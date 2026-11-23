#!/usr/bin/env python3
import json
import os
import shutil
import subprocess
import tempfile
import hashlib
from datetime import datetime, timezone

# Ensure scripts directory exists or relative paths work
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRACKED_REPOS_PATH = os.path.join(PROJECT_ROOT, "tracked_repos.json")
OUTPUT_JSON_PATH = os.path.join(PROJECT_ROOT, "src", "data", "leaderboard.json")

NAME_MAP = {
    "crewai": "CrewAI",
    "langchain": "LangChain",
    "autogen": "AutoGen",
    "software-agent-sdk": "OpenHands SDK",
    "neutral-trust-infrastructure": "NTI Reference Implementation"
}

# Upstream repos that ship a conformant fork or wrapper, surfaced on the
# leaderboard so a failing score links to a fix instead of dead-ending.
# Keyed by repo URL; entries are regenerated nightly, so this must live here
# rather than in leaderboard.json.
FIX_MAP = {
    "https://github.com/OpenHands/software-agent-sdk": {
        "repo": "https://github.com/abisheakp197/Openhands---nti",
        "label": "Apache-2.0 NTI wrapper for OpenHands",
    },
}

def get_grade(score: int) -> str:
    """Mathematical Grading: >=90 (A+), >=80 (B), >=70 (C), >=60 (D), <60 (F)."""
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

def normalize_severity(severity_raw: str) -> str:
    sev = str(severity_raw).lower()
    if sev in ("critical",):
        return "Critical"
    elif sev in ("high", "error"):
        return "High"
    elif sev in ("medium", "moderate", "warning"):
        return "Moderate"
    elif sev in ("low",):
        return "Low"
    else:
        return "Info"

def scan_repository(repo_url: str) -> dict:
    repo_raw_name = repo_url.rstrip("/").split("/")[-1]
    slug = repo_raw_name.lower()
    name = NAME_MAP.get(slug, repo_raw_name)

    attestation_hash = f"sha256:{hashlib.sha256(repo_url.encode()).hexdigest()}"
    # The scanner emits no signature. Until it does, do not fabricate one: an
    # attestation the reader cannot verify is worse than none.
    signature = None

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            clone_dir = os.path.join(tmpdir, repo_raw_name)
            # Clone repo with shallow depth and timeout
            clone_res = subprocess.run(
                ["git", "clone", "--depth", "1", repo_url, clone_dir],
                capture_output=True,
                text=True,
                timeout=120
            )
            if clone_res.returncode != 0:
                raise RuntimeError(f"Git clone failed: {clone_res.stderr}")

            commit_sha = subprocess.run(
                ["git", "-C", clone_dir, "rev-parse", "HEAD"],
                capture_output=True,
                text=True,
                timeout=30
            ).stdout.strip() or None

            # Run nti-scanner
            scan_res = subprocess.run(
                ["nti-scanner", "scan", "--format", "json", clone_dir],
                capture_output=True,
                text=True,
                timeout=120
            )

            if scan_res.returncode != 0 and not scan_res.stdout.strip():
                raise RuntimeError(f"Scanner failed: {scan_res.stderr}")

            scan_data = json.loads(scan_res.stdout)
            score = int(scan_data.get("nti1_score", 0))
            grade = get_grade(score)
            fix = FIX_MAP.get(repo_url)
            if score >= 90:
                status = "Verified"
            elif fix:
                status = "Failing Compliance / Fix Available"
            else:
                status = "Failing"
            scanner_version = scan_data.get("version", "0.1.1")
            mapped_findings = []
            for f in scan_data.get("findings", []):
                file_path = f.get("file", "")
                if file_path.startswith(clone_dir):
                    file_path = os.path.relpath(file_path, clone_dir)

                mapped_findings.append({
                    "rule": f.get("rule_id", "NTI-001"),
                    "severity": normalize_severity(f.get("severity", "medium")),
                    "desc": f.get("message", f.get("desc", "")),
                    "file": file_path,
                    "line": int(f.get("line", 1))
                })

            return {
                "rank": 0,
                "name": name,
                "slug": slug,
                "score": score,
                "grade": grade,
                "status": status,
                "lastScanned": "Just now",
                "trend": None,
                "fix": FIX_MAP.get(repo_url),
                "repoUrl": repo_url,
                "commit": commit_sha,
                "coverage": {
                    "filesScanned": int(scan_data.get("files_scanned", 0)),
                    "linesScanned": int(scan_data.get("lines_scanned", 0)),
                },
                "evidence": {
                    "attestationHash": attestation_hash,
                    "signature": signature,
                    "scannerVersion": f"nti-scanner:{scanner_version}"
                },
                "findings": mapped_findings
            }

    except Exception as e:
        print(f"Error scanning {repo_url}: {e}")
        return {
            "rank": 0,
            "name": name,
            "slug": slug,
            "score": 0,
            "grade": "F",
            "status": "Scan Failed",
            "lastScanned": "Just now",
            "trend": None,
            "fix": FIX_MAP.get(repo_url),
            "repoUrl": repo_url,
            "commit": None,
            "coverage": {"filesScanned": 0, "linesScanned": 0},
            "evidence": {
                "attestationHash": attestation_hash,
                "signature": signature,
                "scannerVersion": "nti-scanner:0.1.1"
            },
            "findings": []
        }

def main():
    if not os.path.exists(TRACKED_REPOS_PATH):
        raise FileNotFoundError(f"Missing configuration file: {TRACKED_REPOS_PATH}")

    with open(TRACKED_REPOS_PATH, "r") as f:
        tracked_urls = json.load(f)

    scanned_entries = []
    for url in tracked_urls:
        print(f"Scanning {url}...")
        entry = scan_repository(url)
        scanned_entries.append(entry)

    all_entries = scanned_entries

    # Sort descending by score
    all_entries.sort(key=lambda x: x["score"], reverse=True)

    # Assign dynamic rank
    for rank, entry in enumerate(all_entries, 1):
        entry["rank"] = rank

    output = {
        "source": "NTI-Registry",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "rubricVersion": "NTI-1.0",
        "entries": all_entries
    }

    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Successfully generated leaderboard with {len(all_entries)} entries at {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()

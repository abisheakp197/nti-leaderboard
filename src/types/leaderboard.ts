export type Severity = "Critical" | "High" | "Moderate" | "Low" | "Info";

export interface Finding {
  rule: string;
  severity: Severity;
  desc: string;
  file: string;
  line: number;
  scope?: "production" | "test";
}

export interface ComplianceGap {
  rule: string;
  pillar: string;
  severity: Severity;
  desc: string;
  occurrences: number;
  remediation: string;
}

export interface Evidence {
  attestationHash: string;
  signature: string | null;
  scannerVersion: string;
}

export interface Trend {
  previousScore: number;
  delta: number;
}

export type Status = "Verified" | "Pending" | "Failing" | "Failing Compliance / Fix Available" | "Scan Failed";

export interface FeatureFix {
  repo: string;
  label: string;
}

export interface Coverage {
  filesScanned: number;
  linesScanned: number;
  /** Languages the scanner actually read, e.g. ["python"]. */
  languages?: string[];
  /** Set when a score's scope must be disclosed alongside it. */
  note?: string;
}

export interface LeaderboardEntry {
  rank: number;
  /** Set when the entry is scored but excluded from the competitive ranking. */
  nonCompetitive?: string | null;
  name: string;
  slug: string;
  score: number;
  grade: string;
  status: Status;
  lastScanned: string;
  trend: Trend | null;
  fix?: FeatureFix | null;
  repoUrl?: string;
  commit?: string | null;
  coverage?: Coverage;
  evidence: Evidence;
  findings: Finding[];
  complianceGaps?: ComplianceGap[];
  vulnerabilityCounts?: Record<"critical" | "high" | "moderate" | "low", number>;
}

export interface LeaderboardData {
  source: string;
  generatedAt: string;
  rubricVersion: string;
  entries: LeaderboardEntry[];
}

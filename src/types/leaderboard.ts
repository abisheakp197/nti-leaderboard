export type Severity = "Critical" | "High" | "Moderate" | "Low" | "Info";

export interface Finding {
  rule: string;
  severity: Severity;
  desc: string;
  file: string;
  line: number;
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
}

export interface LeaderboardEntry {
  rank: number;
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
}

export interface LeaderboardData {
  source: string;
  generatedAt: string;
  rubricVersion: string;
  entries: LeaderboardEntry[];
}

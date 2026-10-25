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
  signature: string;
  scannerVersion: string;
}

export interface Trend {
  previousScore: number;
  delta: number;
}

export type Status = "Verified" | "Pending" | "Failing";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  slug: string;
  score: number;
  grade: string;
  status: Status;
  lastScanned: string;
  trend: Trend | null;
  evidence: Evidence;
  findings: Finding[];
}

export interface LeaderboardData {
  source: string;
  generatedAt: string;
  rubricVersion: string;
  entries: LeaderboardEntry[];
}

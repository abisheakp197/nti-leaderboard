import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldAlert, ShieldCheck } from "lucide-react";
import leaderboardDataRaw from "@/data/leaderboard.json";
import {
  LeaderboardData,
  LeaderboardEntry,
  Severity,
} from "@/types/leaderboard";

const leaderboardData = leaderboardDataRaw as LeaderboardData;

// Friendly aliases so /openhands reaches the SDK entry without renaming the
// scanned slug, which is derived from the repo name.
const SLUG_ALIASES: Record<string, string> = {
  openhands: "software-agent-sdk",
};

function resolveEntry(slug: string): LeaderboardEntry | undefined {
  const target = SLUG_ALIASES[slug] ?? slug;
  return leaderboardData.entries.find((e) => e.slug === target);
}

export function generateStaticParams() {
  const slugs = new Set<string>(Object.keys(SLUG_ALIASES));
  for (const entry of leaderboardData.entries) slugs.add(entry.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = resolveEntry(slug);
  if (!entry) return { title: "Not found | NTI Leaderboard" };
  return {
    title: `${entry.name} — ${entry.score}/100 | NTI Leaderboard`,
    description: `NTI-1 compliance score for ${entry.name}.`,
  };
}

const severityRank: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Moderate: 2,
  Low: 3,
  Info: 4,
};

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = resolveEntry(slug);
  if (!entry) notFound();

  const byRule = new Map<
    string,
    { count: number; severity: Severity; desc: string }
  >();
  for (const f of entry.findings) {
    const cur = byRule.get(f.rule);
    if (cur) cur.count += 1;
    else byRule.set(f.rule, { count: 1, severity: f.severity, desc: f.desc });
  }
  const rules = [...byRule.entries()].sort(
    (a, b) =>
      severityRank[a[1].severity] - severityRank[b[1].severity] ||
      b[1].count - a[1].count
  );

  const passing = entry.score >= 90;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans pb-24">
      <header className="border-b border-white/[0.08] bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All frameworks
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-14">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {entry.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">{entry.slug}</p>
            {entry.repoUrl && (
              <a
                href={
                  entry.commit
                    ? `${entry.repoUrl}/tree/${entry.commit}`
                    : entry.repoUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 break-all font-mono text-xs text-zinc-400 hover:text-emerald-300"
              >
                {entry.repoUrl.replace("https://github.com/", "")}
                {entry.commit ? `@${entry.commit.slice(0, 7)}` : ""}
                <ArrowUpRight className="w-3 h-3 shrink-0" />
              </a>
            )}
          </div>
          <div className="text-right">
            <div
              className={`font-mono font-bold text-5xl ${
                passing ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {entry.score}
              <span className="text-lg text-zinc-600">/100</span>
            </div>
            <div className="mt-1 font-mono text-xs text-zinc-500">
              Grade {entry.grade} ·{" "}
              {entry.nonCompetitive ? "Not ranked" : `Rank #${entry.rank}`}
            </div>
          </div>
        </div>

        <div
          className={`mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            passing
              ? "bg-emerald-400/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-400/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {passing ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          {entry.status}
        </div>

        {entry.fix && (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <p className="text-sm text-zinc-300">
              A conformant implementation is available:
            </p>
            <a
              href={entry.fix.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 break-all font-medium text-emerald-400 underline decoration-emerald-500/40 hover:text-emerald-300"
            >
              {entry.fix.repo}
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
            <p className="mt-1 text-xs text-zinc-500">{entry.fix.label}</p>
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Stat
            label="Production findings"
            value={(entry.findings.filter((f) => f.scope !== "test").length).toLocaleString()}
          />
          <Stat
            label="Files scanned"
            value={(entry.coverage?.filesScanned ?? 0).toLocaleString()}
          />
          <Stat
            label="Lines scanned"
            value={(entry.coverage?.linesScanned ?? 0).toLocaleString()}
          />
        </div>

        {entry.complianceGaps && entry.complianceGaps.length > 0 && (
          <>
            <h2 className="mt-12 text-lg font-semibold">Compliance gaps</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Controls the codebase does not implement. Each gap is counted once
              per repository, however many files it affects, and lowers the
              score without being counted as a vulnerability.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 px-4">Pillar</th>
                    <th className="py-3 px-4">Gap</th>
                    <th className="py-3 px-4 text-right">Files affected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {entry.complianceGaps.map((gap) => (
                    <tr key={gap.rule}>
                      <td className="py-3 px-4 text-xs text-zinc-400">
                        {gap.pillar}
                        <div className="mt-0.5 font-mono text-[11px] text-zinc-600">
                          {gap.rule}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-300">
                        {gap.desc}
                        {gap.remediation && (
                          <div className="mt-0.5 text-[11px] text-zinc-500">
                            {gap.remediation}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-zinc-300">
                        {gap.occurrences}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <h2 className="mt-12 text-lg font-semibold">Findings by rule</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Production code only; findings under tests, examples, and docs are
          excluded. Counts are per rule and not manually triaged. These are
          heuristic indicators, not confirmed vulnerabilities, and will include
          false positives.
        </p>
        {rules.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">No findings recorded.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Rule</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {rules.map(([rule, info]) => (
                  <tr key={rule}>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-300">
                      {rule}
                      <div className="mt-0.5 text-[11px] text-zinc-500">
                        {info.desc}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">
                      {info.severity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-zinc-300">
                      {info.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-10 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs leading-relaxed text-zinc-500">
          Scores reflect the presence of NTI-1 controls (post-quantum identity,
          capability bounds, audit chaining) as detected by static analysis. A
          low score means the framework does not implement those controls
          natively; it is not a claim about the security of unrelated code.
          Generated {leaderboardData.generatedAt}.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="font-mono text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  );
}

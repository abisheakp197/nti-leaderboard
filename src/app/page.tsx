import leaderboardDataRaw from "@/data/leaderboard.json";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ReproducibilityEngine } from "@/components/ReproducibilityEngine";
import { LeaderboardData } from "@/types/leaderboard";
import { ArrowUpRight, Shield, Zap } from "lucide-react";

const leaderboardData = leaderboardDataRaw as LeaderboardData;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden font-sans pb-24">
      {/* Background Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="border-b border-white/[0.08] bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider text-sm text-white">
                NTI LEADERBOARD
              </span>
              <span className="ml-2.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {leaderboardData.rubricVersion}
              </span>
            </div>
          </div>

          <a
            href="https://github.com/marketplace"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/10"
          >
            <span>Get Your Framework Scored</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Post-Quantum ML-DSA-5 Verified Benchmarks</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          The Standard for{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            AI Agent Security
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          The definitive public benchmark for AI Agent security. Eliminating
          self-reported scores with offline-verifiable post-quantum security attestations.
        </p>
      </section>

      {/* Leaderboard Table */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <LeaderboardTable entries={leaderboardData.entries} />
      </section>

      {/* Reproducibility Section */}
      <ReproducibilityEngine />

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 pt-8 text-center font-mono text-xs text-zinc-500">
        <p>
          Generated at {leaderboardData.generatedAt} • Source: {leaderboardData.source} • Rubric: {leaderboardData.rubricVersion}
        </p>
      </footer>
    </main>
  );
}

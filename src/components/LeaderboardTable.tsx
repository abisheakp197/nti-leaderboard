"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { LeaderboardEntry, Severity, Status } from "@/types/leaderboard";
import { VerificationModal } from "./VerificationModal";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<{
    name: string;
    evidence: LeaderboardEntry["evidence"];
  } | null>(null);

  const toggleExpand = (slug: string) => {
    setExpandedRow((prev) => (prev === slug ? null : slug));
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case "Failing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-400/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Failing
          </span>
        );
      case "Scan Failed":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-400/10 text-zinc-400 border border-zinc-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            {status}
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="w-3 h-3" />
            Critical
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-3 h-3" />
            High
          </span>
        );
      case "Moderate":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Info className="w-3 h-3" />
            {severity}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-6 w-16">Rank</th>
              <th className="py-4 px-6">Framework</th>
              <th className="py-4 px-6 text-center">Score</th>
              <th className="py-4 px-6 text-center">Grade</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Trend</th>
              <th className="py-4 px-6 text-right">Last Scanned</th>
              <th className="py-4 px-6 text-center">Verification</th>
              <th className="py-4 px-6 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-sm">
            {entries.map((entry) => {
              const isExpanded = expandedRow === entry.slug;

              return (
                <React.Fragment key={entry.slug}>
                  <tr
                    onClick={() => toggleExpand(entry.slug)}
                    className={`group cursor-pointer transition-colors duration-150 ${
                      isExpanded ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 font-mono text-zinc-400 font-bold">
                      #{entry.rank}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                        {entry.name}
                        {entry.findings.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {entry.findings.length} findings
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {entry.slug}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`font-mono font-bold text-lg ${
                          entry.score >= 90
                            ? "text-emerald-400"
                            : entry.score >= 50
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {entry.score}
                      </span>
                    </td>

                    {/* Grade */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded text-xs border ${
                          entry.grade.startsWith("A")
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {entry.grade}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(entry.status)}
                    </td>

                    {/* Trend */}
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      {entry.trend ? (
                        <div
                          className={`inline-flex items-center gap-1 font-semibold ${
                            entry.trend.delta > 0
                              ? "text-emerald-400"
                              : entry.trend.delta < 0
                              ? "text-rose-400"
                              : "text-zinc-400"
                          }`}
                        >
                          {entry.trend.delta > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {entry.trend.delta > 0 ? `+${entry.trend.delta}` : entry.trend.delta}
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-zinc-600">
                          <Minus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </td>

                    {/* Last Scanned */}
                    <td className="py-4 px-6 text-right font-mono text-xs text-zinc-400">
                      {entry.lastScanned}
                    </td>

                    {/* Verification Action */}
                    <td
                      className="py-4 px-6 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setSelectedVerification({
                            name: entry.name,
                            evidence: entry.evidence,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-500/30 transition-all shadow-sm hover:shadow-emerald-500/10"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify
                      </button>
                    </td>

                    {/* Expand Toggle */}
                    <td className="py-4 px-6 text-center text-zinc-500 hover:text-white transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded AST Findings Drawer */}
                  {isExpanded && (
                    <tr className="bg-black/40 border-b border-white/[0.08]">
                      <td colSpan={9} className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
                              <span>AST Vulnerability Findings</span>
                              <span className="text-[10px] text-zinc-500 font-normal">
                                (Engine: {entry.evidence.scannerVersion})
                              </span>
                            </span>
                          </div>

                          {entry.findings.length === 0 ? (
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <div className="text-xs text-emerald-300 font-sans">
                                No AST vulnerabilities detected. 100% compliant with NTI-1.0 security rubric.
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {entry.findings.map((finding, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-start md:items-center gap-3">
                                    {getSeverityBadge(finding.severity)}
                                    <span className="font-mono text-zinc-300 font-semibold">
                                      [{finding.rule}]
                                    </span>
                                    <span className="text-zinc-200 font-sans">
                                      {finding.desc}
                                    </span>
                                  </div>

                                  <div className="font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded border border-white/5 text-[11px] shrink-0 self-start md:self-auto">
                                    {finding.file}:{finding.line}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verification Modal */}
      {selectedVerification && (
        <VerificationModal
          isOpen={!!selectedVerification}
          onClose={() => setSelectedVerification(null)}
          entryName={selectedVerification.name}
          evidence={selectedVerification.evidence}
        />
      )}
    </div>
  );
};

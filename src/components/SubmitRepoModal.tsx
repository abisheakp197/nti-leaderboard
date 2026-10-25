"use client";

import React, { useState } from "react";
import { X, Send, GitPullRequest, ShieldCheck } from "lucide-react";

interface SubmitRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitRepoModal: React.FC<SubmitRepoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = repoUrl.trim();
    if (!trimmed) {
      setError("Please enter a repository URL.");
      return;
    }

    let cleanUrl = trimmed;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const parsed = new URL(cleanUrl);
      const pathParts = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
      const repoName = pathParts[pathParts.length - 1] || "repository";

      const title = `[Add Repo] ${repoName}`;
      const body = `Please add this repository to the automated scanning pipeline:\n\n${cleanUrl}`;

      const issueUrl = `https://github.com/abisheakp197/nti-leaderboard/issues/new?title=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(body)}`;

      window.open(issueUrl, "_blank");
      setRepoUrl("");
      onClose();
    } catch {
      setError("Please enter a valid URL (e.g. https://github.com/org/repo).");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#09090b] border border-white/10 p-6 shadow-2xl overflow-hidden font-sans text-xs">
        {/* Ambient Glow background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Submit Your Repository
              </h3>
              <p className="text-[11px] text-zinc-400">
                1-Click Submission to the Automated NTI Scanner Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5 text-xs">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/organization/repository"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 font-mono text-xs transition-all"
            />
            {error && (
              <p className="mt-1.5 text-rose-400 text-[11px]">{error}</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2.5 text-zinc-400 text-[11px] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Submitting creates a pre-filled GitHub Issue request. Our background pipeline will automatically clone, perform PQC-verifiable AST security checks, and display your score on the leaderboard.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              <span>Submit for Scoring</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

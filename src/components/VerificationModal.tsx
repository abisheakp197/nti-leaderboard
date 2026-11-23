"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, ShieldCheck, X, ExternalLink } from "lucide-react";
import { Evidence } from "@/types/leaderboard";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryName: string;
  evidence: Evidence;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  entryName,
  evidence,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.attestationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#09090b] border border-white/10 p-6 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Ambient Glow background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white font-sans tracking-wide">
              Attestation Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge Banner */}
        <div className="my-5 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-zinc-300 shrink-0" />
          <div>
            <div className="text-zinc-200 font-semibold font-sans">
              Reproducible scan record
            </div>
            <div className="text-zinc-400 text-[11px] font-sans mt-0.5">
              Target Framework: <span className="text-white font-mono">{entryName}</span>
            </div>
          </div>
        </div>

        {/* Attestation Details */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-zinc-400">
              <span className="text-[11px]">Attestation Hash (SHA-256)</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copiedHash ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-zinc-300 break-all select-all font-mono text-[11px]">
              {evidence.attestationHash}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-zinc-400">
              <span className="text-[11px]">Signature</span>
            </div>
            {evidence.signature ? (
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-zinc-300 break-all select-all font-mono text-[11px]">
                {evidence.signature}
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-zinc-500 font-sans text-[11px]">
                Not signed. The scanner does not yet emit a signature, so none is
                shown. Scores are reproducible by re-running the scanner, not
                cryptographically attested.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500 font-sans border-t border-white/5">
            <div>
              Scanner Engine: <span className="text-zinc-300 font-mono">{evidence.scannerVersion}</span>
            </div>
            <a
              href="https://github.com/abisheakp197/nti-leaderboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:underline"
            >
              Reproduce on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

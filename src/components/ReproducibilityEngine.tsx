"use client";

import React, { useState } from "react";
import { Terminal, Shield, Check, Copy } from "lucide-react";

export const ReproducibilityEngine: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const commandText = `pip install nti-scanner\nnti-scanner scan . --submit`;

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-20 w-full max-w-5xl mx-auto">
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            The Reproducibility Engine
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
          Don&apos;t trust us. Verify it yourself.
        </h2>

        <p className="mt-3 text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl font-sans">
          Every score on this board is backed by a cryptographic attestation. We don&apos;t guess.
          We parse the AST and generate offline-verifiable post-quantum attestations.
        </p>

        {/* Terminal Snippet */}
        <div className="mt-8 rounded-2xl bg-[#09090b] border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-400">
                terminal — local verification
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md font-mono"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 font-mono text-xs md:text-sm text-zinc-300 leading-relaxed overflow-x-auto select-all">
            <div className="flex items-center gap-2 text-zinc-500 mb-1">
              <span># 1. Install the official NTI static analyzer</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              <span className="text-zinc-500 select-none">$ </span>pip install nti-scanner
            </div>
            <div className="flex items-center gap-2 text-zinc-500 mt-4 mb-1">
              <span># 2. Run local AST scan and generate cryptographic proof</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              <span className="text-zinc-500 select-none">$ </span>nti-scanner scan . --submit
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";
import React from "react";
import Link from "next/link";
import { ShieldCheck, TrendingUp, Heart, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/formatters";

interface TransparencyMeterProps {
  raised?: number;
  goal?: number;
  expenses?: number;
  donorCount?: number;
}

export default function TransparencyMeter({
  raised = 245000,
  goal = 500000,
  expenses = 124000,
  donorCount = 42,
}: TransparencyMeterProps) {
  const percentage = Math.min(Math.round((raised / (goal || 1)) * 100), 100);
  const netBalance = raised - expenses;

  return (
    <section className="py-12 bg-[#08172D] border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="vedic-card p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  100% सत्यापित वित्तीय पारदर्शिता (Live Verified Ledger)
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-hindi">
                दान सहयोग एवं महोत्सव निधि प्रगति
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                प्रत्येक दान की अधिकृत रसीद और खर्च का पूरा विवरण जनसाधारण हेतु उपलब्ध है।
              </p>
            </div>

            <Link
              href="/transparency"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-colors"
            >
              <span>सम्पूर्ण व्यय विवरण देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats 4 Column */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
              <div className="text-xs text-slate-400 font-hindi">कुल सत्यापित सहयोग (Raised)</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
                {formatINR(raised)}
              </div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">✓ {donorCount} दानदाताओं द्वारा</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30">
              <div className="text-xs text-slate-400 font-hindi">महोत्सव लक्ष्य (Target Fund)</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1 font-mono">
                {formatINR(goal)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">भव्य जन्मोत्सव व्यवस्था हेतु</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30">
              <div className="text-xs text-slate-400 font-hindi">स्वीकृत व्यवस्था व्यय (Expenses)</div>
              <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1 font-mono">
                {formatINR(expenses)}
              </div>
              <div className="text-[10px] text-rose-300/80 mt-0.5">टेंट, साउंड, प्रसाद व सजावट</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-500/30">
              <div className="text-xs text-slate-400 font-hindi">वर्तमान शेष निधि (Available Balance)</div>
              <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1 font-mono">
                {formatINR(netBalance)}
              </div>
              <div className="text-[10px] text-blue-300/80 mt-0.5">बैंक व कोष में सुरक्षित</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>प्रगति: {percentage}% लक्ष्य पूर्ण</span>
              <span>{formatINR(raised)} / {formatINR(goal)}</span>
            </div>
            <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-1000"
                style={{ width: percentage + "%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

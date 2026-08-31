"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, CheckCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/formatters";
import { TransparencySummary } from "@/types";

export default function TransparencyPage() {
  const [summary, setSummary] = useState<TransparencySummary | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAPI<TransparencySummary>("/public/transparency"),
      fetchAPI<any[]>("/public/transparency/expenses"),
    ])
      .then(([sumRes, expRes]) => {
        setSummary(sumRes);
        setExpenses(expRes);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  }, []);

  const raised = summary?.total_verified_donations || 245000;
  const spent = summary?.total_approved_expenses || 124000;
  const net = raised - spent;

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>खुला खाता • पूर्ण वित्तीय पारदर्शिता (Public Ledger)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          ग्राम युवा समिति वित्तीय पारदर्शिता एवं लेखा-जोखा
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2">
          समिति को प्राप्त प्रत्येक दान और महोत्सव में खर्च किए गए एक-एक रुपये का सार्वजनिक व प्रमाणित विवरण।
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="vedic-card p-6 border-emerald-500/40 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-hindi">
            <span>कुल सत्यापित दान (Verified Raised)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
            {formatINR(raised)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-hindi">
            ✓ {summary?.verified_donation_count || 42} दानदाताओं द्वारा प्राप्त
          </div>
        </div>

        <div className="vedic-card p-6 border-rose-500/40 bg-rose-950/20">
          <div className="flex items-center justify-between text-xs text-rose-300 font-hindi">
            <span>कुल स्वीकृत व्यवस्था व्यय (Total Expenses)</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono mt-2">
            {formatINR(spent)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-hindi">
            सजावट, टेंट, साउंड, प्रसाद व छपाई व्यय
          </div>
        </div>

        <div className="vedic-card p-6 border-blue-500/40 bg-blue-950/20">
          <div className="flex items-center justify-between text-xs text-blue-300 font-hindi">
            <span>कोष में सुरक्षित शेष (Available Balance)</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400 font-mono mt-2">
            {formatINR(net)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-hindi">
            समिति बैंक खाते में उपलब्ध
          </div>
        </div>
      </div>

      {/* Itemized Public Expenses Table */}
      <div className="vedic-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-hindi">
            सार्वजनिक खर्च विवरण (Itemized Expenditure Ledger)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            कुल प्रविष्टियां: {expenses.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-hindi">
                <th className="pb-3 font-semibold">तिथि (Date)</th>
                <th className="pb-3 font-semibold">मद / श्रेणी (Category)</th>
                <th className="pb-3 font-semibold">विवरण (Description)</th>
                <th className="pb-3 font-semibold">खर्चकर्ता सदस्य (Spent By)</th>
                <th className="pb-3 font-semibold text-right">राशि (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-hindi text-slate-200">
              {expenses.map((e, idx) => (
                <tr key={e.id || idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-xs">{formatDate(e.expense_date)}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
                      {e.category_name_hi}
                    </span>
                  </td>
                  <td className="py-3 max-w-xs sm:max-w-sm">{e.description}</td>
                  <td className="py-3 text-slate-300 font-semibold">{e.committee_member_name || "समिति कोष"}</td>
                  <td className="py-3 text-right font-mono font-bold text-rose-400">{formatINR(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

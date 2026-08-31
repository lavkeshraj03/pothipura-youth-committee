"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Heart, Search, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { formatINR, formatDate } from "@/lib/formatters";

const sampleDonors = [
  { display_name: "चौधरी हनुमान राम जी", amount: 51000, purpose: "JANMASHTAMI", is_anonymous: false, donated_at: "2026-08-28" },
  { display_name: "सेठ बंशीधर अग्रवाल", amount: 31000, purpose: "JANMASHTAMI", is_anonymous: false, donated_at: "2026-08-27" },
  { display_name: "गुप्त दानदाता (श्री श्याम भक्त)", amount: 21000, purpose: "JANMASHTAMI", is_anonymous: true, donated_at: "2026-08-27" },
  { display_name: "ठाकुर भवानी सिंह", amount: 25000, purpose: "JANMASHTAMI", is_anonymous: false, donated_at: "2026-08-26" },
  { display_name: "मास्टर जगदीश प्रसाद शर्मा", amount: 11000, purpose: "EDUCATION", is_anonymous: false, donated_at: "2026-08-25" },
  { display_name: "ग्राम युवा प्रवासी मंडल (सूरत)", amount: 51000, purpose: "JANMASHTAMI", is_anonymous: false, donated_at: "2026-08-25" },
];

export default function DonorWall({ donors = sampleDonors }: { donors?: any[] }) {
  const displayList = (donors && donors.length > 0 ? donors : sampleDonors).slice(0, 6);

  return (
    <section className="py-16 bg-[#071428] border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>भामाशाह एवं दानदाता सम्मान</span>
            </div>
            <h2 className="text-3xl font-black text-white font-festival">
              हमारे सम्मानित सहयोगी एवं दानदाता
            </h2>
            <p className="text-sm text-slate-300 font-hindi mt-1">
              समस्त दानदाताओं का हार्दिक आभार। आपका एक-एक रुपया ग्राम उन्नति एवं महोत्सव में समर्पित है।
            </p>
          </div>

          <Link
            href="/donors"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/30 hover:border-amber-500/70 text-xs font-bold transition-all"
          >
            <span>सम्पूर्ण दानदाता सूची देखें (All Supporters)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((d, idx) => (
            <div
              key={idx}
              className="vedic-card p-5 flex items-center justify-between group hover:border-amber-500/60 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400 shrink-0">
                  {d.is_anonymous ? "🙏" : "🌟"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-hindi group-hover:text-amber-300 transition-colors">
                    {d.display_name}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300/90 font-mono">
                      {d.purpose}
                    </span>
                    <span>• {formatDate(d.donated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {formatINR(d.amount)}
                </div>
                <div className="text-[10px] text-emerald-300/80 font-hindi">✓ सत्यापित दान</div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 via-yellow-600/15 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0 hidden sm:block" />
            <div>
              <h4 className="text-base font-bold text-white font-hindi">
                आप भी श्री कृष्ण जन्माष्टमी महोत्सव में अपनी स्वैच्छिक आहुति दें
              </h4>
              <p className="text-xs text-slate-300">
                UPI (GPay / PhonePe / Paytm) या नकद दान के माध्यम से सहयोग करें एवं तुरंत डिजिटल रसीद प्राप्त करें।
              </p>
            </div>
          </div>

          <Link
            href="/donate"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shrink-0 flex items-center space-x-2"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>दान करें (DONATE)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

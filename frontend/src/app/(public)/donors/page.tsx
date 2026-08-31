"use client";
import React, { useEffect, useState } from "react";
import { Heart, Search, ShieldCheck } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/formatters";
import { PublicDonor } from "@/types";

export default function DonorsPage() {
  const [donors, setDonors] = useState<PublicDonor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<PublicDonor[]>("/public/donors")
      .then((res) => {
        setDonors(res);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  }, []);

  const filtered = donors.filter((d) =>
    d.display_name.toLowerCase().includes(search.toLowerCase()) ||
    d.purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>भामाशाह एवं दानदाता गौरव सूची</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          सम्मानित दानदाता एवं सहयोगी महानुभाव
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2">
          श्री कृष्ण जन्माष्टमी महोत्सव एवं ग्राम उत्थान में आपके द्वारा दिए गए आर्थिक योगदान का विवरण।
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="दानदाता के नाम से खोजें..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 font-hindi"
        />
      </div>

      {/* Donor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d, idx) => (
          <div key={idx} className="vedic-card p-5 flex items-center justify-between hover:border-amber-500/60 transition-all">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400 shrink-0">
                {d.is_anonymous ? "🙏" : "🌟"}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-hindi">
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
    </div>
  );
}

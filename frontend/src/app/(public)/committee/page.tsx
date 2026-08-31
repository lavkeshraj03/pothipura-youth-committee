"use client";
import React, { useEffect, useState } from "react";
import { Users, Phone, Mail, Shield, CheckCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { CommitteeMemberPublic } from "@/types";

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMemberPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<CommitteeMemberPublic[]>("/public/committee")
      .then((res) => {
        setMembers(res);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>ग्राम युवा शक्ति संगठन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          ग्राम युवा समिति कार्यकारिणी एवं पदाधिकारी 2026
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2">
          निःस्वार्थ सेवा, ग्राम विकास एवं धार्मिक-सांस्कृतिक आयोजनों के कुशल संचालन हेतु समर्पित समिति सदस्य।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m, idx) => (
          <div key={m.id || idx} className="vedic-card p-6 flex flex-col justify-between hover:border-amber-500/60 transition-all">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full rounded-2xl bg-[#0B1D3A] flex items-center justify-center text-2xl font-bold font-hindi text-amber-300">
                  {m.profile_photo_url ? (
                    <img src={m.profile_photo_url} alt={m.full_name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    m.full_name[0]
                  )}
                </div>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-hindi mb-1">
                  {m.designation_title_hi || m.custom_designation || "कार्यकारिणी सदस्य"}
                </span>
                <h3 className="text-lg font-bold text-white font-hindi">
                  {m.full_name}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {m.designation_title_en || "Executive Member"}
                </p>
              </div>
            </div>

            {m.bio && (
              <p className="text-xs text-slate-300 leading-relaxed font-hindi mb-4">
                {m.bio}
              </p>
            )}

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1 text-emerald-400 font-hindi">
                <Shield className="w-3.5 h-3.5" />
                <span>अधिकृत पदाधिकारी</span>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                क्रम #{m.display_order || idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

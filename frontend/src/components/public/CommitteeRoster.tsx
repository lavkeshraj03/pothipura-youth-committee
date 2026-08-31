"use client";
import React from "react";
import Link from "next/link";
import { Users, ArrowRight, Shield } from "lucide-react";

const defaultMembers = [
  { full_name: "सुरेश कुमार जी", designation_title_hi: "अध्यक्ष (President)", designation_title_en: "President", bio: "समिति संचालन एवं ग्राम विकास कार्यक्रमों का समग्र नेतृत्व।", display_order: 1 },
  { full_name: "राजेश शर्मा जी", designation_title_hi: "उपाध्यक्ष (Vice President)", designation_title_en: "Vice President", bio: "महोत्सव समन्वय एवं युवा स्वयंसेवक प्रबंधन।", display_order: 2 },
  { full_name: "दिनेश सिंह जी", designation_title_hi: "सचिव (Secretary)", designation_title_en: "Secretary", bio: "बैठक कार्यवाही, पत्राचार एवं आधिकारिक घोषणाएं।", display_order: 3 },
  { full_name: "महेश अग्रवाल जी", designation_title_hi: "कोषाध्यक्ष (Treasurer)", designation_title_en: "Treasurer", bio: "वित्तीय लेखा-जोखा, पारदर्शिता एवं कोष संरक्षक।", display_order: 4 },
  { full_name: "अमित चौधरी जी", designation_title_hi: "संयोजक (Coordinator)", designation_title_en: "Event Coordinator", bio: "जन्माष्टमी मटकी फोड़ व सांस्कृतिक कार्यक्रम संयोजक।", display_order: 5 },
  { full_name: "विकास जांगिड़ जी", designation_title_hi: "मीडिया प्रभारी (Media Head)", designation_title_en: "Media Head", bio: "प्रचार-प्रसार, पोस्टर प्रकाशन एवं डिजिटल मंच प्रबंधन।", display_order: 6 },
];

export default function CommitteeRoster({ members }: { members?: any[] }) {
  const displayList = (members && members.length > 0 ? members : defaultMembers).slice(0, 6);

  return (
    <section className="py-16 bg-[#08172D] border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>समिति कार्यकारिणी 2026-27</span>
            </div>
            <h2 className="text-3xl font-black text-white font-festival">
              समिति पदाधिकारी एवं मार्गदर्शक मंडल
            </h2>
            <p className="text-sm text-slate-300 font-hindi mt-1">
              ग्राम विकास, महोत्सव संचालन एवं पारदर्शिता हेतु उत्तरदायी सदस्य।
            </p>
          </div>

          <Link
            href="/committee"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/30 hover:border-amber-500/70 text-xs font-bold transition-all"
          >
            <span>सभी पदाधिकारी देखें (Full Roster)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((m, idx) => (
            <div
              key={m.id || idx}
              className="vedic-card p-6 flex flex-col justify-between group hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-2xl bg-[#0B1D3A] flex items-center justify-center text-2xl font-bold font-hindi text-amber-300">
                    {m.profile_photo_url ? (
                      <img src={m.profile_photo_url} alt={m.full_name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      (m.full_name && m.full_name.length > 0 ? m.full_name[0] : "स")
                    )}
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-hindi mb-1">
                    {m.designation_title_hi || m.custom_designation || "कार्यकारिणी सदस्य"}
                  </span>
                  <h3 className="text-lg font-bold text-white font-hindi group-hover:text-amber-300 transition-colors">
                    {m.full_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {m.designation_title_en || "Executive Member"}
                  </p>
                </div>
              </div>

              {m.bio && (
                <p className="text-xs text-slate-300 leading-relaxed font-hindi line-clamp-2 mb-4">
                  {m.bio}
                </p>
              )}

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>अधिकृत पदाधिकारी</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  सेवा क्रम #{m.display_order || idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

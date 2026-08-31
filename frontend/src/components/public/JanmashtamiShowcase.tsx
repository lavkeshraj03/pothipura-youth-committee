"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Trophy, Music, Gift, ShieldAlert } from "lucide-react";

export default function JanmashtamiShowcase() {
  return (
    <section className="py-16 bg-[#050E1C] border-b border-amber-500/30 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>परंपरा • भक्ति • युवा उत्साह</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-festival tracking-wide">
            माखन मटकी, भजन संध्या एवं पावन लीला दर्शन
          </h2>
          <p className="text-sm text-slate-300 font-hindi mt-3">
            भगवान श्री कृष्ण के जन्मोत्सव पर ग्राम में आयोजित होने वाले समस्त आध्यात्मिक व सांस्कृतिक आकर्षण
          </p>
        </div>

        {/* 2 Big Feature Cards with Real Generated Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Dahi Handi & Matki Makhan */}
          <div className="vedic-card overflow-hidden group border border-amber-500/40 rounded-3xl bg-slate-950/80 flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0 overflow-hidden">
              <Image
                src="/images/matki_makhan.jpg"
                alt="Matki Makhan Dahi Handi"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-slate-950/80" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow">
                🏺 विशेष आकर्षण
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  युवा शक्ति प्रदर्शन
                </div>
                <h3 className="text-2xl font-black text-white font-hindi">
                  भव्य मटकी फोड़ प्रतियोगिता
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2 leading-relaxed">
                  ग्राम के विभिन्न युवा मंडलों के बीच 25 फीट की ऊंचाई पर लटकी माखन हांडी को फोड़ने का रोमांचकारी मुकाबला। विजेता दल को समिति द्वारा विशेष शील्ड एवं नकद पुरस्कार प्रदान किया जाएगा।
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">समय: रात्रि 10:30 बजे</span>
                <Link
                  href="/donate"
                  className="text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-xl transition-all shadow"
                >
                  पुरस्कार सहयोग करें
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Divine Bansuri & Bhajan Sandhya */}
          <div className="vedic-card overflow-hidden group border border-amber-500/40 rounded-3xl bg-slate-950/80 flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0 overflow-hidden">
              <Image
                src="/images/flute_banner.jpg"
                alt="Divine Krishna Bansuri Flute"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-slate-950/80" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black shadow">
                🪈 अमृत रस
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  सांस्कृतिक एवं भक्ति संध्या
                </div>
                <h3 className="text-2xl font-black text-white font-hindi">
                  श्याम संकीर्तन एवं भजन गंगा
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2 leading-relaxed">
                  प्रसिद्ध भजन गायकों की मधुर वाणी में श्याम भजनों, रासलीला प्रस्तुति एवं पुष्प होली का दिव्य आनंद। पूरा मंदिर परिसर सतरंगी रोशनी व फूलों से सुसज्जित रहेगा।
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">समय: सायं 07:00 बजे</span>
                <Link
                  href="/janmashtami#schedule"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-all"
                >
                  समय सारणी देखें →
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

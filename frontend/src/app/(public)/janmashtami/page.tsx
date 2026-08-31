"use client";
import React from "react";
import HeroJanmashtami from "@/components/public/HeroJanmashtami";
import ScheduleTimeline from "@/components/public/ScheduleTimeline";
import Link from "next/link";
import { Heart, Sparkles, MapPin, Award, Calendar } from "lucide-react";

export default function JanmashtamiPage() {
  return (
    <div>
      <HeroJanmashtami />
      <ScheduleTimeline />

      {/* Cultural Attraction Highlights */}
      <section className="py-16 bg-[#08172D] border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white font-festival">
              महोत्सव के मुख्य आकर्षण एवं प्रतियोगिताएं
            </h2>
            <p className="text-sm text-slate-300 font-hindi mt-1">
              4 सितम्बर 2026 को होने वाले सभी भव्य कार्यक्रमों का संक्षिप्त विवरण।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vedic-card p-6 space-y-3">
              <span className="text-3xl">🏺</span>
              <h3 className="text-xl font-bold text-amber-400 font-hindi">25 फीट मटकी फोड़ स्पर्धा</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-hindi">
                ग्राम एवं आसपास की युवा मंडलियों के बीच 25 फीट ऊंचाई पर सजी दही-हांडी फोड़ने की रोमांचक प्रतियोगिता। प्रथम व द्वितीय स्थान हेतु नकद पुरस्कार एवं शील्ड।
              </p>
            </div>

            <div className="vedic-card p-6 space-y-3">
              <span className="text-3xl">👑</span>
              <h3 className="text-xl font-bold text-amber-400 font-hindi">बाल कृष्ण-राधा रूप सज्जा</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-hindi">
                0 से 10 वर्ष तक के बच्चों हेतु मनमोहक रूप सज्जा प्रतियोगिता। सभी सहभागी बच्चों को स्मृति उपहार एवं उत्कृष्ट सज्जा को विशेष पुरस्कार।
              </p>
            </div>

            <div className="vedic-card p-6 space-y-3">
              <span className="text-3xl">🪔</span>
              <h3 className="text-xl font-bold text-amber-400 font-hindi">108 दीप महा-आरती व 56 भोग</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-hindi">
                मध्यरात्रि 12:00 बजे भगवान श्री कृष्ण के दिव्य जन्मोत्सव पर 108 दीपों से शंखनाद महा-आरती, माखन-मिश्री एवं 56 भोग महाप्रसाद वितरण।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

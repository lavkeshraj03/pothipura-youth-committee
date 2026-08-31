"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { Heart, Calendar, MapPin, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";

export default function HeroJanmashtami() {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 md:pt-10 md:pb-28 border-b border-amber-500/30">
      {/* High-Resolution Divine Krishna Background Image with Devotional Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_krishna.jpg"
          alt="Lord Krishna Janmashtami Mahotsav"
          fill
          priority
          className="object-cover object-center opacity-35 scale-105 transform"
        />
        {/* Radial Dark & Golden Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061224]/90 via-[#071428]/85 to-[#061224]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Floral Auspicious Header Badge */}
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold mb-6 shadow-lg shadow-amber-500/10 backdrop-blur-md animate-bounce-slow">
          <span className="text-lg">🪷</span>
          <span className="tracking-wide">ॐ श्री कृष्णाय नमः • 4 सितम्बर 2026</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black uppercase tracking-wider">
            महापर्व
          </span>
        </div>

        {/* Grand Title */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-festival tracking-wide leading-tight sm:leading-none drop-shadow-2xl">
            <span className="gold-gradient-text block">श्री कृष्ण जन्माष्टमी महोत्सव</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-200 block font-hindi mt-2 tracking-normal">
              भव्य ग्राम जन्मोत्सव एवं सांस्कृतिक महाकुंभ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-hindi max-w-2xl mx-auto leading-relaxed pt-2">
            माखन चोर, नन्द किशोर, मुरली मनोहर भगवान श्री कृष्ण के जन्मोत्सव के पावन अवसर पर समस्त ग्रामवासियों व श्रद्धालुओं का हार्दिक स्वागत एवं अभिनंदन।
          </p>
        </div>

        {/* Date, Venue & Time Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-200 mt-6 mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-500/40 shadow backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">शुक्रवार, 4 सितम्बर 2026</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-500/40 shadow backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>श्री राधा कृष्ण मंदिर प्रांगण, मुख्य चौक</span>
          </div>
        </div>

        {/* Live Countdown Section */}
        <div className="my-8 max-w-2xl mx-auto p-4 sm:p-6 rounded-3xl bg-slate-950/70 border border-amber-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold text-amber-300 mb-4 font-hindi">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>शुभ जन्मोत्सव मुहूर्त प्रारंभ होने में शेष समय</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          </div>
          <CountdownTimer targetDate="2026-09-04T00:00:00" />
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-2">
          <Link
            href="/donate"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center justify-center space-x-2 active:scale-95 border border-yellow-200"
          >
            <Heart className="w-5 h-5 fill-slate-950" />
            <span>सहयोग राशि समर्पित करें (DONATE)</span>
          </Link>
          <Link
            href="/janmashtami#schedule"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0B1D3A]/90 border-2 border-amber-500/60 text-amber-300 font-bold text-base hover:bg-amber-500/20 transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>कार्यक्रम समय सारणी</span>
          </Link>
        </div>

        {/* 4 Grand Visual Festival Highlights with Matki & Makhan Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-14 text-left">
          {/* Highlight 1: Matki Phod */}
          <div className="vedic-card p-5 relative overflow-hidden group hover:scale-105 transition-transform border border-amber-500/30">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🏺
              </div>
              <div>
                <div className="text-base font-bold text-white font-hindi group-hover:text-amber-400 transition-colors">
                  मटकी फोड़ प्रतियोगिता
                </div>
                <p className="text-xs text-slate-300 font-hindi mt-1 leading-relaxed">
                  25 फीट ऊंचाई पर सजी माखन-मिश्री हांडी फोड़ने की रोमांचक युवा मंडल स्पर्धा।
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-400 mt-2">
                  रात्रिकालीन 10:30 PM • नकद पुरस्कार
                </span>
              </div>
            </div>
          </div>

          {/* Highlight 2: Bhajan Sandhya */}
          <div className="vedic-card p-5 relative overflow-hidden group hover:scale-105 transition-transform border border-amber-500/30">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🪈
              </div>
              <div>
                <div className="text-base font-bold text-white font-hindi group-hover:text-amber-400 transition-colors">
                  भव्य भजन संध्या
                </div>
                <p className="text-xs text-slate-300 font-hindi mt-1 leading-relaxed">
                  सुप्रसिद्ध भजन गायकों द्वारा रसभरे श्याम भजन एवं सजीव अलौकिक झांकियां।
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-400 mt-2">
                  संध्या 07:00 PM से प्रारंभ
                </span>
              </div>
            </div>
          </div>

          {/* Highlight 3: Bal Roop Sajja */}
          <div className="vedic-card p-5 relative overflow-hidden group hover:scale-105 transition-transform border border-amber-500/30">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                👑
              </div>
              <div>
                <div className="text-base font-bold text-white font-hindi group-hover:text-amber-400 transition-colors">
                  बाल रूप सज्जा स्पर्धा
                </div>
                <p className="text-xs text-slate-300 font-hindi mt-1 leading-relaxed">
                  ग्राम के नन्हे-मुन्ने बच्चों द्वारा बाल राधा-कृष्ण वेशभूषा प्रतियोगिता।
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-400 mt-2">
                  अपराह्न 04:00 PM • स्मृति चिन्ह
                </span>
              </div>
            </div>
          </div>

          {/* Highlight 4: 56 Bhog Mahaprasad */}
          <div className="vedic-card p-5 relative overflow-hidden group hover:scale-105 transition-transform border border-amber-500/30">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🪔
              </div>
              <div>
                <div className="text-base font-bold text-white font-hindi group-hover:text-amber-400 transition-colors">
                  56 भोग एवं महा-आरती
                </div>
                <p className="text-xs text-slate-300 font-hindi mt-1 leading-relaxed">
                  मध्यरात्रि 12:00 बजे जन्मोत्सव, 108 दीपों की आरती व छप्पन भोग महाप्रसाद वितरण।
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-400 mt-2">
                  मध्यरात्रि 12:00 AM प्राकट्य
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

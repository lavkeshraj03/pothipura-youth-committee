"use client";
import React, { useEffect, useState } from "react";
import HeroJanmashtami from "@/components/public/HeroJanmashtami";
import JanmashtamiShowcase from "@/components/public/JanmashtamiShowcase";
import AnnouncementsTicker from "@/components/public/AnnouncementsTicker";
import TransparencyMeter from "@/components/public/TransparencyMeter";
import ScheduleTimeline from "@/components/public/ScheduleTimeline";
import CommitteeRoster from "@/components/public/CommitteeRoster";
import DonorWall from "@/components/public/DonorWall";
import { fetchAPI } from "@/lib/api";
import { JanmashtamiBundle } from "@/types";
import Link from "next/link";
import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<JanmashtamiBundle | null>(null);

  useEffect(() => {
    fetchAPI<JanmashtamiBundle>("/public/janmashtami")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.warn("Loading default festival state:", err);
      });
  }, []);

  return (
    <div className="space-y-0 min-h-screen bg-[#071428]">
      {/* High-priority announcements strip */}
      <AnnouncementsTicker announcements={data?.announcements} />

      {/* Grand Krishna Janmashtami Hero with Background Image & Matki Elements */}
      <HeroJanmashtami />

      {/* Visual Festive Showcase (Matki Phod, Bhajan Ganga, Leela Darshan) */}
      <JanmashtamiShowcase />

      {/* Live Financial Transparency Meter */}
      <TransparencyMeter
        raised={data?.transparency?.total_verified_donations ?? 245000}
        goal={data?.transparency?.target_fund_goal ?? 500000}
        expenses={data?.transparency?.total_approved_expenses ?? 124000}
        donorCount={data?.transparency?.verified_donation_count ?? 42}
      />

      {/* Festival Schedule Timeline */}
      <ScheduleTimeline programs={data?.event?.programs} />

      {/* Committee Leadership Roster */}
      <CommitteeRoster members={data?.committee_members} />

      {/* Public Verified Donor Wall */}
      <DonorWall />

      {/* Bottom Devotional Call to Action */}
      <section className="py-16 bg-gradient-to-t from-[#040D1A] to-[#071428] border-t border-amber-500/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-3xl">
            🦚
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-festival tracking-wide">
            भगवान श्री कृष्ण जन्मोत्सव में अपना अमूल्य योगदान दें
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-hindi max-w-xl mx-auto mt-3 leading-relaxed">
            आपकी सहयोग राशि से टेंट, साउंड, मंदिर पुष्प शृंगार, सुरक्षा व्यवस्था एवं छप्पन भोग महाप्रसाद का सुचारु प्रबंध किया जाएगा।
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/donate"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center justify-center space-x-2 border border-yellow-200"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              <span>सहयोग करें (UPI / QR / Cash)</span>
            </Link>
            <Link
              href="/transparency"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-sm hover:bg-amber-500/10 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% सार्वजनिक व्यय विवरण देखें</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

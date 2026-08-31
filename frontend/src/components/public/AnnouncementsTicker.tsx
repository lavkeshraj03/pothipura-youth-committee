"use client";
import React from "react";
import { Megaphone, Sparkles } from "lucide-react";

interface AnnouncementsTickerProps {
  announcements?: Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    is_active: boolean;
  }>;
}

export default function AnnouncementsTicker({ announcements }: AnnouncementsTickerProps) {
  const defaultList = [
    "🪷 श्री कृष्ण जन्माष्टमी 2026: भव्य 25 फीट मटकी फोड़, भजन संध्या एवं 56 भोग की तैयारियां प्रारंभ।",
    "🏺 सभी ग्रामवासी एवं युवा साथी सहयोग व सेवा हेतु मंदिर प्रांगण में संपर्क करें।",
    "🛡️ शत-प्रतिशत पारदर्शिता: प्रत्येक दान की डिजिटल पावती रसीद तुरंत डाउनलोड करें।",
  ];

  const items =
    announcements && announcements.length > 0
      ? announcements.filter((a) => a.is_active).map((a) => a.title + ": " + a.content)
      : defaultList;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 py-2.5 px-4 shadow-md border-b border-yellow-300/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center space-x-3 text-xs sm:text-sm font-bold font-hindi">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 shrink-0 shadow-sm">
          <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>सूचना (Notice):</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee">
            {items.map((text, idx) => (
              <span key={idx} className="mr-12 inline-flex items-center space-x-2 text-slate-950 font-black">
                <span>{text}</span>
                <span className="text-red-800 text-base">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

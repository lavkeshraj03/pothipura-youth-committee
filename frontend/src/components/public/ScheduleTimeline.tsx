"use client";
import React from "react";
import { Clock, Sparkles, MapPin, CheckCircle } from "lucide-react";

const defaultPrograms = [
  {
    time: "06:00 AM",
    title_hi: "प्रभात फेरी एवं संकीर्तन",
    title_en: "Morning Prabhat Pheri",
    desc: "समस्त ग्रामवासियों के साथ मुख्य मंदिर से प्रारंभ होकर प्रमुख मार्गों से प्रभात फेरी।",
    icon: "🌅"
  },
  {
    time: "09:00 AM",
    title_hi: "विशेष अभिषेक एवं दिव्य शृंगार",
    title_en: "Temple Abhishek & Floral Shringar",
    desc: "पंचामृत अभिषेक, वैदिक मंत्रोच्चार एवं भगवान श्री कृष्ण का आलौकिक पुष्प शृंगार।",
    icon: "🪷"
  },
  {
    time: "04:00 PM",
    title_hi: "बाल कृष्ण रूप सज्जा प्रतियोगिता",
    title_en: "Kids Radha-Krishna Fancy Dress",
    desc: "ग्राम के 0 से 10 वर्ष तक के बच्चों द्वारा राधा-कृष्ण रूप सज्जा (आकर्षक पुरस्कार)।",
    icon: "👑"
  },
  {
    time: "07:00 PM",
    title_hi: "भव्य भजन संध्या एवं झांकी दर्शन",
    title_en: "Grand Bhajan Sandhya",
    desc: "प्रसिद्ध भजन गायकों द्वारा सुमधुर श्याम भजनों एवं सांस्कृतिक नाट्य प्रस्तुतियां।",
    icon: "🪈"
  },
  {
    time: "10:30 PM",
    title_hi: "रोमांचक मटकी फोड़ प्रतियोगिता",
    title_en: "Thrilling Matki Phod",
    desc: "ग्राम के युवा मंडलों द्वारा 25 फीट ऊंचाई पर बंधी दही-हांडी फोड़ने की भव्य स्पर्धा।",
    icon: "🏺"
  },
  {
    time: "12:00 AM",
    title_hi: "श्री कृष्ण जन्मोत्सव, महा-आरती एवं 56 भोग",
    title_en: "Midnight Janmotsav & Maha-Aarti",
    desc: "मध्यरात्रि में भगवान का प्राकट्योत्सव, 108 दीपों की महा-आरती एवं छप्पन भोग महाप्रसाद वितरण।",
    icon: "🪔"
  }
];

export default function ScheduleTimeline({ programs = defaultPrograms }: { programs?: any[] }) {
  const displayList = programs && programs.length > 0 ? programs : defaultPrograms;

  return (
    <section id="schedule" className="py-16 bg-[#071428] border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>4 सितम्बर 2026 • कार्यक्रम रूपरेखा</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-festival tracking-wide">
            श्री कृष्ण जन्माष्टमी महोत्सव समय सारणी
          </h2>
          <p className="text-sm text-slate-300 font-hindi mt-2">
            कृपया सपरिवार समय पर पधारकर धर्मलाभ एवं महाप्रसाद प्राप्त करें।
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Center Line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-700 opacity-40" />

          <div className="space-y-8">
            {displayList.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  } gap-4 md:gap-8`}
                >
                  {/* Content Box */}
                  <div className="w-full md:w-1/2">
                    <div className="vedic-card p-5 sm:p-6 hover:scale-[1.01] transition-transform relative group">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.time_label || item.time}</span>
                        </span>
                        <span className="text-2xl">{item.icon || "🪔"}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-hindi group-hover:text-amber-300 transition-colors">
                        {item.title_hi}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mb-2">
                        {item.title_en}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-hindi">
                        {item.description || item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Badge Point */}
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0B1D3A] border-2 border-amber-500 text-amber-400 shadow-md shadow-amber-500/20 shrink-0 z-10 font-bold text-xs">
                    {idx + 1}
                  </div>

                  {/* Empty side for layout balance */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

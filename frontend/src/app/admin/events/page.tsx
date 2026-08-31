"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Plus, Clock } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatDateTime } from "@/lib/formatters";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchAPI<any[]>("/admin/events").then(setEvents);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-hindi">महोत्सव एवं कार्यक्रम प्रबंधन</h1>
        <p className="text-xs text-slate-400">श्री कृष्ण जन्माष्टमी एवं आगामी धार्मिक-सांस्कृतिक उत्सव।</p>
      </div>

      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🦚</span>
                <div>
                  <h3 className="text-lg font-bold text-white font-hindi">{ev.title_hi}</h3>
                  <p className="text-xs text-slate-400">{ev.title_en} • स्थान: {ev.venue}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                {ev.status}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 font-hindi mb-2">कार्यक्रम समय-सारणी:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ev.programs?.map((p: any) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center space-x-2 font-hindi">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-300 font-mono">{p.time_label}:</span>
                    <span className="text-slate-200">{p.title_hi}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

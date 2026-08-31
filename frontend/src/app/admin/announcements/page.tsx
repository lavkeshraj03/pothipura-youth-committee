"use client";
import React, { useEffect, useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatDateTime } from "@/lib/formatters";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const loadData = () => {
    fetchAPI<any[]>("/admin/announcements").then(setAnnouncements);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;
    try {
      await fetchAPI("/admin/announcements", {
        method: "POST",
        body: JSON.stringify({
          title_hi: title,
          title_en: title,
          description_hi: desc,
          description_en: desc,
          priority: "HIGH",
        }),
      });
      setShowModal(false);
      setTitle("");
      setDesc("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">सूचनाएं एवं पोस्टर प्रसारण</h1>
          <p className="text-xs text-slate-400">वेबसाइट पर प्रकाशित होने वाली आवश्यक सूचनाएं।</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ नई सूचना जारी करें</span>
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl bg-[#091830] border border-slate-800 flex items-start justify-between">
            <div className="space-y-1 font-hindi">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                  {a.priority}
                </span>
                <h3 className="text-base font-bold text-white">{a.title_hi}</h3>
              </div>
              <p className="text-xs text-slate-300">{a.description_hi}</p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{formatDateTime(a.publish_at)}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#091830] border border-amber-500/40 space-y-3 font-hindi">
            <h3 className="text-lg font-bold text-amber-400">+ नई सूचना लिखें</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">शीर्षक *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">विवरण *</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs">रद्द करें</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">प्रकाशित करें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

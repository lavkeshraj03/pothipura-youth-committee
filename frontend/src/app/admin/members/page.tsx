"use client";
import React, { useEffect, useState } from "react";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { fetchAPI } from "@/lib/api";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [desigId, setDesigId] = useState<number>(1);
  const [bio, setBio] = useState("");

  const loadData = () => {
    Promise.all([
      fetchAPI<any[]>("/admin/members"),
      fetchAPI<any[]>("/admin/members/designations"),
    ]).then(([mRes, dRes]) => {
      setMembers(mRes);
      setDesignations(dRes);
      if (dRes.length > 0) setDesigId(dRes[0].id);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    try {
      await fetchAPI("/admin/members", {
        method: "POST",
        body: JSON.stringify({
          full_name: name,
          mobile,
          designation_id: desigId,
          bio,
          display_order: members.length + 1,
        }),
      });
      setShowModal(false);
      setName("");
      setMobile("");
      setBio("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">
            समिति कार्यकारिणी एवं पदाधिकारी प्रबंधन
          </h1>
          <p className="text-xs text-slate-400">
            समिति के अध्यक्ष, सचिव, कोषाध्यक्ष एवं सभी कार्यकारिणी सदस्यों का विवरण।
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ नया सदस्य जोड़ें (Add Member)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((m) => (
          <div key={m.id} className="p-5 rounded-2xl bg-[#091830] border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-lg flex items-center justify-center font-hindi shrink-0">
                {m.full_name[0]}
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-hindi">
                  {m.designation?.title_hi || "सदस्य"}
                </span>
                <h3 className="text-base font-bold text-white font-hindi mt-1">{m.full_name}</h3>
                <p className="text-xs text-slate-400 font-mono">{m.mobile}</p>
              </div>
            </div>
            {m.bio && <p className="text-xs text-slate-300 line-clamp-2 font-hindi">{m.bio}</p>}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
              <span>क्रम #{m.display_order}</span>
              <span className="text-emerald-400">सक्रिय (Active)</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#091830] border border-amber-500/40 space-y-4">
            <h3 className="text-lg font-bold text-amber-400 font-hindi">+ नया पदाधिकारी जोड़ें</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-hindi mb-1">पूरा नाम *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-hindi mb-1">मोबाइल नंबर *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-hindi mb-1">पदनाम (Designation) *</label>
                <select
                  value={desigId}
                  onChange={(e) => setDesigId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>{d.title_hi} ({d.title_en})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-hindi mb-1">संक्षिप्त परिचय (Bio)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-hindi"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs">रद्द करें</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">सहेजें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

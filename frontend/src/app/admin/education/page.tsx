"use client";
import React, { useEffect, useState } from "react";
import { GraduationCap, CheckCircle, XCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatDateTime } from "@/lib/formatters";

export default function AdminEducationPage() {
  const [apps, setApps] = useState<any[]>([]);

  const loadData = () => {
    fetchAPI<any[]>("/admin/education/applications").then(setApps);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetchAPI(`/admin/education/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-hindi">
          IIT-JEE / NEET छात्रवृत्ति एवं कोचिंग सहायता आवेदन
        </h1>
        <p className="text-xs text-slate-400">ग्रामीण विद्यार्थियों द्वारा प्राप्त सहायता आवेदनों की समीक्षा सूची।</p>
      </div>

      <div className="space-y-4">
        {apps.map((a) => (
          <div key={a.id} className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-3 font-hindi">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                  {a.target_examination}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{a.student_name}</h3>
                <p className="text-xs text-slate-400">
                  अभिभावक: {a.parent_guardian_name} • ग्राम: {a.village_name} • मोबाइल: <span className="font-mono text-amber-300">{a.mobile}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold">
                {a.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-300 space-y-1">
              <p><span className="font-bold text-slate-400">शैक्षणिक प्रदर्शन:</span> {a.academic_performance}</p>
              <p><span className="font-bold text-slate-400">सहायता का कारण:</span> {a.reason_for_support}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>आवेदन दिनांक: {formatDateTime(a.created_at)}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleStatus(a.id, "APPROVED")}
                  className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-[11px]"
                >
                  मंजूर करें (Approve)
                </button>
                <button
                  onClick={() => handleStatus(a.id, "REJECTED")}
                  className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-[11px]"
                >
                  अस्वीकार (Reject)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

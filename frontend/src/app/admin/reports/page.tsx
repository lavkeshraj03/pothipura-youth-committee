"use client";
import React from "react";
import { FileSpreadsheet, Download, ShieldCheck } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-hindi">
          वित्तीय रिपोर्ट एवं एक्सेल / CSV निर्यात (Reports & Export)
        </h1>
        <p className="text-xs text-slate-400">
          समिति की वार्षिक व महोत्सव-वार वित्तीय ऑडिट रिपोर्ट एक क्लिक में डाउनलोड करें।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-mono">
            📊
          </div>
          <h3 className="text-lg font-bold text-white font-hindi">सम्पूर्ण दानदाता एवं रसीद रिपोर्ट</h3>
          <p className="text-xs text-slate-400 font-hindi">
            दानदाता का नाम, मोबाइल, रसीद क्रमांक, राशि, उद्देश्य, माध्यम एवं दिनांक सहित संपूर्ण डेटा।
          </p>
          <a
            href="http://localhost:8000/api/v1/admin/reports/donations/csv"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Donations CSV डाउनलोड करें</span>
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-mono">
            📉
          </div>
          <h3 className="text-lg font-bold text-white font-hindi">सम्पूर्ण व्यय एवं बिल विवरण रिपोर्ट</h3>
          <p className="text-xs text-slate-400 font-hindi">
            मद-वार खर्च, खर्चकर्ता समिति सदस्य, वेंडर विवरण, भुगतान माध्यम एवं तिथिवार बहीखाता।
          </p>
          <a
            href="http://localhost:8000/api/v1/admin/reports/expenses/csv"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Expenses CSV डाउनलोड करें</span>
          </a>
        </div>
      </div>
    </div>
  );
}

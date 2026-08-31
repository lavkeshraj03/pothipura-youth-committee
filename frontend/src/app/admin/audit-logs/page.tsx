"use client";
import React, { useEffect, useState } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatDateTime } from "@/lib/formatters";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    fetchAPI<any[]>("/admin/audit-logs").then((res) => {
      setLogs(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">
            सुरक्षा एवं वित्तीय ऑडिट ट्रेल (Immutable Audit Trail)
          </h1>
          <p className="text-xs text-slate-400">
            समिति में किए गए प्रत्येक वित्तीय एवं प्रशासनिक बदलाव का अकाट्य डिजिटल प्रमाण।
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>रिफ्रेश</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-hindi">
              <th className="pb-3">समय</th>
              <th className="pb-3">उपयोगकर्ता (User)</th>
              <th className="pb-3">कार्रवाई (Action)</th>
              <th className="pb-3">इकाई (Entity)</th>
              <th className="pb-3">विवरण (Changes)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-800/30">
                <td className="py-3 text-slate-400">{formatDateTime(l.created_at)}</td>
                <td className="py-3 font-bold text-amber-300">{l.user_name || "System"}</td>
                <td className="py-3 text-emerald-400">{l.action}</td>
                <td className="py-3 text-slate-400">{l.entity} #{l.entity_id}</td>
                <td className="py-3 max-w-sm truncate text-slate-400">
                  {JSON.stringify(l.new_values || l.old_values || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

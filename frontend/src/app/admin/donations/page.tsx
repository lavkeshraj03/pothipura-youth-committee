"use client";
import React, { useEffect, useState } from "react";
import { Heart, Search, CheckCircle, XCircle, FileText, Plus, Filter, Download } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR, formatDateTime } from "@/lib/formatters";
import { DonationAdminItem } from "@/types";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<DonationAdminItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDonations = () => {
    fetchAPI<DonationAdminItem[]>("/admin/donations")
      .then((res) => {
        setDonations(res);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleVerify = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      await fetchAPI(`/admin/donations/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadDonations();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const filtered = donations.filter((d) => {
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const matchesSearch =
      d.donor_name.toLowerCase().includes(search.toLowerCase()) ||
      d.donor_mobile.includes(search) ||
      (d.transaction_ref && d.transaction_ref.toLowerCase().includes(search.toLowerCase())) ||
      (d.receipt_number && d.receipt_number.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">
            सम्पूर्ण दान एवं रसीद प्रबंधन (Donation Ledger)
          </h1>
          <p className="text-xs text-slate-400">
            ऑनलाइन UPI, नकद एवं बैंक ट्रांसफर द्वारा प्राप्त सभी दानों का अधिकृत रजिस्टर।
          </p>
        </div>

        <a
          href="http://localhost:8000/api/v1/admin/reports/donations/csv"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center space-x-1.5"
        >
          <Download className="w-4 h-4" />
          <span>CSV रिपोर्ट डाउनलोड</span>
        </a>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#091830] border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="नाम, मोबाइल, UTR या रसीद से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {["ALL", "VERIFIED", "PAYMENT_SUBMITTED", "PENDING", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono whitespace-nowrap ${
                statusFilter === st
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-hindi">
              <th className="pb-3">रसीद संख्या</th>
              <th className="pb-3">दानदाता का नाम</th>
              <th className="pb-3">मोबाइल</th>
              <th className="pb-3">सहयोग राशि</th>
              <th className="pb-3">माध्यम</th>
              <th className="pb-3">UTR / Ref</th>
              <th className="pb-3">स्थिति (Status)</th>
              <th className="pb-3">दिनांक</th>
              <th className="pb-3 text-right">कार्रवाई / रसीद</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-hindi text-slate-300">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/30">
                <td className="py-3 font-mono font-bold text-amber-400">{d.receipt_number || "N/A"}</td>
                <td className="py-3 font-semibold text-white">{d.donor_name}</td>
                <td className="py-3 font-mono">{d.donor_mobile}</td>
                <td className="py-3 font-mono font-bold text-emerald-400">{formatINR(d.amount)}</td>
                <td className="py-3 font-mono text-[11px]">{d.payment_method}</td>
                <td className="py-3 font-mono text-slate-400">{d.transaction_ref || "-"}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      d.status === "VERIFIED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : d.status === "PAYMENT_SUBMITTED"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="py-3 text-slate-400">{formatDateTime(d.created_at)}</td>
                <td className="py-3 text-right space-x-1.5">
                  {d.status === "PAYMENT_SUBMITTED" || d.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleVerify(d.id, "VERIFIED")}
                        className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleVerify(d.id, "REJECTED")}
                        className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-[10px]"
                      >
                        Reject
                      </button>
                    </>
                  ) : d.receipt_download_url ? (
                    <a
                      href={d.receipt_download_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white text-[10px] font-bold inline-flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF रसीद</span>
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

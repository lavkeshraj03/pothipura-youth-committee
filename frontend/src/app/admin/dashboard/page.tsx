"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, Clock, Plus, CheckCircle, XCircle,
  FileText, ShieldCheck, Heart, AlertCircle, ArrowUpRight
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR, formatDate, formatDateTime } from "@/lib/formatters";
import { DonationAdminItem } from "@/types";

export default function AdminDashboardPage() {
  const [donations, setDonations] = useState<DonationAdminItem[]>([]);
  const [transparency, setTransparency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cash Modal State
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashName, setCashName] = useState("");
  const [cashMobile, setCashMobile] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cashPurpose, setCashPurpose] = useState("JANMASHTAMI");
  const [cashNotes, setCashNotes] = useState("");
  const [cashSubmitting, setCashSubmitting] = useState(false);

  const loadData = () => {
    Promise.all([
      fetchAPI<DonationAdminItem[]>("/admin/donations"),
      fetchAPI<any>("/public/transparency"),
    ])
      .then(([donRes, tranRes]) => {
        setDonations(donRes);
        setTransparency(tranRes);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      await fetchAPI(`/admin/donations/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const handleAddCashDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashName || !cashMobile || !cashAmount) return;
    setCashSubmitting(true);
    try {
      await fetchAPI("/admin/donations/cash", {
        method: "POST",
        body: JSON.stringify({
          donor_name: cashName,
          donor_mobile: cashMobile,
          amount: parseFloat(cashAmount),
          purpose: cashPurpose,
          notes: cashNotes,
        }),
      });
      setShowCashModal(false);
      setCashName("");
      setCashMobile("");
      setCashAmount("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add cash donation");
    } finally {
      setCashSubmitting(false);
    }
  };

  const pendingDonations = donations.filter((d) => d.status === "PAYMENT_SUBMITTED" || d.status === "PENDING");
  const verifiedDonations = donations.filter((d) => d.status === "VERIFIED");

  const raised = transparency?.total_verified_donations || 245000;
  const spent = transparency?.total_approved_expenses || 124000;
  const net = raised - spent;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">
            समिति वित्तीय एवं प्रबंधन डैशबोर्ड
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            श्री कृष्ण जन्माष्टमी महोत्सव 2026 • वास्तविक समय वित्तीय आंकड़े
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowCashModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ नकद दान दर्ज करें (Add Cash)</span>
          </button>
          <Link
            href="/admin/expenses"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <DollarSign className="w-4 h-4 text-rose-400" />
            <span>+ खर्च दर्ज करें (Add Expense)</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#091830] border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold font-hindi">
            <span>कुल सत्यापित दान (Verified Raised)</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatINR(raised)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ✓ {verifiedDonations.length} सत्यापित रसीदें जारी
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091830] border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold font-hindi">
            <span>सत्यापन प्रतीक्षारत (Pending)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {pendingDonations.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ऑनलाइन UPI UTR सत्यापन अपेक्षित
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091830] border border-rose-500/30">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold font-hindi">
            <span>कुल व्यवस्था व्यय (Expenses)</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            {formatINR(spent)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            टेंट, साउंड, प्रसाद व सजावट
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091830] border border-blue-500/30">
          <div className="flex items-center justify-between text-xs text-blue-400 font-semibold font-hindi">
            <span>उपलब्ध शेष निधि (Net Balance)</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-2">
            {formatINR(net)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            बैंक व कोष में सुरक्षित
          </div>
        </div>
      </div>

      {/* Pending Verifications Queue */}
      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-hindi">
              ऑनलाइन UPI दान सत्यापन कतार (Pending Verifications)
            </h2>
          </div>
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono font-bold">
            {pendingDonations.length} Pending
          </span>
        </div>

        {pendingDonations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-hindi">
            ✓ कोई भी ऑनलाइन दान सत्यापन हेतु लंबित नहीं है।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-hindi">
                  <th className="pb-2">दानदाता का नाम</th>
                  <th className="pb-2">मोबाइल</th>
                  <th className="pb-2">सहयोग राशि</th>
                  <th className="pb-2">UTR / Reference</th>
                  <th className="pb-2">समय</th>
                  <th className="pb-2 text-right">कार्रवाई (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-hindi text-slate-300">
                {pendingDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">{d.donor_name}</td>
                    <td className="py-3 font-mono">{d.donor_mobile}</td>
                    <td className="py-3 font-mono font-bold text-emerald-400">{formatINR(d.amount)}</td>
                    <td className="py-3 font-mono text-amber-300">{d.transaction_ref || "UTR Awaited"}</td>
                    <td className="py-3 text-slate-400">{formatDateTime(d.created_at)}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(d.id, "VERIFIED")}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] inline-flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>सत्यापित करें (Verify)</span>
                      </button>
                      <button
                        onClick={() => handleVerify(d.id, "REJECTED")}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] inline-flex items-center space-x-1"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>अस्वीकार (Reject)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Verified Donations Ledger */}
      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-hindi">
            हाल ही में जारी अधिकृत दान रसीदें (Recent Verified Donations)
          </h2>
          <Link href="/admin/donations" className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
            <span>सभी देखें</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-hindi">
                <th className="pb-2">रसीद सं. (Receipt)</th>
                <th className="pb-2">दानदाता का नाम</th>
                <th className="pb-2">माध्यम (Mode)</th>
                <th className="pb-2">सहयोग राशि</th>
                <th className="pb-2">उद्देश्य</th>
                <th className="pb-2">सत्यापनकर्ता</th>
                <th className="pb-2 text-right">PDF रसीद</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-hindi text-slate-300">
              {verifiedDonations.slice(0, 8).map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-amber-400">{d.receipt_number || "YOUTH-2026-X"}</td>
                  <td className="py-3 font-semibold text-white">{d.donor_name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {d.payment_method}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{formatINR(d.amount)}</td>
                  <td className="py-3">{d.purpose}</td>
                  <td className="py-3 text-slate-400">{d.verified_by_name || d.collected_by_name || "Admin"}</td>
                  <td className="py-3 text-right">
                    {d.receipt_download_url ? (
                      <a
                        href={d.receipt_download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white text-[11px] inline-flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>रसीद</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[11px]">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Donation Modal */}
      {showCashModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#091830] border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-amber-400 font-hindi">
                + नकद दान संग्रह प्रविष्टि (Add Cash Donation)
              </h3>
              <button
                onClick={() => setShowCashModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCashDonation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  दानदाता का नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. मोहन सिंह जी"
                  value={cashName}
                  onChange={(e) => setCashName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                    मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10 अंकों का मोबाइल"
                    value={cashMobile}
                    onChange={(e) => setCashMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                    नकद सहयोग राशि (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="5100"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono font-bold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  सहयोग का उद्देश्य
                </label>
                <select
                  value={cashPurpose}
                  onChange={(e) => setCashPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="JANMASHTAMI">श्री कृष्ण जन्माष्टमी महोत्सव</option>
                  <option value="EDUCATION">शिक्षा सहायता कोष (IIT/NEET)</option>
                  <option value="COMMUNITY">ग्राम विकास एवं सामाजिक</option>
                  <option value="GENERAL">सामान्य सहयोग</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  टिप्पणी / संदर्भ (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. रसीद बुक क्रमांक 12, रसीद सं. 45"
                  value={cashNotes}
                  onChange={(e) => setCashNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCashModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={cashSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow disabled:opacity-50"
                >
                  {cashSubmitting ? "दर्ज हो रहा है..." : "दान सहेजें एवं डिजिटल रसीद बनाएं"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { Settings, Save, QrCode, Check } from "lucide-react";
import { fetchAPI } from "@/lib/api";

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState("youthcommittee@upi");
  const [payeeName, setPayeeName] = useState("Gram Yuva Samiti");
  const [donationNote, setDonationNote] = useState("Janmashtami Mahotsav Donation");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAPI<any>("/admin/settings/upi").then((res) => {
      if (res) {
        setUpiId(res.upi_id || "youthcommittee@upi");
        setPayeeName(res.payee_name || "Gram Yuva Samiti");
        setDonationNote(res.donation_note || "Janmashtami Mahotsav Donation");
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await fetchAPI("/admin/settings/upi", {
        method: "PUT",
        body: JSON.stringify({
          upi_id: upiId,
          payee_name: payeeName,
          donation_note: donationNote,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-hindi">
          दान एवं UPI विन्यास (Donation & UPI Settings)
        </h1>
        <p className="text-xs text-slate-400">
          सार्वजनिक वेबसाइट पर प्रदर्शित होने वाले UPI QR कोड एवं दान खाता सेटिंग्स।
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-hindi flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>सेटिंग्स सफलतापूर्वक अपडेट की गईं!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
              समिति अधिकृत UPI ID *
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
              भुगतान प्राप्तकर्ता नाम (Payee Name) *
            </label>
            <input
              type="text"
              required
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
              डिफ़ॉल्ट नोट / संदर्भ (Donation Transaction Note)
            </label>
            <input
              type="text"
              value={donationNote}
              onChange={(e) => setDonationNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "सहेजा जा रहा है..." : "सेटिंग्स सुरक्षित करें"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { DollarSign, Plus, Download, Trash2, ShieldAlert } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/formatters";
import { ExpenseAdminItem } from "@/types";

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseAdminItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [catId, setCatId] = useState<number>(1);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [memberId, setMemberId] = useState("");
  const [vendor, setVendor] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    Promise.all([
      fetchAPI<ExpenseAdminItem[]>("/admin/expenses"),
      fetchAPI<any[]>("/admin/expenses/categories"),
      fetchAPI<any[]>("/admin/members"),
    ]).then(([expRes, catRes, memRes]) => {
      setExpenses(expRes);
      setCategories(catRes);
      setMembers(memRes);
      if (catRes.length > 0) setCatId(catRes[0].id);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    setLoading(true);
    try {
      await fetchAPI("/admin/expenses", {
        method: "POST",
        body: JSON.stringify({
          category_id: Number(catId),
          amount: parseFloat(amount),
          description,
          committee_member_id: memberId || undefined,
          vendor_name: vendor || undefined,
          payment_method: payMethod,
          expense_date: expenseDate,
        }),
      });
      setShowModal(false);
      setAmount("");
      setDescription("");
      setVendor("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async (id: string) => {
    const reason = prompt("कृपया व्यय निरस्त (Void) करने का कारण लिखें:");
    if (!reason) return;
    try {
      await fetchAPI(`/admin/expenses/${id}/void?reason=${encodeURIComponent(reason)}`, {
        method: "PATCH",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to void expense");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-hindi">
            व्यवस्था व्यय लेखा (Expense Ledger)
          </h1>
          <p className="text-xs text-slate-400">
            किस सदस्य ने किस मद में कितना खर्च किया — संपूर्ण पारदर्शी रिकॉर्ड।
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="http://localhost:8000/api/v1/admin/reports/expenses/csv"
            className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs border border-slate-700 flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>CSV डाउनलोड</span>
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया खर्च दर्ज करें (Add Expense)</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="p-6 rounded-2xl bg-[#091830] border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-hindi">
              <th className="pb-3">दिनांक</th>
              <th className="pb-3">मद / श्रेणी</th>
              <th className="pb-3">विवरण</th>
              <th className="pb-3">खर्चकर्ता सदस्य</th>
              <th className="pb-3">दुकानदार / वेंडर</th>
              <th className="pb-3">माध्यम</th>
              <th className="pb-3">राशि (Amount)</th>
              <th className="pb-3">स्थिति</th>
              <th className="pb-3 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-hindi text-slate-300">
            {expenses.map((e) => (
              <tr key={e.id} className={`hover:bg-slate-800/30 ${e.status === "VOIDED" ? "opacity-40 line-through" : ""}`}>
                <td className="py-3 font-mono text-slate-400">{formatDate(e.expense_date)}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
                    {e.category_name_hi}
                  </span>
                </td>
                <td className="py-3 font-semibold text-white max-w-xs">{e.description}</td>
                <td className="py-3 text-slate-300 font-bold">{e.committee_member_name || "समिति कोष"}</td>
                <td className="py-3 text-slate-400">{e.vendor_name || "-"}</td>
                <td className="py-3 font-mono text-[11px]">{e.payment_method}</td>
                <td className="py-3 font-mono font-bold text-rose-400">{formatINR(e.amount)}</td>
                <td className="py-3 font-mono text-[11px]">{e.status}</td>
                <td className="py-3 text-right">
                  {e.status !== "VOIDED" && (
                    <button
                      onClick={() => handleVoid(e.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Void Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#091830] border border-rose-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-400 font-hindi">
                + नया व्यवस्था व्यय दर्ज करें (Add Expense)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">व्यय श्रेणी (Category) *</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_hi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">खर्च राशि (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="12500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">खर्च का विवरण (Description) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. मंदिर प्रांगण सजावट हेतु ताजे फूलों की मालाएं"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">खर्चकर्ता समिति सदस्य</label>
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="">समिति कोष (General Fund)</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.full_name} ({m.designation?.title_hi || "सदस्य"})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">दुकानदार / वेंडर का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. श्री श्याम टेंट हाउस"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">भुगतान माध्यम</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="CASH">नकद (Cash)</option>
                    <option value="UPI">UPI / ऑनलाइन</option>
                    <option value="BANK_TRANSFER">बैंक ट्रांसफर</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">खर्च की तिथि</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow disabled:opacity-50"
                >
                  {loading ? "दर्ज हो रहा है..." : "खर्च सहेजें (Save Expense)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

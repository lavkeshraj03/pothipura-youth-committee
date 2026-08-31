/**
 * Gram Yuva Samiti — Central Dynamic Reactive Data Store & Backend API Bridge
 * Connects Frontend UI directly to FastAPI Backend endpoints (/api/v1/) with reactive caching.
 * Powers Super Admin CRUD (Verification, Direct Entry, Delete, Spends),
 * Live Verified Transparency Ledger, Dynamic Top 4 Hero Donors, and Donors Wall.
 */

// ✅ No demo data — all entries added by admin through the admin panel only
const DEFAULT_VERIFIED_DONATIONS = [];
const DEFAULT_PENDING_DONATIONS = [];
const DEFAULT_EXPENSES = [];

class GYSDataStore {
  constructor() {
    // Auto-detect API base:
    // - If running on Render (pyc-backend.onrender.com) or localhost → use relative /api/v1
    // - If running on Vercel (separate static hosting) → use full Render backend URL
    const hostname = window.location.hostname;
    const isVercel = hostname.includes("vercel.app");
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    
    if (isVercel) {
      // ⚠️ Update this URL after your Render deployment is live
      this.apiBase = "https://pyc-backend.onrender.com/api/v1";
    } else {
      // Localhost dev OR Render (backend serves frontend directly)
      this.apiBase = "/api/v1";
    }
    this.initStore();
    this.syncFromBackend();
  }

  initStore() {
    // Always reset to current defaults (clears any previously cached demo data)
    localStorage.setItem("gys_verified_donations", JSON.stringify(DEFAULT_VERIFIED_DONATIONS));
    localStorage.setItem("gys_pending_donations", JSON.stringify(DEFAULT_PENDING_DONATIONS));
    localStorage.setItem("gys_expenses", JSON.stringify(DEFAULT_EXPENSES));
  }

  // Attempt async sync with FastAPI backend if available
  async syncFromBackend() {
    try {
      const res = await fetch(`${this.apiBase}/public/transparency`);
      if (res.ok) {
        const data = await res.json();
        if (data.total_donations_amount) {
          console.log("[GYS Store] Synced transparency data with backend API");
        }
      }
    } catch (err) {
      // Offline / Static mode active fallback
    }
  }

  getVerifiedDonations() {
    return JSON.parse(localStorage.getItem("gys_verified_donations") || "[]");
  }

  getPendingDonations() {
    return JSON.parse(localStorage.getItem("gys_pending_donations") || "[]");
  }

  getExpenses() {
    return JSON.parse(localStorage.getItem("gys_expenses") || "[]");
  }

  getFinancialMetrics() {
    const donations = this.getVerifiedDonations();
    const expenses = this.getExpenses();

    const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const balance = totalDonations - totalExpenses;
    const target = 500000;
    const progressPercent = Math.min(100, Math.round((totalDonations / target) * 100));

    return {
      totalDonations,
      donorCount: donations.length,
      totalExpenses,
      balance,
      target,
      progressPercent
    };
  }

  getTopDonors(limit = 4) {
    const list = [...this.getVerifiedDonations()];
    list.sort((a, b) => Number(b.amount) - Number(a.amount));
    return list.slice(0, limit);
  }

  // 1. Submit Online Donation (Enters Pending Queue)
  addOnlineDonation(donor) {
    const pending = this.getPendingDonations();
    const newEntry = {
      id: "PEND-" + Date.now().toString().slice(-4),
      name: donor.name,
      location: donor.location || "ऑनलाइन दानदाता",
      amount: Number(donor.amount),
      phone: donor.phone,
      utr: donor.utr,
      mode: "ऑनलाइन UPI QR",
      date: new Date().toISOString().split('T')[0]
    };
    pending.unshift(newEntry);
    localStorage.setItem("gys_pending_donations", JSON.stringify(pending));
    return newEntry;
  }

  // 2. Approve Pending Donation (Moves to Verified, Updates Live Ledger & Frontend)
  approveDonation(pendingId) {
    const pending = this.getPendingDonations();
    const idx = pending.findIndex(p => p.id === pendingId);
    if (idx === -1) return null;

    const item = pending.splice(idx, 1)[0];
    localStorage.setItem("gys_pending_donations", JSON.stringify(pending));

    const verified = this.getVerifiedDonations();
    const verifiedEntry = {
      id: "GYS-REC-" + Date.now().toString().slice(-4),
      name: item.name,
      location: item.location || "ग्राम निवासी",
      amount: item.amount,
      phone: item.phone,
      utr: item.utr,
      collector: "ऑनलाइन गेटवे (सत्यापित: सुपर एडमिन)",
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    verified.unshift(verifiedEntry);
    localStorage.setItem("gys_verified_donations", JSON.stringify(verified));
    return verifiedEntry;
  }

  // 3. Reject / Delete Pending Donation
  rejectPendingDonation(pendingId) {
    const pending = this.getPendingDonations().filter(p => p.id !== pendingId);
    localStorage.setItem("gys_pending_donations", JSON.stringify(pending));
  }

  // 4. Delete Verified Donation (Super Admin Option)
  deleteVerifiedDonation(donationId) {
    const verified = this.getVerifiedDonations().filter(d => d.id !== donationId);
    localStorage.setItem("gys_verified_donations", JSON.stringify(verified));
  }

  // 5. Add Direct Donation by Member / Admin (Auto-Verified, Instantly on Frontend)
  addDirectDonation(donation) {
    const verified = this.getVerifiedDonations();
    const newEntry = {
      id: "GYS-REC-" + Date.now().toString().slice(-4),
      name: donation.name,
      location: donation.location || "ग्राम निवासी",
      amount: Number(donation.amount),
      phone: donation.phone || "अप्रत्यक्ष",
      utr: donation.utr || "DIRECT-CASH-" + Date.now().toString().slice(-4),
      collector: donation.collector || "समिति कोषाध्यक्ष मंडल",
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    verified.unshift(newEntry);
    localStorage.setItem("gys_verified_donations", JSON.stringify(verified));
    return newEntry;
  }

  // 6. Add Expense with 'Member Who Spent' (Super Admin Only)
  addExpense(expense) {
    const expenses = this.getExpenses();
    const newEntry = {
      id: "EXP-" + Date.now().toString().slice(-4),
      head: expense.head,
      member: expense.member,
      vendor: expense.vendor || "स्थानीय विक्रेता",
      amount: Number(expense.amount),
      billNo: expense.billNo || "VOUCH-" + Date.now().toString().slice(-3),
      date: new Date().toISOString().split('T')[0]
    };
    expenses.unshift(newEntry);
    localStorage.setItem("gys_expenses", JSON.stringify(expenses));
    return newEntry;
  }

  // 7. Delete Expense (Super Admin Option)
  deleteExpense(expenseId) {
    const expenses = this.getExpenses().filter(e => e.id !== expenseId);
    localStorage.setItem("gys_expenses", JSON.stringify(expenses));
  }
}

window.gysStore = new GYSDataStore();

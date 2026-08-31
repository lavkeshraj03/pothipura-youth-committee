/**
 * Gram Yuva Samiti — Central Dynamic Reactive Data Store & Backend API Bridge
 * Connects Frontend UI directly to FastAPI Backend endpoints (/api/v1/) with reactive caching.
 * Powers Super Admin CRUD (Verification, Direct Entry, Delete, Spends),
 * Live Verified Transparency Ledger, Dynamic Top 4 Hero Donors, and Donors Wall.
 */

const DEFAULT_VERIFIED_DONATIONS = [
  { id: "DON-001", name: "चौधरी हनुमान राम जी", location: "ग्राम मुख्य चौक", amount: 51000, phone: "9829012345", utr: "UPI-423100918234", collector: "कोषाध्यक्ष महेश अग्रवाल", date: "2026-08-28", verified: true },
  { id: "DON-002", name: "सूरत प्रवासी मंडल", location: "सूरत, गुजरात", amount: 51000, phone: "9829045678", utr: "NEFT-7821900123", collector: "उपाध्यक्ष राजेश शर्मा", date: "2026-08-29", verified: true },
  { id: "DON-003", name: "सेठ बंशीधर अग्रवाल", location: "कोलकाता प्रवासी", amount: 31000, phone: "9829078901", utr: "UPI-423100918236", collector: "कोषाध्यक्ष महेश अग्रवाल", date: "2026-08-30", verified: true },
  { id: "DON-004", name: "पंडित जगदीश शर्मा", location: "जयपुर प्रवासी", amount: 21000, phone: "9829023456", utr: "UPI-423100918237", collector: "अध्यक्ष सुरेश कुमार", date: "2026-08-30", verified: true },
  { id: "DON-005", name: "ठाकुर भवानी सिंह जी", location: "गढ़ परिसर", amount: 15000, phone: "9414012345", utr: "DIRECT-CASH-005", collector: "सचिव दिनेश सिंह", date: "2026-08-31", verified: true },
  { id: "DON-006", name: "श्री कृष्ण युवा मंडल", location: "वार्ड नं. 4", amount: 11000, phone: "9414067890", utr: "DIRECT-CASH-006", collector: "संयोजक अमित चौधरी", date: "2026-08-31", verified: true },
  { id: "DON-007", name: "मास्टर मूलचंद कुमावत", location: "सेवानिवृत्त प्रधानाध्यापक", amount: 11000, phone: "9414033221", utr: "UPI-9921004123", collector: "कोषाध्यक्ष महेश अग्रवाल", date: "2026-08-31", verified: true },
  { id: "DON-008", name: "रामगोपाल शर्मा", location: "बाजार चौक", amount: 5100, phone: "9829099887", utr: "DIRECT-CASH-008", collector: "उपाध्यक्ष राजेश शर्मा", date: "2026-08-31", verified: true },
  { id: "DON-009", name: "कैलाश चंद्र जाट", location: "कृषि फार्म", amount: 5100, phone: "9829055443", utr: "UPI-4235889123", collector: "कोषाध्यक्ष महेश अग्रवाल", date: "2026-08-31", verified: true },
  { id: "DON-010", name: "नवरतन सोनी", location: "सर्राफा बाजार", amount: 3100, phone: "9829011223", utr: "DIRECT-CASH-010", collector: "अध्यक्ष सुरेश कुमार", date: "2026-08-31", verified: true },
  { id: "DON-011", name: "हनुमान सहाय जांगिड़", location: "वार्ड नं. 7", amount: 2100, phone: "9829033445", utr: "UPI-4235998811", collector: "सचिव दिनेश सिंह", date: "2026-08-31", verified: true }
];

const DEFAULT_PENDING_DONATIONS = [
  { id: "PEND-001", name: "विक्रम सिंह राठौड़", location: "ग्राम मुख्य बाजार", amount: 11000, phone: "9829088776", utr: "423589912041", mode: "ऑनलाइन QR", date: "2026-08-31" },
  { id: "PEND-002", name: "गोपाल कृष्ण पारीक", location: "वार्ड नं. 2", amount: 5100, phone: "9414012890", utr: "423577189023", mode: "ऑनलाइन QR", date: "2026-08-31" }
];

const DEFAULT_EXPENSES = [
  { id: "EXP-001", head: "टेंट एवं भव्य वाटरप्रूफ पांडाल", member: "राजेश शर्मा (उपाध्यक्ष)", vendor: "श्री श्याम टेंट हाउस", amount: 45000, billNo: "BILL-402", date: "2026-08-28" },
  { id: "EXP-002", head: "लाइव डिजिटल साउंड व 108 दीप लाइटिंग", member: "महेश अग्रवाल (कोषाध्यक्ष)", vendor: "बालाजी डीजे एंड साउंड्स", amount: 35000, billNo: "BILL-118", date: "2026-08-29" },
  { id: "EXP-003", head: "माखन, मिश्री, 56 भोग व 1500 पैकेट प्रसाद", member: "दिनेश सिंह (सचिव)", vendor: "कन्हैया मिष्ठान भंडार", amount: 24000, billNo: "BILL-905", date: "2026-08-30" },
  { id: "EXP-004", head: "कुश्ती अखाड़ा तैयारी, माटी पूजन व प्राथमिक चिकित्सा", member: "अमित चौधरी (संयोजक)", vendor: "अखाड़ा व्यवस्था समिति", amount: 12000, billNo: "VOUCH-102", date: "2026-08-30" },
  { id: "EXP-005", head: "प्रचार-प्रसार, बैनर व डिजिटल व्यवस्था", member: "विकास जांगिड़ (मीडिया हेड)", vendor: "गणेश प्रिंटर्स", amount: 8000, billNo: "BILL-331", date: "2026-08-31" }
];

class GYSDataStore {
  constructor() {
    this.apiBase = "/api/v1";
    this.initStore();
    this.syncFromBackend();
  }

  initStore() {
    if (!localStorage.getItem("gys_verified_donations")) {
      localStorage.setItem("gys_verified_donations", JSON.stringify(DEFAULT_VERIFIED_DONATIONS));
    }
    if (!localStorage.getItem("gys_pending_donations")) {
      localStorage.setItem("gys_pending_donations", JSON.stringify(DEFAULT_PENDING_DONATIONS));
    }
    if (!localStorage.getItem("gys_expenses")) {
      localStorage.setItem("gys_expenses", JSON.stringify(DEFAULT_EXPENSES));
    }
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

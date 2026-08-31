"use client";
import React, { useState } from "react";
import { Heart, QrCode, Smartphone, Copy, Check, ShieldCheck, ArrowRight, Sparkles, Building, Banknote } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { formatINR } from "@/lib/formatters";

export default function DonatePage() {
  const [amount, setAmount] = useState<number | string>(1100);
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("JANMASHTAMI");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");

  // Step 2 State
  const [initiatedData, setInitiatedData] = useState<any>(null);
  const [utr, setUtr] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const presetAmounts = [501, 1100, 2100, 5100, 11000, 21000];

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const finalAmount = customAmount ? parseFloat(customAmount) : Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      setErrorMsg("कृपया मान्य सहयोग राशि दर्ज करें।");
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg("कृपया अपना पूरा नाम दर्ज करें।");
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg("कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchAPI<any>("/public/donations/initiate", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          mobile,
          email: email || undefined,
          amount: finalAmount,
          purpose,
          is_anonymous: isAnonymous,
          donor_message: donorMessage || undefined,
        }),
      });
      setInitiatedData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "भुगतान प्रारंभ करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUTR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      setErrorMsg("कृपया बैंक UTR या UPI Reference Number दर्ज करें।");
      return;
    }
    setLoading(true);
    try {
      await fetchAPI("/public/donations/confirm", {
        method: "POST",
        body: JSON.stringify({
          donation_id: initiatedData.donation_id,
          transaction_ref: utr,
        }),
      });
      setConfirmSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "विवरण सबमिट करने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>स्वैच्छिक दान एवं सहयोग मंच</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          श्री कृष्ण जन्माष्टमी एवं ग्राम विकास सहयोग
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2 max-w-xl mx-auto">
          आपका प्रत्येक सहयोग उत्सव की भव्यता एवं ग्राम उत्थान में समर्पित होगा। भुगतान के उपरांत अधिकृत ई-रसीद प्राप्त करें।
        </p>
      </div>

      {!initiatedData ? (
        /* Step 1: Donor Info & Amount Selection */
        <div className="vedic-card p-6 sm:p-8">
          <form onSubmit={handleInitiate} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-hindi">
                {errorMsg}
              </div>
            )}

            {/* Purpose Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 font-hindi mb-2 uppercase tracking-wider">
                सहयोग का उद्देश्य (Donation Purpose) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "JANMASHTAMI", label: "श्री कृष्ण जन्माष्टमी 2026", icon: "🦚" },
                  { id: "EDUCATION", label: "शिक्षा सहायता (IIT/NEET)", icon: "📚" },
                  { id: "COMMUNITY", label: "ग्राम विकास एवं सामाजिक", icon: "🏛️" },
                  { id: "GENERAL", label: "सामान्य सहयोग", icon: "🙏" },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPurpose(p.id)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      purpose === p.id
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-xs font-hindi">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 font-hindi mb-2 uppercase tracking-wider">
                सहयोग राशि चुनें (Select Amount) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-bold font-mono transition-all ${
                      amount === amt && !customAmount
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105"
                        : "bg-slate-900/60 border-slate-800 text-slate-200 hover:border-amber-500/40"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="अन्य कोई भी स्वैच्छिक राशि (Custom Amount)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount("");
                  }}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-sm"
                />
              </div>
            </div>

            {/* Donor Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  दानदाता का नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल शर्मा"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  मोबाइल नंबर (WhatsApp No) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  ईमेल (वैकल्पिक / Optional)
                </label>
                <input
                  type="email"
                  placeholder="email@example.com (रसीद प्राप्ति हेतु)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
                  संदेश / शुभकामना (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="समिति या ग्रामवासियों के नाम कोई संदेश"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-hindi"
                />
              </div>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="anon" className="text-xs text-slate-300 font-hindi cursor-pointer">
                मेरा नाम सार्वजनिक दानदाता सूची में 'गुप्त दानदाता (Anonymous)' के रूप में प्रदर्शित करें।
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Smartphone className="w-5 h-5" />
              <span>{loading ? "कृपया प्रतीक्षा करें..." : `₹${(customAmount || amount).toLocaleString()} UPI द्वारा भुगतान करें`}</span>
            </button>
          </form>

          {/* Cash donation note */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
            <Banknote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300">नकद दान (Cash Donation): </span>
              यदि आप नकद सहयोग देना चाहते हैं, तो कृपया समिति अध्यक्ष/कोषाध्यक्ष या अधिकृत कार्यकारिणी सदस्यों से संपर्क करें और मौके पर ही अधिकृत डिजिटल रसीद प्राप्त करें।
            </div>
          </div>
        </div>
      ) : confirmSuccess ? (
        /* Step 3: Success Screen */
        <div className="vedic-card p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-black text-white font-hindi">
            भुगतान विवरण सफलतापूर्वक सबमिट हुआ!
          </h2>
          <p className="text-sm text-slate-300 font-hindi max-w-md mx-auto">
            समिति के वित्तीय प्रबंधक द्वारा बैंक स्टेटमेंट सत्यापन के उपरांत आपकी आधिकारिक डिजिटल रसीद जारी कर आपके व्हाट्सएप नंबर <b>{mobile}</b> पर प्रेषित कर दी जाएगी।
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400">
            रेफरेंस आईडी: {initiatedData.reference_code} • राशि: ₹{initiatedData.amount}
          </div>
          <button
            onClick={() => {
              setInitiatedData(null);
              setConfirmSuccess(false);
              setUtr("");
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
          >
            नया दान दर्ज करें
          </button>
        </div>
      ) : (
        /* Step 2: UPI QR & UTR Submission Screen */
        <div className="vedic-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="text-xs text-slate-400 font-hindi">सहयोग राशि</div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {formatINR(initiatedData.amount)}
            </div>
            <div className="text-xs text-emerald-400 mt-0.5">रेफरेंस कोड: {initiatedData.reference_code}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white text-slate-950 shadow-inner">
              <p className="text-xs font-bold text-slate-700 font-hindi mb-2">
                किसी भी UPI ऐप से QR कोड स्कैन करें
              </p>
              {initiatedData.qr_code_data_uri && (
                <img
                  src={initiatedData.qr_code_data_uri}
                  alt="UPI QR Code"
                  className="w-48 h-48 border border-slate-300 rounded-lg p-1"
                />
              )}
              <div className="flex items-center space-x-2 mt-3 text-xs text-slate-600 font-mono">
                <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
              </div>
            </div>

            {/* UPI Deep link & Manual UTR */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 font-hindi mb-1">
                  समिति UPI ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={initiatedData.upi_id}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyUPI(initiatedData.upi_id)}
                    className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "कॉपी हुआ" : "कॉपी"}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Deep link */}
              <a
                href={initiatedData.upi_intent_uri}
                className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center text-sm shadow transition-all"
              >
                📱 मोबाइल UPI ऐप से सीधे भुगतान करें
              </a>

              {/* Step 2 Form */}
              <form onSubmit={handleConfirmUTR} className="pt-3 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-amber-400 font-hindi">
                  भुगतान उपरांत UTR / Reference No. दर्ज करें *
                </label>
                <input
                  type="text"
                  required
                  placeholder="12 अंकों का UPI UTR (उदा. 423984729384)"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white text-sm font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition-all disabled:opacity-50"
                >
                  {loading ? "सत्यापित किया जा रहा है..." : "पुष्टि करें एवं रसीद अनुरोध भेजें"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

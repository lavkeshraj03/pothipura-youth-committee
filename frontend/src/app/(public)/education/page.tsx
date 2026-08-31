"use client";
import React, { useState } from "react";
import { BookOpen, GraduationCap, CheckCircle, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function EducationPage() {
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [village, setVillage] = useState("");
  const [currentClass, setCurrentClass] = useState("12th");
  const [school, setSchool] = useState("");
  const [targetExam, setTargetExam] = useState("IIT-JEE");
  const [academicPerf, setAcademicPerf] = useState("");
  const [incomeRange, setIncomeRange] = useState("Less than ₹1.5 Lakh / year");
  const [reason, setReason] = useState("");
  const [coachingReq, setCoachingReq] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await fetchAPI("/public/education/apply", {
        method: "POST",
        body: JSON.stringify({
          student_name: studentName,
          parent_guardian_name: parentName,
          mobile,
          email: email || undefined,
          village_name: village,
          current_class_or_year: currentClass,
          school_or_college: school,
          target_examination: targetExam,
          academic_performance: academicPerf,
          annual_family_income_range: incomeRange,
          reason_for_support: reason,
          coaching_requirement: coachingReq,
        }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "आवेदन सबमिट करने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          <span>दीर्घकालीन ग्राम शिक्षा उत्थान पहल</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          IIT-JEE, NEET एवं प्रतियोगी परीक्षा छात्र मार्गदर्शन योजना
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2">
          “आर्थिक तंगी के कारण किसी भी ग्रामीण प्रतिभावान छात्र की शिक्षा नहीं रुकेगी।”
        </p>
      </div>

      {!submitted ? (
        <div className="vedic-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-lg font-bold text-amber-400 font-hindi border-b border-slate-800 pb-2">
              विद्यार्थी सहायता आवेदन पत्र (Student Application Form)
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-sm font-hindi">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">विद्यार्थी का नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="छात्र/छात्रा का पूरा नाम"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">माता / पिता / अभिभावक का नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="अभिभावक का नाम"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">मोबाइल नंबर (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">ग्राम / ढाणी का नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="गांव का नाम"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">वर्तमान कक्षा / वर्ष *</label>
                <select
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="10th">10th (10वीं)</option>
                  <option value="11th">11th (11वीं)</option>
                  <option value="12th">12th (12वीं)</option>
                  <option value="12th Pass / Dropper">12th Pass / Dropper</option>
                  <option value="College / Graduation">College / Graduation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">लक्ष्य प्रतियोगी परीक्षा (Target Exam) *</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="IIT-JEE">IIT-JEE (Engineering)</option>
                  <option value="NEET">NEET (Medical)</option>
                  <option value="UPSC / State PSC">UPSC / State Civil Services</option>
                  <option value="NDA / Defence">NDA / Defence Services</option>
                  <option value="SSC / Banking / Railway">SSC / Banking / Railway</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">स्कूल / कॉलेज का नाम एवं पूर्व कक्षा प्राप्तांक (%) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राजकीय उच्च माध्यमिक विद्यालय (10वीं: 88%, 12वीं: 85%)"
                  value={academicPerf}
                  onChange={(e) => setAcademicPerf(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">आर्थिक सहायता की आवश्यकता का कारण एवं कोचिंग विवरण *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="पारिवारिक स्थिति, कोचिंग संस्थान का नाम या ऑनलाइन कोर्स / अध्ययन सामग्री की आवश्यकता का संक्षिप्त विवरण लिखें..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setCoachingReq(e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow transition-all disabled:opacity-50"
            >
              {loading ? "आवेदन सबमिट हो रहा है..." : "विद्यार्थी सहायता हेतु आवेदन सबमिट करें"}
            </button>
          </form>
        </div>
      ) : (
        <div className="vedic-card p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-black text-white font-hindi">
            आवेदन सफलतापूर्वक प्राप्त हुआ!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-hindi max-w-md mx-auto">
            समिति की शिक्षा समिति द्वारा आपके आवेदन का मूल्यांकन किया जाएगा और शीघ्र ही आपके मोबाइल नंबर <b>{mobile}</b> पर संपर्क किया जाएगा।
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("admin@villageyouth.org");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchAPI<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username_or_email: usernameOrEmail,
          password,
        }),
      });

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "लॉगिन असफल रहा। कृपया ईमेल व पासवर्ड जांचें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mandala-bg">
      <div className="w-full max-w-md vedic-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto text-amber-400">
            🦚
          </div>
          <h1 className="text-2xl font-black text-white font-hindi">
            समिति व्यवस्थापक लॉगिन
          </h1>
          <p className="text-xs text-slate-400">
            ग्राम युवा समिति प्रबंधन एवं वित्तीय पोर्टल
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-hindi">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
              उपयोगकर्ता नाम या ईमेल (Email / Username)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "सत्यापित हो रहा है..." : "सुरक्षित लॉगिन करें"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-amber-400">डिफ़ॉल्ट सुपर-एडमिन साख (Default Credentials):</p>
          <p className="font-mono">ईमेल: admin@villageyouth.org</p>
          <p className="font-mono">पासवर्ड: Admin@123</p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-amber-400/80 hover:text-amber-300">
            ← सार्वजनिक वेबसाइट पर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}

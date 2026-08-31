"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, ShieldCheck, Sparkles, Phone, Users, Landmark } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "मुख्य पृष्ठ", href: "/", icon: Landmark },
    { name: "जन्माष्टमी 2026", href: "/janmashtami", icon: Sparkles, badge: "4 सितम्बर" },
    { name: "वित्तीय पारदर्शिता", href: "/transparency", icon: ShieldCheck },
    { name: "समिति पदाधिकारी", href: "/committee", icon: Users },
    { name: "दानदाता सूची", href: "/donors", icon: Heart },
    { name: "संपर्क", href: "/contact", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#061224]/95 backdrop-blur-lg border-b border-amber-500/30 shadow-lg shadow-black/40">
      {/* Top Auspicious Strip */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-slate-950 text-[11px] font-bold py-1 px-4 text-center font-hindi tracking-wider flex items-center justify-center space-x-2">
        <span>🪷 ॐ नमो भगवते वासुदेवाय 🪷</span>
        <span className="hidden md:inline">• श्री कृष्ण जन्माष्टमी महापर्व: 4 सितम्बर 2026 • समस्त ग्रामवासी सादर आमंत्रित हैं</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-full bg-[#071428] flex items-center justify-center text-2xl">
                🦚
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-hindi tracking-wide drop-shadow">
                  ग्राम युवा समिति
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hidden sm:inline-block font-semibold">
                  आधिकारिक मंच
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-medium hidden sm:block">
                श्री कृष्ण जन्माष्टमी महोत्सव एवं ग्राम सेवा
              </p>
            </div>
          </Link>

          {/* Desktop Nav - Spacious & Clean */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={
                    "px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 " +
                    (isActive
                      ? "text-amber-300 bg-amber-500/20 border border-amber-500/50 font-bold shadow-sm shadow-amber-500/10"
                      : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/60")
                  }
                >
                  <Icon className="w-4 h-4 text-amber-400/90" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/donate"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95 border border-yellow-300/40"
            >
              <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>सहयोग करें (Donate)</span>
            </Link>
            <Link
              href="/admin/login"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-400/90 hover:text-amber-300 bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 transition-all"
            >
              समिति लॉगिन
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/donate"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow flex items-center space-x-1"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>सहयोग</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-amber-400 hover:text-white hover:bg-slate-800 focus:outline-none border border-slate-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#071428] border-b border-amber-500/30 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium " +
                  (isActive
                    ? "text-amber-300 bg-amber-500/20 border border-amber-500/40 font-bold"
                    : "text-slate-200 hover:bg-slate-800/80")
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-xs text-amber-400 font-semibold py-2.5 px-3 rounded-xl border border-amber-500/30 bg-slate-900/60"
            >
              🔐 समिति व्यवस्थापक लॉगिन (Admin Portal)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

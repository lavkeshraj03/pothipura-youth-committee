"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Heart, DollarSign, Users, Calendar, Megaphone,
  FileSpreadsheet, Settings, ShieldAlert, LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) {
      router.push("/admin/login");
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "डैशबोर्ड (Overview)", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "दान प्रबंधन (Donations)", href: "/admin/donations", icon: Heart },
    { name: "व्यय लेखा (Expenses)", href: "/admin/expenses", icon: DollarSign },
    { name: "समिति सदस्य (Members)", href: "/admin/members", icon: Users },
    { name: "उत्सव व कार्यक्रम (Events)", href: "/admin/events", icon: Calendar },
    { name: "सूचनाएं व पोस्टर (CMS)", href: "/admin/announcements", icon: Megaphone },
    { name: "रिपोर्ट्स व CSV (Exports)", href: "/admin/reports", icon: FileSpreadsheet },
    { name: "UPI व सेटिंग्स (Settings)", href: "/admin/settings", icon: Settings },
    { name: "ऑडिट लॉग (Audit Trail)", href: "/admin/audit-logs", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex bg-[#061020] text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#091830] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl text-amber-400">
              🦚
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-400 font-hindi">समिति व्यवस्थापक</h2>
              <p className="text-[11px] text-slate-400">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all " +
                    (isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white")
                  }
                >
                  <Icon className="w-4 h-4 text-amber-400/80" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#071428]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              {user?.full_name ? user.full_name[0] : "A"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.full_name || "व्यवस्थापक"}</div>
              <div className="text-[10px] text-emerald-400 font-mono">SUPER ADMIN</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-[11px] text-slate-300 hover:text-white text-center border border-slate-700"
            >
              वेबसाइट देखें
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-[#091830]/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
              ● LIVE PRODUCTION
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline-block font-hindi">
              श्री कृष्ण जन्माष्टमी महोत्सव 2026 लेखा-जोखा
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-amber-400 hover:underline hidden sm:block"
            >
              🌐 सार्वजनिक पोर्टल खोलें ↗
            </Link>
            <button
              onClick={handleLogout}
              className="md:hidden px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

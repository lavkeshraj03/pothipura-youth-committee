"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-festival">
          ग्राम युवा समिति संपर्क एवं सेवा केंद्र
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-hindi mt-2">
          जन्माष्टमी महोत्सव, सहयोग, वालंटियर पंजीकरण अथवा अन्य किसी भी जानकारी हेतु संपर्क करें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Box */}
        <div className="vedic-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-amber-400 font-hindi">
            समिति मुख्य कार्यालय
          </h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">सेवा भवन, मुख्य मंदिर मार्ग</p>
                <p className="text-xs text-slate-400">ग्राम, जिला एवं राज्य</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">+91 98290 12345 / 98290 45678</p>
                <p className="text-xs text-slate-400">अध्यक्ष / कोषाध्यक्ष हेल्पलाइन</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">contact@villageyouth.org</p>
                <p className="text-xs text-slate-400">आधिकारिक ईमेल पता</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="vedic-card p-6 sm:p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400 font-hindi mb-2">
                संदेश भेजें (Send Message)
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">आपका नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="पूरा नाम"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">मोबाइल नंबर *</label>
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
                <label className="block text-xs font-semibold text-slate-300 font-hindi mb-1">संदेश *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="अपना संदेश लिखें..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-hindi"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>संदेश प्रेषित करें</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white font-hindi">संदेश प्राप्त हुआ!</h3>
              <p className="text-xs text-slate-400 font-hindi">समिति सदस्य शीघ्र ही आपसे संपर्क करेंगे।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

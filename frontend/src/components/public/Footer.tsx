"use client";
import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#040B17] border-t-2 border-amber-500/40 text-slate-300 pt-14 pb-8 relative overflow-hidden">
      {/* Auspicious Top Garland Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-yellow-400 via-amber-500 to-amber-600 absolute top-0 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center text-xl shadow">
                🦚
              </div>
              <span className="text-xl font-bold text-amber-400 font-hindi">
                ग्राम युवा समिति
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-hindi">
              समस्त ग्रामवासियों के सहयोग से संचालित सामाजिक एवं धार्मिक उन्नयन का समर्पित मंच। श्री कृष्ण जन्माष्टमी महोत्सव एवं सांस्कृतिक विरासत का संरक्षण हमारा पावन संकल्प है।
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2.5 font-hindi">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>100% सार्वजनिक वित्तीय पारदर्शिता एवं डिजिटल रसीद प्रणाली।</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3 font-hindi">
            <h3 className="text-base font-bold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>महत्वपूर्ण कड़ियाँ</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">मुख्य पृष्ठ (Home)</Link></li>
              <li><Link href="/janmashtami" className="hover:text-amber-300 transition-colors">श्री कृष्ण जन्माष्टमी महोत्सव 2026</Link></li>
              <li><Link href="/transparency" className="hover:text-amber-300 transition-colors">पारदर्शिता एवं व्यय विवरण</Link></li>
              <li><Link href="/donors" className="hover:text-amber-300 transition-colors">दानदाता एवं भामाशाह सूची</Link></li>
              <li><Link href="/committee" className="hover:text-amber-300 transition-colors">कार्यकारिणी एवं पदाधिकारी</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3 font-hindi">
            <h3 className="text-base font-bold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center space-x-1.5">
              <span>🪔</span>
              <span>जन्माष्टमी महोत्सव 2026</span>
            </h3>
            <div className="text-xs sm:text-sm space-y-2 text-slate-300">
              <p><span className="text-amber-400 font-bold">पावन तिथि:</span> 4 सितम्बर 2026 (शुक्रवार)</p>
              <p><span className="text-amber-400 font-bold">स्थान:</span> श्री राधा कृष्ण मंदिर प्रांगण, मुख्य चौक, ग्राम</p>
              <p><span className="text-amber-400 font-bold">प्रमुख कार्यक्रम:</span> मटकी फोड़, भजन संध्या, बाल रूप सज्जा, 56 भोग</p>
              <p className="text-xs text-amber-300 font-semibold pt-1">समस्त श्रद्धालु सपरिवार सादर आमंत्रित हैं।</p>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-3 font-hindi">
            <h3 className="text-base font-bold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>समिति संपर्क केंद्र</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>समिति सेवा भवन, मुख्य मंदिर मार्ग, ग्राम</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98290 12345 / 98290 45678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@villageyouth.org</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/donate"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>सहयोग राशि समर्पित करें (Donate)</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-hindi">
          <p>© 2026 ग्राम युवा समिति (Village Youth Committee). समस्त अधिकार सुरक्षित।</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <Link href="/transparency" className="hover:text-amber-400">पारदर्शिता रिपोर्ट</Link>
            <Link href="/contact" className="hover:text-amber-400">मदद एवं सहायता</Link>
            <Link href="/admin/login" className="hover:text-amber-400 font-bold text-amber-400/80">व्यवस्थापक लॉगिन</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

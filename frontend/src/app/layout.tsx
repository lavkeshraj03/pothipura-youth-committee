import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "श्री कृष्ण जन्माष्टमी महोत्सव एवं ग्राम युवा समिति",
  description: "ग्राम युवा समिति का आधिकारिक पोर्टल - श्री कृष्ण जन्माष्टमी महोत्सव 2026, दान एवं वित्तीय पारदर्शिता, समिति सदस्य विवरण एवं शिक्षा सहायता पहल।",
  keywords: ["Krishna Janmashtami", "Gram Yuva Samiti", "Village Youth Committee", "Donation", "Transparency", "Janmashtami 2026", "Education Support"],
  openGraph: {
    title: "श्री कृष्ण जन्माष्टमी महोत्सव 2026 — ग्राम युवा समिति",
    description: "4 सितम्बर 2026 को भव्य श्री कृष्ण जन्मोत्सव, भजन संध्या एवं मटकी फोड़। स्वैच्छिक दान एवं संपूर्ण पारदर्शिता।",
    type: "website",
    locale: "hi_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="dark scroll-smooth">
      <body className="mandala-bg min-h-screen antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";
import CartSidebar from "./components/CartSidebar";

// Path ကို သင့် folder နေရာအတိုင်း ပြင်လိုက်ပါပြီ
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'], // မင်းသုံးမယ့် အထူ/အပါးတွေကို ရွေးပါ
  variable: '--font-montserrat', // CSS variable တစ်ခုအနေနဲ့ သတ်မှတ်မယ်
});

export const metadata: Metadata = {
  title: "NEXO - Digital Showcase",
  description: "Innovation with NEXO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        {/* Navbar ကို အပေါ်ဆုံးမှာ ထားပါ */}
        <Navbar /> 
        <CartSidebar />
        {/* Main Content ကို PageTransition နဲ့ တစ်ခါတည်း အုပ်လိုက်ပါ */}
        <main className="flex-grow">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Footer ကို အောက်ဆုံးမှာ ထားပါ */}
        <Footer />
      </body>
    </html>
  );
}
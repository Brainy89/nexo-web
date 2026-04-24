"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0a1e36] text-white py-12 md:py-16 mt-20">
      {/* Background Image Layer */}
      <img 
        src="/header-bg.jpg" 
        alt="Footer Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 transform rotate-180" 
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        
        {/* Left Side: Brand Text */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black tracking-tighter">NEXO</h2>
          <p className="text-blue-200/50 text-[10px] mt-2 uppercase tracking-[0.2em] max-w-[200px] mx-auto md:mx-0 leading-relaxed">
            Innovative Technology for a better future.
          </p>
        </div>

        {/* Center: Logo & Slogan (Header နှင့် ပုံစံတူ ညှိထားပါသည်) */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center group">
            <img 
              src="/logo.png" 
              alt="NEXO" 
              className="h-12 md:h-14 w-auto object-contain mix-blend-screen transition duration-500 group-hover:scale-105" 
            />
            <span className="text-[7px] md:text-[8px] text-blue-200/80 font-semibold tracking-[0.3em] uppercase -mt-2 whitespace-nowrap">
              Reliable Connections, Infinite Possibilities
            </span>
          </Link>
        </div>

        {/* Right Side: Navigation Links */}
        <div className="flex flex-col items-center md:items-end gap-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          <div className="flex gap-6 md:flex-col md:gap-3">
            <Link href="/" className="hover:text-blue-400 transition">Home</Link>
            <Link href="/product" className="hover:text-blue-400 transition">Products</Link>
            <Link href="/contact" className="hover:text-blue-400 transition">Contact</Link>
          </div>
          <p className="text-white/20 mt-4 normal-case font-medium text-[9px]">
            © 2026 NEXO. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBasket, Search, User } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Scroll ဆွဲရင် Navbar ကို ဖျောက်/ပြ လုပ်ပေးတဲ့ Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // အောက်ကိုဆွဲရင် ဖျောက်မယ်
    } else {
      setHidden(false); // အပေါ်ပြန်တင်ရင် ပြမယ်
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed w-full z-50 border-b border-white/10 top-0 overflow-hidden bg-[#0a1e36] h-24 md:h-28 flex items-center"
    >
      {/* Background Image Layer */}
      <img 
        src="/header-bg.jpg" 
        alt="NEXO Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50" 
      />

      <nav className="relative max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        {/* Left: Menu Links */}
        <div className="flex gap-6 md:gap-10 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white">
          <Link href="/" className="hover:text-blue-300 transition">HOME</Link>
          <Link href="/product" className="hover:text-blue-300 transition">Shop</Link>
        </div>

        {/* Center: Large Logo & Slogan (Slogan ကို Logo အောက် ကပ်ပေးထားပါတယ်) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center group">
            <img 
              src="/logo.png" 
              alt="NEXO" 
              className="h-14 md:h-16 w-auto object-contain mix-blend-screen transition duration-500 group-hover:scale-105" 
            />
            <span className="text-[7px] md:text-[9px] text-blue-200/90 font-semibold tracking-[0.3em] uppercase -mt-1 whitespace-nowrap text-center">
              Reliable Connections, Infinite Possibilities
            </span>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4 md:gap-8 text-white">
          <button className="hover:text-blue-300 transition p-2">
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button className="hidden sm:block hover:text-blue-300 transition p-2">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <Link href="/cart" className="hover:text-blue-300 transition p-2 relative">
            <ShoppingBasket className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 bg-blue-500 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
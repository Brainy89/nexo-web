"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, Search, User } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
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
      className="fixed w-full z-[100] border-b border-white/10 top-0 overflow-hidden bg-[#0a1e36] h-20 md:h-24 flex items-center"
    >
      <img 
        src="/header-bg.jpg" 
        alt="NEXO Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30" 
      />

      <nav className="relative max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
        
        {/* Left: Menu Links */}
        <div className="flex gap-4 md:gap-8 text-[11px] md:text-[12px] font-extrabold tracking-[0.15em] uppercase text-white z-50">
          <Link href="/" className="py-2 hover:text-blue-400 transition-colors">HOME</Link>
          <Link href="/shop" className="py-2 hover:text-blue-400 transition-colors">SHOP</Link>
        </div>

        {/* Center: Combined Logo & Brand Name */}
        <div className="absolute left-1/2 -translate-x-1/2 z-50">
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Logo Icon */}
              <img 
                src="/logo.png" 
                alt="NEXO Icon" 
                className="h-8 md:h-12 w-auto object-contain mix-blend-screen transition duration-500 group-hover:scale-110" 
              />
              {/* Brand Name Text */}
              <span className="text-2xl md:text-4xl font-light tracking-[0.1em] text-white transition duration-500 group-hover:text-blue-400">
                NEXO
              </span>
            </div>
            {/* Slogan - Desktop မှာပဲ ပြပါမယ် */}
            <span className="hidden md:block text-[8px] text-blue-200/70 font-bold tracking-[0.4em] uppercase mt-1 whitespace-nowrap">
              Reliable Connections. Infinite Possibilities
            </span>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 md:gap-6 text-white z-50">
          <button className="hover:text-blue-400 transition p-2">
            <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </button>
          <button className="hidden sm:block hover:text-blue-400 transition p-2">
            <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </button>
          <Link href="/cart" className="hover:text-blue-400 transition p-2 relative">
            <ShoppingBasket className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black shadow-lg">
              0
            </span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
"use client";
import { motion } from "framer-motion";

export default function ProductPage() {
  const categories = ["All Products", "Speakers", "Headphones", "Accessories"];

  return (
    <div className="pt-32 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Category Filter */}
        <div className="flex gap-8 border-b border-gray-100 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat, index) => (
            <button key={index} className="whitespace-nowrap text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition">
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
        >
          {/* Product Cards Here (အရင်ပေးထားတဲ့ Card Code ကို ဒီမှာသုံးနိုင်ပါတယ်) */}
        </motion.div>
      </div>
    </div>
  );
}
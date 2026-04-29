"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black uppercase italic text-blue-600 flex items-center gap-2">
            <ShoppingCart /> My Cart
          </h1>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 text-gray-500 hover:text-black">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </header>

        {/* Empty State */}
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
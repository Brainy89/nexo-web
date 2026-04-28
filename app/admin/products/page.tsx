"use client";
import dynamic from 'next/dynamic';

// ProductManager ကို SSR (Server Side Rendering) ပိတ်ပြီး ခေါ်သုံးပါမယ်
const ProductManager = dynamic(() => import('./ProductManager'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-blue-600">
        Loading Nexo Admin Panel...
      </div>
    </div>
  )
});

export default function Page() {
  return <ProductManager />;
}
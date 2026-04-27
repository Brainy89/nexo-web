"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Zustand Store မှ addToCart function ကို ခေါ်ယူခြင်း
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center animate-pulse uppercase tracking-[0.3em] text-[10px] font-black">
      Loading Experience...
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs font-bold">
      Product not found.
    </div>
  );

  return (
    <main className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          
          {/* --- Left: Product Image --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-[#fcfcfc] rounded-[3.5rem] flex items-center justify-center p-12 lg:p-24 relative overflow-hidden shadow-inner border border-gray-50"
          >
            <img 
              src={product.imageUrl || "/placeholder-image.png"} 
              alt={product.name} 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
            />
            {product.discountPrice && (
              <div className="absolute top-10 left-10 bg-blue-600 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                Special Offer
              </div>
            )}
          </motion.div>

          {/* --- Right: Product Info --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col pt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">
                NEXO / {product.category}
              </span>
              <div className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 leading-[0.85]">
              {product.name}
            </h1>

            <p className="text-gray-500 leading-relaxed mb-10 text-sm md:text-base max-w-md border-l-4 border-blue-50 pl-6 italic font-medium">
              {product.description}
            </p>

            {/* Price & Action */}
            <div className="flex flex-col gap-10 mb-14">
              <div className="flex items-baseline gap-5">
                {product.discountPrice ? (
                  <>
                    <span className="text-5xl font-black tracking-tighter text-blue-600 italic">${product.discountPrice}</span>
                    <span className="text-2xl font-light tracking-tighter text-gray-300 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-5xl font-black tracking-tighter italic">${product.price || "0.00"}</span>
                )}
              </div>
              
              <button 
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`group w-full md:w-max px-14 py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] transition-all flex items-center justify-center gap-4 shadow-2xl 
                ${product.inStock 
                  ? "bg-black text-white hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-95" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"}`}
              >
                {product.inStock ? <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" /> : <AlertCircle size={20} />}
                {product.inStock ? "Add to Bag" : "Currently Unavailable"}
              </button>
            </div>

            {/* Warranty Info Card */}
            <div className="pt-10 border-t border-gray-100">
              <div className="flex items-center gap-6 p-7 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 text-gray-400">Security & Warranty</p>
                  <p className="text-sm font-black text-black italic uppercase tracking-tighter">{product.warranty || "Standard Nexo Care"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Full Detailed Description --- */}
        {product.details && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-24 border-t border-gray-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600 mb-5">Tech Specs</h2>
                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Full Product<br/>Intelligence</h3>
              </div>
              <div className="lg:col-span-8">
                <div className="text-gray-500 leading-[2] whitespace-pre-line font-bold text-sm md:text-base bg-gray-50/50 p-10 rounded-[3rem]">
                  {product.details}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-20 pt-12 border-t border-gray-50">
                  <div className="space-y-4">
                    <Truck className="text-blue-600" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-black leading-tight">Priority <br/> Shipping</p>
                  </div>
                  <div className="space-y-4">
                    <RefreshCw className="text-blue-600" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-black leading-tight">7-Day <br/> Premium Return</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
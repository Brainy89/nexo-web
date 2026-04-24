"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ShoppingBasket, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const docRef = doc(db, "products", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-100 rounded"></div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-40 text-center uppercase tracking-widest italic">Product Not Found</div>;

  return (
    <main className="bg-white min-h-screen pt-32 md:pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition mb-12"
        >
          <ArrowLeft size={14} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Left: Product Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="aspect-square bg-[#f9f9f9] rounded-[3rem] flex items-center justify-center p-12 md:p-20 relative overflow-hidden"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain relative z-10" 
            />
            {/* Soft decorative glow background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
          </motion.div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-blue-600 text-xs font-bold uppercase tracking-[0.4em] mb-4"
            >
              {product.category}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-6"
            >
              {product.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-base md:text-lg leading-relaxed mb-10 max-w-lg"
            >
              {product.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button className="flex-1 bg-black text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition shadow-2xl active:scale-95">
                <ShoppingBasket size={18} /> Add to Basket
              </button>
              <button className="flex-1 border-2 border-black py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition active:scale-95">
                Buy it now
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8"
            >
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={20} className="text-gray-300 mb-2" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center border-x border-gray-100">
                <Truck size={20} className="text-gray-300 mb-2" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={20} className="text-gray-300 mb-2" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">30-Day Returns</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
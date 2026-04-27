"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Products"]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setProducts(productList);
        setFilteredProducts(productList);

        // Database ထဲက category အားလုံးကို ဆွဲထုတ်မယ်
        const dynamicCats = Array.from(new Set(productList.map((p: any) => p.category))).filter(Boolean) as string[];
        setCategories(["All Products", ...dynamicCats]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Category ပြောင်းတဲ့အခါ Filter လုပ်မယ့် Logic
  useEffect(() => {
    if (activeCategory === "All Products") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-400">Curating Collection</span>
    </div>
  );

  return (
    <div className="pt-40 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- 1. Category Filter --- */}
        <div className="flex gap-10 border-b border-gray-100 mb-16 overflow-x-auto pb-4 no-scrollbar relative">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`relative whitespace-nowrap text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300
                ${activeCategory === cat ? "text-black" : "text-gray-400 hover:text-black"}`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-black z-10"
                />
              )}
            </button>
          ))}
        </div>

        {/* --- 2. Product Grid --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -10 }} 
                className="group cursor-pointer"
              >
                <Link href={`/product/${p.id}`}>
                  {/* Image Container */}
                  <div className="aspect-[4/5] bg-[#fcfcfc] rounded-[2.5rem] flex items-center justify-center p-12 overflow-hidden relative transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:bg-white border border-transparent group-hover:border-gray-50">
                    
                    {/* Stock & Discount Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                      {!p.inStock && (
                        <span className="bg-red-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          Sold Out
                        </span>
                      )}
                      {p.discountPrice && (
                        <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          Sale
                        </span>
                      )}
                    </div>

                    <motion.img 
                      src={p.imageUrl || "/placeholder-image.png"} 
                      alt={p.name} 
                      className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${!p.inStock && "grayscale opacity-50"}`} 
                    />
                    
                    <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black text-white text-[9px] font-bold py-3 px-6 rounded-full tracking-widest uppercase translate-y-4 group-hover:translate-y-0">
                      Explore Product
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-8 space-y-2 px-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black tracking-tighter uppercase group-hover:text-blue-600 transition-colors italic">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                          {p.category}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        {p.discountPrice ? (
                          <>
                            <span className="text-lg font-black tracking-tighter text-blue-600">${p.discountPrice}</span>
                            <span className="text-[10px] text-gray-300 line-through font-bold">${p.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-black tracking-tighter text-black">${p.price || "0.00"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center text-gray-300 uppercase text-[10px] font-black tracking-[0.5em] italic animate-pulse">
            Collection Updating...
          </div>
        )}
      </div>
    </div>
  );
}
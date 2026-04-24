"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedItems = items.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setProducts(sortedItems);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  // Filter Logic: Category ကော Search ကော နှစ်ခုလုံးနဲ့ စစ်မယ်
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <main className="pt-40 min-h-screen bg-white px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-12 text-center uppercase tracking-tighter italic">NEXO Collection</h1>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all
                  ${activeCategory === cat ? "bg-black text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center italic text-gray-400 uppercase tracking-widest text-xs">Updating...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {filteredProducts.map((p) => (
                <motion.div 
                  key={p.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${p.id}`}>
                    <div className="aspect-square bg-[#f9f9f9] rounded-[2.5rem] flex items-center justify-center p-12 overflow-hidden relative">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-700 relative z-10" />
                    </div>
                    <div className="mt-8 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-blue-600 transition">{p.name}</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{p.category}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
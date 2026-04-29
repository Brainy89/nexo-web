"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Search, Filter, ShoppingBag, ChevronRight } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setFilteredProducts(docs);
      
      const cats = ["All", ...Array.from(new Set(docs.map((p: any) => p.category))) as string[]];
      setCategories(cats);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Search & Filter Logic
  useEffect(() => {
    let result = products;
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar Area */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-gray-100 p-3 pl-12 rounded-2xl text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-white text-slate-600 border-gray-100 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">
            {selectedCategory} <span className="text-blue-600">Collection</span>
          </h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {filteredProducts.length} Items Found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group relative">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:shadow-xl">
                  <img src={p.imageUrl} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                  
                  {/* Stock Tag */}
                  {!p.inStock && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase text-red-500 border border-red-100">
                      Out of Stock
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <button className="absolute bottom-4 right-4 bg-white p-3 rounded-2xl shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all text-blue-600 hover:bg-blue-600 hover:text-white">
                    <ShoppingBag size={20} />
                  </button>
                </div>

                <div className="mt-4 px-2">
                  <h3 className="text-[13px] md:text-base font-bold text-slate-900 leading-tight line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-black text-blue-600">
                      ${p.discountPrice || p.price}
                    </p>
                    {p.discountPrice && (
                      <p className="text-[10px] text-gray-400 line-through">${p.price}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Result */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No products found in this category</p>
          </div>
        )}
      </main>
    </div>
  );
}
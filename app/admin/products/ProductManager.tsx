"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase"; 
import { 
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, 
  query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Edit3, PlusCircle, UploadCloud, ShieldCheck, Tag } from "lucide-react";

export default function ProductManager() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initialFormState = { 
    name: "", category: "", description: "", imageUrl: "", price: "", 
    discountPrice: "", inStock: true, warranty: "" 
  };
  const [formData, setFormData] = useState(initialFormState);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  const uploadToImgBB = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
    if (!apiKey) throw new Error("ImgBB API Key is missing");

    const data = new FormData();
    data.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (result.success) return result.data.url;
    throw new Error("ImgBB Upload Failed");
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user && mounted) router.push("/login");
    });
    return () => unsub();
  }, [router, mounted]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      const cats = Array.from(new Set(productList.map((p: any) => p.category))).filter(Boolean) as string[];
      setDynamicCategories(cats);
    } catch (err) { console.error(err); }
    setFetchLoading(false);
  };

  useEffect(() => { if (mounted) fetchProducts(); }, [mounted]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) finalImageUrl = await uploadToImgBB(imageFile);

      const payload = { 
        ...formData, 
        imageUrl: finalImageUrl,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        updatedAt: serverTimestamp() 
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), { ...payload, createdAt: serverTimestamp() });
      }

      setFormData(initialFormState);
      setImageFile(null); setPreviewUrl(null); setEditingId(null); setIsNewCategory(false);
      fetchProducts();
      alert("Success!");
    } catch (error) { 
      console.error(error);
      alert("Error: " + (error as Error).message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 space-y-6 md:space-y-10">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-blue-600">Admin Panel</h2>
        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-500/60">Professional Inventory</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
        
        {/* Form Section */}
        <form onSubmit={handlePublish} className="lg:col-span-5 bg-white p-5 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 space-y-5">
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic border-b pb-3 text-gray-800">
            {editingId ? "Update Product" : "Add Product"}
          </h3>
          
          <div className="space-y-4">
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img-upload" />
              <label htmlFor="img-upload" className="flex flex-col items-center justify-center w-full h-40 md:h-48 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-blue-50 transition-all">
                {(previewUrl || formData.imageUrl) ? (
                  <img src={previewUrl || formData.imageUrl} className="w-full h-full object-contain p-3" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <UploadCloud size={30} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Select Image</span>
                  </div>
                )}
              </label>
            </div>

            <input type="text" placeholder="Product Name" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm md:text-base border border-transparent focus:border-blue-200" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            
            <div className="flex gap-2">
              {!isNewCategory ? (
                <select className="flex-1 p-4 bg-gray-50 rounded-xl outline-none text-sm md:text-base" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required>
                  <option value="">Category</option>
                  {dynamicCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Category Name" className="flex-1 p-4 bg-blue-50 rounded-xl outline-none text-sm md:text-base font-bold" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required />
              )}
              <button type="button" onClick={()=>setIsNewCategory(!isNewCategory)} className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200"><PlusCircle size={20}/></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <input type="number" placeholder="Regular Price ($)" className="p-4 bg-gray-50 rounded-xl outline-none text-sm border border-transparent focus:border-blue-200" value={formData.price || ""} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
               <input type="number" placeholder="Discount Price" className="p-4 bg-red-50/50 rounded-xl outline-none text-sm border border-transparent focus:border-red-200" value={formData.discountPrice || ""} onChange={(e)=>setFormData({...formData, discountPrice: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
               <input type="text" placeholder="Warranty (e.g. 6 Months)" className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={formData.warranty || ""} onChange={(e)=>setFormData({...formData, warranty: e.target.value})} />
               <select className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={formData.inStock ? "true" : "false"} onChange={(e)=>setFormData({...formData, inStock: e.target.value === "true"})}>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
               </select>
            </div>

            <textarea placeholder="Product details..." className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm" rows={2} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required />

            <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] flex justify-center items-center gap-3 active:scale-95 hover:bg-black transition-all shadow-lg shadow-blue-100">
              {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Info" : "Publish Product"}
            </button>
          </div>
        </form>

        {/* List Section */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">Items List</h3>
            <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-md">{products.length} Total</span>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {fetchLoading ? (
              <div className="p-10 text-center animate-pulse text-[10px] tracking-widest text-gray-400 font-bold uppercase">Refreshing...</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-4 md:p-6 flex flex-col gap-4 hover:bg-blue-50/20 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl border border-gray-100 p-1 flex-shrink-0">
                          <img src={p.imageUrl} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-xs md:text-sm uppercase tracking-tight italic truncate text-gray-800">{p.name}</h4>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          {/* Price Logic: Discount ရှိရင် နှစ်ခုပြမယ်၊ မရှိရင် regular price ပဲပြမယ် */}
                          {p.discountPrice ? (
                            <div className="flex items-center gap-1">
                              <p className="text-[10px] md:text-xs text-red-500 font-black">${p.discountPrice}</p>
                              <p className="text-[8px] md:text-[9px] text-gray-400 line-through">${p.price}</p>
                            </div>
                          ) : (
                            <p className="text-[10px] md:text-xs text-blue-500 font-black">${p.price}</p>
                          )}
                          <span className="text-[8px] text-gray-400 font-bold uppercase bg-gray-100 px-1.5 py-0.5 rounded">{p.category}</span>
                        </div>

                        {/* Warranty: ရှိမှပြမယ် */}
                        {p.warranty && (
                          <div className="flex items-center gap-1 mt-1 text-green-600">
                            <ShieldCheck size={10} />
                            <span className="text-[8px] font-bold uppercase tracking-wider">{p.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => {setEditingId(p.id); setFormData(p); setPreviewUrl(null); window.scrollTo({top: 0, behavior: 'smooth'});}} className="p-2 md:p-3 text-gray-400 hover:text-blue-600 rounded-lg bg-gray-50 hover:bg-white"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 md:p-3 text-gray-400 hover:text-red-600 rounded-lg bg-gray-50 hover:bg-white"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
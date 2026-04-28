"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase"; 
import { 
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, 
  query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth"; // signOut ထည့်လိုက်ပါပြီ
import { useRouter } from "next/navigation";
import { 
  Loader2, Trash2, Edit3, PlusCircle, UploadCloud, 
  ShieldCheck, LogOut, LayoutDashboard 
} from "lucide-react";

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

  // Logout Function
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

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
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-8"> {/* Mobile Navigation အတွက် အောက်မှာ နေရာချန်ထားပါသည် */}
      
      {/* Header with Logout Button */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:p-8 flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-blue-600">Admin Panel</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hidden md:block">Manage Your Store</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Section - Add/Edit Product */}
        <section id="product-form" className="lg:col-span-5 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-5">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-black uppercase tracking-tighter italic text-gray-800">
              {editingId ? "Edit Item" : "Add New Item"}
            </h3>
            {editingId && (
              <button 
                onClick={() => {setEditingId(null); setFormData(initialFormState);}}
                className="text-[10px] font-bold text-blue-600 uppercase"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img-upload" />
              <label htmlFor="img-upload" className="flex flex-col items-center justify-center w-full h-32 md:h-44 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-blue-50 transition-all overflow-hidden">
                {(previewUrl || formData.imageUrl) ? (
                  <img src={previewUrl || formData.imageUrl} className="w-full h-full object-contain p-2" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Tap to Upload</span>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-3">
              <input type="text" placeholder="Product Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm border border-transparent focus:border-blue-200 shadow-inner" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
              
              <div className="flex gap-2">
                {!isNewCategory ? (
                  <select className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none text-sm shadow-inner" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required>
                    <option value="">Select Category</option>
                    {dynamicCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Category Name" className="flex-1 p-4 bg-blue-50 rounded-2xl outline-none text-sm font-bold" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required />
                )}
                <button type="button" onClick={()=>setIsNewCategory(!isNewCategory)} className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"><PlusCircle size={20}/></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                   <span className="text-[9px] font-bold text-gray-400 px-1 uppercase">Price ($)</span>
                   <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm shadow-inner" value={formData.price || ""} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[9px] font-bold text-red-400 px-1 uppercase">Discount ($)</span>
                   <input type="number" className="w-full p-4 bg-red-50/30 rounded-2xl outline-none text-sm shadow-inner" value={formData.discountPrice || ""} onChange={(e)=>setFormData({...formData, discountPrice: e.target.value})} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Warranty" className="p-4 bg-gray-50 rounded-2xl outline-none text-sm shadow-inner" value={formData.warranty || ""} onChange={(e)=>setFormData({...formData, warranty: e.target.value})} />
                 <select className="p-4 bg-gray-50 rounded-2xl outline-none text-sm shadow-inner" value={formData.inStock ? "true" : "false"} onChange={(e)=>setFormData({...formData, inStock: e.target.value === "true"})}>
                    <option value="true">In Stock</option>
                    <option value="false">Out</option>
                 </select>
              </div>

              <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm shadow-inner" rows={2} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required />

              <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex justify-center items-center gap-3 active:scale-95 shadow-lg shadow-blue-100">
                {loading ? <Loader2 className="animate-spin" /> : editingId ? "Save Changes" : "Publish to Store"}
              </button>
            </div>
          </div>
        </section>

        {/* Inventory List Section */}
        <section className="lg:col-span-7 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-lg font-black uppercase tracking-tighter italic">All Products</h3>
            <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-3 py-1 rounded-full">{products.length} Items</span>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {fetchLoading ? (
              <div className="p-10 text-center animate-pulse text-[10px] tracking-widest text-gray-400 font-bold uppercase">Updating List...</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-blue-50/10 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 p-1 flex-shrink-0">
                      <img src={p.imageUrl} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs uppercase tracking-tight truncate text-gray-800">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-blue-600 font-black">${p.discountPrice || p.price}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">{p.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => {setEditingId(p.id); setFormData(p); setPreviewUrl(null); window.scrollTo({top: 0, behavior: 'smooth'});}} className="p-2.5 text-gray-400 hover:text-blue-600 rounded-xl bg-gray-50"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl bg-gray-50"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Mobile Floating Bottom Bar - Mobile အတွက် အဓိက အချက်အချာ */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-black/90 text-white px-6 py-4 rounded-full shadow-2xl backdrop-blur-lg gap-8 border border-white/10 z-50">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-1">
          <PlusCircle size={20} className="text-blue-400" />
          <span className="text-[8px] font-bold uppercase">Add</span>
        </button>
        <button onClick={fetchProducts} className="flex flex-col items-center gap-1">
          <LayoutDashboard size={20} className="text-gray-400" />
          <span className="text-[8px] font-bold uppercase">List</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1">
          <LogOut size={20} className="text-red-400" />
          <span className="text-[8px] font-bold uppercase">Exit</span>
        </button>
      </div>

    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Loader2, Package, ImagePlus, Trash2, Edit3, PlusCircle, AlignLeft } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProductsPage() { // နာမည်ပြောင်းလိုက်ပါတယ်
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState = { 
    name: "", 
    category: "", 
    description: "", 
    imageUrl: "", 
    price: "", 
    discountPrice: "", 
    inStock: true, 
    warranty: "1 Year Official Warranty" 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  // Auth Check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, [router]);
  
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

  useEffect(() => { fetchProducts(); }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const imgData = new FormData();
        imgData.append("image", imageFile);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, 
          {
            method: "POST",
            body: imgData
          }
        );
        const resData = await res.json();
        if(resData.success) finalImageUrl = resData.data.url;
      }
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), { ...formData, imageUrl: finalImageUrl });
        alert("Updated Successfully!");
      } else {
        await addDoc(collection(db, "products"), { ...formData, imageUrl: finalImageUrl, createdAt: new Date() });
        alert("Published Successfully!");
      }
      setFormData(initialFormState);
      setImageFile(null);
      setEditingId(null);
      setIsNewCategory(false);
      fetchProducts();
    } catch (error) { alert("Something went wrong!"); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div className="space-y-10"> {/* Padding Top တွေ ဖယ်လိုက်ပါတယ် Admin Layout က ကိုင်တွယ်ထားလို့ပါ */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Product Inventory</h2>
          <p className="text-gray-400 text-sm font-medium">Manage your NEXO store products and stock status.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Form Section */}
        <form onSubmit={handlePublish} className="xl:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2 mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Product Name</label>
              <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Category</label>
              <div className="flex gap-2">
                {!isNewCategory ? (
                  <select className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none italic" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required>
                    <option value="">Select Category</option>
                    {dynamicCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                ) : (
                  <input type="text" className="flex-1 p-4 bg-blue-50 rounded-2xl outline-none italic" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} required />
                )}
                <button type="button" onClick={()=>setIsNewCategory(!isNewCategory)} className="p-4 bg-gray-100 rounded-2xl"><PlusCircle size={20}/></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Price ($)</label>
                 <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Stock Status</label>
                 <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.inStock ? "true" : "false"} onChange={(e)=>setFormData({...formData, inStock: e.target.value === "true"})}>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                 </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Description</label>
              <textarea className="w-full p-4 bg-gray-50 rounded-2xl outline-none italic" rows={3} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required />
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-600 transition flex justify-center items-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : editingId ? "Save Changes" : "Publish Product"}
            </button>
          </div>
        </form>

        {/* List Section */}
        <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Active Inventory</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {fetchLoading ? (
              <div className="p-20 text-center animate-pulse text-[10px] tracking-widest text-gray-400">UPDATING INVENTORY...</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition">
                  <div className="flex items-center gap-4">
                    <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1" alt="" />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-tight italic">{p.name}</h4>
                      <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">${p.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {setEditingId(p.id); setFormData(p);}} className="p-3 text-gray-400 hover:text-blue-600 transition"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-3 text-gray-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
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
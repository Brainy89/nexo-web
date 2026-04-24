"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Loader2, Package, ImagePlus, Trash2, Edit3, X, Check, PlusCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // ပုံ File သိမ်းဖို့

  const [formData, setFormData] = useState({ 
    name: "", category: "Speakers", description: "", imageUrl: "" 
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login"); // user မရှိရင် login ဆီ ပြန်လွှတ်မယ်
    });
    return () => unsub();
  }, []);
  
  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      // Index မရှိသေးရင် ရိုးရိုးပဲ ဆွဲထုတ်မယ်
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    setFetchLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // ၁။ ပုံအသစ်ရွေးထားရင် ImgBB ဆီ အရင်ပို့မယ်
      if (imageFile) {
        const imgData = new FormData();
        imgData.append("image", imageFile);
        
        const res = await fetch(`https://api.imgbb.com/1/upload?key=db8208a54a11e8bf524be1aaf2f1fd10`, {
          method: "POST",
          body: imgData
        });
        const resData = await res.json();
        if(resData.success) {
          finalImageUrl = resData.data.url;
        }
      }

      // ၂။ Firestore ထဲ သိမ်းမယ်
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), { ...formData, imageUrl: finalImageUrl });
        alert("Updated!");
      } else {
        await addDoc(collection(db, "products"), { 
          ...formData, 
          imageUrl: finalImageUrl, 
          createdAt: new Date() 
        });
        alert("Published!");
      }

      setFormData({ name: "", category: "Speakers", description: "", imageUrl: "" });
      setImageFile(null);
      setEditingId(null);
      fetchProducts();
    } catch (error) { alert("Error!"); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#fafafa] px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Package className="text-blue-600"/> {editingId ? "Edit Product" : "Inventory"}
          </h1>
          {editingId && <button onClick={() => setEditingId(null)} className="text-red-500 text-xs font-bold uppercase">Cancel</button>}
        </div>

        <form onSubmit={handlePublish} className="bg-white p-8 rounded-[2rem] shadow-xl space-y-5 mb-12 italic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" placeholder="Product Name" className="p-4 bg-gray-50 rounded-xl outline-none" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            
            {/* File Upload Input */}
            <label className="p-4 bg-blue-50 border-2 border-dashed border-blue-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition">
              <ImagePlus size={20} className="text-blue-600"/>
              <span className="text-xs font-bold text-blue-600 uppercase">
                {imageFile ? imageFile.name : "Choose Image File"}
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={(e)=>setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="flex gap-2">
            {!isNewCategory ? (
              <select className="flex-1 p-4 bg-gray-50 rounded-xl outline-none" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                <option value="Speakers">Speakers</option>
                <option value="Headphones">Headphones</option>
                <option value="Home Theater">Home Theater</option>
              </select>
            ) : (
              <input type="text" placeholder="New Category" className="flex-1 p-4 bg-blue-50 rounded-xl outline-none" onChange={(e)=>setFormData({...formData, category: e.target.value})} />
            )}
            <button type="button" onClick={()=>setIsNewCategory(!isNewCategory)} className="p-4 bg-gray-100 rounded-xl"><PlusCircle size={20}/></button>
          </div>

          <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-xl outline-none" rows={3} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required />

          <button disabled={loading} className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Product" : "Publish to Shop"}
          </button>
        </form>

        {/* List Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 divide-y divide-gray-50">
          {fetchLoading ? <div className="p-10 text-center animate-pulse uppercase text-[10px] tracking-widest text-gray-400">Loading Inventory...</div> : 
            products.map((p) => (
              <div key={p.id} className="p-6 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <img src={p.imageUrl} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" />
                  <div>
                    <h4 className="font-bold text-sm uppercase">{p.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{p.category}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0);}} className="p-3 text-gray-300 hover:text-blue-600 transition"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="p-3 text-gray-300 hover:text-red-600 transition"><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
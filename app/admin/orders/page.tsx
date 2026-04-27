"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { ShoppingCart, Eye, Clock, CheckCircle, Truck } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    fetchOrders(); // List ပြန် refresh လုပ်တာပါ
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Incoming Orders</h2>
        <p className="text-gray-400 text-sm font-medium">Manage customer purchases and delivery status.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID / Customer</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center animate-pulse text-[10px] tracking-widest text-gray-400">LOADING ORDERS...</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="p-6">
                  <p className="font-black text-sm uppercase italic leading-none mb-1">{order.customer?.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{order.customer?.phone}</p>
                </td>
                <td className="p-6">
                  <p className="text-xs font-bold text-gray-500">{order.items?.length} Items</p>
                </td>
                <td className="p-6 font-black text-blue-600 italic text-sm">${order.total?.toFixed(2)}</td>
                <td className="p-6">
                  <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest 
                    ${order.status === 'pending' ? 'bg-orange-50 text-orange-500' : 
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateStatus(order.id, 'shipped')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"><Truck size={14}/></button>
                    <button onClick={() => updateStatus(order.id, 'completed')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"><CheckCircle size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
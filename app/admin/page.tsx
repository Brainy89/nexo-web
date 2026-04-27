"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    productCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders for Revenue & Count
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      
      const totalRev = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // 2. Fetch Products Count
      const productsSnapshot = await getDocs(collection(db, "products"));
      
      // 3. Fetch Recent 5 Orders
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
      const recentSnapshot = await getDocs(q);
      const recentData = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setStats({
        totalRevenue: totalRev,
        orderCount: ordersSnapshot.size,
        productCount: productsSnapshot.size,
      });
      setRecentOrders(recentData);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: "bg-blue-600", shadow: "shadow-blue-500/20" },
    { label: "Orders Received", value: stats.orderCount, icon: <ShoppingBag />, color: "bg-orange-500", shadow: "shadow-orange-500/20" },
    { label: "Active Products", value: stats.productCount, icon: <Package />, color: "bg-purple-600", shadow: "shadow-purple-500/20" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">NEXO Business Overview</h2>
        <p className="text-gray-400 text-sm font-medium italic">Real-time data from your store operations.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.label}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500"
          >
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg ${card.shadow}`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{card.label}</p>
            <p className="text-4xl font-black tracking-tighter italic">{loading ? "..." : card.value}</p>
            <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ArrowUpRight size={40} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent Transactions</h3>
          <button onClick={fetchDashboardData} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition">Refresh Data</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center animate-pulse text-[10px] tracking-widest text-gray-300">SYNCING TRANSACTIONS...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">No orders found yet.</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 transition">
                    <td className="p-8">
                      <p className="font-black text-sm uppercase italic leading-none">{order.customer?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{order.customer?.phone}</p>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                        order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-8 font-black italic text-black text-sm">${order.total?.toFixed(2)}</td>
                    <td className="p-8 text-right text-gray-400 text-[10px] font-bold uppercase">
                      {order.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
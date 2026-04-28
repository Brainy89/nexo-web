"use client";
import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, User, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isOrdered, setIsOrdered] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Yangon",
    paymentMethod: "cod"
  });

  // --- Telegram Alert Function ---
  const sendTelegramAlert = async (orderData: any) => {
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("Telegram configurations are missing in .env.local");
      return;
    }

    const itemsList = orderData.items
      .map((item: any) => `• ${item.name} (x${item.quantity})`)
      .join("\n");

    const message = `🛍️ *Order အသစ်တက်လာပါပြီ!*%0A` +
      `--------------------------%0A` +
      `👤 *Customer:* ${orderData.customer.name}%0A` +
      `📞 *Phone:* ${orderData.customer.phone}%0A` +
      `📍 *Address:* ${orderData.customer.address}%0A` +
      `💳 *Payment:* ${orderData.customer.paymentMethod.toUpperCase()}%0A` +
      `--------------------------%0A` +
      `📦 *Items:*%0A${itemsList}%0A` +
      `--------------------------%0A` +
      `💰 *Total:* $${orderData.total.toFixed(2)}%0A` +
      `--------------------------%0A` +
      `🚀 *Admin Dashboard မှာ အသေးစိတ် စစ်ဆေးပါဗျ။*`;

    try {
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`
      );
    } catch (err) {
      console.error("Telegram Alert Error:", err);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderData = {
        customer: formData,
        items: cart,
        total: totalPrice(),
        status: "pending", 
        createdAt: serverTimestamp()
      };

      // 1. Save to Firebase
      await addDoc(collection(db, "orders"), orderData);
      
      // 2. Send Telegram Notification
      await sendTelegramAlert(orderData);

      setIsOrdered(true);
      setTimeout(() => {
        clearCart();
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0 && !isOrdered) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <p className="uppercase font-black tracking-widest text-gray-400">Your bag is empty</p>
        <button onClick={() => router.push("/")} className="bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Start Shopping</button>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-[#fcfcfc] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {isOrdered ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-blue-500/40">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Order Received!</h1>
            <p className="text-gray-500 italic">Thank you for choosing NEXO. We'll contact you shortly.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* --- Left: Checkout Form --- */}
            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition">
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">Checkout Details</h1>
              </div>

              <form onSubmit={handleOrder} className="space-y-8">
                {/* Contact Information */}
                <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <User size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Contact Information</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                      <input required type="text" placeholder="Aung Aung" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                      <input required type="tel" placeholder="09xxxxxxxxx" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </section>

                {/* Delivery Information */}
                <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Truck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Delivery Address</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Address</label>
                      <textarea required rows={3} placeholder="Street, Township, Building No." className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition resize-none"
                        onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <CreditCard size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Payment Method</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 bg-gray-50'}`}>
                      <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({...formData, paymentMethod: 'cod'})} className="hidden" />
                      <span className="font-bold text-sm">Cash on Delivery</span>
                      <div className={`w-4 h-4 rounded-full border-4 ${formData.paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'}`}></div>
                    </label>
                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition ${formData.paymentMethod === 'kpay' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 bg-gray-50'}`}>
                      <input type="radio" name="payment" value="kpay" checked={formData.paymentMethod === 'kpay'} onChange={() => setFormData({...formData, paymentMethod: 'kpay'})} className="hidden" />
                      <span className="font-bold text-sm">KPay / WavePay</span>
                      <div className={`w-4 h-4 rounded-full border-4 ${formData.paymentMethod === 'kpay' ? 'border-blue-600' : 'border-gray-300'}`}></div>
                    </label>
                  </div>
                </section>

                <button type="submit" className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/10 active:scale-[0.98]">
                  Complete Purchase — ${totalPrice().toFixed(2)}
                </button>
              </form>
            </div>

            {/* --- Right: Order Summary --- */}
            <div className="lg:col-span-5">
              <div className="sticky top-40 bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Order Summary</h3>
                <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 p-2">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-blue-600 mt-1">${(Number(item.discountPrice || item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Total Amount</span>
                    <span className="text-2xl font-black tracking-tighter italic text-black">${totalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.2em] text-center mt-4">Free Shipping included</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
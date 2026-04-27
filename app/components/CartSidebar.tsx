"use client";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartSidebar() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="uppercase text-[10px] font-bold tracking-[0.2em]">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 p-4">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-black uppercase tracking-tight italic line-clamp-1">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-blue-600 font-bold text-sm mt-1">${item.discountPrice || item.price}</p>
                        
                        {/* Qty Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-gray-100 rounded-full px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-blue-600">
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-blue-600">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                  <span className="text-2xl font-black tracking-tighter italic text-blue-600">${totalPrice().toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="w-full block">
                  <button 
                    onClick={toggleCart} // Sidebar ကို ပိတ်သွားအောင် လုပ်ပေးတာပါ
                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-600 transition-all shadow-xl"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
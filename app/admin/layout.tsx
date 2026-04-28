"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
    { icon: <Package size={20} />, label: "Products", href: "/admin/products" },
    { icon: <ShoppingCart size={20} />, label: "Orders", href: "/admin/orders" },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-600">
            NEXO <span className="text-black text-xs not-italic font-bold ml-1 uppercase tracking-widest">Admin</span>
          </h1>
          {/* Mobile Close Button */}
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)} // နှိပ်လိုက်ရင် sidebar ပိတ်သွားအောင်
                className={`flex items-center gap-4 p-4 rounded-2xl transition font-bold text-sm uppercase tracking-tight 
                  ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400 hover:text-red-600 font-bold text-sm uppercase tracking-tight transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-30">
          <h1 className="font-black italic text-blue-600">NEXO</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 rounded-xl">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 p-5 md:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
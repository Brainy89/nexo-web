"use client";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
    { icon: <Package size={20} />, label: "Products", href: "/admin/products" },
    { icon: <ShoppingCart size={20} />, label: "Orders", href: "/admin/orders" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-600">NEXO <span className="text-black text-xs not-italic font-bold ml-2 uppercase tracking-widest">Admin</span></h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-4 p-4 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition font-bold text-sm uppercase tracking-tight">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <button className="flex items-center gap-4 text-red-400 hover:text-red-600 font-bold text-sm uppercase tracking-tight transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
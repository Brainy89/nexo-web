"use client";
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Clock, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="text-blue-600" size={24} />,
      label: "Call Us",
      value: "09941144959",
      href: "tel:09941144959",
    },
    {
      icon: <Mail className="text-blue-600" size={24} />,
      label: "Email Us",
      value: "nexo.myanmar@gmail.com",
      href: "mailto:nexo.myanmar@gmail.com",
    },
    {
      icon: <MapPin className="text-blue-600" size={24} />,
      label: "Visit Us",
      value: "No29, Bayathokedi Street, Tarmwe, Yangon.",
      href: "https://maps.google.com/?q=No29,Bayathokedi Street,Tarmwe,Yangon",
    },
  ];

  return (
    <main className="pt-40 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Header --- */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Contact Nexo</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic italic">Infinite Support</motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* --- Left: Contact Info & Map --- */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.a key={index} href={info.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-6 group" target="_blank">
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{info.label}</p>
                    <p className="text-lg font-bold text-black group-hover:text-blue-600 transition-colors leading-tight">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Business Hours - All Day Support */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-blue-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Availability</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-xl italic text-blue-900">Open 24/7</span>
                <span className="text-[9px] font-bold py-1 px-3 bg-blue-600 text-white rounded-full uppercase tracking-widest">All Day</span>
              </div>
              <p className="mt-2 text-xs text-blue-600/70 font-medium italic">Our IT support and services are available every day of the week.</p>
            </motion.div>

           
            {/* --- Google Map Section --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.6 }} 
              className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner relative group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.536341252125!2d96.1685324!3d16.800845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1ec9115b7190f%3A0xe54d580b06b744!2sBayathokedi%20St%2C%20Yangon!5e0!3m2!1sen!2smm!4v1714032000000!5m2!1sen!2smm" 
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href="https://maps.google.com/?q=No29,Bayathokedi+Street,Tarmwe,Yangon" 
                  target="_blank" 
                  className="bg-white/90 p-2 rounded-lg shadow-sm block text-blue-600"
                >
                  <ExternalLink size={16}/>
                </a>
              </div>
            </motion.div>
          </div>

          {/* --- Right: Contact Form --- */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Send a Message</h2>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Name</label>
                  <input type="text" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 ring-blue-50 transition border border-transparent focus:border-blue-100" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
                  <input type="email" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 ring-blue-50 transition border border-transparent focus:border-blue-100" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">How can we help?</label>
                <textarea rows={4} className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 ring-blue-50 transition border border-transparent focus:border-blue-100 resize-none"></textarea>
              </div>

              <button className="group w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] hover:bg-blue-600 transition-all flex justify-center items-center gap-4 shadow-2xl">
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Send Inquiry
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
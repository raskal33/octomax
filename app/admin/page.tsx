"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const wallet = useWallet();
  
  useEffect(() => {
    setMounted(true);
    console.log("Admin dashboard mounted");
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
        <h2 className="text-xl font-bold text-[#14F195] mb-4">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#121212] p-4 rounded-lg border border-[#2A2A2A]">
            <h3 className="text-lg font-medium text-[#9945FF] mb-2">Wallet Info</h3>
            <p className="text-gray-400">
              <span className="font-bold">Connected:</span> {wallet.connected ? "Yes" : "No"}
            </p>
            <p className="text-gray-400">
              <span className="font-bold">Wallet:</span> {wallet.publicKey ? wallet.publicKey.toString() : "Not connected"}
            </p>
          </div>
          
          <div className="bg-[#121212] p-4 rounded-lg border border-[#2A2A2A]">
            <h3 className="text-lg font-medium text-[#00C2FF] mb-2">Admin Status</h3>
            <p className="text-gray-400">
              <span className="font-bold">Status:</span> Active
            </p>
            <p className="text-gray-400">
              <span className="font-bold">Role:</span> Administrator
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2A2A2A]">
        <h2 className="text-xl font-bold text-[#14F195] mb-4">Quick Actions</h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#9945FF] text-white px-4 py-2 rounded-lg hover:bg-[#8035DF] transition-colors">
            Manage Matches
          </button>
          <button className="bg-[#14F195] text-black px-4 py-2 rounded-lg hover:bg-[#10D080] transition-colors">
            Update Categories
          </button>
          <button className="bg-[#00C2FF] text-black px-4 py-2 rounded-lg hover:bg-[#00A8E0] transition-colors">
            View Statistics
          </button>
        </div>
      </div>
    </div>
  );
} 
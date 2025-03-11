"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

// Dynamically import the wallet components
const WalletComponents = dynamic(
  () => import("../components/WalletComponents"),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State hooks
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected, publicKey } = useWallet();
  
  // Router hook
  const router = useRouter();

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
    
    // Set initial loading state to false after a short delay
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Check if wallet is admin
  const checkAdminStatus = (address: string) => {
    setIsLoading(true);
    
    try {
      // Get admin wallets from environment variable
      const adminWalletsStr = process.env.NEXT_PUBLIC_ADMIN_WALLETS;
      if (!adminWalletsStr) {
        console.error("Admin wallets not configured");
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      const adminWallets = JSON.parse(adminWalletsStr);
      const isAdminWallet = adminWallets.includes(address);
      
      setIsAdmin(isAdminWallet);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  // Handle wallet connection changes
  useEffect(() => {
    if (!mounted) return;

    if (connected && publicKey) {
      checkAdminStatus(publicKey.toString());
    } else {
      setIsAdmin(false);
      router.push("/");
    }
  }, [connected, publicKey, mounted, router]);

  // Show loading spinner until client-side rendering is ready
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <header className="bg-[#121212] border-b border-[#2A2A2A] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#14F195]">Admin Dashboard</h1>
          <nav className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="text-gray-300 hover:text-[#14F195] transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/matches" 
              className="text-gray-300 hover:text-[#14F195] transition-colors"
            >
              Matches
            </Link>
            <Link 
              href="/" 
              className="text-gray-300 hover:text-[#14F195] transition-colors"
            >
              Back to Site
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !connected ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 mb-4">Please connect your wallet to access the admin dashboard.</p>
            <WalletComponents onWalletStatusChange={() => {}} />
          </div>
        ) : !isAdmin ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">You do not have permission to access this area.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </main>
    </div>
  );
} 
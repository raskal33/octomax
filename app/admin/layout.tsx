"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Router hook
  const router = useRouter();

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
    
    // Set initial loading state to false after a short delay
    // This prevents infinite loading if wallet components don't load properly
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Handle wallet connection status
  const handleWalletStatus = (connected: boolean, address: string | null) => {
    console.log("Wallet status changed:", { connected, address });
    setIsConnected(connected);
    setWalletAddress(address);
    
    // Reset admin status when wallet changes
    if (!connected || !address) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }
    
    // Check if wallet is admin
    checkAdminStatus(address);
  };
  
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
      
      console.log("Current wallet:", address);
      console.log("Admin wallets:", adminWallets);
      
      // Check if the current wallet is in the admin list
      const isAdminWallet = adminWallets.includes(address);
      console.log("Is admin wallet?", isAdminWallet);
      
      setIsAdmin(isAdminWallet);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  // Handle redirect logic
  useEffect(() => {
    if (!mounted) return;
    
    // Only redirect if we've confirmed user is not an admin
    if (isConnected && isAdmin === false) {
      console.log("Redirecting non-admin user to home");
      router.push("/");
    }
  }, [isAdmin, isConnected, router, mounted]);

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
        ) : !isConnected ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 mb-4">Please connect your wallet to access the admin dashboard.</p>
            <WalletComponents onWalletStatusChange={handleWalletStatus} />
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
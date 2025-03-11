"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletComponentsProps {
  onWalletStatusChange: (connected: boolean, address: string | null) => void;
}

export default function WalletComponents({ onWalletStatusChange }: WalletComponentsProps) {
  const { publicKey, connected } = useWallet();
  
  // Update parent component when wallet status changes
  useEffect(() => {
    const address = publicKey ? publicKey.toString() : null;
    onWalletStatusChange(connected, address);
  }, [publicKey, connected, onWalletStatusChange]);
  
  return (
    <div className="wallet-button-container">
      <WalletMultiButton />
    </div>
  );
} 
"use client";

// Import styles at the component level
import "@solana/wallet-adapter-react-ui/styles.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo, useState, useEffect } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";

// Dynamically import the WalletModalProvider with ssr disabled
const WalletModalProvider = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

// Import wallet adapters - only include the most common ones
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  SolongWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export default function AppWalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use state to track if we're on the client
  const [mounted, setMounted] = useState(false);

  // Set mounted to true when component mounts on client
  useEffect(() => {
    setMounted(true);
    console.log("AppWalletProvider mounted");
  }, []);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Only include the most common wallets to reduce bundle size
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    [network]
  );

  // Don't render anything until mounted on client
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

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
  // Can't render wallet stuff server side
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    [] // Removed network dependency as it's not used in the wallet creation
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

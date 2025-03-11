"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { FaCopy } from "react-icons/fa";

export default function InfoComp() {
  const [, copyToClipboard] = useCopyToClipboard();
  const { publicKey } = useWallet();

  const walletKey = publicKey?.toBase58();

  return (
    <div
      className={`group-hover group relative col-span-full flex w-full shrink-0 select-none gap-4 rounded-lg bg-dark-2 px-4 py-8 text-disabled-1 max-lg:flex-col`}
    >
      <div className={`flex w-64 flex-col gap-2`}>
        <h2 className="mb-6 text-3xl font-semibold text-primary">Profile</h2>

        <div className={`flex gap-4 text-2xl font-semibold`}>User123</div>

        <div className={`flex gap-4 font-medium`}>Active Since: July 2024</div>
        <div className={`flex items-center gap-4 font-medium`}>
          <div className={`w-32 truncate`}>
            Wallet: {publicKey?.toBase58() ?? "N/A"}
          </div>
          {""}
          {walletKey && (
            <FaCopy
              className={`cursor-pointer`}
              onClick={() => copyToClipboard(walletKey)}
            />
          )}
        </div>
      </div>

      <div className={`grid grow grid-cols-4 gap-4`}>
        {stats.map((e, i) => (
          <div
            key={i}
            className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-dark-1 transition hover:bg-dark-3 max-lg:col-span-2`}
          >
            <p className={`text-center text-xl font-medium text-primary`}>
              {e.label}
            </p>
            <p className={`font-semibold text-secondary`}>{e.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const stats = [
  { value: "+50 SOL", label: "Profit & Loss" },
  { value: "75%", label: "Win Rate" },
  { value: "120", label: "Total Bets" },
  { value: "80", label: "Won Bets" },
];

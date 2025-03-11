"use client";

// import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWindowScroll } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import SimpleNav from "./SimpleNav";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [{ y }] = useWindowScroll();
  const segment = useSelectedLayoutSegment();

  const [isRender, setIsRender] = useState<boolean>(false);
  useEffect(() => {
    setIsRender(true);
  }, []);

  const newY = y || 1;

  const handleClose = () => setIsMenuOpen(false);

  const Ul = () => (
    <div className="flex flex-col items-center gap-4 p-4 lg:flex-row lg:gap-2">
      {links.map((e) => (
        <Link
          key={e.label}
          href={e.href}
          className={`${
            segment == e.segment 
              ? "bg-black text-[#14F195] font-bold header-active-link" 
              : "text-white hover:text-[#9945FF] header-inactive-link"
          } rounded px-4 py-1 transition duration-500 hover:bg-black text-base md:text-lg`}
          style={{
            color: segment == e.segment ? '#14F195' : 'white',
            fontSize: '1rem',
            fontWeight: segment == e.segment ? 'bold' : 'normal',
          }}
          onClick={() => setIsMenuOpen(false)}
        >
          {e.label}
        </Link>
      ))}
    </div>
  );

  if (segment !== "/_not-found") {
    return (
      <motion.header
        animate={{ translateY: newY > 200 ? [-100, 0] : 0 }}
        transition={{
          easings: ["easeInOut"],
        }}
        className={`${
          newY > 200 ? "sticky" : "relative"
        } inset-x-0 top-0 z-50 select-none bg-dark-1`}
      >
        <header className="container mx-auto flex h-fit flex-col border-b border-black/25 px-4 backdrop-blur-sm md:px-16 xl:px-32">
          <div className={`flex items-center justify-between`}>
            {" "}
            <div className="relative font-black text-white">
              <Link href="/">
                <Image src="/logo2.png" alt="" width={200} height={1} />
              </Link>
            </div>
            <div className="text-light-secondary transition-all duration-500 ease-in-out max-lg:hidden">
              <Ul />
            </div>
            <div className="overflow-x- flex w-48 items-center justify-end gap-4 whitespace-nowrap">
              {isRender && (
                <WalletMultiButton
                  style={{
                    fontFamily: "var(--font-onest)",
                    backgroundColor: "transparent",
                    width: "100%",
                    fontSize: "0.9rem",
                  }}
                  className="wallet-button-custom"
                />
              )}

              <div
                className="cursor-pointer lg:hidden"
                onClick={() => setIsMenuOpen((e) => !e)}
              >
                <FaBars className="text-white" />
              </div>
            </div>
          </div>
          <SimpleNav handleClose={handleClose} />
        </header>

        <nav
          className="text-light-secondary absolute w-full overflow-hidden border-black/25 bg-dark-1/90 backdrop-blur-sm transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isMenuOpen ? "1500px" : "0px",
            borderBottomWidth: isMenuOpen ? "1px" : "0px",
          }}
        >
          <Ul />
        </nav>
      </motion.header>
    );
  }
}

const links = [
  {
    label: "Home",
    href: "/",
    segment: undefined,
  },
  {
    label: "OctoMax",
    href: "/octomax",
    segment: "octomax",
  },
  {
    label: "OctoAI",
    href: "/octoai",
    segment: "octoai",
  },
  {
    label: "Profile",
    href: "/profile",
    segment: "profile",
  },
];

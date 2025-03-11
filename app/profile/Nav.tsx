"use client";

import Link from "next/link";
import Button from "@/components/button";
import { useSelectedLayoutSegment } from "next/navigation";
export default function Nav() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className={`col-span-full flex flex-wrap justify-center gap-4`}>
      {links.map((e, i) => (
        <Link key={i} href={e.href}>
          <Button variant={e.segment == segment ? "primary" : "dark"}>
            {e.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

const links = [
  { label: "Overview", href: "/profile", segment: null },
  {
    label: "Betting History",
    href: "/profile/betting-history",
    segment: "betting-history",
  },
  {
    label: "Active Slips",
    href: "/profile/created-predictions",
    segment: "created-predictions",
  },
  {
    label: "Past Slips",
    href: "/profile/community-activity",
    segment: "community-activity",
  },
];

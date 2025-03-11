import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex grow flex-col">
      {children}
    </section>
  );
}

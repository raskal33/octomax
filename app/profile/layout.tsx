import InfoComp from "./InfoComp";

import Nav from "./Nav";

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

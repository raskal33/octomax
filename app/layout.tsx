import "./globals.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Prediction Master",
  description: "Make predictions and win SOL",
};

const onest = Onest({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="pixelated">
      <head>
        <link rel="stylesheet" href="/css/pixel-fonts.css" />
        <link rel="stylesheet" href="/css/override-styles.css" />
        <link rel="stylesheet" href="/css/profile-page.css" />
      </head>
      <body className={`${onest.variable} flex min-h-screen flex-col bg-[#121212] text-light-1 antialiased pixelated`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

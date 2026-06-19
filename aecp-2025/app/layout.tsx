import type { Metadata } from "next";
import { Cinzel, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AECP 2025 — Annual English Competition Polban",
  description: "The official platform for AECP participants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${cinzel.variable} ${raleway.variable} font-raleway`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
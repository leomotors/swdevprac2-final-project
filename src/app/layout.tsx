import "./globals.css";

import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Yuri Exhibition Booth Booking",
  description: "Book your booth for the exhibition held by Yuri Lover Group!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-b from-[#FFDEE9] via-[#B5EAEA] to-[#FFCBCB] antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

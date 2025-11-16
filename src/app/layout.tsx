import "./globals.css";

import type { Metadata } from "next";

import { AuthProvider } from "@/contexts/AuthContext";

import Navbar from "./components/Navbar";

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
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

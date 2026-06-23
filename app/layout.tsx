import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/sessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Get me a Chai - For chai lovers",
    template: "%s - Get me a Chai",
  },
  description: "This is a website for all the chai lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-black flex flex-col">
        <SessionWrapper>
          <Navbar />

          <main className="flex-1 bg-[radial-gradient(140%_140%_at_40%_20%,#000_60%,#63e_100%)] text-white">
            {children}
          </main>

          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}

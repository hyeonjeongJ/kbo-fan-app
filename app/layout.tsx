import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KBO Fan Community",
  description: "KBO 팬들을 위한 최고의 커뮤니티",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 메인 페이지인지 확인
  const isMainPage = typeof window !== 'undefined' && window.location.pathname === '/';
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

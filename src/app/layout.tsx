import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QueryProviders } from "./providers";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/app/ga/GoogleAnalytics";
import GAProvider from "./ga/GAProvider";

// ✅ PWA Metadata 추가
export const metadata: Metadata = {
  metadataBase: new URL("https://showstats.dugout.dev"),
  title: "ShowStats | MLB The Show 25 전적 분석 · 경기 로그 파싱 · 선수 DB",
  description:
    "MLB The Show 25 전적 조회 및 심화 분석 플랫폼입니다. OPS, 타율, 타점 등 상세 스탯과 경기 로그 자동 파싱, 선수 DB 검색 기능을 제공하여 플레이어와 카드 정보를 한눈에 확인할 수 있습니다.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "msapplication-TileColor": "#FFC107",
    "msapplication-TileImage": "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFC107",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <GAProvider />
        <GoogleAnalytics />
        <QueryProviders>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ServiceWorkerRegister /> {/* ✅ 여기서 Service Worker 등록 */}
          <Toaster />
        </QueryProviders>
      </body>
    </html>
  );
}

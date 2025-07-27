import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QueryProviders } from "./providers";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister"; // ✅ 추가
import { Toaster } from "@/components/ui/sonner";

// ✅ PWA Metadata 추가
export const metadata: Metadata = {
  title: "ShowStats - MLB The Show 통계 분석",
  description: "MLB The Show 야구 게임 전적 조회 및 심화 분석 플랫폼",
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

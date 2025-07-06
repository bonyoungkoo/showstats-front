import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QueryProviders } from "./providers";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister"; // ✅ 추가

// ✅ PWA Metadata 추가
export const metadata: Metadata = {
  title: "ShowStats - MLB The Show 통계 분석",
  description: "MLB The Show 야구 게임 전적 조회 및 심화 분석 플랫폼",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
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
        </QueryProviders>
      </body>
    </html>
  );
}

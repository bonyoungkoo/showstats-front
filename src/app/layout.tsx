import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QueryProviders } from "./providers";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister"; // ✅ 추가

export const metadata: Metadata = {
  title: "ShowStats - MLB The Show 통계 분석",
  description: "MLB The Show 야구 게임 전적 조회 및 심화 분석 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFC107" />
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
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

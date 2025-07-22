"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "홈", href: "/" },
    { name: "전적 조회", href: "/games" },
    { name: "선수 DB", href: "/players" },
    { name: "랭킹", href: "/rankings" },
    { name: "통계", href: "/stats" },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="transition-colors">
              <div className="text-3xl font-black tracking-tight">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  Show
                </span>
                <span className="text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] ml-1">
                  Stats
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <Button className="showstats-button">로그인</Button>
        </div>
      </div>
    </header>
  );
}

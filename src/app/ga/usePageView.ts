// src/app/ga/usePageView.ts
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_ID, isGAEnabled } from "./ga";

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isGAEnabled) return;
    if (typeof window === "undefined" || !window.gtag) return;
    if (!pathname) return;

    // 쿼리스트링은 window.location.search 로 가져오기
    const search = window.location.search || "";
    const url = `${pathname}${search}`;

    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }, [pathname]);
}

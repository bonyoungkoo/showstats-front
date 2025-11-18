"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GA_ID, isGAEnabled } from "./ga";

export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGAEnabled) return;
    if (typeof window === "undefined" || !window.gtag) return;
    if (!pathname) return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);
}

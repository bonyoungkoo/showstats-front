"use client";

import { usePageView } from "./usePageView";

export default function GAProvider() {
  usePageView();
  return null; // 화면에 아무것도 렌더링하지 않음
}

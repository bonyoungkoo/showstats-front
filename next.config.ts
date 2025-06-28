import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 개발 모드에서 중복 호출 방지
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mlb25.theshow.com",
        port: "",
        pathname: "/rails/active_storage/blobs/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Allow WebSocket connections
    if (!isServer) {
      config.externals = [...(config.externals || []), 'socket.io-client'];
    }
    return config;
  },
};

export default nextConfig;

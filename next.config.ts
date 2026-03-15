import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ENABLE_VOICE_ASSISTANT: process.env.ENABLE_VOICE_ASSISTANT ?? "false",
  },
};

export default nextConfig;

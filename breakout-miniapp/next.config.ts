import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // prod build'te lint hatalarını bloklama
  },
}
export default nextConfig

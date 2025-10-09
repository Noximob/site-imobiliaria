/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig

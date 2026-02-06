/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
    // Permitir otimização Next (WebP/AVIF, redimensionamento) = melhor LCP e SEO
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        // Repositório GitHub do projeto (sempre em minúsculo para evitar URLs com UPPERCASE)
        pathname: '/noximob/site-imobiliaria/**',
      },
      // Imagens DWV (CDN DigitalOcean Spaces)
      {
        protocol: 'https',
        hostname: 'dwvimages.sfo2.digitaloceanspaces.com',
        pathname: '/**',
      },
      // Imagens Firebase Storage (admin / site-config)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig

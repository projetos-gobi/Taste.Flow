/** @type {import('next').NextConfig} */
const nextConfig = {
  // Não usar trailingSlash aqui: estava gerando 308 em /api/* na Vercel,
  // quebrando chamadas POST (login) que dependem do proxy via `vercel.json`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desabilita o ESLint durante o build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', '127.0.0.1'], // 🚀 Permitir hosts locais
  },
};


export default nextConfig;

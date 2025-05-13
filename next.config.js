/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yrrrzxnhbkvnmeqrwlaq.supabase.co', 'i.ibb.co'],
  },
  eslint: {
    // ESLint 검사를 빌드 과정에서 비활성화
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript 타입 체크를 빌드 과정에서 비활성화
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 
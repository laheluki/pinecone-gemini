/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['zd92rvrh-3000.asse.devtunnels.ms', 'localhost:3000'],
    },
  },
};

export default nextConfig;

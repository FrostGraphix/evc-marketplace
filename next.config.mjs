/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/why-us',
        destination: '/about',
        permanent: false,
      },
      {
        source: '/track',
        destination: '/account',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

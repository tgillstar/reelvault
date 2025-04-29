/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'image.tmdb.org',
          pathname: '/t/p/**',
        },
      ],
      minimumCacheTTL: 60, // cache images for at least 60 seconds
    },
  };

export default nextConfig;

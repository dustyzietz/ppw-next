/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pricepoint-uploads.s3.us-west-1.amazonaws.com',
        port: '',
      },
    ],
  },
  webpack: (config) => {
    // Disable canvas usage
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;


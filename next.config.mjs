/** @type {import('next').NextConfig} */
const nextConfig = {
//   images: {
//     domains: ['https:/pricepoint-uploads.s3.us-west-1.amazonaws.com', 'pricepoint-uploads.s3.us-west-1.amazonaws.com'],
// },
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pricepoint-uploads.s3.us-west-1.amazonaws.com',
      port: '',
    },
  ],
},
};

export default nextConfig;

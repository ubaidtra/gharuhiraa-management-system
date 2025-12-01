/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build (errors will be warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable static exports for better PWA support
  // output: 'export', // Uncomment only if you want fully static export
  
  // Headers for PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

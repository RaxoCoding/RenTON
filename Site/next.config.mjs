/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'mnlfkqhkiahkfkyumdgl.supabase.co',
          pathname: '**',
        },
      ],
    },
  };

export default nextConfig;

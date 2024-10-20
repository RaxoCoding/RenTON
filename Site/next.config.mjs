/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'mnlfkqhkiahkfkyumdgl.supabase.co',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'iheartcraftythings.com',
          pathname: '**',
        },
      ],
    },
  };

export default nextConfig;

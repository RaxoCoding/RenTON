/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mnlfkqhkiahkfkyumdgl.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "iheartcraftythings.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

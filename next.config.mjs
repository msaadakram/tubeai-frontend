/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Bake NEXT_PUBLIC_API_URL into the build so the correct backend is always
  // used even if the Vercel env var is not set at build time.
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://api.ytforge.app',
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'api.ytforge.app' },
      { protocol: 'https', hostname: 'tubeai-backend.vercel.app' },
    ],
  },
};

export default nextConfig;

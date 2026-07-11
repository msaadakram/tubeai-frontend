/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Bake NEXT_PUBLIC_API_URL into the build so the correct backend is always
  // used even if the Vercel env var is not set at build time.
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://vu-web-backend.vercel.app',
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      // Current backend — vu-web-backend project on Vercel
      { protocol: 'https', hostname: 'vu-web-backend.vercel.app' },
      // Keep old hostname in case any stored avatar URLs still reference it
      { protocol: 'https', hostname: 'tubeai-backend.vercel.app' },
    ],
  },
};

export default nextConfig;

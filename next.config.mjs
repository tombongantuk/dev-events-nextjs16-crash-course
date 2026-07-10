/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponent:true,
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname:"/**"
    }]
  },
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev:true
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build autonome (binaire + deps minimales) pour des images Docker légères.
  output: "standalone",
};

export default nextConfig;

// Importing the NextConfig type for TypeScript support, if necessary
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['metaschool.so'],
    },
    env: {
      X_AI_API_KEY: process.env.X_AI_API_KEY,
    },
  };
  
  export default nextConfig;
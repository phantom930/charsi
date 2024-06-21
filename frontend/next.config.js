// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   scope: "/app",
//   sw: "firebase-messaging-sw.js",
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/create-account",
        destination: "/create-account/0",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["storage.googleapis.com", "lh3.googleusercontent.com"],
  },
  env: {
    FIREBASE_MESSAGING_SW: "/firebase-messaging-sw.ts",
  },
  generateBuildId: async () => {
    return new Date().getTime().toString();
  },
  headers: async () => {
    return [
      {
        source: "/firebase-messaging-sw.ts",
        headers: [
          {
            key: "Content-Type",
            value: "application/typescript",
          },
        ],
      },
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

module.exports = nextConfig;

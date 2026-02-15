import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    distDir: process.env.DIST_DIR || ".next",
    output: "standalone",
    reactCompiler: true,
    transpilePackages: ["@repo/db", "@repo/kafka", "@repo/redis"],

    images: {
        remotePatterns: [
            { hostname: "uploadthing.com" },
            { hostname: "z4hrk2n1pd.ufs.sh" },
        ],
    },
};

export default nextConfig;

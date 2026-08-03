import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /auto-accident (legacy template route) was superseded by the
        // bespoke /auto-accidents build (ATS-141) — permanent redirect so
        // neither URL competes for the same query in search.
        source: "/auto-accident",
        destination: "/auto-accidents",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

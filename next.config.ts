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
      {
        // ATS-E3 (3.3): the contact page's canonical URL is /contact-us —
        // redirect the legacy /contact path so it still resolves instead
        // of soft-404ing.
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

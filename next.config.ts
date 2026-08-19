import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A separate lockfile exists above this repository on the development
  // machine. Pin Turbopack to this app so it never infers/scans the parent
  // home directory (and so local/CI resolution matches production).
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["192.168.100.91"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "align-the-spine.b-cdn.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        // /auto-accident (legacy template route) was superseded by the
        // bespoke /auto-accidents build (ATS-141) — permanent redirect so
        // neither URL competes for the same query in search.
        source: "/auto-accident",
        destination: "/car-accident-chiropractor",
        permanent: true,
      },
      {
        source: "/auto-accidents",
        destination: "/car-accident-chiropractor",
        permanent: true,
      },
      {
        source: "/home-visits",
        destination: "/home-visit-chiropractor",
        permanent: true,
      },
      {
        source: "/services/massage-soft-tissue",
        destination: "/services/soft-tissue-therapy",
        permanent: true,
      },
      {
        source: "/book",
        destination: "/book-an-appointment",
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

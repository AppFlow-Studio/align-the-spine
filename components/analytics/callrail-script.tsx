"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { CALLRAIL_SWAP_SRC, isCallRailHost } from "@/lib/analytics/callrail";

export function CallRailScript() {
  const pathname = usePathname();
  const [isAllowedHost, setIsAllowedHost] = useState(false);

  useEffect(() => {
    // The post-mount update keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAllowedHost(isCallRailHost(window.location.hostname));
  }, []);

  if (!isAllowedHost || pathname.startsWith("/admin") || pathname.startsWith("/preview")) {
    return null;
  }

  return <Script id="callrail-dni" src={CALLRAIL_SWAP_SRC} strategy="afterInteractive" />;
}

import type { SVGProps } from "react";

export function ExpandVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="8 7 12 3 16 7" />
      <polyline points="8 17 12 21 16 17" />
    </svg>
  );
}

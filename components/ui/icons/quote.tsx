import type { SVGProps } from "react";

export function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.333 0C5.97 2.667 0 9.333 0 16.667 0 21.333 3.333 24 6.667 24c3.333 0 6-2.667 6-6 0-3.2-2.4-5.733-5.467-6-.133-2.667 2.4-6 6.133-8L13.333 0zm18.667 0c-7.333 2.667-13.333 9.333-13.333 16.667 0 4.666 3.333 7.333 6.666 7.333 3.334 0 6-2.667 6-6 0-3.2-2.4-5.733-5.466-6-.134-2.667 2.4-6 6.133-8L32 0z" />
    </svg>
  );
}

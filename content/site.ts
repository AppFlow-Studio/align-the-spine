export interface Address {
  line1: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
}

export interface DayHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteConfig {
  business: {
    name: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: Address;
  };
  hours: DayHours[];
  hoursNote: string;
  nav: NavLink[];
  bookingCta: NavLink;
  footer: {
    tagline: string;
    links: NavLink[];
    copyrightName: string;
  };
  serviceAreas: string[];
  social: SocialLink[];
}

const businessHours: DayHours[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({ day: day as DayHours["day"], open: "9:00 AM", close: "7:00 PM" }));

export const siteConfig: SiteConfig = {
  business: {
    name: "Align the Spine Chiropractic",
    phone: "(954) 573-7192",
    phoneHref: "tel:+19545737192",
    email: "abenasser@alignthespinechiropractic.com",
    address: {
      line1: "811 Southeast 8th Avenue",
      suite: "Suite #101",
      city: "Deerfield Beach",
      state: "FL",
      zip: "33441",
    },
  },
  hours: businessHours,
  hoursNote: "Priority for emergency cases",
  nav: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "Auto Accidents", href: "/auto-accidents" },
  ],
  bookingCta: { label: "Book Appointment", href: "/book" },
  footer: {
    tagline:
      "Premium chiropractic care delivered with medical excellence and patient-first convenience across South Florida.",
    links: [
      { label: "Accident Care", href: "/auto-accidents" },
      { label: "About Dr. Abe", href: "/about" },
      { label: "Reviews", href: "/reviews" },
    ],
    copyrightName: "Align the Spine Chiropractic",
  },
  serviceAreas: ["Deerfield Beach", "Boca Raton", "Pompano Beach", "Coconut Creek"],
  social: [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
  ],
};

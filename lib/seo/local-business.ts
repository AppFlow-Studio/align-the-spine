import { siteConfig } from "@/content/site";

/** "9:00 AM" / "7:00 PM" -> "09:00" / "19:00", per schema.org's
 * openingHoursSpecification time format. */
function to24Hour(time: string): string {
  const [, hourStr, minute, meridiem] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i) ?? [];
  let hour = Number(hourStr) % 12;
  if (meridiem?.toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

/** LocalBusiness/MedicalClinic JSON-LD for the practice, per ATS-131 scope
 * (name, address, phone, hours, geo). Static — the business data it's
 * built from (content/site.ts) doesn't vary by page. */
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalClinic", "LocalBusiness"],
  "@id": `${siteConfig.siteUrl}/#business`,
  name: siteConfig.business.name,
  url: siteConfig.siteUrl,
  telephone: siteConfig.business.phone,
  email: siteConfig.business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}`,
    addressLocality: siteConfig.business.address.city,
    addressRegion: siteConfig.business.address.state,
    postalCode: siteConfig.business.address.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.business.geo.latitude,
    longitude: siteConfig.business.geo.longitude,
  },
  openingHoursSpecification: siteConfig.hours.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.day,
    opens: to24Hour(hours.open),
    closes: to24Hour(hours.close),
  })),
  areaServed: siteConfig.serviceAreas.map((city) => ({ "@type": "City", name: city })),
};

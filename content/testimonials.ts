import type { Locale } from "@/content/i18n";

export interface Testimonial {
  /** The review exactly as the patient wrote it. Never edited. */
  quote: string;
  author: string;
  /** Spanish translation of `quote`, shown on /es pages.
   *
   * This is a translation, not the patient's own words, and the UI says so:
   * every component that renders it also renders a visible "traducida del
   * inglés" note and marks the text `lang="es-US"`. That distinction is the
   * whole point — presenting a rewritten review as the reviewer's own
   * wording would make it a fabricated review under Google's review
   * policies, and simply untrue. Translations preserve meaning and register
   * (including how casual the original is); they do not upgrade a review's
   * enthusiasm, add claims, or tidy up the patient's point.
   *
   * Optional: a review with no translation falls back to the English
   * original, marked `lang="en-US"`, rather than being hidden. */
  quoteEs?: string;
  /** Brazilian Portuguese translation of `quote`, shown on /pt pages — same
   * contract and same disclosure requirement as `quoteEs` (marked
   * `lang="pt-BR"`, always paired with a visible "traduzidas do inglês"
   * note). NEEDS LINGUISTIC REVIEW: machine-translated by an LLM with no
   * verified native Brazilian Portuguese fluency (see
   * docs/multilingual-seo-baseline.md §8.2) — checked for meaning/register
   * preservation against the English original, not reviewed by a native
   * speaker. */
  quotePt?: string;
  /** Haitian Creole translation of `quote`, shown on /ht pages — same
   * contract as `quoteEs`/`quotePt` (marked `lang="ht"`, always paired with
   * a visible "tradwi nan lang angle" note). NEEDS LINGUISTIC REVIEW: same
   * caveat as `quotePt`, and per docs/multilingual-seo-baseline.md §8.2 this
   * is the single largest quality risk of the two new locales — do not treat
   * this as a native-speaker-approved translation. */
  quoteHt?: string;
}

/** Real, client-supplied Google reviews (screenshots provided directly by
 * the practice, 2026-08-12) — copied verbatim, including each reviewer's
 * own phrasing/typos, same as every other real review on this site. Do not
 * invent or embellish entries here — a prior version fabricated "Maria G."
 * placeholder testimonials and that's what content-safety.test.ts's rule
 * exists to catch. All are 5-star; no date field since none of the
 * consuming UI (ReviewsCarousel, HeroReviewsCarousel, PatientReviews)
 * displays one. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Dr. Abe is a very dedicated, committed, and knowledgeable professional. He helped me a lot with my pain after my car accident.",
    quoteEs:
      "El Dr. Abe es un profesional muy dedicado, comprometido y con mucho conocimiento. Me ayudó muchísimo con el dolor que tenía después de mi accidente de auto.",
    quotePt:
      "O Dr. Abe é um profissional muito dedicado, comprometido e com muito conhecimento. Ele me ajudou muito com a dor que eu tinha depois do meu acidente de carro.",
    quoteHt:
      "Dr. Abe se yon pwofesyonèl ki trè devwe, angaje, e ki gen anpil konesans. Li te ede m anpil ak doulè mwen te genyen apre aksidan machin mwen an.",
    author: "Sheila Pimentel",
  },
  {
    quote:
      "Amazing service! I am a professional fighter, DR Abe has helped me recover and fix any injuries I get from my fights and training",
    quoteEs:
      "¡Excelente servicio! Soy peleador profesional y el Dr. Abe me ha ayudado a recuperarme y a tratar las lesiones que me dejan las peleas y los entrenamientos",
    quotePt:
      "Serviço incrível! Sou lutador profissional e o Dr. Abe tem me ajudado a me recuperar e tratar as lesões que ficam das minhas lutas e treinos",
    quoteHt:
      "Sèvis ekstraòdinè! Mwen se yon konbatan pwofesyonèl, e Dr. Abe ede m refè epi trete blesi mwen fè nan konba ak antrènman mwen yo",
    author: "John Michael Escoboza",
  },
  {
    quote:
      "Very professional had great therapy here I would definitely recommend to anyone with knee and back pain. Dr. Abe is very helpful and I would definitely come back again for more treatment",
    quoteEs:
      "Muy profesional, recibí muy buena terapia aquí. Sin duda se lo recomendaría a cualquiera con dolor de rodilla y de espalda. El Dr. Abe ayuda muchísimo y definitivamente volvería para más tratamiento",
    quotePt:
      "Muito profissional, recebi uma ótima terapia aqui. Com certeza recomendaria a qualquer pessoa com dor no joelho e nas costas. O Dr. Abe ajuda muito e com certeza eu voltaria para mais tratamento",
    quoteHt:
      "Trè pwofesyonèl, mwen resevwa yon bon terapi isit la. San dout mwen ta rekòmande l bay nenpòt moun ki gen doulè jenou ak do. Dr. Abe ede anpil e mwen ta definitivman tounen pou plis tretman",
    author: "Josh Merulla",
  },
  {
    quote:
      "I contacted Dr. Nasser after being in so much pain. He litterely responded right away and saw me the next day. I left there feeling so much better and pain free. I Will most definitely recommend him and be back soon.",
    quoteEs:
      "Contacté al Dr. Nasser después de tener muchísimo dolor. Literalmente me respondió de inmediato y me atendió al día siguiente. Salí de ahí sintiéndome mucho mejor y sin dolor. Sin duda lo voy a recomendar y volveré pronto.",
    quotePt:
      "Entrei em contato com o Dr. Nasser depois de sentir muita dor. Ele literalmente respondeu na hora e me atendeu no dia seguinte. Saí de lá me sentindo muito melhor e sem dor. Com certeza vou recomendá-lo e voltarei em breve.",
    quoteHt:
      "Mwen te kontakte Dr. Nasser apre m te gen anpil doulè. Li reponn imedyatman e li wè m nan landmen. Mwen kite kote a santi m pi byen anpil e san doulè. San dout m ap rekòmande l e m ap tounen byento.",
    author: "Evolutionary physique Fitness",
  },
  {
    quote:
      "Very professional and clean office. I love that he offers mobile services. I highly recommend Dr. Nasser. I walk out of his office feeling relieved of my lower back pain.",
    quoteEs:
      "Consultorio muy profesional y limpio. Me encanta que ofrezca servicios a domicilio. Recomiendo mucho al Dr. Nasser. Salgo de su consultorio con alivio en el dolor de mi espalda baja.",
    quotePt:
      "Consultório muito profissional e limpo. Adoro que ele ofereça atendimento a domicílio. Recomendo muito o Dr. Nasser. Saio do consultório dele com alívio da minha dor na lombar.",
    quoteHt:
      "Kabinè trè pwofesyonèl e pwòp. Mwen renmen li ofri sèvis lakay. Mwen rekòmande Dr. Nasser anpil. Mwen kite kabinè li ak soulajman nan doulè pati anba do mwen.",
    author: "Sabrina Perez",
  },
  {
    quote:
      "Had some lower back pain and saw Dr. Abe he was very informative and helpful in assisting me to get my range of motion back. Highly recommend!",
    quoteEs:
      "Tenía dolor en la espalda baja y fui con el Dr. Abe. Me explicó todo muy bien y me ayudó mucho a recuperar mi rango de movimiento. ¡Muy recomendado!",
    quotePt:
      "Eu tinha dor na lombar e fui ao Dr. Abe. Ele me explicou tudo muito bem e me ajudou muito a recuperar minha amplitude de movimento. Super recomendo!",
    quoteHt:
      "Mwen te gen doulè nan pati anba do e mwen te wè Dr. Abe. Li eksplike m tout bagay byen e li ede m anpil pou m rekipere mouvman m. Mwen rekòmande l anpil!",
    author: "Mohammed Husein",
  },
  {
    quote:
      "Dr. Abe Nasser has me feeling great! Came in with shoulder, neck and knee pain and I feel great. Prices were spectacular compared to anyone else, great conversations. 100% recommended!",
    quoteEs:
      "¡El Dr. Abe Nasser me tiene sintiéndome muy bien! Llegué con dolor de hombro, cuello y rodilla y me siento muy bien. Los precios fueron espectaculares comparados con cualquier otro, y muy buenas conversaciones. ¡100% recomendado!",
    quotePt:
      "O Dr. Abe Nasser me deixou me sentindo muito bem! Cheguei com dor no ombro, no pescoço e no joelho e agora me sinto ótimo. Os preços foram excelentes comparados com qualquer outro, e as conversas foram muito boas. 100% recomendado!",
    quoteHt:
      "Dr. Abe Nasser fè m santi m byen anpil! Mwen te vini ak doulè nan zepòl, kou, ak jenou e kounye a mwen santi m byen. Pri yo te ekstraòdinè konpare ak nenpòt lòt kote, e bon konvèsasyon. 100% rekòmande!",
    author: "Nash Husein",
  },
];

export interface ResolvedQuote {
  text: string;
  /** BCP-47 tag for the text actually rendered — drives the `lang`
   * attribute so a screen reader pronounces it correctly. */
  lang: string;
  /** True when `text` is a translation rather than the patient's own
   * words. Callers MUST surface this to the reader (see Testimonial.quoteEs). */
  translated: boolean;
}

/** Picks the quote text to render for a locale, and reports honestly which
 * one it picked. On /es, /pt, and /ht this returns that locale's translation
 * when one exists (translated: true) and otherwise falls back to the
 * untouched English original (translated: false) rather than hiding the
 * review or fabricating a translation that isn't there.
 *
 * ATS-SEO-070 follow-up: extended from Spanish-only to also check
 * `quotePt`/`quoteHt`, now that every testimonial has all three
 * translations (see Testimonial's own field docs for the "never fabricate
 * a translation" policy this follows). */
export function resolveTestimonialQuote(testimonial: Testimonial, locale: Locale): ResolvedQuote {
  if (locale === "es" && testimonial.quoteEs) {
    return { text: testimonial.quoteEs, lang: "es-US", translated: true };
  }
  if (locale === "pt" && testimonial.quotePt) {
    return { text: testimonial.quotePt, lang: "pt-BR", translated: true };
  }
  if (locale === "ht" && testimonial.quoteHt) {
    return { text: testimonial.quoteHt, lang: "ht", translated: true };
  }
  return { text: testimonial.quote, lang: "en-US", translated: false };
}

export const featuredTestimonial: Testimonial | undefined = testimonials[0];
export const homeFeaturedTestimonial: Testimonial | undefined = testimonials[0];
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = testimonials;

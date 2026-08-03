export interface FAQ {
  question: string;
  answer: string;
}

/** "Before you call / Quick answers" block on /book (ATS-100), per the
 * Book-appt artboard: walk-ins, PIP coverage, home-visit travel.
 * ATS-E4 (4.4/4.5/4.6): answers previously asserted same-day availability,
 * a $0-out-of-pocket PIP claim, and a fixed multi-city service area as
 * fact with no client approval — reworded to point to a call instead of
 * asserting those specifics. */
export const bookFaqs: FAQ[] = [
  {
    question: "Do you take walk-ins or same-day appointments?",
    answer:
      "We recommend booking ahead so we can hold time for a full exam — call the office and we'll do our best to find a time that works for you.",
  },
  {
    question: "How does PIP coverage work for my visit?",
    answer:
      "Florida PIP can cover care after an auto accident when treatment begins within 14 days. Call us and we'll walk through your coverage and what to expect before your first visit.",
  },
  {
    question: "How far do you travel for home visits?",
    answer:
      "Home visits are offered based on your case and location. Call us and we'll let you know if you're in range.",
  },
];

/** "Everything you need to know about home visits" block on /home-visits
 * (ATS-110), per the Home-visits-v2 artboard. ATS-E4 (4.5/4.6): see
 * bookFaqs' note — the same $0/PIP billing and fixed-city claims were
 * reworded here too. */
export const homeVisitFaqs: FAQ[] = [
  {
    question: "Is there an extra fee for a home visit?",
    answer:
      "Cost depends on your case and whether it's accident-related. Call us and we'll walk through pricing before you book.",
  },
  {
    question: "What should I do to prepare?",
    answer:
      "Just have a bit of open space to move around in and wear comfortable clothing. Dr. Abe brings everything needed for the exam and treatment — no equipment or setup required on your end.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "Home visits are offered based on your case and location. Call us and we'll let you know if you're in range.",
  },
  {
    question: "How is this different from a regular chiropractic visit?",
    answer:
      "Same exam, hands-on treatment, and documentation as an office visit — just delivered at your address when it's the right fit for your case and location.",
  },
];

/** ATS-E4 (4.4/4.5): "Do you accept insurance?", "walk-in" and "home
 * visits" answers previously asserted most-major-insurance/$0-PIP,
 * same-day, and guaranteed home-visit availability as fact — reworded to
 * point to a call instead. */
export const faqs: FAQ[] = [
  {
    question: "Do you accept insurance?",
    answer:
      "Call us and we'll walk through your coverage and payment options before your first visit.",
  },
  {
    question: "What should I expect at my first visit?",
    answer:
      "Your first visit includes a full consultation, a hands-on exam, and — if needed — imaging to pinpoint the cause of your pain. We'll walk you through a treatment plan before any adjustment begins.",
  },
  {
    question: "Do I need an appointment, or can I walk in?",
    answer:
      "We recommend booking ahead so we can hold time for a full exam — call the office and we'll do our best to find a time that works for you.",
  },
  {
    question: "I was just in a car accident. How soon should I come in?",
    answer:
      "As soon as possible, even if you feel fine. Whiplash and soft-tissue injuries often don't show symptoms for days. Early evaluation also creates the documentation your PIP claim needs.",
  },
  {
    question: "How many visits will I need?",
    answer:
      "It depends on the injury and how long you've had it. Many patients feel relief within a few visits, while more complex or long-standing issues may need several weeks of care. We'll reassess and adjust the plan as you progress.",
  },
  {
    question: "Do you offer home visits?",
    answer:
      "Home visits may be available depending on your case. Call us and we'll let you know if it's a fit for your situation.",
  },
];

export interface PageFaqs {
  /** Header tail: "Everything you need to know about {tail}" */
  tail: string;
  items: FAQ[];
}

export const faqsByPage = {
  home: {
    tail: "your spine health",
    items: faqs,
  },
} satisfies Record<string, PageFaqs>;

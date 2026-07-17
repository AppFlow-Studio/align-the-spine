export interface FAQ {
  question: string;
  answer: string;
}

/** "Before you call / Quick answers" block on /book (ATS-100), per the
 * Book-appt artboard: walk-ins, PIP coverage, home-visit travel. */
export const bookFaqs: FAQ[] = [
  {
    question: "Do you take walk-ins or same-day appointments?",
    answer:
      "We recommend booking ahead so we can hold time for a full exam, but we keep same-day slots open for urgent cases — call the office and we'll fit you in when we can.",
  },
  {
    question: "How does PIP coverage work for my visit?",
    answer:
      "Florida PIP covers care after an auto accident when treatment begins within 14 days, and it often reduces your out-of-pocket cost to $0. Bring your claim number if you have one and we'll verify your coverage before your first visit.",
  },
  {
    question: "How far do you travel for home visits?",
    answer:
      "We serve Deerfield Beach, Boca Raton, Fort Lauderdale, and the surrounding South Florida communities. If you're nearby but not sure you're in range, call us — we'll let you know right away.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Do you accept insurance?",
    answer:
      "Yes — we work with most major insurance providers, and if you were in an auto accident, PIP coverage often reduces your out-of-pocket cost to $0. Call us and we'll verify your benefits before your first visit.",
  },
  {
    question: "What should I expect at my first visit?",
    answer:
      "Your first visit includes a full consultation, a hands-on exam, and — if needed — imaging to pinpoint the cause of your pain. We'll walk you through a treatment plan before any adjustment begins.",
  },
  {
    question: "Do I need an appointment, or can I walk in?",
    answer:
      "We recommend booking ahead so we can hold time for a full exam, but we keep same-day slots open for urgent cases — call the office and we'll fit you in when we can.",
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
      "Yes, home visits are available when it applies — ask our team when you call and we'll let you know if it's a fit for your situation.",
  },
];

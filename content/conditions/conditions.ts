import type { Condition } from "@/content/conditions/types";

/** Neck Pain condition content per condition-page-spec §B3, §C. Stands in for
 * the not-yet-built ATS-060 condition data feed — the shape here is what
 * ATS-060 is expected to populate for every condition. */
export const neckPainCondition: Condition = {
  slug: "neck-pain",
  name: "Neck Pain",
  summary: "Relief from chronic and acute neck pain through targeted chiropractic care.",
  understanding: {
    intro:
      "Neck pain can range from a dull, nagging stiffness to sharp pain that limits how far you can turn your head. Left untreated, it often radiates into the shoulders and upper back.",
    image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe examining a patient's neck" },
    types: [
      {
        name: "Acute Neck Pain",
        description:
          "Sudden onset, usually tied to a specific movement, injury, or sleeping position. Typically resolves within a few weeks with the right care.",
      },
      {
        name: "Chronic Neck Pain",
        description:
          "Persists for three months or longer, often from poor posture, repetitive strain, or an old injury that never fully healed.",
      },
    ],
    causes: [
      "Poor posture from prolonged desk or phone use",
      "Whiplash from a car accident",
      "Sleeping in an awkward position",
      "Muscle strain from overexertion",
      "Degenerative changes in the cervical spine",
    ],
    redFlags: {
      title: "See a doctor promptly if you notice:",
      bullets: [
        "Numbness or tingling radiating into your arms or hands",
        "Neck pain following a fall, car accident, or direct blow",
        "Fever, unexplained weight loss, or night sweats alongside neck pain",
      ],
    },
  },
};

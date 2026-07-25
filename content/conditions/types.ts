export interface ConditionType {
  name: string;
  description: string;
}

export interface ConditionRedFlags {
  title: string;
  bullets: string[];
}

export interface ConditionUnderstanding {
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  redFlags: ConditionRedFlags;
}

export interface ConditionAccidentBanner {
  headline: string;
  body: string;
}

export interface Condition {
  slug: string;
  name: string;
  summary: string;
  understanding: ConditionUnderstanding;
  accidentBanner: ConditionAccidentBanner;
}

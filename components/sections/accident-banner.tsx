import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PipCalculator } from "@/components/ui/pip-calculator";
import { Section } from "@/components/ui/section";
import type { Condition } from "@/content/conditions/types";

export interface AccidentBannerProps {
  condition: Condition;
  className?: string;
}

/** "Was this from an accident?" band per condition-page-spec §B4, §C:
 * navy rounded card, condition-driven headline/body/smallprint on the left,
 * PIPCalculator (ATS-032) on the right. Eyebrow is static — everything else
 * varies per condition via Condition.accident. */
export function AccidentBanner({ condition, className }: AccidentBannerProps) {
  const { accident } = condition;

  return (
    <Section className={className}>
      <Container>
        <div className="rounded-30 bg-navy-900 p-10 md:p-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow variant="onDark">Was this from an accident?</Eyebrow>
              <h2 className="font-display text-h2 md:text-understanding-intro text-white">
                {accident.headline}
              </h2>
              <p className="font-sans text-body-lg text-mute-300">{accident.body}</p>

              <div className="flex items-start gap-4 rounded-30 bg-overlay-white-15 px-5 py-4 lg:items-center lg:rounded-full">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 font-sans text-sm font-bold text-white"
                >
                  !
                </span>
                <p className="font-sans text-small-print text-mute-300">{accident.smallprint}</p>
              </div>
            </div>

            <div className="w-full lg:ml-auto lg:max-w-md">
              <PipCalculator />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

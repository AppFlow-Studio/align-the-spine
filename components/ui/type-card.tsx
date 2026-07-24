import { cn } from "@/lib/cn";

export interface TypeCardProps {
  name: string;
  description: string;
  className?: string;
}

/** TypeCard per condition-page-spec §B3: name (Poppins SemiBold 30 teal-500)
 * + description (Geist 25/40 ink-500). Plain stacked text, no border/background. */
export function TypeCard({ name, description, className }: TypeCardProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h4 className="font-sans text-type-name text-teal-500">{name}</h4>
      <p className="font-alt text-faq-a text-ink-500">{description}</p>
    </div>
  );
}

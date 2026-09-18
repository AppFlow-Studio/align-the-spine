import { describe, expect, it } from "vitest";

import { CitationLink } from "@/components/ui/citation";
import { CITATIONS } from "@/content/citations";

describe("CitationLink", () => {
  const citation = CITATIONS.floridaPip14Day;

  it("renders a real <a> with the citation's URL as href", () => {
    const element = CitationLink({ citation });
    expect(element.type).toBe("a");
    expect(element.props.href).toBe(citation.url);
  });

  it("shows the visible label as the link text", () => {
    const element = CitationLink({ citation });
    expect(element.props.children).toBe(citation.label);
  });

  it("opens in a new tab without granting the target page access to window.opener", () => {
    const element = CitationLink({ citation });
    expect(element.props.target).toBe("_blank");
    expect(element.props.rel).toContain("noopener");
    expect(element.props.rel).toContain("noreferrer");
  });

  it("does not carry a nofollow hint (this links to a primary authoritative source)", () => {
    const element = CitationLink({ citation });
    expect(element.props.rel).not.toContain("nofollow");
  });

  it("surfaces the source title and organization in a title tooltip", () => {
    const element = CitationLink({ citation });
    expect(element.props.title).toContain(citation.sourceTitle);
    expect(element.props.title).toContain(citation.sourceOrg);
  });
});

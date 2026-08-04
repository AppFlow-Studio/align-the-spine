import { describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a script[type=application/ld+json] with the serialized data", () => {
    const element = JsonLd({ data: { "@type": "Thing", name: "Test" } });
    expect(element.type).toBe("script");
    expect(element.props.type).toBe("application/ld+json");
    expect(JSON.parse(element.props.dangerouslySetInnerHTML.__html)).toEqual({
      "@type": "Thing",
      name: "Test",
    });
  });

  it("escapes '<' so a closing </script> can't be injected via string content", () => {
    const element = JsonLd({ data: { name: "</script><script>alert(1)</script>" } });
    const html = element.props.dangerouslySetInnerHTML.__html;
    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script\\u003e");
  });

  it("throws when a string field is exactly the '#' placeholder", () => {
    expect(() => JsonLd({ data: { url: "#" } })).toThrow(/placeholder/i);
  });

  it("throws when a nested field is the '#' placeholder", () => {
    expect(() => JsonLd({ data: { sameAs: ["https://facebook.com/real", "#"] } })).toThrow(
      /placeholder/i,
    );
  });

  it("does not throw for a real anchor-style @id containing '#'", () => {
    expect(() => JsonLd({ data: { "@id": "https://example.com/#organization" } })).not.toThrow();
  });
});

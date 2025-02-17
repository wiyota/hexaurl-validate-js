import { describe, it, expect } from "vitest";
import { Config, Composition } from "../src/index";
import { z } from "zod";
import "../src/zod/index";

describe("HexaURL zod extension", () => {
  it("should pass for a valid HexaURL string", () => {
    // In the default setting, only alphanumeric characters + hyphen are allowed,
    // so as an example, “abc-123” is a valid case
    const schema = z.string().hexaurl();
    const validString = "abc-123";
    const result = schema.safeParse(validString);
    expect(result.success).toBe(true);
  });

  it("should fail when a HexaURL string starts with a hyphen", () => {
    // Default delimiter rules prohibit leading/trailing hyphens
    const schema = z.string().hexaurl();
    const invalidString = "-abc123";
    const result = schema.safeParse(invalidString);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain(
        "Hyphens cannot start or end",
      );
    }
  });

  it("should fail for input with invalid characters", () => {
    // Underscores are treated as invalid characters since
    // Composition is alphabetic, numeric, and hyphen only
    const schema = z.string().hexaurl();
    const invalidString = "abc_123";
    const result = schema.safeParse(invalidString);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("Invalid character");
    }
  });

  it("should pass when using a custom config to allow underscores", () => {
    // Test if Composition is changed to AlphanumericHyphenUnderscore
    // in custom settings and leading/trailing underlines are also allowed
    const customConfig = Config.create({
      composition: Composition.AlphanumericHyphenUnderscore,
      delimiter: {
        allowLeadingTrailingHyphens: false,
        allowLeadingTrailingUnderscores: true,
        allowConsecutiveHyphens: false,
        allowConsecutiveUnderscores: false,
        allowAdjacentHyphenUnderscore: false,
      },
    });
    const schema = z.string().hexaurl(customConfig);
    const validString = "_abc-123_";
    const result = schema.safeParse(validString);
    expect(result.success).toBe(true);
  });

  it("should enforce an additional regex constraint after hexaurl", () => {
    // In addition to hexaurl() validation, it imposes the regular expression
    // constraint of ending with a number. That is, the input string must end
    // in a number in addition to the default HexaURL rule.
    const schema = z
      .string()
      .regex(/[0-9]$/, {
        message: "The string must end with a digit",
      })
      .hexaurl();
    const validString = "abc-123";
    const invalidString = "abc-XYZ"; // Error due to non-numeric ending

    const validResult = schema.safeParse(validString);
    expect(validResult.success).toBe(true);

    const invalidResult = schema.safeParse(invalidString);
    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.error.errors[0].message).toContain(
        "The string must end with a digit",
      );
    }
  });

  it("should transform HexaURL string to URL", () => {
    // Define a schema that validates HexaURL and transforms it to a URL
    const schema = z
      .string()
      .hexaurl()
      .transform((str) => new URL(`https://example.com/${str}`));

    const validString = "abc-123";
    const result = schema.safeParse(validString);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(URL);
      expect(result.data.href).toBe("https://example.com/abc-123");
      expect(result.data.pathname).toBe("/abc-123");
    }
  });
});

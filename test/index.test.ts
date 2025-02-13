import { describe, it, expect } from "vitest";
import {
  validate,
  isEncodingSafe,
  createConfig,
  createDelimiterRules,
  createAllowedDelimiterRules,
  Composition,
  HexaUrlError,
  HexaUrlErrorCode,
} from "../src";

describe("HexaURL Validation", () => {
  describe("Basic Validation", () => {
    it("should validate valid strings", () => {
      expect(() => validate("abc123")).not.toThrow();
      expect(() => validate("hello-world")).not.toThrow();
      expect(() => validate("test-123")).not.toThrow();
    });

    it("should reject invalid strings", () => {
      expect(() => validate("")).toThrow(HexaUrlError);
      expect(() => validate("a!b")).toThrow(HexaUrlError);
      expect(() => validate("too--many-hyphens")).toThrow(HexaUrlError);
    });

    it("should enforce length constraints", () => {
      expect(() => validate("ab")).toThrow(HexaUrlError);
      expect(() => validate("a".repeat(50))).toThrow(HexaUrlError);
    });
  });

  describe("Custom Configuration", () => {
    it("should respect custom minimum length", () => {
      const config = createConfig({ minLength: 5 });
      expect(() => validate("abcd", config)).toThrow(HexaUrlError);
      expect(() => validate("abcde", config)).not.toThrow();
    });

    it("should respect custom maximum length", () => {
      const config = createConfig({ maxLength: 10 });
      expect(() => validate("abcdefghij", config)).not.toThrow();
      expect(() => validate("abcdefghijk", config)).toThrow(HexaUrlError);
    });

    it("should handle different identifier compositions", () => {
      const alphanumericConfig = createConfig({
        composition: Composition.Alphanumeric,
      });
      expect(() => validate("abc123", alphanumericConfig)).not.toThrow();
      expect(() => validate("abc-123", alphanumericConfig)).toThrow(
        HexaUrlError,
      );

      const hyphenConfig = createConfig({
        composition: Composition.AlphanumericHyphen,
      });
      expect(() => validate("abc-123", hyphenConfig)).not.toThrow();
      expect(() => validate("abc_123", hyphenConfig)).toThrow(HexaUrlError);
    });
  });

  describe("Delimiter Rules", () => {
    it("should handle leading/trailing hyphens", () => {
      const allowConfig = createConfig({
        delimiter: createDelimiterRules({ allowLeadingTrailingHyphens: true }),
      });
      const disallowConfig = createConfig({
        delimiter: createDelimiterRules({ allowLeadingTrailingHyphens: false }),
      });

      expect(() => validate("-test-", allowConfig)).not.toThrow();
      expect(() => validate("-test-", disallowConfig)).toThrow(HexaUrlError);
    });

    it("should handle consecutive delimiters", () => {
      const allowConfig = createConfig({
        delimiter: createDelimiterRules({ allowConsecutiveHyphens: true }),
      });
      const disallowConfig = createConfig({
        delimiter: createDelimiterRules({ allowConsecutiveHyphens: false }),
      });

      expect(() => validate("test--123", allowConfig)).not.toThrow();
      expect(() => validate("test--123", disallowConfig)).toThrow(HexaUrlError);
    });

    it("should work with all delimiters allowed", () => {
      const config = createConfig({
        composition: Composition.AlphanumericHyphenUnderscore,
        delimiter: createAllowedDelimiterRules(),
      });

      expect(() => validate("-test_", config)).not.toThrow();
      expect(() => validate("test--123", config)).not.toThrow();
      expect(() => validate("test__123", config)).not.toThrow();
      expect(() => validate("test-_123", config)).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should throw correct error codes", () => {
      let errorThrown = false;
      try {
        validate("");
      } catch (error) {
        errorThrown = true;
        expect(error instanceof HexaUrlError).toBe(true);
        if (error instanceof HexaUrlError) {
          expect(error.code).toBe(HexaUrlErrorCode.StringTooShort);
        }
      }
      expect(errorThrown).toBe(true);
    });

    it("should provide descriptive error messages", () => {
      let errorThrown = false;
      try {
        validate(
          "test--test",
          createConfig({
            delimiter: createDelimiterRules({ allowConsecutiveHyphens: false }),
          }),
        );
      } catch (error) {
        errorThrown = true;
        expect(error instanceof HexaUrlError).toBe(true);
        if (error instanceof HexaUrlError) {
          expect(error.message).toContain("consecutive");
        }
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe("String Safety Check", () => {
    it("should identify safe strings", () => {
      expect(isEncodingSafe("hello")).toBe(true);
      expect(isEncodingSafe("test-123")).toBe(true);
    });

    it("should identify unsafe strings", () => {
      expect(isEncodingSafe("🦊")).toBe(false);
      expect(isEncodingSafe("a".repeat(50))).toBe(false);
    });
  });

  describe("Byte Size Handling", () => {
    it("should respect byte size constraints", () => {
      const smallByteSize = 8; // 8 bytes = ~10 chars
      const largeByteSize = 32; // 32 bytes = ~42 chars

      expect(() => validate("a".repeat(11), undefined, smallByteSize)).toThrow(
        HexaUrlError,
      );
      expect(() =>
        validate("a".repeat(10), undefined, smallByteSize),
      ).not.toThrow();

      expect(() => validate("a".repeat(43), undefined, largeByteSize)).toThrow(
        HexaUrlError,
      );
      expect(() =>
        validate("a".repeat(42), undefined, largeByteSize),
      ).not.toThrow();
    });
  });
});

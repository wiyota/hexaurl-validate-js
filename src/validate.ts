import { Config, IdentifierComposition, DelimiterRules } from "./config";
import { HexaUrlError, HexaUrlErrorCode } from "./error";

// RegExp patterns for validation
const PATTERNS = {
  ALPHANUMERIC: /^[0-9A-Za-z]+$/,
  ALPHANUMERIC_HYPHEN: /^[0-9A-Za-z-]+$/,
  ALPHANUMERIC_UNDERSCORE: /^[0-9A-Za-z_]+$/,
  ALPHANUMERIC_HYPHEN_UNDERSCORE: /^[0-9A-Za-z\-_]+$/,
};

/**
 * Calculates the length of the decoded string based on the number of input bytes.
 */
function calcStrLen(n: number): number {
  return (n * 4) / 3;
}

/**
 * Validates a HexaURL string with default configuration.
 */
export function validate(input: string, byteSize: number): void {
  validateWithConfig(input, Config.create(), byteSize);
}

/**
 * Validates a HexaURL string with custom configuration.
 */
export function validateWithConfig(
  input: string,
  config: Config,
  byteSize: number,
): void {
  const len = input.length;

  // Check minimum length
  if (config.minLength !== null && len < config.minLength) {
    throw new HexaUrlError(
      `String is too short: minimum length is ${config.minLength} characters`,
      HexaUrlErrorCode.StringTooShort,
    );
  }

  // Check maximum length
  const effectiveMax =
    config.maxLength !== null
      ? Math.min(config.maxLength, calcStrLen(byteSize))
      : calcStrLen(byteSize);

  if (len > effectiveMax) {
    throw new HexaUrlError(
      `String is too long: maximum length is ${effectiveMax} characters`,
      HexaUrlErrorCode.StringTooLong,
    );
  }

  // Character validation based on identifier composition
  const pattern = getPatternForIdentifier(config.identifier);
  if (!pattern.test(input)) {
    throw new HexaUrlError(
      "Invalid character in this type of HexaURL",
      HexaUrlErrorCode.InvalidCharacter,
    );
  }

  // Delimiter rules validation
  if (config.delimiter) {
    validateDelimiters(input, config.delimiter);
  }
}

/**
 * Returns the appropriate RegExp pattern for the given identifier composition.
 */
function getPatternForIdentifier(identifier: IdentifierComposition): RegExp {
  switch (identifier) {
    case IdentifierComposition.Alphanumeric:
      return PATTERNS.ALPHANUMERIC;
    case IdentifierComposition.AlphanumericHyphen:
      return PATTERNS.ALPHANUMERIC_HYPHEN;
    case IdentifierComposition.AlphanumericUnderscore:
      return PATTERNS.ALPHANUMERIC_UNDERSCORE;
    case IdentifierComposition.AlphanumericHyphenUnderscore:
      return PATTERNS.ALPHANUMERIC_HYPHEN_UNDERSCORE;
  }
}

/**
 * Validates delimiter rules for the input string.
 */
function validateDelimiters(input: string, rules: DelimiterRules): void {
  // Check leading/trailing delimiters
  if (!rules.allowLeadingTrailingHyphens) {
    if (input.startsWith("-") || input.endsWith("-")) {
      throw new HexaUrlError(
        "Hyphens cannot start or end this type of HexaURL",
        HexaUrlErrorCode.LeadingTrailingHyphen,
      );
    }
  }

  if (!rules.allowLeadingTrailingUnderscores) {
    if (input.startsWith("_") || input.endsWith("_")) {
      throw new HexaUrlError(
        "Underscores cannot start or end this type of HexaURL",
        HexaUrlErrorCode.LeadingTrailingUnderscore,
      );
    }
  }

  // Check consecutive delimiters
  if (!rules.allowConsecutiveHyphens) {
    if (input.includes("--")) {
      throw new HexaUrlError(
        "This type of HexaURL cannot include consecutive hyphens",
        HexaUrlErrorCode.ConsecutiveHyphens,
      );
    }
  }

  if (!rules.allowConsecutiveUnderscores) {
    if (input.includes("__")) {
      throw new HexaUrlError(
        "This type of HexaURL cannot include consecutive underscores",
        HexaUrlErrorCode.ConsecutiveUnderscores,
      );
    }
  }

  // Check adjacent different delimiters
  if (!rules.allowAdjacentHyphenUnderscore) {
    if (input.includes("-_") || input.includes("_-")) {
      throw new HexaUrlError(
        "This type of HexaURL cannot include adjacent hyphens and underscores",
        HexaUrlErrorCode.AdjacentHyphenUnderscore,
      );
    }
  }
}

/**
 * Checks if the input string is safe for HexaURL encoding.
 */
export function isEncodingSafe(input: string, byteSize: number): boolean {
  return input.length <= calcStrLen(byteSize) && /^[\x00-\x7F]*$/.test(input);
}

/** Custom error class for HexaURL validation errors */
export class HexaUrlError extends Error {
  constructor(
    message: string,
    /** Error code identifying the specific validation failure */
    public readonly code: HexaUrlErrorCode,
  ) {
    super(message);
  }
}

/** Enum of possible HexaURL validation error codes */
export enum HexaUrlErrorCode {
  /** String exceeds maximum length */
  StringTooLong,
  /** String is shorter than minimum length */
  StringTooShort,
  /** Byte array exceeds maximum length */
  BytesTooLong,
  /** Byte array is shorter than minimum length */
  BytesTooShort,
  /** Contains invalid characters */
  InvalidCharacter,
  /** Configuration is invalid */
  InvalidConfig,
  /** Length is invalid for encoding type */
  InvalidLength,
  /** Has hyphens at start/end when not allowed */
  LeadingTrailingHyphen,
  /** Has underscores at start/end when not allowed */
  LeadingTrailingUnderscore,
  /** Contains consecutive hyphens when not allowed */
  ConsecutiveHyphens,
  /** Contains consecutive underscores when not allowed */
  ConsecutiveUnderscores,
  /** Has adjacent hyphen+underscore when not allowed */
  AdjacentHyphenUnderscore,
}

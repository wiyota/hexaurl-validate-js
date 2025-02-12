export class HexaUrlError extends Error {
  constructor(
    message: string,
    public readonly code: HexaUrlErrorCode,
  ) {
    super(message);
  }
}

export enum HexaUrlErrorCode {
  StringTooLong,
  StringTooShort,
  BytesTooLong,
  BytesTooShort,
  InvalidCharacter,
  InvalidLength,
  LeadingTrailingHyphen,
  LeadingTrailingUnderscore,
  ConsecutiveHyphens,
  ConsecutiveUnderscores,
  AdjacentHyphenUnderscore,
}

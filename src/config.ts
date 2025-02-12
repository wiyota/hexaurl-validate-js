/**
 * Valid options for identifier composition.
 */
export enum IdentifierComposition {
  /** Letters and digits only */
  Alphanumeric = "alphanumeric",
  /** Letters, digits and hyphen */
  AlphanumericHyphen = "alphanumeric-hyphen",
  /** Letters, digits and underscore */
  AlphanumericUnderscore = "alphanumeric-underscore",
  /** Letters, digits, hyphen and underscore */
  AlphanumericHyphenUnderscore = "alphanumeric-hyphen-underscore",
}

/**
 * Rules for allowed delimiters.
 */
export interface DelimiterRules {
  allowLeadingTrailingHyphens: boolean;
  allowLeadingTrailingUnderscores: boolean;
  allowConsecutiveHyphens: boolean;
  allowConsecutiveUnderscores: boolean;
  allowAdjacentHyphenUnderscore: boolean;
}

/**
 * Configuration for validation rules.
 */
export interface ConfigOptions {
  minLength?: number | null;
  maxLength?: number | null;
  identifier?: IdentifierComposition;
  delimiter?: DelimiterRules | null;
}

export class Config {
  private static readonly DEFAULT_MIN_LENGTH = 3;

  constructor(
    public readonly minLength: number | null = Config.DEFAULT_MIN_LENGTH,
    public readonly maxLength: number | null = null,
    public readonly identifier: IdentifierComposition = IdentifierComposition.AlphanumericHyphen,
    public readonly delimiter: DelimiterRules | null = null,
  ) {
    this.validate();
  }

  static create(options: ConfigOptions = {}): Config {
    return new Config(
      options.minLength ?? Config.DEFAULT_MIN_LENGTH,
      options.maxLength ?? null,
      options.identifier ?? IdentifierComposition.AlphanumericHyphen,
      options.delimiter ?? null,
    );
  }

  static minimal(): Config {
    return new Config(
      null,
      null,
      IdentifierComposition.AlphanumericHyphenUnderscore,
      createAllowedDelimiterRules(),
    );
  }

  private validate(): void {
    if (
      this.minLength !== null &&
      this.maxLength !== null &&
      this.minLength > this.maxLength
    ) {
      throw new Error("Minimum length cannot be greater than maximum length");
    }
  }

  toString(): string {
    return `Config(minLength=${this.minLength}, maxLength=${this.maxLength}, identifier=${this.identifier}, delimiter=${JSON.stringify(this.delimiter)})`;
  }
}

export const createDelimiterRules = (
  options: Partial<DelimiterRules> = {},
): DelimiterRules => ({
  allowLeadingTrailingHyphens: false,
  allowLeadingTrailingUnderscores: false,
  allowConsecutiveHyphens: false,
  allowConsecutiveUnderscores: false,
  allowAdjacentHyphenUnderscore: false,
  ...options,
});

export const createAllowedDelimiterRules = (): DelimiterRules => ({
  allowLeadingTrailingHyphens: true,
  allowLeadingTrailingUnderscores: true,
  allowConsecutiveHyphens: true,
  allowConsecutiveUnderscores: true,
  allowAdjacentHyphenUnderscore: true,
});

export const createConfig = (options: ConfigOptions = {}): Config => {
  return Config.create(options);
};

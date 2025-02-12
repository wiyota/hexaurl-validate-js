/** Valid options for identifier composition */
export enum IdentifierComposition {
  /** Letters and digits */
  Alphanumeric,
  /** Letters, digits and hyphen */
  AlphanumericHyphen,
  /** Letters, digits and underscore */
  AlphanumericUnderscore,
  /** Letters, digits, hyphen and underscore */
  AlphanumericHyphenUnderscore,
}

/** Rules for how delimiters can be used */
export interface DelimiterRules {
  allowLeadingTrailingHyphens: boolean;
  allowLeadingTrailingUnderscores: boolean;
  allowConsecutiveHyphens: boolean;
  allowConsecutiveUnderscores: boolean;
  allowAdjacentHyphenUnderscore: boolean;
}

/** Optional configuration parameters */
export interface ConfigOptions {
  minLength?: number | null;
  maxLength?: number | null;
  identifier?: IdentifierComposition;
  delimiter?: DelimiterRules | null;
}

/** Configuration for validation rules */
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

  /** Creates a new Config from options */
  static create(options: ConfigOptions = {}): Config {
    return new Config(
      options.minLength ?? Config.DEFAULT_MIN_LENGTH,
      options.maxLength ?? null,
      options.identifier ?? IdentifierComposition.AlphanumericHyphen,
      options.delimiter ?? null,
    );
  }

  /** Creates a minimal config with relaxed rules */
  static minimal(): Config {
    return new Config(
      null,
      null,
      IdentifierComposition.AlphanumericHyphenUnderscore,
      createAllowedDelimiterRules(),
    );
  }

  /** Validates the config values */
  private validate(): void {
    if (
      this.minLength !== null &&
      this.maxLength !== null &&
      this.minLength > this.maxLength
    ) {
      throw new Error("Minimum length cannot be greater than maximum length");
    }
  }

  toString = (): string =>
    `Config(minLength=${this.minLength}, maxLength=${this.maxLength}, identifier=${this.identifier}, delimiter=${JSON.stringify(this.delimiter)})`;
}

/** Creates delimiter rules with specified options */
export const createDelimiterRules = (
  o: Partial<DelimiterRules> = {},
): DelimiterRules => ({
  allowLeadingTrailingHyphens: false,
  allowLeadingTrailingUnderscores: false,
  allowConsecutiveHyphens: false,
  allowConsecutiveUnderscores: false,
  allowAdjacentHyphenUnderscore: false,
  ...o,
});

/** Creates delimiter rules with all options enabled */
export const createAllowedDelimiterRules = (): DelimiterRules => ({
  allowLeadingTrailingHyphens: true,
  allowLeadingTrailingUnderscores: true,
  allowConsecutiveHyphens: true,
  allowConsecutiveUnderscores: true,
  allowAdjacentHyphenUnderscore: true,
});

/** Creates a new Config with provided options */
export const createConfig = (o: ConfigOptions = {}): Config => Config.create(o);

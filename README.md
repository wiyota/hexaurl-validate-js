# hexaurl-validate

![HexaURL validate logo](https://github.com/perforate-org/hexaurl/blob/main/assets/validate_logo.png?raw=true)

A TypeScript library for validating [HexaURL](https://github.com/perforate-org/hexaurl) strings with configurable rules.

This library has no dependencies, so it's lightweight and simple to integrate. It also helps protect against vulnerabilities in unmaintained packages and avoids deprecation or version conflicts.

## Installation

```bash
npm install hexaurl-validate
```

## Usage

### Basic Validation

```ts
import { validate } from "hexaurl-validate";

let input = "my-hexaurl";

// Basic validation with default configuration (16 bytes)
try {
  validate(input);
  console.log("Validation successful!");
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
}
```

### Custom Configuration

```ts
import { validate, createConfig, Composition } from "hexaurl-validate";

// Custom configuration with minimum length of 4 and maximum length of 40
// Identifier composition: Alphanumeric, hyphen and underscore
// Delimiter rules: Allow leading/trailing hyphens and underscores, consecutive hyphens and underscores
const config = createConfig({
  minLength: 4,
  maxLength: 40,
  composition: Composition.AlphanumericHyphenUnderscore,
  delimiter: {
    allowLeadingTrailingHyphens: true,
    allowLeadingTrailingUnderscores: true,
    allowConsecutiveHyphens: true,
    allowConsecutiveUnderscores: true,
    allowAdjacentHyphenUnderscore: false,
  },
});

// Validate with custom configuration and 32 bytes (can contain 42 characters at most)
validate("my_custom-hexa__", config, 32);
```

### Checking String Safety

```ts
import { isEncodingSafe } from "hexaurl-validate";

const isSafe = isEncodingSafe("my-string");
console.log(isSafe); // true/false
```

## API Reference

### Functions

#### `validate(input: string, config?: Config, byteSize?: number): void`

Validates a HexaURL string. If no configuration is provided, uses default configuration. If no byte size is provided, uses 16 bytes. Throws `HexaUrlError` if validation fails.

#### `isEncodingSafe(input: string, byteSize?: number): boolean`

Checks if the input string is safe for HexaURL encoding. If no byte size is provided, uses 16 bytes.

### Configuration

#### `Composition`

Enum for valid identifier composition options:

- `Alphanumeric`: Letters and digits only
- `AlphanumericHyphen`: Letters, digits and hyphen
- `AlphanumericUnderscore`: Letters, digits and underscore
- `AlphanumericHyphenUnderscore`: Letters, digits, hyphen and underscore

#### `DelimiterRules`

Interface for configuring delimiter rules:

```typescript
interface DelimiterRules {
  allowLeadingTrailingHyphens: boolean;
  allowLeadingTrailingUnderscores: boolean;
  allowConsecutiveHyphens: boolean;
  allowConsecutiveUnderscores: boolean;
  allowAdjacentHyphenUnderscore: boolean;
}
```

### Helper Functions

#### `createConfig(options: ConfigOptions): Config`

Creates a configuration object with custom options.

#### `createDelimiterRules(options: Partial<DelimiterRules>): DelimiterRules`

Creates delimiter rules with custom options.

#### `createAllowedDelimiterRules(): DelimiterRules`

Creates delimiter rules with all options set to true.

### Error Handling

The library throws `HexaUrlError` with specific error codes (`HexaUrlErrorCode`) when validation fails:

```typescript
try {
  validate("invalid--url");
} catch (error) {
  if (error instanceof HexaUrlError) {
    console.log(error.code); // HexaUrlErrorCode
    console.log(error.message); // Error description
  }
}
```

## License

This project is licensed under either of [Apache License, Version 2.0](./LICENSE-APACHE) or [MIT License](./LICENSE-MIT) at your option.

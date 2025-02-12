/*!
 * hexaurl-validate-js
 * Copyright (c) 2025 Inomoto, Yota
 * Released under the MIT and Apache 2.0 Licenses
 * https://opensource.org/licenses/MIT
 * https://www.apache.org/licenses/LICENSE-2.0
 */

// Main validation functions
export { validate, isEncodingSafe } from "./validate";

// Configuration
export {
  Config,
  ConfigOptions,
  IdentifierComposition,
  DelimiterRules,
  createConfig,
  createDelimiterRules,
  createAllowedDelimiterRules,
} from "./config";

// Error types
export { HexaUrlError, HexaUrlErrorCode } from "./error";

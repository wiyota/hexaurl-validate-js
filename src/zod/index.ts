/**
 * @packageDocumentation
 * ## HexaURL validation extension for the Zod schema
 *
 * This module adds a new hexaurl method to the Zod String schema.
 * This method validates that a string is in the HexaURL format, based on the specified byteSize and config.
 *
 * @remarks
 * - The config parameter is optional and can be customized as needed.
 * - The default value of byteSize is 16 (can contain up to 21 characters).
 *
 * @example
 * // Basic HexaURL validation
 *
 * import { z } from "zod";
 * import "hexaurl-validate/zod"; // Ensure the module is imported to use the hexaurl method
 *
 * const schema = z.string().hexaurl();
 *
 * schema.parse("abc-123"); // ✅ OK
 *
 * try {
 *   schema.parse("invalid-hexaurl!");
 * } catch (err) {
 *   console.log(err.message); // ❌ Invalid HexaURL format
 * }
 *
 * @example
 * // Combine with other Zod validations with Config
 *
 * import { z } from "zod";
 * import { createConfig } from "hexaurl-validate";
 * import "hexaurl-validate/zod";
 *
 * const config = createConfig({ minLength: 5 });
 *
 * const customSchema = z.string()
 *   .regex(/[0-9]$/, {
 *     message: "The string must end with a digit",
 *   })
 *   .hexaurl(config, 8) // 8-byte HexaURL can contain up to 10 characters
 *   .transform(hexaurl => `https://example.com/${hexaurl}`);
 *
 * const result = customSchema.safeParse("abc-123");
 * console.log(result.success); // true
 * console.log(result.data.href); // https://example.com/abc-123
 * console.log(result.data.pathname); // /abc-123
 *
 * @module
 */

import { ZodString, ZodEffects } from "zod";
import { validate, Config, HexaUrlError } from "../index";

declare module "zod" {
  interface ZodString {
    hexaurl(
      config?: Config,
      byteSize?: number,
    ): ZodEffects<ZodString, string, string>;
  }
}

ZodString.prototype.hexaurl = function (
  config: Config = Config.create(),
  byteSize: number = 16,
) {
  // The type returned by superRefine is ZodEffects<... > but treated as this by casting
  return this.superRefine((value: string, ctx) => {
    try {
      validate(value, config, byteSize);
    } catch (err) {
      if (err instanceof HexaUrlError) {
        ctx.addIssue({
          code: "custom",
          message: err.message + ` (code: ${err.code})`,
        });
      } else {
        ctx.addIssue({
          code: "custom",
          message: "Unknown error during HexaURL validation",
        });
      }
    }
  });
};

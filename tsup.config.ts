import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    ".": "src/index.ts",
    zod: "src/zod/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
});

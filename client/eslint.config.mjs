// client/eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname, resolvePluginsRelativeTo: __dirname });

const isCI = process.env.CI === "true";

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // In CI: error on console (except warn/error). Locally: turn it off.
      "no-console": isCI ? ["error", { allow: ["warn", "error"] }] : "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/react-in-jsx-scope": "off"
    }
  }
];

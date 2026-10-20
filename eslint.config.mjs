import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import prettierConfig from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import jestDom from "eslint-plugin-jest-dom";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextPlugin from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

const testingLibraryConfig = testingLibrary.configs["flat/react"];
const jestDomConfig = jestDom.configs["flat/recommended"];

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  {
    name: "sandicts/next-react-foundation",
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": fixupPluginRules(nextPlugin),
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      "import/resolver": {
        node: true,
        typescript: {
          project: "./tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    name: "sandicts/testing-library",
    files: ["src/**/*.test.{ts,tsx}", "test/**/*.{ts,tsx}"],
    plugins: {
      ...testingLibraryConfig.plugins,
      ...jestDomConfig.plugins,
    },
    rules: {
      ...testingLibraryConfig.rules,
      ...jestDomConfig.rules,
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated API client:
    "src/lib/api/generated/**",
    // Test artifacts:
    "blob-report/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  prettierConfig,
  {
    name: "sandicts/tailwindcss",
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      "tailwindcss/classnames-order": "error",
      "tailwindcss/no-contradicting-classname": "error",
    },
  },
  {
    name: "sandicts/readable-component-style-files",
    files: ["src/components/**/*.styles.{ts,tsx}"],
    rules: {
      "max-len": [
        "error",
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
    },
  },
]);

export default eslintConfig;

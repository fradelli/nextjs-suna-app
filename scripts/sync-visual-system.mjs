import { buttonVariants } from "@fradelli/ui/button";
import tailwindcss from "@tailwindcss/postcss";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const require = createRequire(import.meta.resolve("@tailwindcss/postcss"));
const postcss = require("postcss");
const targetPath = resolve(
  projectRoot,
  "docs/frontend/prototypes/shared/sandicts-visual-tokens.css",
);
const checkOnly = process.argv.includes("--check");
const prototypeConsumers = [
  {
    directory: "app-shells",
    styleEntry: "styles.css",
    styleHref: "./styles.css",
  },
  {
    directory: "global-states",
    styleEntry: "styles.css",
    styleHref: "./styles.css",
  },
  {
    directory: "auth-sign-in",
    styleEntry: "styles.css",
    styleHref: "./styles.css",
  },
  {
    directory: "auth-magic-link",
    styleEntry: "../auth-sign-in/styles.css",
    styleHref: "../auth-sign-in/styles.css",
  },
];

async function buildArtifact() {
  const buttonRules = Object.entries({
    ".button": { variant: "outline", size: "lg" },
    ".button--primary": { variant: "default", size: "lg" },
    ".button--secondary": { variant: "secondary", size: "lg" },
    ".button--ghost": { variant: "ghost", size: "lg" },
    ".button--compact": { variant: "outline", size: "sm" },
  })
    .map(([selector, options]) => {
      const utilities = buttonVariants(options)
        .split(" ")
        .filter((name) => name !== "fd-focus-managed")
        .join(" ");
      return `${selector} { @apply ${utilities}; }`;
    })
    .join("\n");
  const entry = `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@500&display=swap");
@import "tailwindcss" source(none);
@import "@fradelli/ui/styles.css";
@import "./docs/frontend/prototypes/shared/sandicts-brand-tokens.css";
@import "./docs/frontend/prototypes/shared/prototype-theme.css";
@source "./node_modules/@fradelli/ui/dist";
@source "./docs/frontend/prototypes/**/*.html";
@source "./docs/frontend/prototypes/**/*.js";
${buttonRules}
`;
  const result = await postcss([tailwindcss({ optimize: false })]).process(
    entry,
    {
      from: resolve(projectRoot, "prototype-entry.css"),
    },
  );
  return `/* Generated from @fradelli/ui by scripts/sync-visual-system.mjs. Do not edit. */\n${result.css.trimEnd()}\n`;
}

async function validatePrototypeConsumers() {
  const results = await Promise.all(
    prototypeConsumers.map(async ({ directory, styleEntry, styleHref }) => {
      const basePath = resolve(
        projectRoot,
        "docs/frontend/prototypes",
        directory,
      );
      const [styles, document] = await Promise.all([
        readFile(resolve(basePath, styleEntry), "utf8"),
        readFile(resolve(basePath, "index.html"), "utf8"),
      ]);

      return {
        directory,
        importsSharedTokens: styles.includes(
          '@import url("../shared/sandicts-visual-tokens.css");',
        ),
        linksStyleEntry: document.includes(`href="${styleHref}"`),
        activatesDarkTheme: /<html\b[^>]*\bclass=["'][^"']*\bdark\b/.test(
          document,
        ),
      };
    }),
  );
  const invalid = results.filter(
    ({ importsSharedTokens, linksStyleEntry, activatesDarkTheme }) =>
      !importsSharedTokens || !linksStyleEntry || !activatesDarkTheme,
  );

  if (invalid.length > 0) {
    throw new Error(
      `Prototype visual-system contract is incomplete: ${invalid
        .map(({ directory }) => directory)
        .join(", ")}.`,
    );
  }
}

const expected = await buildArtifact();
let current = "";

try {
  current = await readFile(targetPath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

if (checkOnly) {
  if (current !== expected) {
    console.error(
      "Visual-system artifacts are out of sync. Run npm run visual-system:sync.",
    );
    process.exitCode = 1;
  } else {
    console.log("Visual-system artifacts are in sync.");
  }
} else if (current === expected) {
  console.log("Visual-system artifacts are already in sync.");
} else {
  await writeFile(targetPath, expected, "utf8");
  console.log(
    "Updated docs/frontend/prototypes/shared/sandicts-visual-tokens.css.",
  );
}

await validatePrototypeConsumers();

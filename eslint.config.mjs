// eslint.config.mjs
import globals from "globals";
import tsparser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
    ...obsidianmd.configs.recommended,
    globalIgnores([
        "test/",
        "**/*.js",
        "*.mjs",
        "package.json"
    ]),
    {
        files: ["src/**/*.ts"],
        plugins: { obsidianmd },
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.json"
            },
            globals: { ...globals.node, ...globals.browser },
        },
        rules: {
            "obsidianmd/ui/sentence-case": [
                "warn",
                {
                    brands: ["collapse: none", "Microsoft", "Document"],
                    acronyms: [],
                    enforceCamelCaseLower: true,
                },
            ],
        },
    },
]);

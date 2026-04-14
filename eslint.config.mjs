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
            globals: {
                ...globals.node,
                ...globals.browser,
                // Obsidian global DOM augmentations (declared in obsidian.d.ts global namespace)
                createEl: "readonly",
                createDiv: "readonly",
                createSpan: "readonly",
                createSvg: "readonly",
                createFragment: "readonly",
                fish: "readonly",
                fishAll: "readonly",
                ajax: "readonly",
                ajaxPromise: "readonly",
                activeWindow: "readonly",
                activeDocument: "readonly",
            },
        },
        rules: {
            "obsidianmd/ui/sentence-case": [
                "warn",
                {
                    brands: ["collapse: none", "note", "abstract", "title"],
                    acronyms: [],
                    enforceCamelCaseLower: true,
                },
            ],
        },
    },
]);

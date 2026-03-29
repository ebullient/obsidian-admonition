import { Notice } from "obsidian";
import type { Admonition } from "../@types";

function startsWithAny(str: string, needles: string[]) {
    for (let i = 0; i < needles.length; i++) {
        if (str.startsWith(needles[i])) {
            return i;
        }
    }

    return false;
}

export function getParametersFromSource(
    type: string,
    src: string,
    admonition: Admonition,
) {
    const admonitionTitle =
        admonition.title ?? type[0].toUpperCase() + type.slice(1).toLowerCase();
    const keywordTokens = [
        "title:",
        "collapse:",
        "icon:",
        "color:",
        "metadata:",
    ];

    const keywords = ["title", "collapse", "icon", "color", "metadata"];

    const lines = src.split("\n");

    let skipLines = 0;

    const params: { [k: string]: string } = {};

    for (let i = 0; i < lines.length; i++) {
        const keywordIndex = startsWithAny(lines[i], keywordTokens);

        if (keywordIndex === false) {
            break;
        }

        const foundKeyword = keywords[keywordIndex];

        if (params[foundKeyword] !== undefined) {
            break;
        }

        params[foundKeyword] = lines[i]
            .slice(keywordTokens[keywordIndex].length)
            .trim();
        ++skipLines;
    }

    let { title, collapse, icon, color, metadata } = params;

    // If color is in RGB format
    if (color?.startsWith("rgb")) {
        color = color.slice(4, -1);
    }

    // If color is in Hex format, convert it to RGB
    if (color?.startsWith("#")) {
        const hex = color.slice(1);
        const bigint = Number.parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        color = `${r}, ${g}, ${b}`;
    }

    // If color is in HSL format, convert it to RGB
    if (color?.startsWith("hsl")) {
        const [h, s, l] = color
            .slice(4, -1)
            .split(",")
            .map((str) => Number(str.replace("%", "").trim()));
        const [r, g, b] = hslToRgb(h, s, l);
        color = `${r}, ${g}, ${b}`;
    }

    // If color is in HSB format, convert it to RGB
    if (color && (color.startsWith("hsb") || color.startsWith("hsv"))) {
        const [h, s, v] = color
            .slice(4, -1)
            .split(",")
            .map((str) => Number(str.replace("%", "").trim()));
        const [r, g, b] = hsbToRgb(h, s, v);
        color = `${r}, ${g}, ${b}`;
    }

    const content = lines.slice(skipLines).join("\n");

    /**
     * If the admonition should collapse, but something other than open or closed was provided, set to closed.
     */
    if (
        collapse !== undefined &&
        collapse !== "none" &&
        collapse !== "open" &&
        collapse !== "closed"
    ) {
        collapse = "closed";
    }

    if (!("title" in params)) {
        if (!admonition.noTitle) {
            title = admonitionTitle;
        }
    }
    /**
     * If the admonition should collapse, but title was blanked, set the default title.
     */
    if (
        title &&
        title.trim() === "" &&
        collapse !== undefined &&
        collapse !== "none"
    ) {
        title = admonitionTitle;
        new Notice("An admonition must have a title if it is collapsible.");
    }

    return { title, collapse, content, icon, color, metadata };
}

function hslToRgb(h: number, s: number, l: number) {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    let r = 0;
    let g = 0;
    let b = 0;

    if (sNorm === 0) {
        r = lNorm;
        g = lNorm;
        b = lNorm; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            const tNorm = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
            if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
            if (tNorm < 1 / 2) return q;
            if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
            return p;
        };
        const q =
            lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;
        r = hue2rgb(p, q, hNorm + 1 / 3);
        g = hue2rgb(p, q, hNorm);
        b = hue2rgb(p, q, hNorm - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsbToRgb(h: number, s: number, b: number) {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const bNorm = b / 100;
    let r = 0;
    let g = 0;
    let bb = 0;
    const i = Math.floor(hNorm * 6);
    const f = hNorm * 6 - i;
    const p = bNorm * (1 - sNorm);
    const q = bNorm * (1 - f * sNorm);
    const t = bNorm * (1 - (1 - f) * sNorm);
    switch (i % 6) {
        case 0:
            r = bNorm;
            g = t;
            bb = p;
            break;
        case 1:
            r = q;
            g = bNorm;
            bb = p;
            break;
        case 2:
            r = p;
            g = bNorm;
            bb = t;
            break;
        case 3:
            r = p;
            g = q;
            bb = bNorm;
            break;
        case 4:
            r = t;
            g = p;
            bb = bNorm;
            break;
        case 5:
            r = bNorm;
            g = p;
            bb = q;
            break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(bb * 255)];
}

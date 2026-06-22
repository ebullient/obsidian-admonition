import type { Admonition } from "../@types";
import type ObsidianAdmonition from "../main";

const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.";

/**
 * Build a live admonition preview element and append it to `parent`.
 * Returns the element so callers can hold a reference for later in-place swaps.
 * Pass `collapse` to show the fold affordance (e.g. in the insert modal).
 */
export function buildAdmonitionPreview(
    parent: HTMLElement,
    plugin: ObsidianAdmonition,
    admonition: Admonition,
    title: string,
    collapse?: string,
): HTMLElement {
    parent.empty();
    const el = plugin.getAdmonitionElement(
        admonition.type,
        title,
        plugin.isIconWithCss(admonition) ? {} : admonition.icon,
        plugin.shouldInjectColor(admonition) ? admonition.color : undefined,
        collapse,
    );
    el.createDiv("callout-content admonition-content").createEl("p", {
        text: LOREM_IPSUM,
    });
    parent.appendChild(el);
    return el;
}

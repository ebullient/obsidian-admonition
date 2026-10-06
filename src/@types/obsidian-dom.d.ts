// Obsidian augments `Window` with the same DOM helper methods it adds to
// `Node` (createEl, createDiv, createSpan, createSvg, createFragment), via
// its `enhance.js` at runtime. The published `obsidian` package types do not
// declare this augmentation, so it's added here to type `activeWindow.createEl(...)`.
declare global {
    interface Window {
        createEl<K extends keyof HTMLElementTagNameMap>(
            tag: K,
            o?: DomElementInfo | string,
            callback?: (el: HTMLElementTagNameMap[K]) => void,
        ): HTMLElementTagNameMap[K];
    }
}

export {};

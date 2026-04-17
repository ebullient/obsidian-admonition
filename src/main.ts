import {
    addIcon,
    editorLivePreviewField,
    type MarkdownPostProcessor,
    type MarkdownPostProcessorContext,
    MarkdownPreviewRenderer,
    MarkdownRenderChild,
    MarkdownRenderer,
    MarkdownView,
    Notice,
    Plugin,
    setIcon,
} from "obsidian";
import type {
    Admonition,
    AdmonitionIconDefinition,
    AdmonitionSettings,
} from "./@types";
import {
    ADD_ADMONITION_COMMAND_ICON,
    ADD_COMMAND_NAME,
    ADMONITION_MAP,
    getParametersFromSource,
    REMOVE_ADMONITION_COMMAND_ICON,
    REMOVE_COMMAND_NAME,
    SPIN_ICON,
    SPIN_ICON_NAME,
    WARNING_ICON,
    WARNING_ICON_NAME,
} from "./util";

declare module "obsidian" {
    interface App {
        customCss: {
            getSnippetPath(file: string): string;
            readSnippets(): void;
            setCssEnabledStatus(snippet: string, enabled: boolean): void;
        };
        plugins: {
            getPluginFolder(): string;
        };
    }
    interface MarkdownPreviewView {
        renderer: MarkdownPreviewRenderer;
    }
    interface MarkdownPreviewRenderer {
        onCheckboxClick: (evt: MouseEvent, el: HTMLInputElement) => void;
    }
    interface Editor {
        cm: {
            state: EditorState;
            focus: () => void;
            posAtDOM: (el: HTMLElement) => number;
            dispatch: (tr: TransactionSpec) => void;
        };
    }
    interface Workspace {
        iterateCodeMirrors(callback: (cm: CodeMirror.Editor) => void): void;
    }
}

import type { EditorState, TransactionSpec } from "@codemirror/state";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import CalloutManager from "./callout/manager";
import { type DownloadableIconPack, IconManager } from "./icons/manager";
import { InsertAdmonitionModal } from "./modal";
import AdmonitionSetting from "./settings";
import { AdmonitionSuggest, CalloutSuggest } from "./suggest/suggest";

const DEFAULT_APP_SETTINGS: AdmonitionSettings = {
    userAdmonitions: {},
    syntaxHighlight: false,
    copyButton: false,
    version: "",
    autoCollapse: false,
    defaultCollapseType: "open",
    injectColor: true,
    parseTitles: true,
    dropShadow: true,
    hideEmpty: false,
    icons: [],
    useFontAwesome: true,
    rpgDownloadedOnce: false,
    useSnippet: false,
    snippetPath: `custom-admonitions.${[...Array(6).keys()]
        .map(() => ((16 * Math.random()) | 0).toString(16))
        .join("")}`,
};

export default class ObsidianAdmonition extends Plugin {
    data: AdmonitionSettings;

    postprocessors: Map<string, MarkdownPostProcessor> = new Map();

    iconManager = new IconManager(this);
    calloutManager: CalloutManager;

    get types() {
        return Object.keys(this.admonitions);
    }
    get admonitionArray() {
        return Object.keys(this.admonitions).map((key) => {
            return {
                ...this.admonitions[key],
                type: key,
            };
        });
    }

    isIconWithCss(admonition: Admonition): boolean {
        return admonition.iconWithCss === true;
    }

    shouldInjectColor(admonition: Admonition): boolean {
        if (admonition.injectColor !== undefined) {
            return admonition.injectColor;
        }
        return this.data.injectColor;
    }

    async onload(): Promise<void> {
        console.debug("Obsidian Admonition loaded");

        this.postprocessors = new Map();

        await this.loadSettings();
        await this.iconManager.load();

        this.app.workspace.onLayoutReady(() => {
            this.calloutManager = new CalloutManager(this);
            this.addChild(this.calloutManager);

            this.registerEditorSuggest(new AdmonitionSuggest(this));
            this.registerEditorSuggest(new CalloutSuggest(this));

            this.registerMarkdownPostProcessor(
                this.calloutManager.calloutProcessor.bind(
                    this.calloutManager,
                ) as MarkdownPostProcessor,
            );

            Object.keys(this.admonitions).forEach((type) => {
                this.registerType(type);
            });

            this.addSettingTab(new AdmonitionSetting(this.app, this));

            addIcon(ADD_COMMAND_NAME, ADD_ADMONITION_COMMAND_ICON);
            addIcon(REMOVE_COMMAND_NAME, REMOVE_ADMONITION_COMMAND_ICON);
            addIcon(WARNING_ICON_NAME, WARNING_ICON);
            addIcon(SPIN_ICON_NAME, SPIN_ICON);

            /** Add generic commands. */
            this.addCommand({
                id: "collapse-admonitions",
                name: "Collapse all",
                checkCallback: (checking) => {
                    // checking if the command should appear in the Command Palette
                    if (checking) {
                        // make sure the active view is a MarkdownView.
                        return !!this.app.workspace.getActiveViewOfType(
                            MarkdownView,
                        );
                    }
                    const view =
                        this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view || !(view instanceof MarkdownView)) return;

                    const admonitions =
                        view.contentEl.querySelectorAll<HTMLElement>(
                            ".callout.is-collapsible:not(.is-collapsed)",
                        );
                    for (let i = 0; i < admonitions.length; i++) {
                        const admonition = admonitions[i];
                        this.calloutManager.collapse(admonition);
                    }
                },
            });
            this.addCommand({
                id: "open-admonitions",
                name: "Open all",
                checkCallback: (checking) => {
                    // checking if the command should appear in the Command Palette
                    if (checking) {
                        // make sure the active view is a MarkdownView.
                        return !!this.app.workspace.getActiveViewOfType(
                            MarkdownView,
                        );
                    }
                    const view =
                        this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view || !(view instanceof MarkdownView)) return;

                    const admonitions =
                        view.contentEl.querySelectorAll<HTMLElement>(
                            ".callout.is-collapsible.is-collapsed",
                        );
                    for (let i = 0; i < admonitions.length; i++) {
                        const admonition = admonitions[i];

                        this.calloutManager.collapse(admonition);
                    }
                },
            });
            this.addCommand({
                id: "insert-admonition",
                name: "Insert code block",
                editorCallback: (editor, _view) => {
                    const suggestor = new InsertAdmonitionModal(this);
                    suggestor.onClose = () => {
                        if (!suggestor.insert) return;
                        let titleLine = "";
                        let collapseLine = "";
                        if (
                            suggestor.title.length &&
                            suggestor.title.toLowerCase() !==
                                suggestor.type.toLowerCase()
                        ) {
                            titleLine = `title: ${suggestor.title}\n`;
                        }
                        if (suggestor.collapse !== "default") {
                            collapseLine = `collapse: ${suggestor.collapse}\n`;
                        }
                        editor.replaceSelection(
                            `\`\`\`ad-${
                                suggestor.type
                            }\n${titleLine}${collapseLine}
${editor.getSelection()}
\`\`\`\n`,
                        );
                        const cursor = editor.getCursor();
                        editor.setCursor(cursor.line - 3);
                    };
                    suggestor.open();
                },
            });
            this.addCommand({
                id: "insert-callout",
                name: "Insert callout",
                editorCallback: (editor, _view) => {
                    const suggestor = new InsertAdmonitionModal(this);
                    suggestor.onClose = () => {
                        if (!suggestor.insert) return;
                        let title = "";
                        let collapse = "";
                        if (suggestor.collapse !== "default") {
                            switch (suggestor.collapse) {
                                case "open":
                                    collapse = "+";
                                    break;
                                case "closed":
                                    collapse = "-";
                                    break;
                                case "none":
                                    collapse = "";
                                    break;
                            }
                        }
                        if (
                            suggestor.title.length &&
                            suggestor.title.toLowerCase() !==
                                suggestor.type.toLowerCase()
                        ) {
                            title = ` ${suggestor.title}`;
                        }
                        const selection = editor.getSelection();
                        editor.replaceSelection(
                            `> [!${suggestor.type}]${collapse}${title}
> ${selection.split("\n").join("\n> ")}
`,
                        );
                    };
                    suggestor.open();
                },
            });
        });
    }
    async downloadIcon(pack: DownloadableIconPack) {
        await this.iconManager.downloadIcon(pack);
    }

    async removeIcon(pack: DownloadableIconPack) {
        await this.iconManager.removeIcon(pack);
    }

    async postprocessor(
        type: string,
        src: string,
        el: HTMLElement,
        ctx?: MarkdownPostProcessorContext,
    ) {
        if (!this.admonitions[type]) {
            return;
        }
        try {
            const sourcePath =
                typeof ctx === "string"
                    ? ctx
                    : (ctx?.sourcePath ??
                      this.app.workspace.getActiveFile()?.path ??
                      "");
            let { title, collapse, content, icon, color, metadata } =
                getParametersFromSource(type, src, this.admonitions[type]);

            if (this.data.autoCollapse && !collapse) {
                collapse = this.data.defaultCollapseType ?? "open";
            } else if (collapse && collapse.trim() === "none") {
                collapse = "";
            }

            /* const iconNode = icon ? this.admonitions[type].icon; */
            const admonition = this.admonitions[type];
            const iconOverride = icon
                ? this.iconManager.iconDefinitions.find(
                      ({ name }) => icon === name,
                  )
                : null;
            const admonitionElement = this.getAdmonitionElement(
                type,
                title,
                iconOverride ??
                    (this.isIconWithCss(admonition) ? {} : admonition.icon),
                color ??
                    (this.shouldInjectColor(admonition)
                        ? admonition.color
                        : null),
                collapse,
                sourcePath,
                metadata,
            );
            this.renderAdmonitionContent(
                admonitionElement,
                type,
                content,
                ctx,
                sourcePath,
                src,
            );
            if (collapse && collapse !== "none") {
                this.calloutManager.setCollapsible(admonitionElement);
            }
            /**
             * Replace the <pre> tag with the new admonition.
             */
            const parent = el.parentElement;
            if (parent) {
                parent.addClass(
                    "admonition-parent",
                    `admonition-${type}-parent`,
                );
            }
            el.replaceWith(admonitionElement);

            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view?.editor?.cm?.state?.field(editorLivePreviewField)) {
                const editor = view.editor.cm;
                admonitionElement.onClickEvent((ev) => {
                    if (ev.defaultPrevented || ev.detail > 1 || ev.shiftKey) {
                        return;
                    }
                    const target = ev.target as HTMLElement;
                    const interactive = target.closest(
                        "input, button, select, textarea, a[href], label, [contenteditable='true'], [tabindex]:not([tabindex='-1'])",
                    );
                    if (
                        interactive &&
                        interactive !== admonitionElement &&
                        admonitionElement.contains(interactive)
                    ) {
                        return;
                    }
                    try {
                        setTimeout(() => {
                            try {
                                const pos = editor.posAtDOM(admonitionElement);
                                editor.focus();
                                editor.dispatch({
                                    selection: {
                                        head: pos,
                                        anchor: pos,
                                    },
                                });
                            } catch {
                                /* posAtDOM may throw if el is detached */
                            }
                        }, 10);
                    } catch {
                        /* ignore errors from setTimeout setup */
                    }
                });
            }

            return admonitionElement;
        } catch (e) {
            console.error(e);
            const pre = createEl("pre");

            pre.createEl("code", {
                attr: {
                    style: "color: var(--text-error) !important",
                },
            }).createSpan({
                text:
                    "There was an error rendering the admonition:" +
                    "\n\n" +
                    src,
            });

            el.replaceWith(pre);
        }
    }

    /**
     *  .callout.admonition.is-collapsible.is-collapsed
     *      .callout-title
     *          .callout-icon
     *          .callout-title-inner
     *          .callout-fold
     *      .callout-content
     */
    getAdmonitionElement(
        type: string,
        title: string,
        icon: AdmonitionIconDefinition,
        color?: string,
        collapse?: string,
        source?: string,
        metadata?: string,
    ): HTMLElement {
        const admonition = createDiv({
            cls: `callout admonition admonition-${type} admonition-plugin ${
                !title?.trim().length ? "no-title" : ""
            }`,
            attr: {
                style: color ? `--callout-color: ${color};` : "",
                "data-callout": type,
                "data-callout-fold": "",
                "data-callout-metadata": metadata ?? "",
            },
        });
        const titleEl = admonition.createDiv({
            cls: `callout-title admonition-title ${
                !title?.trim().length ? "no-title" : ""
            }`,
        });

        if (title?.trim().length) {
            //build icon element
            const iconEl = titleEl.createDiv(
                "callout-icon admonition-title-icon",
            );
            if (icon?.name && icon.type) {
                iconEl.appendChild(
                    this.iconManager.getIconNode(icon) ?? createDiv(),
                );
            }

            const renderer = new MarkdownRenderChild(titleEl);

            //get markdown
            const titleInnerEl = titleEl.createDiv(
                "callout-title-inner admonition-title-content",
            );
            void MarkdownRenderer.render(
                this.app,
                title,
                titleInnerEl,
                source ?? "",
                renderer,
            );
            if (
                titleInnerEl.firstElementChild &&
                titleInnerEl.firstElementChild instanceof HTMLParagraphElement
            ) {
                titleInnerEl.setChildrenInPlace(
                    Array.from(titleInnerEl.firstElementChild.childNodes),
                );
            }
        }

        //add them to title element

        if (collapse) {
            admonition.addClass("is-collapsible");
            if (collapse === "closed") {
                admonition.addClass("is-collapsed");
            }
        }
        if (!this.data.dropShadow) {
            admonition.addClass("no-drop");
        }
        return admonition;
    }

    renderAdmonitionContent(
        admonitionElement: HTMLElement,
        type: string,
        content: string,
        ctx: MarkdownPostProcessorContext,
        sourcePath: string,
        src: string,
    ) {
        const markdownRenderChild = new MarkdownRenderChild(admonitionElement);
        markdownRenderChild.containerEl = admonitionElement;
        if (ctx && !(typeof ctx === "string")) {
            ctx.addChild(markdownRenderChild);
        }

        if (content?.trim().length) {
            /**
             * Render the content as markdown and append it to the admonition.
             */
            const contentEl = this.getAdmonitionContentElement(
                type,
                admonitionElement,
                content,
            );
            if (/^`{3,}mermaid/m.test(content)) {
                const wasCollapsed = !admonitionElement.hasAttribute("open");
                if (admonitionElement instanceof HTMLDetailsElement) {
                    admonitionElement.setAttribute("open", "open");
                }
                setImmediate(() => {
                    void MarkdownRenderer.render(
                        this.app,
                        content,
                        contentEl,
                        sourcePath,
                        markdownRenderChild,
                    );
                    if (
                        admonitionElement instanceof HTMLDetailsElement &&
                        wasCollapsed
                    ) {
                        admonitionElement.removeAttribute("open");
                    }
                });
            } else {
                void MarkdownRenderer.render(
                    this.app,
                    content,
                    contentEl,
                    sourcePath,
                    markdownRenderChild,
                );
            }

            if (
                (!content.length || contentEl.textContent.trim() === "") &&
                this.data.hideEmpty
            ) {
                admonitionElement.addClass("no-content");
            }

            const taskLists = contentEl.querySelectorAll<HTMLInputElement>(
                ".task-list-item-checkbox",
            );
            if (taskLists?.length) {
                const split = src.split("\n");
                let slicer = 0;
                taskLists.forEach((task) => {
                    const line = split
                        .slice(slicer)
                        .findIndex((l) => /^[ \t>]*- \[.\]/.test(l));

                    if (line === -1) return;
                    task.dataset.line = `${line + slicer + 1}`;
                    slicer = line + slicer + 1;
                });
            }
        }
    }

    getAdmonitionContentElement(
        type: string,
        admonitionElement: HTMLElement,
        content: string,
    ) {
        const contentEl = admonitionElement.createDiv(
            "callout-content admonition-content",
        );
        if (this.admonitions[type].copy ?? this.data.copyButton) {
            const copy = contentEl.createDiv("admonition-content-copy");
            setIcon(copy, "copy");
            copy.addEventListener("click", () => {
                void navigator.clipboard.writeText(content.trim()).then(() => {
                    new Notice("Admonition content copied to clipboard.");
                });
            });
        }
        return contentEl;
    }

    registerType(type: string) {
        /** Turn on CodeMirror syntax highlighting for this "language" */
        if (this.data.syntaxHighlight) {
            this.turnOnSyntaxHighlighting([type]);
        }

        /** Register an admonition code-block post processor */
        const titleCase = type[0].toUpperCase() + type.slice(1);
        if (this.postprocessors.has(type)) {
            (
                MarkdownPreviewRenderer as typeof MarkdownPreviewRenderer & {
                    unregisterCodeBlockPostProcessor(lang: string): void;
                }
            ).unregisterCodeBlockPostProcessor(`ad-${type}`);
            if (titleCase !== type) {
                MarkdownPreviewRenderer.unregisterCodeBlockPostProcessor(
                    `ad-${titleCase}`,
                );
            }
        }
        this.postprocessors.set(
            type,
            this.registerMarkdownCodeBlockProcessor(
                `ad-${type}`,
                (src, el, ctx) => this.postprocessor(type, src, el, ctx),
            ),
        );
        if (titleCase !== type) {
            this.registerMarkdownCodeBlockProcessor(
                `ad-${titleCase}`,
                (src, el, ctx) => this.postprocessor(type, src, el, ctx),
            );
        }
        const admonition = this.admonitions[type];
        if (admonition.command) {
            this.registerCommandsFor(admonition);
        }
    }
    get admonitions() {
        return { ...ADMONITION_MAP, ...this.data.userAdmonitions };
    }
    async addAdmonition(admonition: Admonition): Promise<void> {
        admonition.type = admonition.type.toLowerCase();
        this.data.userAdmonitions = {
            ...this.data.userAdmonitions,
            [admonition.type]: admonition,
        };

        this.registerType(admonition.type);

        /** Create the admonition type in CSS */
        this.calloutManager.addAdmonition(admonition);

        await this.saveSettings();
    }
    registerCommandsFor(admonition: Admonition) {
        admonition.command = true;
        this.addCommand({
            id: `insert-${admonition.type}-callout`,
            name: `Insert ${admonition.type} Callout`,
            editorCheckCallback: (checking, editor, _view) => {
                if (checking) return admonition.command;
                if (admonition.command) {
                    try {
                        const selection = editor.getSelection();
                        editor.replaceSelection(
                            `> [!${admonition.type}]
> ${selection.split("\n").join("\n> ")}
`,
                        );
                        const cursor = editor.getCursor();
                        editor.setCursor(cursor.line - 2);
                    } catch {
                        new Notice(
                            "There was an issue inserting the admonition.",
                        );
                    }
                }
            },
        });
        this.addCommand({
            id: `insert-${admonition.type}`,
            name: `Insert ${admonition.type}`,
            editorCheckCallback: (checking, editor, _view) => {
                if (checking) return admonition.command;
                if (admonition.command) {
                    try {
                        editor.replaceSelection(
                            `\`\`\`ad-${admonition.type}

${editor.getSelection()}

\`\`\`\n`,
                        );
                        const cursor = editor.getCursor();
                        editor.setCursor(cursor.line - 2);
                    } catch {
                        new Notice(
                            "There was an issue inserting the admonition.",
                        );
                    }
                }
            },
        });
        this.addCommand({
            id: `insert-${admonition.type}-with-title`,
            name: `Insert ${admonition.type} With Title`,
            editorCheckCallback: (checking, editor, _view) => {
                if (checking) return admonition.command;
                if (admonition.command) {
                    try {
                        const title = admonition.title ?? "";
                        editor.replaceSelection(
                            `\`\`\`ad-${admonition.type}
title: ${title}

${editor.getSelection()}

\`\`\`\n`,
                        );
                        const cursor = editor.getCursor();
                        editor.setCursor(cursor.line - 3);
                    } catch {
                        new Notice(
                            "There was an issue inserting the admonition.",
                        );
                    }
                }
            },
        });
    }
    unregisterType(admonition: Admonition) {
        if (this.data.syntaxHighlight) {
            this.turnOffSyntaxHighlighting([admonition.type]);
        }

        if (admonition.command) {
            this.unregisterCommandsFor(admonition);
        }

        const postprocessor = this.postprocessors.get(admonition.type);
        if (postprocessor) {
            MarkdownPreviewRenderer.unregisterPostProcessor(postprocessor);
            // unregisterCodeBlockPostProcessor is not part of the public API;
            // there is no official way to unregister a code block processor by language name.
            (
                MarkdownPreviewRenderer as typeof MarkdownPreviewRenderer & {
                    unregisterCodeBlockPostProcessor(lang: string): void;
                }
            ).unregisterCodeBlockPostProcessor(`ad-${admonition.type}`);
            this.postprocessors.delete(admonition.type);
        }
    }
    async removeAdmonition(admonition: Admonition) {
        if (this.data.userAdmonitions[admonition.type]) {
            delete this.data.userAdmonitions[admonition.type];
        }

        this.unregisterType(admonition);

        /** Remove the admonition type in CSS */
        this.calloutManager.removeAdmonition(admonition);

        await this.saveSettings();
    }
    unregisterCommandsFor(admonition: Admonition) {
        admonition.command = false;
        this.removeCommand(`insert-${admonition.type}-callout`);
        this.removeCommand(`insert-${admonition.type}`);
        this.removeCommand(`insert-${admonition.type}-with-title`);
    }

    async saveSettings() {
        this.data.version = this.manifest.version;

        // Strip legacy fields that may exist in saved data from older versions
        const dataToSave = { ...this.data } as Record<string, unknown>;
        delete dataToSave.msDocConverted;

        await this.saveData(dataToSave);
    }
    async loadSettings() {
        const loaded = (await this.loadData()) as AdmonitionSettings;
        this.data = Object.assign({}, DEFAULT_APP_SETTINGS, loaded);

        if (this.data.userAdmonitions) {
            if (
                !this.data.version ||
                Number(this.data.version.split(".")[0]) < 5
            ) {
                for (const admonition in this.data.userAdmonitions) {
                    if (
                        Object.hasOwn(
                            this.data.userAdmonitions[admonition],
                            "type",
                        )
                    )
                        continue;
                    this.data.userAdmonitions[admonition] = {
                        ...this.data.userAdmonitions[admonition],
                        icon: {
                            type: "font-awesome",
                            name: this.data.userAdmonitions[admonition]
                                .icon as unknown as IconName,
                        },
                    };
                }
            }

            for (const key of Object.keys(this.data.userAdmonitions)) {
                const admonition = this.data.userAdmonitions[key];
                // Migrate legacy RGB triplet colors ("r, g, b") to valid CSS rgb(r, g, b)
                if (
                    admonition.color &&
                    /^\d+,\s*\d+,\s*\d+$/.test(admonition.color)
                ) {
                    admonition.color = `rgb(${admonition.color})`;
                }
            }
        }

        if (
            !this.data.rpgDownloadedOnce &&
            this.data.userAdmonitions &&
            Object.values(this.data.userAdmonitions).some(
                (admonition) => admonition.icon.type === "rpg",
            ) &&
            !this.data.icons.includes("rpg")
        ) {
            try {
                await this.downloadIcon("rpg");
                this.data.rpgDownloadedOnce = true;
            } catch {
                /* non-critical: proceed without rpg icons if download fails */
            }
        }

        if (this.data.userAdmonitions) {
            for (const key of Object.keys(this.data.userAdmonitions)) {
                const lower = key.toLowerCase();
                if (lower !== key) {
                    this.data.userAdmonitions[lower] = {
                        ...this.data.userAdmonitions[key],
                        type: lower,
                    };
                    delete this.data.userAdmonitions[key];
                }
            }
        }

        await this.saveSettings();
    }

    turnOnSyntaxHighlighting(types: string[] = Object.keys(this.admonitions)) {
        if (!this.data.syntaxHighlight) return;
        types.forEach((type) => {
            const match = `${type}`.match(/^([\w+#-]*)[^\n`]*$/);
            if (!match) return;
            const [, cmPatchedType] = match;
            window.CodeMirror.defineMode(
                `ad-${cmPatchedType}`,
                (_config, _options) => {
                    return window.CodeMirror.getMode({}, "hypermd");
                },
            );
        });

        this.app.workspace.onLayoutReady(() =>
            this.app.workspace.iterateCodeMirrors((cm) =>
                cm.setOption("mode", cm.getOption("mode")),
            ),
        );
    }
    turnOffSyntaxHighlighting(types: string[] = Object.keys(this.admonitions)) {
        types.forEach((type) => {
            if (Object.hasOwn(window.CodeMirror.modes, `ad-${type}`)) {
                delete window.CodeMirror.modes[`ad-${type}`];
            }
        });
        this.app.workspace.onLayoutReady(() =>
            this.app.workspace.iterateCodeMirrors((cm) =>
                cm.setOption("mode", cm.getOption("mode")),
            ),
        );
    }

    onunload() {
        console.debug("Obsidian Admonition unloaded");
        this.postprocessors.clear();
        this.turnOffSyntaxHighlighting();
    }
}

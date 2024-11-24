import {
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo
} from "obsidian";
import { Admonition } from "src/@types";
import ObsidianAdmonition from "src/main";

abstract class AdmonitionOrCalloutSuggester extends EditorSuggest<
    [string, Admonition]
> {
    constructor(public plugin: ObsidianAdmonition) {
        super(plugin.app);
    }
    getSuggestions(ctx: EditorSuggestContext) {
        if (!ctx.query?.length) return Object.entries(this.plugin.admonitions);

        return Object.entries(this.plugin.admonitions).filter((p) =>
            p[0].toLowerCase().contains(ctx.query.toLowerCase())
        );
    }
    renderSuggestion(
        [text, item]: [text: string, item: Admonition],
        el: HTMLElement
    ) {
        el.addClasses(["admonition-suggester-item", "mod-complex"]);
        el.style.setProperty("--callout-color", item.color);
        el.createSpan({ text });
        const iconDiv = el.createDiv("suggestion-aux").createDiv({
            cls: "suggestion-flair",
            attr: {
                style: `color: rgb(var(--callout-color))`
            }
        });
        let iconEl = this.plugin.iconManager.getIconNode(item.icon);
        // Unpack the icon if it's an Obsidian one, as they're wrapped with an extra <div>
        if (iconEl instanceof HTMLDivElement && iconEl.childElementCount == 1)
            iconEl = iconEl.firstElementChild;
        else if (iconEl !== null) {
            iconEl.removeClass("svg-inline--fa");
            iconEl.addClass("svg-icon");
        }
        iconDiv.appendChild(iconEl ?? createDiv());
    }
    onTrigger(
        cursor: EditorPosition,
        editor: Editor
    ): EditorSuggestTriggerInfo {
        const line = editor.getLine(cursor.line);
        const match = this.testAndReturnQuery(line, cursor);
        if (!match) return null;
        const [_, prefix, query] = match;

        if (
            Object.keys(this.plugin.admonitions).find(
                (p) => p.toLowerCase() == query.toLowerCase()
            )
        ) {
            return null;
        }

        return {
            end: cursor,
            start: {
                // using 'prefix.length' instead of 'this.offset'
                ch: match.index + prefix.length,
                line: cursor.line
            },
            query
        };
    }
    abstract selectSuggestion(
        value: [string, Admonition],
        evt: MouseEvent | KeyboardEvent
    ): void;
    abstract testAndReturnQuery(
        line: string,
        cursor: EditorPosition
    ): RegExpMatchArray | null;
}

export class CalloutSuggest extends AdmonitionOrCalloutSuggester {
    selectSuggestion(
        [text]: [text: string, item: Admonition],
        evt: MouseEvent | KeyboardEvent
    ): void {
        if (!this.context) return;

        // Code Refactoring
        const { editor, query, start, end } = this.context;

        const line = editor
            .getLine(end.line)
            .slice(end.ch);
        const [_, exists] = line.match(/^(\] ?)/) ?? [];

        editor.replaceRange(
            `${text}] `,
            start,
            {
                ...end,
                ch:
                    start.ch +
                    query.length +
                    (exists?.length ?? 0)
            },
            "admonitions"
        );

        editor.setCursor(
            start.line,
            start.ch + text.length + 2
        );

        this.close();
    }
    testAndReturnQuery(
        line: string,
        cursor: EditorPosition
    ): RegExpMatchArray | null {
        if (/> ?\[!\w+\]/.test(line.slice(0, cursor.ch))) return null;

        // Modified the regex to capture 'prefix', 'query'
        const match = line.match(/(> ?\[!)(\w*)\]?/);
        if (!match) return null;
        return match
    }
}
export class AdmonitionSuggest extends AdmonitionOrCalloutSuggester {
    selectSuggestion(
        [text]: [text: string, item: Admonition],
        evt: MouseEvent | KeyboardEvent
    ): void {
        if (!this.context) return;

        // Code Refactoring
        const { editor, start, end } = this.context;

        editor.replaceRange(
            `${text}`,
            start,
            end,
            "admonitions"
        );

        // Move the cursor to the end of the inserted text
        editor.setCursor(
            start.line,
            start.ch + text.length
        );

        this.close();
    }
    testAndReturnQuery(
        line: string,
        cursor: EditorPosition
    ): RegExpMatchArray | null {
        if (!/```ad-\w*/.test(line)) return null;

        // Modified the regex to capture 'prefix', 'query'
        const match = line.match(/(```ad-)(\w*)/);
        if (!match) return null;
        return match;
    }
}

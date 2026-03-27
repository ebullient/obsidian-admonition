import {
    type App,
    type FuzzyMatch,
    type TextComponent,
    type SearchMatches,
    AbstractInputSuggest,
    prepareSimpleSearch,
    SearchComponent,
    renderMatches
} from "obsidian";

declare module "obsidian" {
    interface AbstractInputSuggest<T> {
        selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
    }
}

export interface FuzzyInputSuggest<T> {
    renderNote?(noteEL: HTMLElement, result: FuzzyMatch<T>): void;
    renderFlair?(flairEl: HTMLElement, result: FuzzyMatch<T>): void;
}

export abstract class FuzzyInputSuggest<T> extends AbstractInputSuggest<
    FuzzyMatch<T>
> {
    constructor(
        app: App,
        input: TextComponent | SearchComponent,
        public items: T[]
    ) {
        super(app, input.inputEl);
    }
    abstract getItemText(item: T): string;
    protected getSuggestions(query: string) {
        const search = prepareSimpleSearch(query);
        const results = [];
        for (const item of this.items) {
            const match = search(this.getItemText(item));
            if (match) {
                results.push({ item, match });
            }
        }
        return results;
    }

    abstract renderTitle(titleEl: HTMLElement, result: FuzzyMatch<T>): void;
    renderSuggestion(result: FuzzyMatch<T>, el: HTMLElement): void {
        el.addClass("mod-complex");
        let content = el.createDiv({
            cls: "suggestion-content"
        });
        if (!result?.item) {
            content.setText("No match found");
            content.parentElement?.addClass("is-selected");
            return;
        }

        this.renderTitle(content.createDiv("suggestion-title"), result);
        this.renderNote?.(content.createDiv("suggestion-note"), result);
        this.renderFlair?.(
            el.createDiv("suggestion-aux").createDiv("suggestion-flair"),
            result
        );
    }

    renderMatches(
        el: HTMLElement | DocumentFragment,
        text: string,
        matches: SearchMatches | null,
        offset?: number
    ): void {
        renderMatches(el, text, matches, offset);
    }
}

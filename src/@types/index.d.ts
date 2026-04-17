import { DownloadableIconPack } from "src/icons/manager";

export interface Admonition {
    type: string;
    title?: string;
    icon?: AdmonitionIconDefinition;
    color?: string;
    command: boolean;
    iconWithCss?: boolean;
    injectColor?: boolean;
    noTitle: boolean;
    copy?: boolean;
}

export interface NestedAdmonition {
    type: string;
    start: number;
    end: number;
    src: string;
}

export interface AdmonitionSettings {
    userAdmonitions: Record<string, Admonition>;
    syntaxHighlight: boolean;
    copyButton: boolean;
    autoCollapse: boolean;
    defaultCollapseType: "open" | "closed";
    version: string;
    injectColor: boolean;
    parseTitles: boolean;
    dropShadow: boolean;
    hideEmpty: boolean;
    icons: Array<DownloadableIconPack>;
    useFontAwesome: boolean;
    rpgDownloadedOnce: boolean;
    useSnippet: boolean;
    snippetPath: string;
}

export type AdmonitionIconDefinition = {
    type?: IconType;
    name?: string;
};

export type IconType =
    | "font-awesome"
    | "obsidian"
    | "image"
    | DownloadableIconPack;

export type AdmonitionIconName = AdmonitionIconDefinition["name"];
export type AdmonitionIconType = AdmonitionIconDefinition["type"];

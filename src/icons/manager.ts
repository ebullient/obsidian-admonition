import { getIconIds, Notice, requestUrl, setIcon } from "obsidian";
/* import { RPG } from "./rpgawesome"; */
import type { AdmonitionIconDefinition, IconType } from "src/@types";
import type ObsidianAdmonition from "src/main";
import FA_NAMES from "../../icons/fa-names/names.json";
import { type DownloadableIconPack, DownloadableIcons } from "./packs";

export { type DownloadableIconPack, DownloadableIcons, FA_NAMES };

/** Identify which FA pack a legacy "font-awesome" icon name belongs to.
 *  Prefers fas over far when an icon exists in both (matches old lookup order). */
export function faPackForIcon(name: string): DownloadableIconPack | undefined {
    if (FA_NAMES.fas.includes(name)) return "fas";
    if (FA_NAMES.far.includes(name)) return "far";
    if (FA_NAMES.fab.includes(name)) return "fab";
}

export class IconManager {
    DOWNLOADED: {
        [key in DownloadableIconPack]?: Record<string, string>;
    } = {};
    constructor(public plugin: ObsidianAdmonition) {}
    async load() {
        for (const icon of this.plugin.data.icons) {
            const exists = await this.plugin.app.vault.adapter.exists(
                this.localIconPath(icon),
            );
            if (!exists) {
                await this.downloadIcon(icon);
            } else {
                this.DOWNLOADED[icon] = JSON.parse(
                    await this.plugin.app.vault.adapter.read(
                        `${this.plugin.app.plugins.getPluginFolder()}/obsidian-admonition/${icon}.json`,
                    ),
                ) as Record<string, string>;
            }
        }
        this.setIconDefinitions();
    }
    iconDefinitions: AdmonitionIconDefinition[] = [];
    setIconDefinitions() {
        const downloaded: AdmonitionIconDefinition[] = [];
        for (const pack of this.plugin.data.icons) {
            if (!(pack in this.DOWNLOADED)) continue;
            const icons = this.DOWNLOADED[pack];
            downloaded.push(
                ...Object.keys(icons).map((name) => {
                    return { type: pack, name };
                }),
            );
        }
        this.iconDefinitions = [
            ...getIconIds().map((name) => {
                return { type: "obsidian" as IconType, name };
            }),
            ...downloaded,
        ];
    }
    iconPath(pack: DownloadableIconPack) {
        return `https://raw.githubusercontent.com/ebullient/obsidian-admonition/main/icons/${pack}/icons.json`;
    }
    localIconPath(pack: DownloadableIconPack) {
        return `${this.plugin.app.plugins.getPluginFolder()}/obsidian-admonition/${pack}.json`;
    }
    async downloadIcon(pack: DownloadableIconPack) {
        try {
            const response = await requestUrl(this.iconPath(pack));
            const icons = response.json as Record<string, string>;
            this.plugin.data.icons.push(pack);
            this.plugin.data.icons = [...new Set(this.plugin.data.icons)];
            await this.plugin.app.vault.adapter.write(
                this.localIconPath(pack),
                JSON.stringify(icons),
            );
            this.DOWNLOADED[pack] = icons;
            await this.plugin.saveSettings();
            this.setIconDefinitions();

            new Notice(`${DownloadableIcons[pack]} successfully downloaded.`);
        } catch (e) {
            console.error(e);
            new Notice("Could not download icon pack");
        }
    }
    async removeIcon(pack: DownloadableIconPack) {
        await this.plugin.app.vault.adapter.remove(this.localIconPath(pack));
        delete this.DOWNLOADED[pack];
        this.plugin.data.icons.remove(pack);
        this.plugin.data.icons = [...new Set(this.plugin.data.icons)];
        await this.plugin.saveSettings();
        this.setIconDefinitions();
    }
    getIconType(str: string): IconType | undefined {
        if (getIconIds().includes(str)) {
            return "obsidian";
        }
        for (const [pack, icons] of Object.entries(this.DOWNLOADED)) {
            if (str in icons) return pack as DownloadableIconPack;
        }
    }
    getIconModuleName(icon: AdmonitionIconDefinition): string | undefined {
        if (icon.type && icon.type !== "image") {
            if (icon.type === "obsidian") return "Obsidian Icon";
            if (icon.type in DownloadableIcons) {
                return DownloadableIcons[icon.type as DownloadableIconPack];
            }
        }
    }
    getIconNode(icon: AdmonitionIconDefinition): Element | null {
        if (!icon.name) {
            return null;
        }
        if (icon.type === "image") {
            const img = new Image();
            img.src = icon.name;
            return img;
        }
        if (icon.type === "obsidian") {
            // Can not use createEl or createDiv here:
            // VM1242 plugin:obsidian-admonition:585 HierarchyRequestError: Failed to execute 'appendChild' on 'Node': Only one element on document allowed.
            // at enhance.js:1:9665
            // at HTMLDocument.createEl (enhance.js:1:8610)
            // at l2.getIconNode (plugin:obsidian-admonition:575:1600758)
            // eslint-disable-next-line obsidianmd/prefer-create-el -- fails with HierarchyRequestError: Failed to execute 'appendChild' on 'Node': Only one element on document allowed.
            const el = activeDocument.createElement("div");
            setIcon(el, icon.name);
            return el;
        }
        const packType = icon.type as DownloadableIconPack | undefined;
        const svgString =
            packType && icon.name
                ? this.DOWNLOADED[packType]?.[icon.name]
                : undefined;
        if (svgString) {
            const parsed = new DOMParser().parseFromString(
                svgString,
                "image/svg+xml",
            );
            return parsed.documentElement;
        }
        return null;
    }
}

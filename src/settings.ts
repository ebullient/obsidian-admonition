import {
    type App,
    Modal,
    Notice,
    Platform,
    PluginSettingTab,
    type Setting,
    type SettingDefinitionItem,
    type SettingGroup,
    type SettingGroupItem,
    TextAreaComponent,
} from "obsidian";
import { t9n } from "src/lang/helpers";
import type { Admonition } from "./@types";
import { faPackForIcon } from "./icons/manager";
import { type DownloadableIconPack, DownloadableIcons } from "./icons/packs";
import type ObsidianAdmonition from "./main";
import { CalloutSettingsModal } from "./modal/callout";
import { confirmWithModal } from "./modal/confirm";
import Export from "./modal/export";
import { ADD_COMMAND_NAME, REMOVE_COMMAND_NAME } from "./util";
import { validateImport } from "./util/validator";

export default class AdmonitionSetting extends PluginSettingTab {
    constructor(
        app: App,
        public plugin: ObsidianAdmonition,
    ) {
        super(app, plugin);
        this.containerEl.addClass("admonition-settings");
    }

    getControlValue(key: string): unknown {
        return (this.plugin.data as unknown as Record<string, unknown>)[key];
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        (this.plugin.data as unknown as Record<string, unknown>)[key] = value;
        await this.plugin.saveSettings();
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            {
                type: "group",
                heading: "Display and behavior",
                items: this.behaviorItems(),
            },
            { type: "group", heading: "CSS", items: this.cssItems() },
            {
                type: "group",
                heading: "Import & export",
                items: this.importExportItems(),
            },
            this.customTypesList(),
            {
                type: "group",
                heading: "Icon packs",
                items: this.iconPackItems(),
            },
            { type: "group", heading: "Advanced", items: this.advancedItems() },
            this.coffeeItem(),
        ];
    }

    private behaviorItems(): SettingGroupItem[] {
        return [
            {
                name: t9n("drop-shadow.name"),
                desc: t9n("drop-shadow.desc"),
                control: { type: "toggle", key: "dropShadow" },
            },
            {
                name: t9n("copy-button.name"),
                desc: t9n("copy-button.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) =>
                        t
                            .setValue(this.plugin.data.copyButton)
                            .onChange(async (v) => {
                                this.plugin.data.copyButton = v;
                                if (!v) {
                                    activeDocument
                                        .querySelectorAll(
                                            ".admonition-content-copy",
                                        )
                                        .forEach((el) => {
                                            el.detach();
                                        });
                                }
                                await this.plugin.saveSettings();
                            }),
                    );
                },
            },
            {
                name: t9n("hide-empty.name"),
                desc: t9n("hide-empty.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) =>
                        t
                            .setValue(this.plugin.data.hideEmpty)
                            .onChange(async (v) => {
                                this.plugin.data.hideEmpty = v;
                                await this.plugin.saveSettings();
                                this.update();
                            }),
                    );
                },
            },
            {
                name: t9n("collapse-type.name"),
                desc: t9n("collapse-type.desc"),
                visible: () => this.plugin.data.autoCollapse,
                control: {
                    type: "dropdown",
                    key: "defaultCollapseType",
                    options: { open: "Open", closed: "Closed" },
                },
            },
            {
                name: t9n("collapsible.name"),
                desc: createFragment((e) => {
                    e.createSpan({
                        text: t9n("collapsible.desc-prefix"),
                    });
                    e.createEl("code", {
                        text: "collapse: none",
                    });
                    e.createSpan({
                        text: t9n("collapsible.desc-suffix"),
                    });
                }),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) =>
                        t
                            .setValue(this.plugin.data.autoCollapse)
                            .onChange(async (v) => {
                                this.plugin.data.autoCollapse = v;
                                await this.plugin.saveSettings();
                                this.refreshDomState();
                            }),
                    );
                },
            },
            {
                name: t9n("parse-titles.name"),
                desc: t9n("parse-titles.desc"),
                control: { type: "toggle", key: "parseTitles" },
            },
        ];
    }

    private cssItems(): SettingGroupItem[] {
        return [
            {
                name: t9n("use-snippet.name"),
                desc: t9n("use-snippet.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) =>
                        t
                            .setValue(this.plugin.data.useSnippet)
                            .onChange(async (v) => {
                                this.plugin.data.useSnippet = v;
                                await this.plugin.saveSettings();
                                this.plugin.calloutManager.setUseSnippet();
                            }),
                    );
                },
            },
            {
                name: t9n("set-colors.name"),
                desc: t9n("set-colors.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) =>
                        t
                            .setValue(this.plugin.data.injectColor)
                            .onChange(async (v) => {
                                this.plugin.data.injectColor = v;
                                await this.plugin.saveSettings();
                                this.update();
                            }),
                    );
                },
            },
        ];
    }

    private importExportItems(): SettingGroupItem[] {
        const items: SettingGroupItem[] = [];

        if (Platform.isDesktop) {
            items.push({
                name: t9n("export-css.name"),
                desc: t9n("export-css.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addButton((b) =>
                        b
                            .setIcon("download")
                            .setDisabled(
                                !Object.keys(this.plugin.data.userAdmonitions)
                                    .length,
                            )
                            .onClick(() => {
                                const file = new Blob(
                                    [
                                        this.plugin.calloutManager.generateCssString(),
                                    ],
                                    {
                                        type: "text/css",
                                    },
                                );
                                createEl("a", {
                                    attr: {
                                        download: "custom_callouts.css",
                                        href: URL.createObjectURL(file),
                                    },
                                }).click();
                            }),
                    );
                },
            });
        }

        items.push({
            name: t9n("export-json.name"),
            desc: t9n("export-json.desc"),
            render: (setting: Setting, _group: SettingGroup) => {
                setting
                    .addButton((b) =>
                        b
                            .setButtonText(t9n("btn.download-all"))
                            .setCta()
                            .onClick(() => {
                                const admonitions = Object.values(
                                    this.plugin.data.userAdmonitions,
                                );
                                this.download(admonitions);
                            }),
                    )
                    .addButton((b) =>
                        b
                            .setButtonText(t9n("btn.select-download"))
                            .onClick(() => {
                                const modal = new Export(this.plugin);
                                modal.onClose = () => {
                                    if (!modal.export) return;
                                    const admonitions = Object.values(
                                        this.plugin.data.userAdmonitions,
                                    );
                                    this.download(
                                        admonitions.filter((a) =>
                                            modal.selectedAdmonitions.includes(
                                                a.type,
                                            ),
                                        ),
                                    );
                                };
                                modal.open();
                            }),
                    );
            },
        });

        items.push({
            name: t9n("import.name"),
            desc: t9n("import.desc"),
            render: (setting: Setting, _group: SettingGroup) => {
                const input = createEl("input", {
                    attr: {
                        type: "file",
                        name: "merge",
                        accept: ".json",
                        multiple: true,
                        style: "display: none;",
                    },
                });

                input.onchange = async () => {
                    const { files } = input;
                    if (!files?.length) {
                        return;
                    }
                    try {
                        const data: (Admonition[] | Admonition)[] = [];
                        for (const file of Array.from(files)) {
                            data.push(
                                JSON.parse(await file.text()) as
                                    | Admonition[]
                                    | Admonition,
                            );
                        }
                        const items = data
                            .flat()
                            .filter((item) => typeof item === "object");
                        const packsNeeded = new Set<DownloadableIconPack>();
                        for (const item of items) {
                            if (!item.icon) {
                                item.icon = { name: "pencil", type: "fas" };
                                packsNeeded.add("fas");
                            } else if (
                                item.icon.type === "font-awesome" &&
                                item.icon.name
                            ) {
                                item.icon.type =
                                    faPackForIcon(item.icon.name) ?? "fas";
                                packsNeeded.add(item.icon.type);
                            } else if (
                                item.icon.type &&
                                item.icon.type !== "obsidian" &&
                                item.icon.type !== "image"
                            ) {
                                packsNeeded.add(
                                    item.icon.type as DownloadableIconPack,
                                );
                            }
                        }
                        for (const pack of packsNeeded) {
                            if (!this.plugin.data.icons.includes(pack)) {
                                try {
                                    await this.plugin.downloadIcon(pack);
                                } catch {
                                    /* non-critical */
                                }
                            }
                        }
                        for (const item of items) {
                            const valid = validateImport(this.plugin, item);
                            if (valid.success === false) {
                                new Notice(
                                    createFragment((e) => {
                                        e.createSpan({
                                            text: `There was an issue importing the ${item.type} admonition:`,
                                        });
                                        e.createEl("br");
                                        e.createSpan({ text: valid.message });
                                    }),
                                );
                                continue;
                            }
                            if (valid.messages?.length) {
                                new Notice(
                                    createFragment((e) => {
                                        e.createSpan({
                                            text: `There was an issue importing the ${item.type} admonition:`,
                                        });
                                        for (const message of valid.messages ??
                                            []) {
                                            e.createEl("br");
                                            e.createSpan({
                                                text: message,
                                            });
                                        }
                                    }),
                                );
                            }
                            await this.plugin.addAdmonition(item);
                        }
                        this.update();
                    } catch (e) {
                        new Notice(
                            `There was an error while importing the admonition${
                                files.length === 1 ? "" : "s"
                            }.`,
                        );
                        console.error(e);
                    }

                    input.value = "";
                };

                setting
                    .addButton((b) => {
                        b.setButtonText(t9n("btn.choose-files"));
                        b.buttonEl.appendChild(input);
                        b.onClick(() => input.click());
                    })
                    .addExtraButton((b) =>
                        b.setIcon("info").onClick(() => {
                            const modal = new Modal(this.plugin.app);
                            modal.onOpen = () => {
                                modal.contentEl.createSpan({
                                    text: "Import one or more admonition definitions as a JSON array. An admonition definition should look as follows at minimum:",
                                });
                                modal.contentEl.createEl("br");
                                const textarea = new TextAreaComponent(
                                    modal.contentEl.createDiv(),
                                )
                                    .setDisabled(true)
                                    .setValue(
                                        JSON.stringify(
                                            {
                                                type: "embed-affliction",
                                                color: "149, 214, 148",
                                                icon: {
                                                    name: "head-side-cough",
                                                    type: "fas",
                                                },
                                            },
                                            null,
                                            4,
                                        ),
                                    );
                                textarea.inputEl.setAttribute(
                                    "style",
                                    `height: ${textarea.inputEl.scrollHeight}px; resize: none;`,
                                );
                                modal.contentEl.createEl("br");
                                modal.contentEl.createSpan({
                                    text: "See the plugin ReadMe for more information.",
                                });
                            };
                            modal.open();
                        }),
                    );
            },
        });

        return items;
    }

    private customTypesList(): SettingDefinitionItem {
        const admonitions = Object.values(this.plugin.data.userAdmonitions);

        return {
            type: "list",
            heading: "Custom types",
            emptyState: "No custom admonition types defined.",
            addItem: {
                name: t9n("btn.add-additional"),
                action: () => {
                    const modal = new CalloutSettingsModal(this.plugin);
                    modal.onClose = () => {
                        if (!modal.saved || !modal.type) return;
                        const admonition: Admonition = {
                            type: modal.type,
                            color: modal.color,
                            icon: modal.icon,
                            command: false,
                            title: modal.title,
                            iconWithCss: modal.iconWithCss,
                            injectColor: modal.injectColor,
                            noTitle: modal.noTitle,
                            copy: modal.copy,
                        };
                        void this.plugin.addAdmonition(admonition);
                        this.update();
                    };
                    modal.open();
                },
            },
            onDelete: (idx: number) => {
                const admonition = admonitions[idx];
                void this.plugin.removeAdmonition(admonition);
                this.update();
            },
            items: admonitions.map((admonition) => ({
                name: admonition.type,
                searchable: false,
                render: (setting: Setting, _group: SettingGroup) => {
                    const admonitionElement = this.plugin.getAdmonitionElement(
                        admonition.type,
                        admonition.type[0].toUpperCase() +
                            admonition.type.slice(1).toLowerCase(),
                        this.plugin.isIconWithCss(admonition)
                            ? {}
                            : admonition.icon,
                        this.plugin.shouldInjectColor(admonition)
                            ? admonition.color
                            : undefined,
                    );
                    setting.infoEl.replaceWith(admonitionElement);

                    if (!admonition.command) {
                        setting.addExtraButton((b) => {
                            b.setIcon(ADD_COMMAND_NAME.toString())
                                .setTooltip(t9n("btn.register"))
                                .onClick(async () => {
                                    this.plugin.registerCommandsFor(admonition);
                                    await this.plugin.saveSettings();
                                    this.update();
                                });
                        });
                    } else {
                        setting.addExtraButton((b) => {
                            b.setIcon(REMOVE_COMMAND_NAME.toString())
                                .setTooltip(t9n("btn.unregister"))
                                .onClick(async () => {
                                    this.plugin.unregisterCommandsFor(
                                        admonition,
                                    );
                                    await this.plugin.saveSettings();
                                    this.update();
                                });
                        });
                    }

                    setting.addExtraButton((b) => {
                        b.setIcon("pencil")
                            .setTooltip(t9n("btn.edit"))
                            .onClick(() => {
                                const modal = new CalloutSettingsModal(
                                    this.plugin,
                                    admonition,
                                );
                                modal.onClose = () => {
                                    if (!modal.saved || !modal.type) return;
                                    const hasCommand = admonition.command;
                                    const modalAdmonition: Admonition = {
                                        type: modal.type,
                                        color: modal.color,
                                        icon: modal.icon,
                                        command: hasCommand,
                                        title: modal.title,
                                        iconWithCss: modal.iconWithCss,
                                        injectColor: modal.injectColor,
                                        noTitle: modal.noTitle,
                                        copy: modal.copy,
                                    };

                                    if (
                                        modalAdmonition.type !== admonition.type
                                    ) {
                                        this.plugin.unregisterType(admonition);

                                        const existing: [string, Admonition][] =
                                            Object.entries(
                                                this.plugin.data
                                                    .userAdmonitions,
                                            );

                                        this.plugin.data.userAdmonitions =
                                            Object.fromEntries<Admonition>(
                                                existing.map(([type, def]) => {
                                                    if (
                                                        type === admonition.type
                                                    ) {
                                                        return [
                                                            modalAdmonition.type,
                                                            modalAdmonition,
                                                        ];
                                                    }
                                                    return [type, def];
                                                }),
                                            );
                                    } else {
                                        this.plugin.data.userAdmonitions[
                                            modalAdmonition.type
                                        ] = modalAdmonition;
                                    }

                                    this.plugin.registerType(
                                        modalAdmonition.type,
                                    );
                                    this.plugin.calloutManager.addAdmonition(
                                        modalAdmonition,
                                    );
                                    void this.plugin.saveSettings();
                                    this.update();
                                };
                                modal.open();
                            });
                    });
                },
            })),
        };
    }

    private iconPackItems(): SettingGroupItem[] {
        let selected: DownloadableIconPack;
        const possibilities = Object.entries(DownloadableIcons).filter(
            ([icon]) =>
                !this.plugin.data.icons.includes(icon as DownloadableIconPack),
        );

        const items: SettingGroupItem[] = [
            {
                name: t9n("additional-icons.name"),
                desc: t9n("additional-icons.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting
                        .addDropdown((d) => {
                            if (!possibilities.length) {
                                d.setDisabled(true);
                                return;
                            }
                            for (const [icon, display] of possibilities) {
                                d.addOption(icon, display);
                            }
                            d.onChange((v: string) => {
                                selected = v as DownloadableIconPack;
                            });
                            selected = d.getValue() as DownloadableIconPack;
                        })
                        .addExtraButton((b) => {
                            b.setIcon("plus-with-circle")
                                .setTooltip(t9n("btn.load"))
                                .onClick(async () => {
                                    if (!selected?.length) return;
                                    await this.plugin.downloadIcon(selected);
                                    this.update();
                                });
                            if (!possibilities.length) b.setDisabled(true);
                        });
                },
            },
        ];

        for (const icon of this.plugin.data.icons) {
            items.push({
                name: DownloadableIcons[icon],
                searchable: false,
                render: (setting: Setting, _group: SettingGroup) => {
                    setting
                        .addExtraButton((b) => {
                            b.setIcon("reset")
                                .setTooltip(t9n("btn.redownload"))
                                .onClick(async () => {
                                    await this.plugin.removeIcon(icon);
                                    await this.plugin.downloadIcon(icon);
                                    this.update();
                                });
                        })
                        .addExtraButton((b) => {
                            b.setIcon("trash").onClick(async () => {
                                if (
                                    Object.values(
                                        this.plugin.data.userAdmonitions,
                                    ).find(
                                        (admonition) =>
                                            admonition.icon?.type === icon,
                                    )
                                ) {
                                    if (
                                        !(await confirmWithModal(
                                            this.plugin.app,
                                            "You have Admonitions using icons from this pack. Are you sure you want to remove it?",
                                        ))
                                    )
                                        return;
                                }
                                await this.plugin.removeIcon(icon);
                                this.update();
                            });
                        });
                },
            });
        }

        return items;
    }

    private advancedItems(): SettingGroupItem[] {
        return [
            {
                name: t9n("markdown-highlight.name"),
                desc: t9n("markdown-highlight.desc"),
                render: (setting: Setting, _group: SettingGroup) => {
                    setting.addToggle((t) => {
                        t.setValue(this.plugin.data.syntaxHighlight);
                        t.onChange(async (v) => {
                            this.plugin.data.syntaxHighlight = v;
                            if (v) {
                                this.plugin.turnOnSyntaxHighlighting();
                            } else {
                                this.plugin.turnOffSyntaxHighlighting();
                            }
                            await this.plugin.saveSettings();
                        });
                    });
                },
            },
        ];
    }

    private coffeeItem(): SettingDefinitionItem {
        return {
            name: "",
            render: (setting: Setting) => {
                setting.descEl.addClass("admonition-mcp-coffee");
                setting.descEl
                    .createEl("a", {
                        href: "https://www.buymeacoffee.com/ebullient",
                    })
                    .createEl("img", {
                        attr: {
                            src: "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=ebullient&button_colour=8e6787&font_colour=ebebeb&font_family=Inter&outline_colour=392a37&coffee_colour=ecc986",
                        },
                    });
            },
        };
    }

    download(admonitions: Admonition[]) {
        if (!admonitions.length) {
            new Notice(t9n("error.export-none-selected"));
            return;
        }
        const link = createEl("a");
        const file = new Blob([JSON.stringify(admonitions)], {
            type: "json",
        });
        const url = URL.createObjectURL(file);
        link.href = url;
        link.download = "admonitions.json";
        link.click();
        URL.revokeObjectURL(url);
    }
}

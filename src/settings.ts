import {
    type App,
    type ButtonComponent,
    Modal,
    Notice,
    Platform,
    PluginSettingTab,
    Setting,
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
    additionalEl: HTMLDivElement;
    notice: Notice;
    constructor(
        app: App,
        public plugin: ObsidianAdmonition,
    ) {
        super(app, plugin);
    }
    display(): void {
        this.containerEl.empty();
        this.containerEl.addClass("admonition-settings");

        const admonitionEl = this.containerEl.createDiv(
            "admonitions-nested-settings",
        );
        if (!Platform.isMobile) {
            new Setting(admonitionEl)
                .setName(t9n("export-css.name"))
                .setDesc(t9n("export-css.desc"))
                .addButton((b) =>
                    b
                        .setIcon("download")
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
                        })
                        .setDisabled(
                            !Object.keys(this.plugin.data.userAdmonitions)
                                .length,
                        ),
                );
        }

        new Setting(admonitionEl)
            .setName(t9n("export-json.name"))
            .setDesc(t9n("export-json.desc"))
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
                b.setButtonText(t9n("btn.select-download")).onClick(() => {
                    const modal = new Export(this.plugin);
                    modal.onClose = () => {
                        if (!modal.export) return;
                        const admonitions = Object.values(
                            this.plugin.data.userAdmonitions,
                        );
                        this.download(
                            admonitions.filter((a) =>
                                modal.selectedAdmonitions.includes(a.type),
                            ),
                        );
                    };
                    modal.open();
                }),
            );

        new Setting(admonitionEl)
            .setName(t9n("use-snippet.name"))
            .setDesc(t9n("use-snippet.desc"))
            .addToggle((t) =>
                t.setValue(this.plugin.data.useSnippet).onChange(async (v) => {
                    this.plugin.data.useSnippet = v;
                    await this.plugin.saveSettings();
                    this.plugin.calloutManager.setUseSnippet();
                }),
            );

        new Setting(admonitionEl)
            .setName(t9n("add-new.name"))
            .setDesc(t9n("add-new.desc"))
            .addButton((button: ButtonComponent): ButtonComponent => {
                const b = button
                    .setTooltip(t9n("btn.add-additional"))
                    .setButtonText("+")
                    .onClick(() => {
                        const modal = new CalloutSettingsModal(this.plugin);

                        modal.onClose = () => {
                            if (modal.saved) {
                                const admonition = {
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

                                this.plugin.calloutManager.addAdmonition(
                                    admonition,
                                );
                                this.display();
                            }
                        };

                        modal.open();
                    });

                return b;
            });
        new Setting(admonitionEl)
            .setName(t9n("import.name"))
            .setDesc(t9n("import.desc"))
            .addButton((b) => {
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
                                packsNeeded.add(
                                    item.icon.type as DownloadableIconPack,
                                );
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
                        this.display();
                    } catch (e) {
                        new Notice(
                            `There was an error while importing the admonition${
                                files.length === 1 ? "" : "s"
                            }.`,
                        );
                        console.error(e);
                    }

                    input.value = null;
                };
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
        this.additionalEl = admonitionEl.createDiv("additional");
        this.buildTypes();

        this.buildAdmonitions(this.containerEl.createDiv());
        this.buildIcons(this.containerEl.createDiv());
        this.buildAdvanced(this.containerEl.createDiv());

        const div = this.containerEl.createDiv("coffee");
        div.createEl("a", {
            href: "https://www.buymeacoffee.com/ebullient",
        }).createEl("img", {
            attr: {
                src: "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentine195&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000",
            },
        });
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
    buildAdmonitions(containerEl: HTMLElement) {
        containerEl.empty();
        new Setting(containerEl)
            .setHeading()
            .setName(t9n("heading.admonitions-callouts"));

        new Setting(containerEl)
            .setName(t9n("drop-shadow.name"))
            .setDesc(t9n("drop-shadow.desc"))
            .addToggle((t) => {
                t.setValue(this.plugin.data.dropShadow).onChange(async (v) => {
                    this.plugin.data.dropShadow = v;
                    this.display();
                    await this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName(t9n("collapsible.name"))
            .setDesc(
                createFragment((e) => {
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
            )
            .addToggle((t) => {
                t.setValue(this.plugin.data.autoCollapse).onChange(
                    async (v) => {
                        this.plugin.data.autoCollapse = v;
                        this.display();
                        await this.plugin.saveSettings();
                    },
                );
            });

        if (this.plugin.data.autoCollapse) {
            new Setting(containerEl)
                .setName(t9n("collapse-type.name"))
                .setDesc(t9n("collapse-type.desc"))
                .addDropdown((d) => {
                    d.addOption("open", "Open");
                    d.addOption("closed", "Closed");
                    d.setValue(this.plugin.data.defaultCollapseType);
                    d.onChange(async (v: "open" | "closed") => {
                        this.plugin.data.defaultCollapseType = v;
                        await this.plugin.saveSettings();
                    });
                });
        }
        new Setting(containerEl)
            .setName(t9n("copy-button.name"))
            .setDesc(t9n("copy-button.desc"))
            .addToggle((t) => {
                t.setValue(this.plugin.data.copyButton);
                t.onChange(async (v) => {
                    this.plugin.data.copyButton = v;

                    if (!v) {
                        activeDocument
                            .querySelectorAll(".admonition-content-copy")
                            .forEach((el) => {
                                el.detach();
                            });
                    }

                    await this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName(t9n("parse-titles.name"))
            .setDesc(t9n("parse-titles.desc"))
            .addToggle((t) => {
                t.setValue(this.plugin.data.parseTitles);
                t.onChange(async (v) => {
                    this.plugin.data.parseTitles = v;

                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName(t9n("set-colors.name"))
            .setDesc(t9n("set-colors.desc"))
            .addToggle((t) =>
                t
                    .setValue(this.plugin.data.injectColor)
                    .setTooltip(
                        `${
                            this.plugin.data.injectColor ? "Disable" : "Enable"
                        } Admonition Color`,
                    )
                    .onChange(async (v) => {
                        this.plugin.data.injectColor = v;

                        await this.plugin.saveSettings();

                        this.buildTypes();
                    }),
            );
        new Setting(containerEl)
            .setName(t9n("hide-empty.name"))
            .setDesc(t9n("hide-empty.desc"))
            .addToggle((t) =>
                t.setValue(this.plugin.data.hideEmpty).onChange(async (v) => {
                    this.plugin.data.hideEmpty = v;

                    await this.plugin.saveSettings();

                    this.buildTypes();
                }),
            );
    }

    buildIcons(containerEl: HTMLElement) {
        containerEl.empty();
        new Setting(containerEl)
            .setHeading()
            .setName(t9n("heading.icon-packs"));

        let selected: DownloadableIconPack;
        const possibilities = Object.entries(DownloadableIcons).filter(
            ([icon]) =>
                !this.plugin.data.icons.includes(icon as DownloadableIconPack),
        );
        new Setting(containerEl)
            .setName(t9n("additional-icons.name"))
            .setDesc(t9n("additional-icons.desc"))
            .addDropdown((d) => {
                if (!possibilities.length) {
                    d.setDisabled(true);
                    return;
                }
                for (const [icon, display] of possibilities) {
                    d.addOption(icon, display);
                }
                d.onChange((v: DownloadableIconPack) => (selected = v));
                selected = d.getValue() as DownloadableIconPack;
            })
            .addExtraButton((b) => {
                b.setIcon("plus-with-circle")
                    .setTooltip(t9n("btn.load"))
                    .onClick(async () => {
                        if (!selected?.length) return;

                        await this.plugin.downloadIcon(selected);
                        this.buildIcons(containerEl);
                    });
                if (!possibilities.length) b.setDisabled(true);
            });

        const iconsEl = containerEl.createDiv();
        for (const icon of this.plugin.data.icons) {
            new Setting(iconsEl)
                .setName(DownloadableIcons[icon])
                .addExtraButton((b) => {
                    b.setIcon("reset")
                        .setTooltip(t9n("btn.redownload"))
                        .onClick(async () => {
                            await this.plugin.removeIcon(icon);
                            await this.plugin.downloadIcon(icon);
                            this.buildIcons(containerEl);
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash").onClick(async () => {
                        if (
                            Object.values(
                                this.plugin.data.userAdmonitions,
                            ).find(
                                (admonition) => admonition.icon.type === icon,
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
                        this.buildIcons(containerEl);
                    });
                });
        }
    }

    buildAdvanced(containerEl: HTMLElement) {
        containerEl.empty();
        new Setting(containerEl).setHeading().setName(t9n("heading.advanced"));

        new Setting(containerEl)
            .setName(t9n("markdown-highlight.name"))
            .setDesc(t9n("markdown-highlight.desc"))
            .addToggle((t) => {
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
    }

    buildTypes() {
        this.additionalEl.empty();
        for (const admonition of Object.values(
            this.plugin.data.userAdmonitions,
        )) {
            const setting = new Setting(this.additionalEl);

            const admonitionElement = this.plugin.getAdmonitionElement(
                admonition.type,
                admonition.type[0].toUpperCase() +
                    admonition.type.slice(1).toLowerCase(),
                this.plugin.isIconWithCss(admonition) ? {} : admonition.icon,
                this.plugin.shouldInjectColor(admonition)
                    ? admonition.color
                    : null,
            );
            setting.infoEl.replaceWith(admonitionElement);

            if (!admonition.command) {
                setting.addExtraButton((b) => {
                    b.setIcon(ADD_COMMAND_NAME.toString())
                        .setTooltip(t9n("btn.register"))
                        .onClick(async () => {
                            this.plugin.registerCommandsFor(admonition);
                            await this.plugin.saveSettings();
                            this.display();
                        });
                });
            } else {
                setting.addExtraButton((b) => {
                    b.setIcon(REMOVE_COMMAND_NAME.toString())
                        .setTooltip(t9n("btn.unregister"))
                        .onClick(async () => {
                            this.plugin.unregisterCommandsFor(admonition);
                            await this.plugin.saveSettings();
                            this.display();
                        });
                });
            }

            setting
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip(t9n("btn.edit"))
                        .onClick(() => {
                            const modal = new CalloutSettingsModal(
                                this.plugin,
                                admonition,
                            );

                            modal.onClose = () => {
                                if (modal.saved) {
                                    const hasCommand = admonition.command;
                                    const modalAdmonition = {
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

                                    this.display();
                                }
                            };

                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash")
                        .setTooltip(t9n("btn.delete"))
                        .onClick(() => {
                            void this.plugin.removeAdmonition(admonition);
                            this.display();
                        });
                });
        }
    }
}

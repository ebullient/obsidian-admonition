import {
    type App,
    type ButtonComponent,
    Modal,
    Notice,
    Platform,
    PluginSettingTab,
    Setting,
    TextAreaComponent,
    type TextComponent,
} from "obsidian";
import { t9n } from "src/lang/helpers";
import type { Admonition, AdmonitionIconDefinition } from "./@types";
import { type DownloadableIconPack, DownloadableIcons } from "./icons/packs";
import type ObsidianAdmonition from "./main";
import { IconSuggestionModal } from "./modal";
import { confirmWithModal } from "./modal/confirm";
import Export from "./modal/export";
import { ADD_COMMAND_NAME, REMOVE_COMMAND_NAME } from "./util";
import {
    validate,
    validateIcon,
    validateImport,
    validateType,
} from "./util/validator";

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
                t.setValue(this.plugin.data.useSnippet).onChange((v) => {
                    this.plugin.data.useSnippet = v;
                    void this.plugin.saveSettings();
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
                    .onClick(async () => {
                        const modal = new SettingsModal(this.plugin);

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

                    if (!files.length) return;
                    try {
                        const data: (Admonition[] | Admonition)[] = [];
                        for (const file of Array.from(files)) {
                            data.push(
                                JSON.parse(await file.text()) as
                                    | Admonition[]
                                    | Admonition,
                            );
                        }
                        for (const item of data.flat()) {
                            if (typeof item !== "object") continue;

                            if (!item.icon) {
                                item.icon = {
                                    name: "pencil-alt",
                                    type: "font-awesome",
                                };
                            }
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
                                            type: "font-awesome",
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
                        document
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

        new Setting(containerEl)
            .setName(t9n("font-awesome.name"))
            .setDesc(t9n("font-awesome.desc"))
            .addToggle((t) => {
                t.setValue(this.plugin.data.useFontAwesome).onChange((v) => {
                    this.plugin.data.useFontAwesome = v;
                    this.plugin.iconManager.setIconDefinitions();
                    void this.plugin.saveSettings();
                });
            });

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
                            const modal = new SettingsModal(
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

class SettingsModal extends Modal {
    color = "#7d7d7d";
    icon: AdmonitionIconDefinition = {};
    type: string;
    saved = false;
    error = false;
    title: string;
    iconWithCss = false;
    injectColor: boolean = this.plugin.data.injectColor;
    noTitle = false;
    admonitionPreviewParent: HTMLElement;
    admonitionPreview: HTMLElement;
    copy: boolean;
    originalType: string;
    editing = false;
    constructor(
        public plugin: ObsidianAdmonition,
        admonition?: Admonition,
    ) {
        super(plugin.app);
        if (admonition) {
            this.editing = true;
            this.color = admonition.color;
            this.icon = admonition.icon;
            this.type = admonition.type;
            this.originalType = admonition.type;
            this.title = admonition.title;
            this.iconWithCss = this.plugin.isIconWithCss(admonition);
            this.injectColor = this.plugin.shouldInjectColor(admonition);
            this.noTitle = admonition.noTitle ?? false;
            this.copy = admonition.copy ?? this.plugin.data.copyButton;
        }
    }

    setAdmonitionElement(title: string) {
        this.admonitionPreviewParent.empty();
        this.admonitionPreview = this.plugin.getAdmonitionElement(
            this.type,
            title[0].toUpperCase() + title.slice(1).toLowerCase(),
            this.iconWithCss ? {} : this.icon,
            this.injectColor ? this.color : null,
        );
        this.admonitionPreview
            .createDiv("callout-content admonition-content")
            .createEl("p", {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.",
            });
        this.admonitionPreviewParent.appendChild(this.admonitionPreview);
    }
    async display() {
        this.containerEl.addClass("admonition-settings-modal");
        this.titleEl.setText(`${this.editing ? "Edit" : "Add"} Admonition`);
        const { contentEl } = this;

        contentEl.empty();

        const settingDiv = contentEl.createDiv();
        const title = this.title ?? this.type ?? "...";

        this.admonitionPreviewParent = contentEl.createDiv();
        this.setAdmonitionElement(
            title[0].toUpperCase() + title.slice(1).toLowerCase(),
        );

        let typeText: TextComponent;
        const typeSetting = new Setting(settingDiv)
            .setName(t9n("admonition-type.name"))
            .addText((text) => {
                typeText = text;
                typeText.setValue(this.type).onChange((v) => {
                    const valid = validateType(
                        v,
                        this.plugin,
                        this.originalType,
                    );
                    if (valid.success === false) {
                        SettingsModal.setValidationError(
                            text.inputEl,
                            valid.message,
                        );
                        return;
                    }

                    SettingsModal.removeValidationError(text.inputEl);

                    this.type = v;
                    if (!this.title)
                        this.setAdmonitionElement(
                            this.type?.[0].toUpperCase() +
                                this.type?.slice(1).toLowerCase(),
                        );
                });
            });
        typeSetting.controlEl.addClass("admonition-type-setting");

        typeSetting.descEl.createSpan({
            text: "This is used to create the admonition (e.g.,  ",
        });
        typeSetting.descEl.createEl("code", {
            text: "note",
        });
        typeSetting.descEl.createSpan({
            text: " or ",
        });
        typeSetting.descEl.createEl("code", {
            text: "abstract",
        });
        typeSetting.descEl.createSpan({
            text: ")",
        });

        new Setting(settingDiv)
            .setName(t9n("admonition-title.name"))
            .setDesc(t9n("admonition-title.desc"))
            .addText((text) => {
                text.setValue(this.title).onChange((v) => {
                    if (!v.length) {
                        this.title = null;
                        this.setAdmonitionElement(
                            this.type?.[0].toUpperCase() +
                                title.slice(1).toLowerCase(),
                        );
                        return;
                    }

                    this.title = v;
                    this.setAdmonitionElement(this.title);
                });
            });
        new Setting(settingDiv)
            .setName(t9n("no-title.name"))
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: t9n("no-title.desc-prefix"),
                    });
                    e.createEl("code", { text: "title" });
                    e.createSpan({ text: t9n("no-title.desc-suffix") });
                }),
            )
            .addToggle((t) => {
                t.setValue(this.noTitle).onChange((v) => (this.noTitle = v));
            });
        new Setting(settingDiv)
            .setName(t9n("show-copy.name"))
            .setDesc(t9n("show-copy.desc"))
            .addToggle((t) => {
                t.setValue(this.copy).onChange((v) => (this.copy = v));
            });
        const input = createEl("input", {
            attr: {
                type: "file",
                name: "image",
                accept: "image/*",
            },
        });
        let iconText: TextComponent;
        new Setting(settingDiv)
            .setName(t9n("admonition-icon.name"))
            .setDesc(t9n("admonition-icon.desc"))
            .addText((text) => {
                iconText = text;
                text.setDisabled(this.iconWithCss);
                if (this.icon.type !== "image") text.setValue(this.icon.name);

                const validate = async () => {
                    if (this.iconWithCss) {
                        SettingsModal.removeValidationError(text.inputEl);
                        return;
                    }
                    const v = text.inputEl.value;
                    const valid = validateIcon({ name: v }, this.plugin);
                    if (valid.success === false) {
                        SettingsModal.setValidationError(
                            text.inputEl,
                            valid.message,
                        );
                        return;
                    }

                    SettingsModal.removeValidationError(text.inputEl);
                    const ic = this.plugin.iconManager.getIconType(v);
                    this.icon = {
                        name: v,
                        type: ic,
                    };

                    const iconEl = this.admonitionPreview.querySelector(
                        ".admonition-title-icon",
                    );

                    iconEl.innerHTML =
                        this.plugin.iconManager.getIconNode(this.icon)
                            ?.outerHTML ?? "";
                };

                const modal = new IconSuggestionModal(
                    this.plugin,
                    text,
                    this.plugin.iconManager.iconDefinitions,
                );

                modal.onSelect((item) => {
                    text.inputEl.value = item.item.name;
                    void validate();
                    modal.close();
                });

                text.inputEl.onblur = validate;
            })
            .addButton((b) => {
                b.setButtonText(t9n("btn.upload-image")).setIcon("image-file");
                b.buttonEl.addClass("admonition-file-upload");
                b.buttonEl.appendChild(input);
                b.setDisabled(this.iconWithCss);
                b.onClick(() => input.click());
            })
            .addToggle((t) => {
                t.setTooltip(t9n("icon-with-css.name"))
                    .setValue(!this.iconWithCss)
                    .onChange((v) => {
                        this.iconWithCss = !v;
                        void this.display();
                    });
            });

        /** Image Uploader */
        input.onchange = async () => {
            const { files } = input;

            if (!files.length) return;

            const image = files[0];
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                const image = new Image();
                image.onload = () => {
                    try {
                        // Resize the image
                        const canvas = document.createElement("canvas");
                        const max_size = 24;
                        let width = image.width;
                        let height = image.height;
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        canvas
                            .getContext("2d")
                            .drawImage(image, 0, 0, width, height);

                        this.icon = {
                            name: canvas.toDataURL("image/png"),
                            type: "image",
                        };
                        void this.display();
                    } catch {
                        new Notice(t9n("error.image-parse"));
                    }
                };
                const result = evt.target?.result;
                if (typeof result !== "string") return;
                image.src = result;
            };
            reader.readAsDataURL(image);

            input.value = null;
        };

        const color = settingDiv.createDiv("admonition-color-settings");
        this.createColor(color);

        const footerEl = contentEl.createDiv();
        const footerButtons = new Setting(footerEl);
        footerButtons.addButton((b) => {
            b.setTooltip(t9n("btn.save"))
                .setIcon("checkmark")
                .onClick(async () => {
                    const icon = { ...this.icon };
                    if (iconText.inputEl.value?.length) {
                        icon.name = iconText.inputEl.value;
                    }
                    const valid = this.iconWithCss
                        ? validateType(
                              typeText.inputEl.value,
                              this.plugin,
                              this.originalType,
                          )
                        : validate(
                              this.plugin,
                              typeText.inputEl.value,
                              icon,
                              this.originalType,
                          );
                    if (valid.success === false) {
                        SettingsModal.setValidationError(
                            valid.failed === "type"
                                ? typeText.inputEl
                                : iconText.inputEl,
                            valid.message,
                        );
                        new Notice(t9n("error.fix-before-save"));
                        return;
                    }
                    this.saved = true;
                    this.close();
                });
            return b;
        });
        footerButtons.addExtraButton((b) => {
            b.setIcon("cross")
                .setTooltip(t9n("btn.cancel"))
                .onClick(() => {
                    this.saved = false;
                    this.close();
                });
            return b;
        });
    }
    createColor(el: HTMLDivElement) {
        el.empty();
        const colorEnabled = this.injectColor && this.plugin.data.injectColor;
        const desc = !this.plugin.data.injectColor
            ? t9n("color.disabled-global")
            : t9n("color.enabled");
        new Setting(el)
            .setName(t9n("color.name"))
            .setDesc(desc)
            .addText((t) => {
                t.inputEl.setAttribute("type", "color");

                if (!colorEnabled) {
                    t.inputEl.setAttribute("disabled", "true");
                }

                t.setValue(rgbToHex(this.color)).onChange((v) => {
                    const color = hexToRgb(v);
                    if (!color) return;
                    this.color = `${color.r}, ${color.g}, ${color.b}`;
                    if (colorEnabled) {
                        this.admonitionPreview.setAttribute(
                            "style",
                            `--callout-color: ${this.color};`,
                        );
                    }
                });
            })
            .addToggle((t) =>
                t
                    .setValue(this.injectColor)
                    .setTooltip(
                        `${this.injectColor ? "Disable" : "Enable"} Admonition Color`,
                    )
                    .setDisabled(!this.plugin.data.injectColor)
                    .onChange((v) => {
                        this.injectColor = v;

                        if (!v) {
                            this.admonitionPreview.removeAttribute("style");
                        } else {
                            this.admonitionPreview.setAttribute(
                                "style",
                                `--callout-color: ${this.color};`,
                            );
                        }

                        this.createColor(el);
                    }),
            );
    }

    onOpen() {
        void this.display();
    }

    static setValidationError(textInput: HTMLInputElement, message?: string) {
        textInput.addClass("is-invalid");
        if (message) {
            textInput.parentElement.addClasses([
                "has-invalid-message",
                "unset-align-items",
            ]);
            textInput.parentElement.parentElement.addClass(
                ".unset-align-items",
            );
            let mDiv =
                textInput.parentElement.querySelector<HTMLDivElement>(
                    ".invalid-feedback",
                );

            if (!mDiv) {
                mDiv = textInput.parentElement.createDiv({
                    cls: "invalid-feedback",
                });
            }
            mDiv.setText(message);
        }
    }
    static removeValidationError(textInput: HTMLInputElement) {
        textInput.removeClass("is-invalid");
        textInput.parentElement.removeClasses([
            "has-invalid-message",
            "unset-align-items",
        ]);
        textInput.parentElement.parentElement.removeClass(".unset-align-items");

        if (textInput.parentElement.querySelector(".invalid-feedback")) {
            textInput.parentElement.removeChild(
                textInput.parentElement.querySelector(".invalid-feedback"),
            );
        }
    }
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
        ? {
              r: Number.parseInt(result[1], 16),
              g: Number.parseInt(result[2], 16),
              b: Number.parseInt(result[3], 16),
          }
        : null;
}
function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
function rgbToHex(rgb: string) {
    const result = /^(\d+),\s?(\d+),\s?(\d+)/i.exec(rgb);
    if (!result?.length) {
        return "";
    }
    return `#${componentToHex(Number(result[1]))}${componentToHex(
        Number(result[2]),
    )}${componentToHex(Number(result[3]))}`;
}

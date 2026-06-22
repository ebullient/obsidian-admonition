import {
    Modal,
    Notice,
    Setting,
    sanitizeHTMLToDom,
    type TextComponent,
} from "obsidian";
import { t9n } from "src/lang/helpers";
import type { Admonition, AdmonitionIconDefinition } from "../@types";
import type ObsidianAdmonition from "../main";
import { buildAdmonitionPreview } from "../util";
import { validate, validateIcon, validateType } from "../util/validator";
import { IconSuggestionModal } from ".";

export class CalloutSettingsModal extends Modal {
    color = "#7d7d7d";
    editing = false;
    error = false;
    icon: AdmonitionIconDefinition = {};
    iconWithCss = false;
    noTitle = false;
    saved = false;

    type?: string;
    originalType?: string;
    title?: string;

    injectColor: boolean;
    copy: boolean;
    admonitionPreviewParent?: HTMLElement;
    admonitionPreview?: HTMLElement;

    constructor(
        public plugin: ObsidianAdmonition,
        admonition?: Admonition,
    ) {
        super(plugin.app);
        if (admonition) {
            this.color = admonition.color ?? "#7d7d7d";
            this.copy = admonition.copy ?? this.plugin.data.copyButton;
            this.editing = true;
            this.icon = admonition.icon ?? {};
            this.iconWithCss = this.plugin.isIconWithCss(admonition);
            this.injectColor = this.plugin.shouldInjectColor(admonition);
            this.noTitle = admonition.noTitle ?? false;
            this.originalType = admonition.type;
            this.title = admonition.title;
            this.type = admonition.type;
        } else {
            this.copy = this.plugin.data.copyButton;
            this.injectColor = this.plugin.data.injectColor;
        }
    }

    setAdmonitionElement(parentEl: HTMLElement, title: string) {
        this.admonitionPreviewParent = parentEl;
        this.admonitionPreview = buildAdmonitionPreview(
            parentEl,
            this.plugin,
            {
                type: this.type,
                icon: this.icon,
                color: this.color,
                iconWithCss: this.iconWithCss,
                injectColor: this.injectColor,
            } as Admonition,
            title[0].toUpperCase() + title.slice(1).toLowerCase(),
        );
    }
    async display() {
        this.containerEl.addClass("admonition-settings-modal");
        this.titleEl.setText(`${this.editing ? "Edit" : "Add"} Admonition`);
        const { contentEl } = this;

        contentEl.empty();

        const settingDiv = contentEl.createDiv();
        const title = this.title ?? this.type ?? "...";
        const admonitionPreviewParent = contentEl.createDiv();

        this.setAdmonitionElement(
            admonitionPreviewParent,
            title[0].toUpperCase() + title.slice(1).toLowerCase(),
        );

        let typeText: TextComponent;
        const typeSetting = new Setting(settingDiv)
            .setName(t9n("admonition-type.name"))
            .addText((text) => {
                typeText = text;
                typeText.setValue(this.type ?? "").onChange((v) => {
                    const valid = validateType(
                        v,
                        this.plugin,
                        this.originalType,
                    );
                    if (valid.success === false) {
                        CalloutSettingsModal.setValidationError(
                            text.inputEl,
                            valid.message,
                        );
                        return;
                    }

                    CalloutSettingsModal.removeValidationError(text.inputEl);

                    this.type = v;
                    if (!this.title)
                        this.setAdmonitionElement(
                            admonitionPreviewParent,
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
                text.setValue(this.title ?? "").onChange((v) => {
                    if (!v.length) {
                        this.title = "";
                        this.setAdmonitionElement(
                            admonitionPreviewParent,
                            this.type?.[0].toUpperCase() +
                                title.slice(1).toLowerCase(),
                        );
                        return;
                    }

                    this.title = v;
                    this.setAdmonitionElement(
                        admonitionPreviewParent,
                        this.title,
                    );
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
                if (this.icon.type !== "image") {
                    text.setValue(this.icon?.name ?? "");
                }

                const validate = async () => {
                    if (this.iconWithCss) {
                        CalloutSettingsModal.removeValidationError(
                            text.inputEl,
                        );
                        return;
                    }
                    const v = text.inputEl.value;
                    const valid = validateIcon({ name: v }, this.plugin);
                    if (valid.success === false) {
                        CalloutSettingsModal.setValidationError(
                            text.inputEl,
                            valid.message,
                        );
                        return;
                    }

                    CalloutSettingsModal.removeValidationError(text.inputEl);
                    const ic = this.plugin.iconManager.getIconType(v);
                    this.icon = {
                        name: v,
                        type: ic,
                    };

                    const iconEl = this.admonitionPreview?.querySelector(
                        ".admonition-title-icon",
                    );

                    iconEl?.replaceChildren(
                        sanitizeHTMLToDom(
                            this.plugin.iconManager.getIconNode(this.icon)
                                ?.outerHTML ?? "",
                        ),
                    );
                };

                const modal = new IconSuggestionModal(
                    this.plugin,
                    text,
                    this.plugin.iconManager.iconDefinitions,
                );

                modal.onSelect((item) => {
                    text.inputEl.value = item.item?.name ?? "";
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

            if (!files?.length) return;

            const image = files[0];
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                const image = new Image();
                image.onload = () => {
                    try {
                        // Resize the image
                        const canvas = activeDocument.createEl("canvas");
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
                        const context = canvas.getContext("2d");
                        if (context) {
                            context.drawImage(image, 0, 0, width, height);
                        }

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

            input.value = "";
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
                        CalloutSettingsModal.setValidationError(
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
                    this.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
                    if (colorEnabled) {
                        this.admonitionPreview?.setAttribute(
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
                            this.admonitionPreview?.removeAttribute("style");
                        } else {
                            this.admonitionPreview?.setAttribute(
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
        if (!textInput.parentElement) {
            return;
        }
        if (message) {
            textInput.parentElement.addClasses([
                "has-invalid-message",
                "unset-align-items",
            ]);
            textInput.parentElement.parentElement?.addClass(
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
        if (!textInput.parentElement) {
            return;
        }
        textInput.parentElement.removeClasses([
            "has-invalid-message",
            "unset-align-items",
        ]);
        textInput.parentElement.parentElement?.removeClass(
            ".unset-align-items",
        );

        const mDiv = textInput.parentElement.querySelector(".invalid-feedback");
        if (mDiv) {
            textInput.parentElement.removeChild(mDiv);
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
    // Handle both "rgb(r, g, b)" and legacy "r, g, b" formats
    const result =
        /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i.exec(rgb) ??
        /^(\d+),\s?(\d+),\s?(\d+)/i.exec(rgb);
    if (!result?.length) {
        return "";
    }
    return `#${componentToHex(Number(result[1]))}${componentToHex(
        Number(result[2]),
    )}${componentToHex(Number(result[3]))}`;
}

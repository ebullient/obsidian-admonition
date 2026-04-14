import type { Admonition, AdmonitionIconDefinition } from "src/@types";
import { t9n } from "src/lang/helpers";
import type ObsidianAdmonition from "src/main";

type ValidationSuccess = {
    success: true;
    messages?: string[];
};
type ValidationError = {
    success: false;
    failed: "type" | "icon" | "rgb" | "title" | "booleans";
    message: string;
};
type Result = ValidationSuccess | ValidationError;

/** Taken from https://stackoverflow.com/questions/34849001/check-if-css-selector-is-valid/42149818 */
export const isSelectorValid = ((dummyElement) => (selector: string) => {
    try {
        dummyElement.querySelector(selector);
    } catch {
        return false;
    }
    return true;
})(document.createDocumentFragment());

export function validateImport(
    plugin: ObsidianAdmonition,
    admonition: Admonition,
): Result {
    const messages: string[] = [];
    const result: ValidationSuccess = { success: true, messages };
    const iconWithCss = admonition.iconWithCss === true;
    const validType = validateType(admonition.type, plugin);
    if (validType.success === false) {
        return validType;
    }
    if (!iconWithCss) {
        const iconName = admonition.icon?.name;
        const validIcon = validateType(iconName ?? "", plugin);
        if (validIcon.success === false) {
            return validIcon;
        }

        const iconNode = plugin.iconManager.getIconNode(admonition.icon);
        if (!iconNode) {
            messages.push(
                "No installed icon found by the name " +
                    (iconName ?? "") +
                    ". Perhaps you need to install a new icon pack?",
            );
        }
    }
    if (admonition.title && typeof admonition.title !== "string") {
        return {
            success: false,
            failed: "title",
            message: "Admonition titles can only be strings.",
        };
    }
    if (
        !("color" in admonition) ||
        !/(?:(?:2(?:[0-4]\d|5[0-5])|\d{1,2}|1\d\d)\s*,\s*){2}\s*(?:2(?:[0-4]\d|5[0-5])|\d{1,2}|1\d\d)/.test(
            admonition.color,
        )
    ) {
        console.warn(
            "No color provided for the import of " +
                admonition.type +
                ". Adding a random color.",
        );
        admonition.color = `${Math.floor(
            Math.random() * 255,
        )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255,
        )}`;
    }
    const booleans: (keyof Admonition)[] = [
        "command",
        "injectColor",
        "iconWithCss",
        "noTitle",
        "copy",
    ];
    for (const key of booleans) {
        if (
            key in admonition &&
            typeof JSON.parse(JSON.stringify(admonition[key])) !== "boolean"
        ) {
            return {
                success: false,
                failed: "booleans",
                message: `The "${key}" property must be a boolean if present.`,
            };
        }
    }
    return result;
}

export function validate(
    plugin: ObsidianAdmonition,
    type: string,
    icon: AdmonitionIconDefinition,
    oldType?: string,
): Result {
    const validType = validateType(type, plugin, oldType);
    if (validType.success === false) {
        return validType;
    }

    return validateIcon(icon, plugin);
}

export function validateType(
    type: string,
    plugin: ObsidianAdmonition,
    oldType?: string,
): Result {
    if (!type.length) {
        return {
            success: false,
            message: t9n("error.type-empty"),
            failed: "type",
        };
    }

    if (type.includes(" ")) {
        return {
            success: false,
            message: t9n("error.type-spaces"),
            failed: "type",
        };
    }
    if (!isSelectorValid(type)) {
        return {
            success: false,
            message: t9n("error.type-css"),
            failed: "type",
        };
    }
    const normalizedType = type.toLowerCase();
    if (
        normalizedType !== oldType &&
        normalizedType in plugin.data.userAdmonitions
    ) {
        return {
            success: false,
            message: "That Admonition type already exists.",
            failed: "type",
        };
    }
    return { success: true };
}

export function validateIcon(
    definition: AdmonitionIconDefinition,
    plugin: ObsidianAdmonition,
): Result {
    if (definition.type === "image") {
        return {
            success: true,
        };
    }
    if (!definition.name) {
        return {
            success: false,
            message: t9n("error.icon-empty"),
            failed: "icon",
        };
    }
    const icon = plugin.iconManager.getIconType(definition.name);
    if (!icon) {
        return {
            success: false,
            message: t9n("error.icon-invalid"),
            failed: "icon",
        };
    }
    return {
        success: true,
    };
}

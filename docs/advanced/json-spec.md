# JSON Specification

This page describes the fields you can use when creating admonitions via a `.json` import file (see [Import an Admonition](../import.md)).

## `Admonition`

```ts
interface Admonition {
    // Required. The type name used in code blocks (```ad-type) and callouts (> [!type]).
    type: string;

    // Optional. Default title shown in the admonition header.
    // If omitted, the type name is used as the title.
    title?: string;

    // The icon to display in the admonition header.
    icon: AdmonitionIconDefinition;

    // The admonition color as an RGB string, e.g. "200, 50, 50".
    color: string;

    // Whether to register Command Palette commands for this type.
    command: boolean;

    // If true, this admonition is styled entirely via CSS.
    // The plugin will not auto-generate icon/color CSS for this type.
    styleWithCss?: boolean;

    // Deprecated legacy field (color-only override).
    // Old imports using injectColor:false are migrated to styleWithCss:true.
    injectColor?: boolean;

    // If true, the title bar is hidden by default unless title: is explicitly set.
    noTitle: boolean;

    // If true, a "Copy Content" button is shown on the admonition.
    copy?: boolean;
}
```

## `AdmonitionIconDefinition`

```ts
type AdmonitionIconDefinition = {
    // Which icon pack the icon name belongs to.
    // If omitted, the plugin will infer it.
    type?: IconType;

    // The exact icon name from the chosen pack.
    name?: string;
};

type IconType =
    | "obsidian"      // Built-in Obsidian Lucide icons
    | "image"         // Custom uploaded image
    | DownloadableIconPack;

// Downloadable packs (can be enabled in Settings → Icon Packs)
type DownloadableIconPack =
    | "fas"       // Font Awesome Solid
    | "far"       // Font Awesome Regular
    | "fab"       // Font Awesome Brands
    | "octicons"  // GitHub Octicons
    | "rpg";      // RPG Awesome
```

> **Note:** The legacy `"font-awesome"` type is accepted on import for backwards compatibility and is automatically migrated to the appropriate `fas`/`far`/`fab` pack.

## Minimal Example

Only `type` is required. Omitting `icon` and `color` assigns defaults.

```json
[
    {
        "type": "my-type"
    }
]
```

## Full Example

```json
[
    {
        "type": "my-type",
        "title": "My Type",
        "icon": {
            "type": "fas",
            "name": "star"
        },
        "color": "200, 50, 50",
        "command": false,
        "styleWithCss": false,
        "noTitle": false,
        "copy": false
    }
]
```

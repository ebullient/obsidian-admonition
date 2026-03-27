# Admonitions API

The Admonitions plugin exposes a programmatic API that other plugins can use to register, remove, and inspect admonition types at runtime.

## Accessing the Plugin

There is no separate API object — methods are accessed directly on the plugin instance:

```typescript
const admonitions = this.app.plugins.plugins["obsidian-admonition"];
```

## Admonition Management

### `addAdmonition(admonition: Admonition): Promise<void>`

Registers a new custom admonition type. Updates CSS and saves settings.

```typescript
await admonitions.addAdmonition({
    type: "my-type",
    title: "My Type",
    icon: { type: "font-awesome", name: "star" },
    color: "200, 50, 50",
    command: false,
    noTitle: false,
    injectColor: true,
    copy: false,
});
```

### `removeAdmonition(admonition: Admonition): Promise<void>`

Removes a custom admonition type. Cleans up CSS and saves settings.

```typescript
await admonitions.removeAdmonition(admonition);
```

### `admonitions: Record<string, Admonition>` (getter)

Returns all available admonition types — both built-in and user-defined — keyed by type name.

```typescript
const all = admonitions.admonitions;
// { note: {...}, tip: {...}, "my-type": {...}, ... }
```

### `admonitionArray: Array<Admonition & { type: string }>` (getter)

Returns all admonitions as an array with the `type` property included on each object.

```typescript
for (const admonition of admonitions.admonitionArray) {
    console.log(admonition.type, admonition.icon);
}
```

### `types: string[]` (getter)

Returns an array of all registered admonition type names.

```typescript
console.log(admonitions.types);
// ["note", "tip", "warning", "my-type", ...]
```

## Icon Management

Icon operations are delegated to `plugin.iconManager`.

### `downloadIcon(pack: DownloadableIconPack): Promise<void>`

Downloads an optional icon pack.

```typescript
await admonitions.downloadIcon("rpg");
```

### `removeIcon(pack: DownloadableIconPack): Promise<void>`

Removes a downloaded icon pack.

```typescript
await admonitions.removeIcon("rpg");
```

## Type Definitions

### `Admonition`

```typescript
interface Admonition {
    type: string;                   // Unique identifier (used in code blocks / callouts)
    title?: string;                 // Default display title
    icon: AdmonitionIconDefinition; // Icon to display
    color: string;                  // RGB color string, e.g. "200, 50, 50"
    command: boolean;               // Whether insert commands are registered
    injectColor?: boolean;          // Whether to inject the color into the rendered output
    noTitle: boolean;               // Whether to suppress the title by default
    copy?: boolean;                 // Whether to show the copy-content button
}
```

### `AdmonitionIconDefinition`

```typescript
type AdmonitionIconDefinition = {
    type?: IconType;
    name?: string;  // Exact icon name from the chosen icon pack
};

type IconType =
    | "font-awesome"
    | "obsidian"
    | "image"
    | DownloadableIconPack;
```

`DownloadableIconPack` is a union of pack identifiers such as `"rpg"` and `"weather"`.

## Settings

The plugin's full settings object is available at `plugin.data`:

```typescript
interface AdmonitionSettings {
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
    open: {
        admonitions: boolean;
        icons: boolean;
        other: boolean;
        advanced: boolean;
    };
    msDocConverted: boolean;
    useSnippet: boolean;
    snippetPath: string;
}
```

Prefer using `addAdmonition` / `removeAdmonition` over mutating `plugin.data.userAdmonitions` directly, as those methods also update CSS and persist settings.

# Admonitions API

The Admonitions plugin exposes a programmatic API that other plugins can use to register, remove, and inspect admonition types at runtime.

## Accessing the Plugin

There is no separate API object — methods are accessed directly on the plugin instance:

```typescript
const plugin = this.app.plugins.plugins["obsidian-admonition"];
```

## Admonition Management

### `addAdmonition(admonition: Admonition): Promise<void>`

Registers a new custom admonition type. Updates CSS and saves settings.

```typescript
await plugin.addAdmonition({
    type: "my-type",
    title: "My Type",
    icon: { type: "font-awesome", name: "star" },
    color: "200, 50, 50",
    command: false,
    iconWithCss: false,
    noTitle: false,
    copy: false,
});
```

### `removeAdmonition(admonition: Admonition): Promise<void>`

Removes a custom admonition type. Cleans up CSS and saves settings.

```typescript
// Look up the admonition object first, then remove it
const admonition = plugin.admonitions["my-type"];
if (admonition) {
    await plugin.removeAdmonition(admonition);
}
```

### `admonitions: Record<string, Admonition>` (getter)

Returns all available admonition types — both built-in and user-defined — keyed by type name.

```typescript
const all = plugin.admonitions;
// { note: {...}, tip: {...}, "my-type": {...}, ... }
```

### `admonitionArray: Array<Admonition & { type: string }>` (getter)

Returns all admonitions as an array with the `type` property included on each object.

```typescript
for (const admonition of plugin.admonitionArray) {
    console.log(admonition.type, admonition.icon);
}
```

### `types: string[]` (getter)

Returns an array of all registered admonition type names.

```typescript
console.log(plugin.types);
// ["note", "tip", "warning", "my-type", ...]
```

## Icon Management

Icon operations are delegated to `plugin.iconManager`.

### `downloadIcon(pack: DownloadableIconPack): Promise<void>`

Downloads an optional icon pack.

```typescript
await plugin.downloadIcon("rpg");
```

### `removeIcon(pack: DownloadableIconPack): Promise<void>`

Removes a downloaded icon pack.

```typescript
await plugin.removeIcon("rpg");
```

## Type Definitions

### `Admonition`

See [JSON Specification](json-spec.md) for the full `Admonition` interface with field descriptions.

```typescript
interface Admonition {
    type: string;
    title?: string;
    icon: AdmonitionIconDefinition;
    color: string;
    command: boolean;
    iconWithCss?: boolean;
    /** @deprecated Use iconWithCss instead. */
    injectColor?: boolean;
    noTitle: boolean;
    copy?: boolean;
}
```

### `AdmonitionIconDefinition`

```typescript
type AdmonitionIconDefinition = {
    type?: IconType;
    name?: string;  // Exact icon name from the chosen icon pack
};

type IconType =
    | "obsidian"
    | "image"
    | DownloadableIconPack;

// Downloadable packs (can be enabled in Settings → Icon Packs)
type DownloadableIconPack =
    | "fas"       // Font Awesome Solid
    | "far"       // Font Awesome Regular
    | "fab"       // Font Awesome Brands
    | "octicons"  // GitHub Octicons
    | "rpg";      // RPG Awesome
```

> [!NOTE]
> The legacy `"font-awesome"` type string is still accepted for backwards compatibility and is automatically migrated to the appropriate `fas`/`far`/`fab` pack. As of v12.0.4, Font Awesome packs are downloadable like other packs; existing users with Font Awesome icons are migrated automatically.

> [!NOTE]
> Prefer `addAdmonition` / `removeAdmonition` over mutating `plugin.data.userAdmonitions` directly. Those methods also update the injected CSS and persist settings to disk.

# Admonition Plugin Test Vault

Quick manual verification of all supported admonition features.

Open this vault in Obsidian with the [Admonition plugin](https://github.com/ebullient/obsidian-admonition) installed.

## Test Files

| File | What it tests |
|------|--------------|
| [[01-basic-options]] | `title:`, `collapse:`, `icon:`, no-content — core header options |
| [[02-color-formats]] | All `color:` input formats (RGB, hex, HSL, HSB/HSV) |
| [[03-metadata]] | Undocumented `metadata:` parameter — both `ad-*` and callout syntax |
| [[04-nesting]] | Nested admonitions, code blocks, and embedded notes inside admonitions |
| [[05-callout-syntax]] | Obsidian native `> [!type]` callout syntax with plugin enhancements |
| [[06-limitations]] | Known limitations (collapse requires a title) |
| [[07-all-types]] | All built-in admonition types and their aliases |
| [[08-mermaid]] | Mermaid diagrams in all collapse states; mermaid + embeds |
| [[09-image-icon]] | Icon behavior reference: codeblocks, callout limitation, SVG/CSS alternative |

## Quick Syntax Reference

### `ad-*` block syntax

````md
```ad-<type>
title: Optional title (markdown supported)
collapse: open | closed | none
icon: <icon-name>
color: r, g, b
metadata: <value>

Content goes here.
```
````

> [!NOTE]
> Parameters must appear at the **top** of the block, in any order (since v4.4.1).
> The first non-parameter line ends the header section.

### Callout syntax

```md
> [!type|metadata] Title
> Content
```

Collapsible callouts use `+` (open) or `-` (closed) after the type:
```md
> [!note]+ Open by default
> > [!warning]- Closed by default
```

---
priority: medium
someToggle: false
---
# Meta Bind Compatibility

Demonstrates admonitions containing [Meta Bind](https://github.com/mProjectsCode/obsidian-meta-bind-plugin) input fields in Live Preview mode.

**Requires:** Meta Bind plugin installed and enabled.

| Action | Result |
|--------|--------|
| Click toggle | Toggles the value |
| Click dropdown | Opens dropdown |
| Click text field | Focuses text input |
| Click body (non-interactive) | Moves editor cursor to admonition source |

## Behavior

Clicking anywhere on an admonition in LP mode moves the editor cursor to the admonition's source — the same behavior as native Obsidian callouts. Clicks on interactive elements (inputs, buttons, dropdowns, checkboxes, links) are passed through to the element instead.

## Toggle input inside `ad-*` block

```ad-note
title: Settings Admonition
`INPUT[toggle:someToggle]` Enable feature
```

> [!note] Settings Callout
> `INPUT[toggle:someToggle]` Enable feature

## Dropdown inside `ad-warning` block

```ad-warning
title: Priority Admonition
`INPUT[inlineSelect(option(low), option(medium), option(high)):priority]`
```

> [!warning] Priority Callout
> `INPUT[inlineSelect(option(low), option(medium), option(high)):priority]`

## Text input inside `ad-info` block

```ad-info
title: Notes Admonition
`INPUT[text:notes]`
```

> [!info] Notes Callout
> `INPUT[text:notes]`

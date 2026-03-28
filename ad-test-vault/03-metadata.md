# metadata: parameter

> [!NOTE]
> The `metadata:` parameter sets the `data-callout-metadata` HTML attribute on the 
> rendered admonition element.
> It has no default visual effect — its value is available for CSS and JavaScript targeting.

---

## `ad-*` block syntax

Use `metadata:` as a header parameter:

```ad-note
title: Admonition with metadata
metadata: highlight
This admonition has `data-callout-metadata="highlight"` on its root element.
Inspect the DOM to verify (Cmd+Opt+I in Obsidian DevTools).
```

```ad-warning
title: Another metadata value
metadata: priority-high
Use any string value. Multiple admonitions can share or differ on metadata values.
```

```ad-info
title: Empty metadata
metadata:
An empty value sets `data-callout-metadata=""` (same as the default when omitted).
```

---

## Callout syntax: pipe notation

For Obsidian native callout blocks, metadata comes after a `|` pipe inside the brackets:

> [!note|highlight] Callout with metadata
> This callout has `data-callout-metadata="highlight"` set via the pipe syntax.

> [!warning|priority-high] High priority warning
> Same metadata value as the `ad-*` example above, using callout syntax.

> [!tip|custom-style] Custom styled tip
> The metadata value is whatever comes after the `|` before the `]`.

---

## Using metadata with CSS

Add a CSS snippet in `.obsidian/snippets/` to style admonitions by metadata value:

```css
/* Style any admonition with metadata="highlight" */
.callout[data-callout-metadata="highlight"] {
    border-left-width: 4px;
    border-left-style: solid;
}

/* Style admonitions with metadata="priority-high" */
.callout[data-callout-metadata="priority-high"] .callout-title {
    font-weight: 800;
    text-transform: uppercase;
}
```

---

## Using metadata with JavaScript / Dataview

You can query admonitions by metadata value from a script or Dataview JS block:

```javascript
// Find all rendered admonitions with a specific metadata value
document.querySelectorAll('.callout[data-callout-metadata="highlight"]')
```

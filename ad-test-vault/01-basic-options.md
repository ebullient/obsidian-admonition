# Basic Options

## Default (no options)

The admonition type name becomes the title (capitalized).

```ad-note
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

```ad-Note
case-insensitive admonition name
```

---

## title: — Custom title

```ad-note
title: Custom Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

---

## title: — Markdown in title

Titles are rendered as Markdown (bold, italic, math, etc.).

```ad-tip
title: **Bold**, _italic_, and `code` in a title
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

LaTeX math in title:

```ad-info
title: $\sum\frac{\pi}{\sigma}$
The title above contains LaTeX math.
```

---

## title: (blank) — No title bar

Leave the value empty to suppress the title bar entirely.

```ad-note
title:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. No title bar renders above.
```

---

## collapse: open

Renders expanded. Click the title to collapse.

```ad-warning
title: Collapsible (open)
collapse: open
This renders expanded. Click the title to collapse it.
```

---

## collapse: closed

Renders collapsed. Click the title to expand.

```ad-danger
title: Collapsible (closed)
collapse: closed
This content is hidden until you click the title to expand.
```

---

## collapse: none

Forces non-collapsible even when the "Collapsible By Default" plugin setting is enabled.

```ad-success
title: Forced non-collapsible
collapse: none
This admonition will never be collapsible, regardless of plugin settings.
```

---

## icon: — Override icon

Provide the exact name of a FontAwesome or RPGAwesome icon.

```ad-note
title: Custom Icon (triforce)
icon: triforce
This uses the `triforce` icon from RPGAwesome instead of the default note icon.
```

---

## No content — Title bar only

An admonition with no body renders only the title bar.

```ad-abstract
title: No content below this line
```

---

## Parameter order

Parameters can appear in any order (since v4.4.1). The first non-parameter line ends the header section.

```ad-example
title: Order doesn't matter
color: 100, 149, 237
collapse: open
icon: star
This admonition uses title, color, collapse, and icon — in a different order than the docs show.
```

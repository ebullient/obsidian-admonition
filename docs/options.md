# Admonition Options

[![Admonitions demo](https://github.com/ebullient/obsidian-admonitions/blob/main/publish/gifs/all.gif?raw=true)](https://github.com/ebullient/obsidian-admonitions)

Placing a code block with the admonition type:

````md
```ad-note
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

Becomes:

![Default Admonition Note](https://github.com/ebullient/obsidian-admonitions/blob/main/publish/images/default.png?raw=true)

## Options

````md
```ad-<type> # Admonition type — see types.md for the full list.
title:                  # Admonition title (optional).
collapse:               # open | closed | none
icon:                   # Override the icon.
color:                  # Override the color.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

> [!WARNING]
> As of **4.4.1**, the `title`, `collapse`, `icon` and `color` parameters must be at the *top* of the block, in any order.

### Title

The admonition will render with the type of admonition by default. If you wish to customize the title, you can do so this way:

````md
```ad-note
title: Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

Custom titles are rendered as Markdown, so they support the full Markdown syntax available to Obsidian.

````md
```ad-note
title: $\sum\frac{\pi}{\sigma}$
```
````

Becomes:

![Rendered title markdown](https://github.com/ebullient/obsidian-admonitions/blob/main/publish/images/rendered-title-markdown.png?raw=true)

Leave the title field blank to only display the admonition content without a title.

````md
```ad-note
title:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

![No title](https://github.com/ebullient/obsidian-admonitions/blob/main/publish/images/no-title.png?raw=true)

### Collapsible

To create a collapsible admonition, add the `collapse` parameter. Valid values:

| Value | Behavior |
|-------|----------|
| `open` | Renders open; can be collapsed by clicking the title |
| `closed` | Renders collapsed; can be expanded by clicking the title |
| `none` | Forces the admonition to be non-collapsible, even if "Collapsible By Default" is enabled in settings |

If the admonition's title is left blank, the `collapse` parameter has no effect.

You can set all admonitions to be collapsible by default in the [settings](settings.md).

![Collapse demo](https://github.com/ebullient/obsidian-admonitions/blob/main/publish/gifs/collapse.gif?raw=true)

> [!NOTE]
> Mermaid diagrams render correctly inside admonitions regardless of collapse state.

### Icon

To change the default icon of an admonition, you can use the `icon` parameter.

Please note that the icon name you provide must be the exact name of an icon from either **FontAwesome** or **RPGAwesome**, otherwise it will not work.

````md
```ad-note
icon: triforce

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

### Color

To change the color of an admonition, you can use the `color` parameter followed by an RGB triad value. The RGB triad should be entered as three integers separated by commas, each between 0 and 255.

**For example**: `color: 255, 0, 0` sets the color to red, and `color: 0, 128, 0` sets the color to green.

````md
```ad-note
color: 200, 200, 200

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla.
```
````

### No Content

If an admonition is created without any content, only the title block will be rendered.

````md
```ad-note
```
````

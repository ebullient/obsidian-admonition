# Icon Attribute Behavior

This page centralizes icon behavior for code block admonitions and native callouts.

## Setup

1. Open Admonition settings.
2. Create a custom admonition type named `image-362`.
3. Set its icon to `assets/red-square-16.png`.
4. Save settings.

## 1) `icon:` in code block admonitions

The `icon:` header attribute applies to `ad-*` code blocks.

```ad-note
title: Code block icon override
icon: bug
This code block uses the `icon:` parameter.
```

## 2) Uploaded image icon behavior

With the custom `image-362` type above:

```ad-image-362
title: Code block with uploaded image icon
The red square icon from settings should render here.
```

> [!image-362] Native callout with same type
> Native callouts do not use the code-block `icon:` attribute.
> With an uploaded bitmap icon, the title may render without the image icon.

## 3) Alternative for one icon across both forms

Use CSS with an SVG `--callout-icon` value (per Obsidian callout customization docs):

```css
.callout[data-callout="image-362"] {
    --callout-icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor"/></svg>';
}
```

This applies to both:
- `> [!image-362]` native callouts
- `` ```ad-image-362 `` code block admonitions
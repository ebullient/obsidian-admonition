# Admonitions

[GitHub Repo](https://github.com/valentine195/obsidian-admonition) | [Changelog](https://github.com/valentine195/obsidian-admonition/blob/master/CHANGELOG.md) | [Issues](https://github.com/valentine195/obsidian-admonition/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)

The Admonitions plugin for [Obsidian](https://obsidian.md) adds block-styled content and callout functionality to your notes, with a design inspired by [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/).

## Features

1. Create either a code block or a callout using Admonitions.
2. Set default titles, default collapse states, or default no-title options for the callouts you create with Admonitions.
3. Admonitions includes editor suggestions to speed up the process of creating custom admonitions and callout boxes.
4. Admonitions provides helpful commands for inserting callout boxes and the ability to register commands for specific types.
5. Download optional icon packs: Font Awesome (Solid, Regular, Brands), Octicons, and RPG Awesome. As of v12.0.4, Font Awesome packs are also downloaded (a migration step will download them automatically if you had Font Awesome icons in use).
6. Check out the Obsidian TTRPG-Share's [Repository of Admonitions](https://github.com/Obsidian-TTRPG-Community/ObsidianTTRPGShare/tree/0a8b23a52fcf6129ddae9fc21a2e7433f83cc343/System-Agnostic/admonitions) for some starter admonitions.

## Quickstart

Admonitions supports two syntaxes. Both use the same type names, and any custom type you define in settings works as either form.

**Callout** (Obsidian's native syntax — simpler, works everywhere):

```md
> [!tip] This is a tip
> This is the content of the admonition.
```

**Code block** (plugin syntax — supports additional parameters):

````md
```ad-tip
title: This is a tip
collapse: open

This is the content of the admonition.
```
````

Code blocks support `title:`, `collapse:`, `icon:`, and `color:` parameters. See [Admonition Options](options.md) for details.

## Suggested Reading Order

1. [Admonition Options](options.md)
   - [Types of Admonitions](types.md)
   - [Nesting Admonitions](nesting.md)
2. [Settings](settings.md)
3. [Command Palette](commands.md)
4. [Create an Admonition](create.md)
5. [Import an Admonition](import.md)

### Advanced Topics

1. [Admonition CSS](advanced/css.md)
2. [JSON Specification](advanced/json-spec.md)
3. [API](advanced/api.md)
4. [Localizing Admonitions](advanced/localizing.md)
5. [Publish.js with Admonitions](advanced/publish.md)

## Community Reviews

[▶ Video walkthrough on YouTube](https://www.youtube.com/watch?v=TqYQ0kA1yAo)

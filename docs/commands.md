# Admonition Commands

The plugin provides several commands in the [Command Palette](https://help.obsidian.md/Plugins/Command+palette) by default.

## Collapse and Expand All Admonitions in Note

If an open note has collapsible admonitions, these commands can collapse or expand all of them, respectively.

## Insert Admonition

This command opens a modal window to set the type, title, and collapse behavior of a new admonition. The plugin then generates the appropriate code block, which is inserted into the open editor.

## Admonition-Specific Commands

Custom commands can be registered for each custom admonition type by clicking the **Register Commands** button next to the type in the Admonitions settings list.

Three commands will be registered for each type: `Insert <type> Callout`, `Insert <type>`, and `Insert <type> with Title`.

> **Callout vs. code block:** A *callout* uses Obsidian's native `> [!type]` blockquote syntax. A *code block admonition* uses the plugin's `` ```ad-type `` syntax. Both render visually the same; callouts are the simpler modern form, while code blocks support additional parameters like `icon:` and `color:`.

### Insert Callout

Inserts the selected type as an Obsidian callout (`> [!type]`), prepopulated with any text you had selected in the editor.

### Insert

Inserts the selected type as a code block admonition (`` ```ad-type ``), prepopulated with any text you had selected.

### Insert with Title

Inserts the selected type as a code block admonition with a `title:` parameter. The cursor is placed on the title line so you can type it immediately.

## Mermaid Graphs

Admonitions are compatible with Mermaid graphs. However, there are some restrictions:

- Mermaid graphs cannot be combined with embeds or transclusions.
- Mermaid graphs do not function within admonitions that are set to collapse by default.

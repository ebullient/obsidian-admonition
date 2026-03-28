# Admonition Commands

The plugin provides several commands in the [Command Palette](https://help.obsidian.md/Plugins/Command+palette) by default.

## Collapse and Expand All Admonitions in Note

If an open note has collapsible admonitions, these commands can collapse or expand all of them, respectively.

## Insert Admonition

This command opens a modal window to set the type, title, and collapse behavior of a new admonition. The plugin then generates the appropriate code block, which is inserted into the open editor.

### Collapse behavior in the modal

The **Make Collapsible** dropdown controls whether a collapse parameter is written into the inserted block. The dropdown initializes to match your configured *Default Collapse Type* if *Collapsible By Default* is enabled, or **Default** otherwise.

**For callouts** (`> [!type]` syntax):

| Selection | Written syntax | Behavior |
|---|---|---|
| **Default** | `> [!type]` | Obsidian's native behavior — collapsible, but neither forced open nor closed. |
| **Open** | `> [!type]+` | Starts expanded; can be collapsed. |
| **Closed** | `> [!type]-` | Starts collapsed; can be expanded. |
| **None** | `> [!type]` | Same as Default — callouts have no syntax to explicitly disable collapse. |

**For code block admonitions** (`` ```ad-type `` syntax):

| Selection | Written syntax | Behavior |
|---|---|---|
| **Default** | *(no collapse line)* | The plugin's *Collapsible By Default* setting applies at render time. |
| **Open** | `collapse: open` | Starts expanded; can be collapsed. |
| **Closed** | `collapse: closed` | Starts collapsed; can be expanded. |
| **None** | `collapse: none` | Removes collapsible behavior entirely, overriding *Collapsible By Default*. |

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


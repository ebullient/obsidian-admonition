# Callout Syntax

Obsidian native callout syntax (`> [!type]`) is processed by the plugin when the callout type matches a defined admonition type.

---

## Basic callout

> [!note]
> This is a basic note callout. The title defaults to the type name.

> [!warning]
> This is a warning callout.

---

## With custom title

The title follows the closing `]` on the first line.

> [!tip] Custom Tip Title
> The title is "Custom Tip Title" instead of the default "Tip".

> [!danger] Watch out!
> Custom title with an exclamation point.

---

## Collapsible: open by default (`+`)

> [!abstract]+ Summary (open)
> This callout renders expanded. Click the title to collapse.

---

## Collapsible: closed by default (`-`)

> [!question]- FAQ Entry (closed)
> This callout renders collapsed. Click the title to expand.

---

## Metadata via pipe (`|`)

Metadata is specified after a `|` pipe inside the brackets. The plugin sets `data-callout-metadata` on the element.

> [!note|highlight] Note with metadata
> This callout has `data-callout-metadata="highlight"`.

> [!warning|priority-high] High priority
> Metadata value is "priority-high".

> [!success|done] Completed task
> Metadata and title can be combined.

---

## Collapsible callout with metadata

> [!example|featured]+ Featured Example (open)
> Collapsible (`+`) and metadata (`|`) can be combined.
> The `+` goes after the metadata value.

> [!bug|known-issue]- Known Issue (closed)
> Collapsed callout with metadata.

---

## Nested callouts

> [!note] Outer callout
> This is the outer note.
> > [!warning] Nested warning
> > This warning is nested inside the note.
> > > [!danger] Doubly nested danger
> > > Three levels deep.

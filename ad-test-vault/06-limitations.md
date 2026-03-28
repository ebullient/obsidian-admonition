# Known Limitations

## Collapsible admonition requires a title

If `collapse:` is set but `title:` is blank, the plugin resets the title to the default type name and shows a notice. The admonition will still collapse.

```ad-note
title:
collapse: open
The blank title is reset to "Note" because collapse requires a title.
A "must have a title" notice appears in Obsidian.
```

// English

export default {
    // --- Main heading ---
    "settings.title": "Admonition settings",

    // --- Global settings headings ---
    "heading.admonitions-callouts": "Admonitions & callouts",
    "heading.icon-packs": "Icon packs",
    "heading.additional-syntaxes": "Additional syntaxes",
    "heading.advanced": "Advanced settings",

    // --- Export / Import ---
    "export-css.name": "Export custom types as CSS",
    "export-css.desc": "Export a CSS snippet for custom callout types.",
    "export-json.name": "Export custom types as JSON",
    "export-json.desc":
        "Choose custom types to export as a JSON file that you can then share with other users.",
    "use-snippet.name": "Use CSS snippet for custom callouts",
    "use-snippet.desc":
        "Instead of managing it internally, Admonitions will maintain a CSS snippet to enable your custom types for callouts. Required for correct rendering in popout windows.",
    "import.name": "Import admonition(s)",
    "import.desc": "Import admonitions from a JSON definition.",

    // --- Add New ---
    "add-new.name": "Add new",
    "add-new.desc":
        "Add a new admonition type. All custom admonitions will also be usable as callouts.",

    // --- Admonitions & Callouts ---
    "drop-shadow.name": "Add drop shadow",
    "drop-shadow.desc": "A drop shadow will be added to admonitions.",
    "collapsible.name": "Collapsible by default",
    "collapsible.desc-prefix":
        "All admonitions & callouts will be collapsible by default. Use ",
    "collapsible.desc-suffix": " to prevent.",
    "collapse-type.name": "Default collapse type",
    "collapse-type.desc":
        "Collapsible admonitions & callouts will be either opened or closed.",
    "copy-button.name": "Add copy button",
    "copy-button.desc":
        "Add a 'copy content' button to admonitions & callouts.",
    "parse-titles.name": "Parse titles as Markdown",
    "parse-titles.desc": "Admonition titles will be rendered as Markdown.",
    "set-colors.name": "Set admonition colors",
    "set-colors.desc":
        "Disable this setting to turn off admonition coloring by default. Can be overridden in the admonition definition.",
    "set-colors.tooltip": "Randomize",
    "hide-empty.name": "Hide empty admonitions",
    "hide-empty.desc":
        "Any admonition that does not have content inside it will be hidden.",

    // --- Icon Packs ---
    "additional-icons.name": "Load additional icons",
    "additional-icons.desc":
        "Load an additional icon pack. This requires an internet connection.",
    "btn.load": "Load",
    "btn.redownload": "Redownload",

    // --- Advanced ---
    "markdown-highlight.name": "Markdown syntax highlighting",
    "markdown-highlight.desc":
        "Use Obsidian's Markdown syntax highlighter in admonition code blocks. This setting is experimental and could cause errors.",

    // --- Per-admonition settings ---
    "admonition-type.name": "Admonition type",
    "admonition-title.name": "Admonition title",
    "admonition-title.desc":
        "This will be the default title for this admonition type.",
    "no-title.name": "No admonition title by default",
    "no-title.desc-prefix": "The admonition will have no title unless ",
    "no-title.desc-suffix": " is explicitly provided.",
    "show-copy.name": "Show copy button",
    "show-copy.desc":
        "A copy button will be added to the admonition & callout.",
    "icon-with-css.name": "Enable admonition icon",
    "admonition-icon.name": "Admonition icon",
    "admonition-icon.desc": "Icon to display next to the title.",
    "color.name": "Color",
    "color.enabled": "Set the admonition color.",
    "color.disabled-global":
        "Color injection is disabled globally. Enable 'Set admonition colors' in plugin settings to use this.",
    "color.disabled-per-admonition":
        "Color is disabled for this admonition type. Style color with CSS.",

    // --- Insert modal ---
    "modal.title.name": "Admonition title",
    "modal.title.desc": "Leave blank to render without a title.",
    "modal.collapsible.name": "Make collapsible",
    "option.default": "Default",
    "option.open": "Open",
    "option.closed": "Closed",
    "option.none": "None",

    // --- Export modal ---
    "export.title": "Export admonitions",
    "export.selected": "Export selected",
    "export.select-all": "Select all",
    "export.deselect-all": "Deselect all",

    // --- Buttons / actions ---
    "btn.add-additional": "Add additional",
    "btn.register": "Register commands",
    "btn.unregister": "Unregister commands",
    "btn.edit": "Edit",
    "btn.delete": "Delete",
    "btn.save": "Save",
    "btn.upload-image": "Upload image",
    "btn.choose-files": "Choose files",
    "btn.convert": "Convert",
    "btn.download-all": "Download all",
    "btn.select-download": "Select & download",
    "btn.insert": "Insert",
    "btn.cancel": "Cancel",

    // --- Validation / errors ---
    "error.type-empty": "Admonition type cannot be empty.",
    "error.type-spaces": "Admonition type cannot include spaces.",
    "error.type-css": "Types must be a valid CSS selector.",
    "error.icon-invalid": "Invalid icon name.",
    "error.icon-empty": "Icon cannot be empty.",
    "error.image-parse": "There was an error parsing the image.",
    "error.no-match": "No match found",
    "error.admonition-type-missing": "No admonition type by that name exists.",
    "error.export-none-selected":
        "At least one admonition must be chosen to export.",
    "error.fix-before-save": "Fix errors before saving.",
};

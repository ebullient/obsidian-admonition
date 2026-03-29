// English

export default {
    // --- Main heading ---
    "settings.title": "Admonition Settings",

    // --- Global settings headings ---
    "heading.admonitions-callouts": "Admonitions & Callouts",
    "heading.icon-packs": "Icon Packs",
    "heading.additional-syntaxes": "Additional Syntaxes",
    "heading.advanced": "Advanced Settings",

    // --- Export / Import ---
    "export-css.name": "Export Custom Types as CSS",
    "export-css.desc": "Export a CSS snippet for custom callout types.",
    "export-json.name": "Export Custom Types as JSON",
    "export-json.desc":
        "Choose custom types to export as a JSON file that you can then share with other users.",
    "use-snippet.name": "Use CSS Snippet for Custom Callouts",
    "use-snippet.desc":
        "Instead of managing it internally, Admonitions will maintain a CSS snippet to enable your custom types for callouts. Required for correct rendering in popout windows.",
    "import.name": "Import Admonition(s)",
    "import.desc": "Import admonitions from a JSON definition.",

    // --- Add New ---
    "add-new.name": "Add New",
    "add-new.desc":
        "Add a new Admonition type. All custom Admonitions will also be usable as callouts.",

    // --- Admonitions & Callouts ---
    "drop-shadow.name": "Add Drop Shadow",
    "drop-shadow.desc": "A drop shadow will be added to admonitions.",
    "collapsible.name": "Collapsible by Default",
    "collapsible.desc-prefix":
        "All admonitions & callouts will be collapsible by default. Use ",
    "collapsible.desc-suffix": " to prevent.",
    "collapse-type.name": "Default Collapse Type",
    "collapse-type.desc":
        "Collapsible admonitions & callouts will be either opened or closed.",
    "copy-button.name": "Add Copy Button",
    "copy-button.desc":
        "Add a 'copy content' button to admonitions & callouts.",
    "parse-titles.name": "Parse Titles as Markdown",
    "parse-titles.desc": "Admonition Titles will be rendered as markdown.",
    "set-colors.name": "Set Admonition Colors",
    "set-colors.desc":
        "Disable this setting to turn off admonition coloring by default. Can be overridden in the admonition definition.",
    "set-colors.tooltip": "Randomize",
    "hide-empty.name": "Hide Empty Admonitions",
    "hide-empty.desc":
        "Any admonition that does not have content inside it will be hidden.",

    // --- Icon Packs ---
    "font-awesome.name": "Use Font Awesome Icons",
    "font-awesome.desc":
        "Font Awesome Free icons will be available in the item picker. Existing Admonitions defined using Font Awesome icons will continue to work.",
    "additional-icons.name": "Load Additional Icons",
    "additional-icons.desc":
        "Load an additional icon pack. This requires an internet connection.",
    "btn.load": "Load",
    "btn.redownload": "Redownload",

    // --- Additional Syntaxes ---
    "convert-msdoc.name": "Convert MSDoc Admonitions to Callouts",
    "convert-msdoc.desc-warning": "This ",
    "convert-msdoc.desc-warning-bold": "will",
    "convert-msdoc.desc-warning-suffix":
        " modify notes. Use at your own risk and please make backups.",
    "convert-msdoc.desc-note": "With large vaults, this could take awhile!",
    "convert-msdoc.progress": "Converting MS-doc admonitions...",
    "convert-codeblock.name": "Convert Codeblock Admonitions to Callouts",
    "convert-codeblock.progress": "Converting Codeblock admonitions...",

    // --- Advanced ---
    "markdown-highlight.name": "Markdown Syntax Highlighting",
    "markdown-highlight.desc":
        "Use Obsidian's markdown syntax highlighter in admonition code blocks. This setting is experimental and could cause errors.",

    // --- Per-admonition settings ---
    "admonition-type.name": "Admonition Type",
    "admonition-title.name": "Admonition Title",
    "admonition-title.desc":
        "This will be the default title for this admonition type.",
    "no-title.name": "No Admonition Title by Default",
    "no-title.desc-prefix": "The admonition will have no title unless ",
    "no-title.desc-suffix": " is explicitly provided.",
    "show-copy.name": "Show Copy Button",
    "show-copy.desc":
        "A copy button will be added to the admonition & callout.",
    "admonition-icon.name": "Admonition Icon",
    "admonition-icon.desc": "Icon to display next to the title.",
    "color.name": "Color",

    // --- Insert modal ---
    "modal.title.name": "Admonition Title",
    "modal.title.desc": "Leave blank to render without a title.",
    "modal.collapsible.name": "Make Collapsible",
    "option.default": "Default",
    "option.open": "Open",
    "option.closed": "Closed",
    "option.none": "None",

    // --- Export modal ---
    "export.title": "Export Admonitions",
    "export.selected": "Export Selected",
    "export.select-all": "Select All",
    "export.deselect-all": "Deselect All",

    // --- Buttons / actions ---
    "btn.add-additional": "Add Additional",
    "btn.register": "Register Commands",
    "btn.unregister": "Unregister Commands",
    "btn.edit": "Edit",
    "btn.delete": "Delete",
    "btn.save": "Save",
    "btn.upload-image": "Upload Image",
    "btn.choose-files": "Choose Files",
    "btn.convert": "Convert",
    "btn.download-all": "Download All",
    "btn.select-download": "Select & Download",
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

# Admonition Settings

## Admonition Plugin Settings

In these plugin settings, you can create and manage custom admonition types, which are also referred to as callouts.

### Export Custom Types as CSS

This button generates a CSS snippet for your custom callout types, which you can save and use as desired.

### Export Custom Admonitions

This option allows you to select the admonitions in your list and export them to a `.json` file, which you can then import via [Import an Admonition](import.md).

### Add New

This option opens a modal window where you can create a new admonition. A visual guide is available at [Create an Admonition](create.md).

Once created, all admonitions can be used as [Obsidian callouts](https://help.obsidian.md/Editing+and+formatting/Callouts).

Each admonition in the list also has a **Register Commands** button. Clicking it registers three Command Palette commands for that type — see [Commands](commands.md#admonition-specific-commands) for details.

### Importing Custom Admonitions

Imports admonitions from a JSON file. See [Import an Admonition](import.md) for a step-by-step guide and JSON format examples, and [JSON Specification](advanced/json-spec.md) for the full field reference.

## Admonitions & Callouts Settings

Settings related to the display and behavior of admonitions and callouts.

- **Add Drop Shadow**: Adds a drop shadow to rendered admonitions. If turned off, admonitions receive the `.no-drop` CSS class instead.
- **Collapsible By Default**: Determines whether all admonitions are collapsible by default, except those with `collapse: none` set in the parameters.
- **Default Collapse Type**: Only available if Collapsible By Default is enabled. Sets the default collapse type for admonitions.
- **Add Copy Button**: Adds a "Copy Content" button to the top-right corner of the admonition content.
- **Parse Titles as Markdown**: Controls whether admonition titles are rendered as markdown.
- **Set Admonition Colors**: Determines whether a rendered admonition is assigned a color. If turned off, you can control color via CSS.
- **Hide Empty Admonitions**: Hides admonitions with no content. Note: this only works for admonitions that have *no text content whatsoever*.

## Advanced Settings

Additional settings to further customize the Admonition plugin.

### Markdown Syntax Highlighting

Enables syntax highlighting when editing admonition code blocks.

### Sync Links to Metadata Cache

When enabled, the plugin attempts to synchronize links to the metadata cache so they can be displayed in graph view.

> [!NOTE]
> This feature is experimental. Links will only be synced when rendered in an admonition and will not persist if you close and reopen Obsidian. See [issue #144](https://github.com/valentine195/obsidian-admonition/issues/144) for more information.

### Generate JS for Publish

> [!CAUTION]
> This feature was removed in v10.0.0. Use native Obsidian callouts (`> [!type]`) instead.

Generates JavaScript for use on custom-domain Obsidian Publish websites. See [Publish.js with Admonitions](advanced/publish.md) for historical details.

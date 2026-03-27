# Import an Admonition

Admonitions allows the import and export of [custom admonitions](types.md), as configured in the [Admonitions Settings](settings.md).

## Obtain an admonitions.json File

To import an Admonition, you need an admonitions `.json` file.

If you do not already have one, you can find some at both the [ObsidianTTRPGShare](https://github.com/Obsidian-TTRPG-Community/ObsidianTTRPGShare) and [TTRPG-CLI](https://github.com/ebullient/ttrpg-convert-cli/tree/main/examples) repositories.

## JSON Format

The file must be a JSON array of admonition definitions. The only required field is `"type"`:

```json
[
    {
        "type": "my-custom-type"
    }
]
```

When `"icon"` and `"color"` are not specified, a random color and the `pencil-alt` FontAwesome icon will be used. To set them explicitly:

```json
[
    {
        "type": "my-custom-type",
        "icon": "globe",
        "color": "120,120,120"
    }
]
```

To specify which icon pack the icon name comes from:

```json
[
    {
        "type": "my-custom-type",
        "icon": {
            "name": "globe",
            "type": "font-awesome"
        },
        "color": "120,120,120"
    }
]
```

See the [JSON Specification](advanced/json-spec.md) for all available fields.

## Import Steps

1. Open the Admonitions settings within Obsidian.

2. Navigate to the option named **Import Admonition(s)**.

<details>
<summary>Import an Admonition File</summary>

![Import an Admonition](images/IMG-Import%20an%20Admonition.png)

</details>

3. Select the **Choose Files** button.

4. Select the `.json` file you want to import.

<details>
<summary>Select an Admonition</summary>

![Select an Admonition file](images/IMG-Import%20an%20Admonition-3.png)

</details>

5. Select **Open**.

6. Your admonitions should now be in your Admonitions list and available for use.

<details>
<summary>List of Admonitions</summary>

![List of Admonitions after import](images/IMG-Import%20an%20Admonition-4.png)

</details>

> [!NOTE]
> **Some assembly may be required.** Some community admonition packs (such as PF2E) rely heavily on custom CSS for their appearance. If imported admonitions look plain or unstyled, check whether the pack includes a CSS file and add it as an [Obsidian CSS snippet](https://help.obsidian.md/Extending+Obsidian/CSS+snippets).

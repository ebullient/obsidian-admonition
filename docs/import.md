# Import an Admonition

Admonitions allows the import and export of [custom admonitions](types.md), as configured in the [Admonitions Settings](settings.md).

## Obtain an admonitions.json File

To import an Admonition, you need an admonitions `.json` file.

If you do not already have one, you can find some at both the [ObsidianTTRPGShare](https://github.com/Obsidian-TTRPG-Community/ObsidianTTRPGShare) and [TTRPG-CLI](https://github.com/ebullient/ttrpg-convert-cli/tree/main/examples) repositories.

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
> **Some assembly may be required.** Some Admonitions rely on styling CSS more than others — in such cases you should also grab the available CSS files. PF2E Admonitions are one such case.
>
> You can bypass the coloration and color admonitions directly by editing each one to use the CSS color from the JSON file.

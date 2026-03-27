# Create an Admonition

To create an Admonition, navigate to the [Admonition Settings](settings.md#add-new).

<details>
<summary>Gif of the Creation Process</summary>

![Create an Admonition](images/IMG-Create%20an%20Admonition.gif)

</details>

## Steps

1. Navigate to Obsidian's Settings.
2. Select Admonitions from the Plugin List.
3. Select **Add New** from the first set of options in [Settings](settings.md).
4. In the new window that opens:
   1. Enter an Admonition Type. This will be the name used in code blocks (`` ```ad-type `` ) and callouts (`> [!type]`).
   2. If desired, choose a default title shown when no `title:` parameter is given.
   3. If desired, enable **No Title** mode — the admonition will render without a title bar unless you explicitly provide one with `title:` in the code block.
   4. If desired, enable the copy button, which appears in the top-right corner of the admonition content.
   5. Select an admonition icon. You can use your own or select one from the included icon packs (see [Icon](options.md#icon)).
   6. Choose a color mode:
      - **CSS** — no color is injected by the plugin; you control the color via your own CSS snippet.
      - **JSON** — the plugin stores and injects the color; use the color picker to choose it.

<details>
<summary>Screenshot of Popup Window</summary>

![Create an Admonition settings popup](images/IMG-Create%20an%20Admonition.png)

</details>

# Types of Admonitions

The following admonition types are supported upon install:

| Type     | Aliases                     |
|----------|-----------------------------|
| note     | note, seealso               |
| abstract | abstract, summary, tldr     |
| info     | info, todo                  |
| tip      | tip, hint, important        |
| success  | success, check, done        |
| question | question, help, faq         |
| warning  | warning, caution, attention |
| failure  | failure, fail, missing      |
| danger   | danger, error               |
| bug      | bug                         |
| example  | example                     |
| quote    | quote, cite                 |

For a visual representation of what these admonitions look like, refer to the [Material for MkDocs admonitions reference](https://squidfunk.github.io/mkdocs-material/reference/admonitions/).

The default admonitions can be customised by creating a user-defined admonition with the same name.

## Custom Admonitions and Callouts

Custom admonitions may be created in [settings](settings.md). Creating a custom admonition will also enable it to be used as an Obsidian [callout](https://help.obsidian.md/Editing+and+formatting/Callouts).

Creating a new admonition requires three things: the type, the icon to use, and the colour of the admonition.

Only one admonition of each type may exist at any given time; if another admonition of the same type is created, it will override the previously created one.

If a default admonition is overridden, it can be restored by deleting the user-defined admonition.

By default, the background colour of the title is the **colour of the admonition** at **10% opacity**. CSS must be used to update this.

### Images as Icons

Instead of using an icon from a downloaded icon set (see the [Icon](options.md#icon) section), you can upload an image to use as an admonition icon. The uploaded image is stored at 24×24 resolution in the plugin's settings.

To remove an uploaded image icon, choose an icon from the icon chooser text box.

### Contributing an Icon Pack

The following steps are for **plugin contributors** who want to add a new icon pack to the codebase and submit it via pull request:

1. Create a new folder in the `icons` directory with the name of your icon set.
2. Inside the newly created folder, add an `icons.json` file that defines the icons as an object. Refer to the `Octicons json` file in the `icons/octicons/` folder for guidance.
3. In the `Icon Packs` file in the `src/icons/` directory, update the two variables with your icon pack's information.

Submit your icon pack as a pull request.

# Publish.js and Admonitions

> [!CAUTION]
> This feature was **removed in [v10.0.0](https://github.com/javalent/admonitions/releases/tag/10.0.0)**. It is recommended to use the callouts `> [!custom-admonition-name]` created from the Admonition plugin instead.

In general, plugins for Obsidian cannot currently be used on publish sites. Starting from version 6.4.0, Admonitions had a feature to generate a JavaScript file that could be utilized on Publish sites with custom domains.

> [!NOTE]
> Obsidian Publish only supports the use of external JavaScript on sites with custom domains. If your Publish site is **not** hosted on a custom domain, this functionality is not available.

## Instructions (Historical)

1. Go to the Admonition settings tab and click the **Generate JS for Publish** button.
2. Save the JavaScript file.
3. Copy the contents of the JS file to your `publish.js` file.
4. Add the contents of the [assets/main.css](https://github.com/valentine195/obsidian-admonition/tree/master/src/assets) file to your `publish.css` file.

Neither Javalent nor any other contributors to the Admonitions plugin can guarantee stability on your publish site. It is possible that other JavaScript included on your site may conflict with the generated JavaScript file.

If you encounter any issues, please create an issue on the [GitHub repository](https://github.com/valentine195/obsidian-admonition/issues).

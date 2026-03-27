# Admonitions CSS

> [!TIP]
> **SCSS Users**: The [main.scss](https://github.com/javalent/admonitions/blob/main/src/assets/main.scss) and [callout.scss](https://github.com/javalent/admonitions/blob/main/src/assets/callout.scss) are available directly from the repository.

## Default CSS for All Admonitions

<details>
<summary>The Big List of Default CSS</summary>

```css
:root {
  /*
   * --admonition-details-icon contains an SVG arrow icon by default.
   * It was omitted here to avoid rendering a giant inline SVG.
   * See the note below for the full value.
   */
  --admonition-details-icon: ;
  --admonition-margin-top: 1.5rem;
  --admonition-margin-bottom: var(--admonition-margin-top);
  --admonition-margin-top-lp: 0px;
  --admonition-margin-bottom-lp: 0.75rem;
}

.admonition {
  margin-top: var(--admonition-margin-top);
  margin-bottom: var(--admonition-margin-bottom);
  box-shadow: 0 0.2rem 0.5rem var(--background-modifier-box-shadow);
}
.admonition.no-title .admonition-content {
  margin-top: 0;
  margin-bottom: 0;
}
.admonition li.task-list-item.is-checked p {
  text-decoration: line-through;
}
.admonition.no-drop {
  box-shadow: none;
}
.admonition.no-drop > .admonition-title.no-title + .admonition-content {
  margin-top: 0;
  margin-bottom: 0;
}
.admonition.no-drop .admonition .admonition-content {
  border-right: 0.0625rem solid rgba(var(--admonition-color), 0.2);
  border-bottom: 0.0625rem solid rgba(var(--admonition-color), 0.2);
}
.admonition.no-drop .admonition .admonition-title.no-title + .admonition-content {
  border-top: 0.0625rem solid rgba(var(--admonition-color), 0.2);
  margin-top: 0;
  margin-bottom: 0;
}

:is(.markdown-source-view.mod-cm6) .admonition .math-block > mjx-container {
  display: block;
  text-align: center;
  padding: 1rem;
}

:is(.markdown-reading-view) .admonition .math-block > mjx-container {
  display: block;
  text-align: center;
  padding: 0.0625rem;
}

*:not(.is-live-preview) .admonition.no-content {
  display: none;
}

.is-live-preview .admonition {
  margin-top: var(--admonition-margin-top-lp);
  margin-bottom: var(--admonition-margin-bottom-lp);
}
.is-live-preview .admonition.no-content {
  opacity: 0.1;
}
.is-live-preview .admonition-content p {
  line-height: inherit;
  margin: revert;
}
.is-live-preview .admonition-content p br {
  display: initial;
}
.is-live-preview .admonition-content:first-child {
  margin-top: 0.8rem;
}
.is-live-preview .admonition-content:last-child {
  margin-bottom: 0.8rem;
}

.admonition-title.no-title {
  display: none;
}
.admonition-title:hover + .admonition-content .admonition-content-copy {
  opacity: 0.7;
}

.admonition-content,
.callout-content {
  position: relative;
}

.admonition-content-copy {
  color: var(--text-faint);
  cursor: pointer;
  opacity: 0;
  position: absolute;
  margin: 0.375rem;
  right: 0;
  top: 0;
  transition: 0.3s opacity ease-in;
}
.admonition-content-copy:hover {
  color: var(--text-normal);
}

.admonition:hover .admonition-content-copy,
.callout:hover .admonition-content-copy,
.admonition-content-copy:hover {
  opacity: 1;
}

.admonition-settings .additional {
  margin: 0.375rem 0.75rem;
}
.admonition-settings .additional > .setting-item {
  border-top: 0;
  padding-top: 0.5625rem;
}
.admonition-settings .coffee {
  width: 60%;
  color: var(--text-faint);
  margin: 1rem auto;
  text-align: center;
}
.admonition-settings .coffee img {
  height: 30px;
}
.admonition-settings details > summary {
  outline: none;
  display: block !important;
  list-style: none !important;
  list-style-type: none !important;
  min-height: 1rem;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
  cursor: pointer;
  position: relative;
}
.admonition-settings details > summary > .collapser {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  content: "";
}
.admonition-settings details > summary > .collapser > .handle {
  transform: rotate(0deg);
  transition: transform 0.25s;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-image: var(--admonition-details-icon);
  mask-image: var(--admonition-details-icon);
  width: 20px;
  height: 20px;
}
.admonition-settings details[open] > summary > .collapser > .handle {
  transform: rotate(90deg);
}

.setting-item > .admonition {
  width: 50%;
  margin: 0;
}

.unset-align-items {
  align-items: unset;
}

.admonition-settings-modal .has-invalid-message {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "text image" "inv inv";
}
.admonition-settings-modal input.is-invalid {
  border-color: #dc3545 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.admonition-settings-modal .admonition-type-setting input {
  grid-column: span 2;
}
.admonition-settings-modal .invalid-feedback {
  display: block;
  grid-area: inv;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.suggestion-content.admonition-icon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row wrap;
}
.suggestion-content.admonition-icon > .suggestion-text.admonition-text {
  width: fit-content;
}
.suggestion-content.admonition-icon > .suggestion-flair.admonition-suggester-icon {
  width: min-content;
  position: relative;
  top: unset;
  left: unset;
  right: unset;
  bottom: unset;
  display: flex;
  align-items: center;
}
.suggestion-content.admonition-icon > .suggestion-note {
  width: 100%;
}

.admonition-suggester-icon svg {
  width: 1em;
}

.admonition-color-settings .setting-item-control {
  gap: 1rem;
}
.admonition-color-settings input[type=color]:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.theme-dark .admonition-color-settings input[type=color]:disabled {
  opacity: 1;
  cursor: not-allowed;
}

.admonition-convert {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.admonition-convert-icon {
  display: flex;
  align-items: center;
}
.admonition-convert-icon .admonition-spin {
  animation: admonition-convert 1s ease-in-out infinite;
  fill: currentColor;
}

@keyframes admonition-convert {
  from {
    transform: rotateZ(-45deg);
  }
  to {
    transform: rotateZ(315deg);
  }
}
.admonition-settings .admonition-convert {
  color: var(--text-error);
}

.notice-container .admonition-convert {
  justify-content: space-between;
  gap: 1rem;
}

.admonition-file-upload {
  margin-right: 0;
  margin-left: 12px;
}
.admonition-file-upload > input[type=file] {
  display: none;
}

.insert-admonition-modal button:focus,
.insert-admonition-modal .clickable-icon:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  border-color: var(--background-modifier-border-focus);
}

.admonition-settings details > summary::-webkit-details-marker,
.admonition-settings details > summary::marker {
  display: none !important;
}

.admonition-setting-warning {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.admonition-setting-warning.text-warning {
  color: var(--text-error);
}

.admonitions-nested-settings {
  padding-bottom: 18px;
}
.admonitions-nested-settings .setting-item {
  border: 0;
  padding-bottom: 0;
}

.admonitions-nested-settings[open] .setting-item-heading,
.admonitions-nested-settings:not(details) .setting-item-heading {
  border-top: 0;
  border-bottom: 1px solid var(--background-modifier-border);
}

.is-live-preview .admonition-content ul,
.is-live-preview .admonition-content ol {
  white-space: normal;
}
```

</details>

> [!NOTE]
> `--admonition-details-icon` by default contains the following SVG value:
> `url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z'/></svg>")`
> It was removed from the Default CSS block above to avoid rendering a giant inline SVG.

Admonitions require a lot of styling as they are technically a code block and will contain many varying pieces of data. Here are the essential parts to consider when styling:

### `.admonition`

```css
.admonition[data-callout="admonition-name"]
```

This style applies to the entire callout. Equivalent to `.callout[data-callout="callout-name"]`.

### `.admonition-title`

```css
.admonition[data-callout="admonition-name"] .admonition-title
```

Styling for the upper box containing the title, icon, and margins/padding. Equivalent to `.callout[data-callout="callout-name"] .callout-title`.

### `.admonition-title-content`

```css
.admonition[data-callout="admonition-name"] .admonition-title .admonition-title-content
```

Styling specifically for the title text area. Equivalent to `.callout[data-callout="callout-name"] .callout-title .callout-title-inner`.

### `.admonition-content`

```css
.admonition[data-callout="admonition-name"] .admonition-content
```

Styling for the main body of an admonition. This will likely include most styling for elements such as `strong`, `em`, and `.internal-link`. Equivalent to `.callout[data-callout="callout-name"] .callout-content`.

## Admonitions Callout Default CSS

By default, Admonitions translates to its equivalents in a `.callout`. Admonitions also adds one piece of styling to callouts:

```css
.callout:not(.admonition) .drop-shadow {
    box-shadow: 0 0.2rem 0.5rem var(--background-modifier-box-shadow);
}
.callout:not(.admonition) .no-title {
    display: none;
}
```

## Individual Styling

Like all callouts, individual styling can be handled with `.admonition[data-callout="admonition-name"]`.

### PF2-Note Example

<details>
<summary>Screenshot of PF2-Note in Live Preview and Source Mode</summary>

![PF2 Note](../images/pf2-note.png)

</details>

#### Admonition CSS

<details>
<summary>Admonition CSS</summary>

```css
.admonition.admonition[data-callout=pf2-note] {
  --callout-icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M854.173 764.089H712.398l-1.355-2.419c.501-86.681 34.198-175.368 98.214-245.312 47.831-52.261 83.95-121.041 102.458-189.368l-82.338-49.795 76.414-13.791-86.599-51.529 104.084-17.674c-10.445-78.138-57.588-136.002-154.489-136.002-94.565 18.374-363.959 23.983-503.322 5.922-17.664-5.751-35.459-9.136-52.817-9.731-.129-.035-.267-.068-.394-.102l.219.097c-45.31-1.502-87.613 16.03-116.708 60.236-40.414 61.408 2.616 166.812 97.48 166.812 5.359 0 10.253-.289 14.727-.832v.733h118.467c-17.921 72.21-62.36 152.533-113.828 233.474a564.359 564.359 0 0 0-12.575 20.767l69.657 71.359-112.351 18.818c-65.349 171.651-54.745 363.552 96.403 363.552v-.002l15.634.11v.234h171.175v-.311h451.103c135.99.002 154.656-225.247-37.485-225.247zM452.277 872.408c-.003-.935-.03-1.888-.055-2.836.025.95.052 1.903.055 2.836zm-4.386-35.788c.027.119.047.232.074.351-.027-.117-.047-.231-.074-.347-5.374-23.696-20.779-43.454-40.897-56.175h.007c20.114 12.721 35.516 32.477 40.89 56.171zm4.214 29.647zm-.459-6.386zm-.765-6.682c-.125-.924-.242-1.844-.384-2.781.144.937.261 1.858.384 2.781zm-1.113-7.143c-.144-.814-.269-1.615-.426-2.437.157.822.282 1.624.426 2.437zM236.579 269.87c28.031-23.871-1.146-80.303-34.722-127.243h115.747c19.346 37.343 21.335 80.462 11.471 127.243h-92.496zm89.202 522.253c51.786-17.213 110.468 15.682 122.11 67.013 1.991 8.782 3.269 17.061 3.911 24.882.075-.817.112-1.662.17-2.491-1.291 18.519-6.792 33.936-15.602 46.701h-1.034a76.702 76.702 0 0 1-3.062 4.103l1.614-.707c-14.802 19.359-37.539 32.29-64.57 40.636h-28.104l1.368-.6c-29.614-.008-63.612-2.798-63.612-2.798 43.925-.703 62.862-19.294 70.065-40.598-31.298 11.376-64.654-9.072-75.146-39.264-14.161-40.748 12.502-83.784 51.893-96.877zm126.458 83.452c-.018.919-.027 1.846-.065 2.75.038-.905.045-1.831.065-2.75zm-18.22 55.872z"></path></svg>';
}
.admonition.admonition[data-callout=pf2-note] .admonition-title .admonition-title-inner {
  display: inline;
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.internal-link {
  color: rgb(102, 51, 51);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.internal-link:hover {
  color: #aa5555;
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.internal-link.is-unresolved {
  color: rgb(0, 73, 97);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.internal-link.is-unresolved:hover {
  color: #0096c7;
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.external-link {
  color: rgb(107, 0, 153);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content a.external-link:hover {
  color: #b200ff;
}
.admonition.admonition[data-callout=pf2-note] .admonition-content em {
  color: rgb(51, 51, 51);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h1 {
  color: rgb(80, 67, 79);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h2 {
  color: rgb(44, 70, 78);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h3 {
  color: rgb(51, 51, 51);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h4 {
  color: rgb(42, 72, 62);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h5 {
  color: rgb(102, 51, 51);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content h6 {
  color: rgb(36, 36, 36);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content strong {
  color: rgb(51, 66, 82);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content strong em {
  color: #333b43;
}
.admonition.admonition[data-callout=pf2-note] .admonition-content ol > li::marker,
.admonition.admonition[data-callout=pf2-note] .admonition-content ul > li::marker {
  color: rgb(204, 72, 0);
}
.admonition.admonition[data-callout=pf2-note] .admonition-content ul,
.admonition.admonition[data-callout=pf2-note] .admonition-content ol,
.admonition.admonition[data-callout=pf2-note] .admonition-content li {
  text-align: left;
}
```

</details>

#### Callout CSS

The callout CSS applies nearly the same styling to maintain uniformity.

<details>
<summary>Callout CSS</summary>

```css
.callout[data-callout=pf2-note] {
  clear: both;
  font-style: italic;
  text-align: center;
  margin-bottom: 1rem;
}
.callout[data-callout=pf2-note] .callout-title .callout-title-inner {
  flex: unset;
  display: none;
}
.callout[data-callout=pf2-note] .callout-title .callout-title-inner {
  display: inline;
}
.callout[data-callout=pf2-note] .callout-content {
  margin-bottom: -0.5rem;
}
.callout[data-callout=pf2-note] .callout-content a.internal-link {
  color: rgb(102, 51, 51);
}
.callout[data-callout=pf2-note] .callout-content a.internal-link:hover {
  color: #aa5555;
}
.callout[data-callout=pf2-note] .callout-content a.internal-link.is-unresolved {
  color: rgb(0, 73, 97);
}
.callout[data-callout=pf2-note] .callout-content a.internal-link.is-unresolved:hover {
  color: #0096c7;
}
.callout[data-callout=pf2-note] .callout-content a.external-link {
  color: rgb(107, 0, 153);
}
.callout[data-callout=pf2-note] .callout-content a.external-link:hover {
  color: #b200ff;
}
.callout[data-callout=pf2-note] .callout-content em {
  color: rgb(51, 51, 51);
}
.callout[data-callout=pf2-note] .callout-content h1 {
  color: rgb(80, 67, 79);
}
.callout[data-callout=pf2-note] .callout-content h2 {
  color: rgb(44, 70, 78);
}
.callout[data-callout=pf2-note] .callout-content h3 {
  color: rgb(51, 51, 51);
}
.callout[data-callout=pf2-note] .callout-content h4 {
  color: rgb(42, 72, 62);
}
.callout[data-callout=pf2-note] .callout-content h5 {
  color: rgb(102, 51, 51);
}
.callout[data-callout=pf2-note] .callout-content h6 {
  color: rgb(36, 36, 36);
}
.callout[data-callout=pf2-note] .callout-content strong {
  color: rgb(51, 66, 82);
}
.callout[data-callout=pf2-note] .callout-content strong em {
  color: #333b43;
}
.callout[data-callout=pf2-note] .callout-content ol > li::marker,
.callout[data-callout=pf2-note] .callout-content ul > li::marker {
  color: rgb(204, 72, 0);
}
```

</details>

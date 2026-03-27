# Localizing Admonitions

New locales can be added by creating a pull request. The pull request needs to accomplish the following:

1. Create the locale in the `/src/locales/` folder by copying the `en.ts` file. The file should be named to match the string returned by `moment.locale()`.
2. Create the translation by editing the value of each property.
3. Add the import in `locales.ts`.
4. Add the language to the `localeMap` variable.

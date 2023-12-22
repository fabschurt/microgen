Microgen can be used to generate simple one-page websites, résumés, etc.

## Usage

Given the following project structure:

```
dist/
src/
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  └─ img/
│     ├─ logo.png
│     └─ portrait.jpg
├─ data.json
└─ index.pug
```

…if you run:

```sh
npx github:fabschurt/microgen src dist
```

…then Microgen will basically:

* copy the `src/assets` directory verbatim into the `dist` directory;
* parse the data from `src/data.json`, pass it to the `src/index.pug` template,
and finally render the whole thing as `dist/index.html`.

## TODO

- [x] Add a CLI usage message
- [ ] Write an updated and detailed CLI usage in the README
- [ ] Add some CLI logging and user-friendly exception catching
- [ ] Standardize the coding standards
- [ ] Write JSDoc blocks
- [x] Write missing tests

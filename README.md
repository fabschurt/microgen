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

## Why?

I mainly use this package to generate some very simple HTML/CSS content that I
can then open in a browser and print to PDF, for example.

## TODO

- [x] Add a CLI usage message
- [ ] Write a detailed CLI usage in the README
- [ ] Add some CLI logging and user-friendly exception catching
- [ ] Write missing tests

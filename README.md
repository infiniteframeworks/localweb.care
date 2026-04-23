# site-template

A minimal [Eleventy (11ty)](https://www.11ty.dev/) starter. This repo is a template — it is meant to be copied into other projects and built out from there, not used directly.

## What's included

- Eleventy 3.x with Nunjucks templating
- `src/` input directory, `_site/` output
- A base layout (`src/_includes/base.njk`)
- A minimal stylesheet (`src/assets/css/style.css`)
- A single home page (`src/index.md`)

## Getting started in a new project

1. Copy the contents of this repo into your project directory.
2. Run `npm install`.
3. Run `npm start` to start a local dev server with live reload.
4. Run `npm run build` to produce a production build in `_site/`.

## Customizing

- Add pages as `.md` or `.njk` files under `src/`.
- Add layouts under `src/_includes/`.
- Add site-wide data (title, author, etc.) in `src/_data/`.
- Static files in `src/assets/` are copied to `_site/assets/` as-is.
- Adjust templating, passthrough copies, and output options in `eleventy.config.js`.

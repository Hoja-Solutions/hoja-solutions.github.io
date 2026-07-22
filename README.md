# Hoja Website

AI and software consultancy website.

## Setup

```sh
npm install
npm run dev
```

Dev server at `localhost:4321`.

## Build

```sh
npm run build
```

Output in `./dist/`.

## Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   └── logos/
├── src/
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── About.astro
│   │   ├── Technologies.astro
│   │   ├── CTA.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── global.css
└── astro.config.mjs
```

## Stack

- Astro 4, static output
- Tailwind CSS v4
- Inter + Julia Mono fonts
- Canvas network visualization
- Simple Icons CDN for logos
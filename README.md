# Gather: Event Management Website

A responsive event discovery and registration site built with plain HTML5, CSS3 and JavaScript. No build step or dependencies.

**Live site:** add your Vercel, Netlify or GitHub Pages link here
**Repository:** add your GitHub link here

## Features

- Hero section with a live countdown to the next event
- Event cards with date, venue, category, image area and short description
- Search by name, venue or keyword, plus category filter chips
- Detail popup for each event with a registration form
- JavaScript validation: name (letters only), email format, 10 digit Indian mobile number, required event, duplicate registration check
- Success confirmation after submit
- Registrations saved in Local Storage, viewable under "My tickets"
- Dark and light mode, remembered between visits
- Responsive layout for mobile, tablet and desktop
- Keyboard accessible, visible focus styles, reduced motion respected

## Project structure

```
index.html   page structure and dialogs
style.css    design tokens, layout, dark mode, responsive rules
script.js    event data, rendering, filters, validation, storage, countdown
```

## How it works

1. Events live in the `EVENTS` array at the top of `script.js`. Past events are hidden automatically.
2. `renderGrid()` filters the array by the active category and search text, then draws the cards.
3. Clicking a card opens a native `<dialog>` with details and the form, with that event preselected.
4. On submit each field runs through the `rules` object. Errors show under the field. If all pass, the record is saved to `localStorage` under `gather-regs`.
5. The theme is stored under `gather-theme` and applied through a `data-theme` attribute on `<html>`, which switches the CSS variables.

## Add your own events

Add an object to `EVENTS`. To use a real photo, add `image: "images/my-photo.jpg"`. Without it, the card uses a gradient from `colors`.

## Run locally

Open `index.html` in a browser, or run `npx serve` in the folder.

## Deploy

- **GitHub Pages:** Settings, Pages, deploy from the `main` branch root.
- **Netlify or Vercel:** import the repository, leave the build command empty and publish the root folder.

## Git workflow

```
git init
git add .
git commit -m "Initial event website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Tip: make several small commits (layout, filters, form validation, dark mode) so your history shows progress.

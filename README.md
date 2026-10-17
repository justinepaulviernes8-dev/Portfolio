# Justine Paul Viernes — Portfolio

Personal portfolio website for IT ELEC01 – Advanced Web Development.

## Technologies
- HTML5 (semantic tags)
- Tailwind CSS v4 (browser CDN build)
- Vanilla JavaScript
- Poppins (Google Fonts), Feather Icons (inline SVG, MIT)

## How to run
Open `index.html` in a browser (or use the VS Code Live Server extension).
An internet connection is needed for the Tailwind CDN and Google Fonts.

## Folder structure
```
Viernes_Portfolio/
├── index.html              all sections: Home, About Me, Skills, Projects, Education, Contact
├── js/                     one file per JavaScript feature
│   ├── theme.js            dark / light mode toggle
│   ├── menu.js             mobile menu toggle
│   ├── nav-highlight.js    active nav link while scrolling
│   ├── form-validation.js  contact form validation + success message
│   ├── back-to-top.js      back-to-top button
│   ├── hide-nav.js         hide nav on scroll down, show on scroll up
│   ├── project-carousel.js 3D carousel for the Projects section
│   ├── project-modal.js    "View Project" pop-up with zoom animation
│   └── scroll-reveal.js    fade-in animation while scrolling
├── images/
│   ├── profile/            profile.png
│   └── projects/           project-1.svg … project-5.svg (replace with screenshots)
├── screenshots/            375px, 768px and 1280px screenshots for submission
└── README.md
```

## Where to fix a bug
| Problem | Look in |
|---|---|
| Dark mode does not switch or is not remembered | `js/theme.js`, and the `@custom-variant dark` line in `index.html` `<head>` |
| ☰ menu does not open/close on mobile | `js/menu.js` |
| Nav link is not highlighted while scrolling | `js/nav-highlight.js` (each link needs `data-nav`, each section an `id`) |
| Form errors / success message | `js/form-validation.js` |
| Back-to-top button not showing | `js/back-to-top.js` |
| Nav does not hide/show on scroll | `js/hide-nav.js` (header needs `id="site-header"`) |
| Carousel cards in the wrong place, arrows/dots/swipe not working, or text below not changing | `js/project-carousel.js` (the `positions` table controls size, tilt and spacing) |
| Project pop-up does not open, shows wrong content, or won't close | `js/project-modal.js`; each slide needs `data-project`, the button `data-open-project` |
| Items do not fade in while scrolling (or stay invisible) | `js/scroll-reveal.js`; the element needs `data-reveal`; styles are `.reveal-ready [data-reveal]` in `<head>` |
| Pop-up animation looks wrong | `@keyframes modal-in / modal-out` in the `<style>` block in `index.html` `<head>` |
| Layout, colors, spacing, text | the matching `<!-- ===== SECTION ===== -->` block in `index.html` |
| Image not showing | the file name/path in `images/` and the `src` in `index.html` |

Each JS file prints a clear message in the browser Console (F12 › Console) if an element it needs is missing from `index.html`.

## JavaScript features
1. Mobile menu toggle (with `aria-expanded` and Escape to close)
2. Dark / light mode toggle (saved in `localStorage`)
3. Contact form validation with a success message (front-end only, nothing is sent)
4. Active nav highlight while scrolling (IntersectionObserver)
5. Projects: 3D carousel (arrows, dots, click a side card, keyboard arrows, swipe) + pop-up with zoom animation (native `<dialog>`)
6. Scroll animation: sections and cards fade in and slide up every time they scroll into view (IntersectionObserver)
- Extra: back-to-top button
- Extra: navigation hides on scroll down, shows on scroll up

## My unique feature
TODO: describe the feature I designed myself and where the idea came from.

## Credits
- Icons: Feather Icons — https://feathericons.com (MIT License)
- Font: Poppins — Google Fonts (Open Font License)

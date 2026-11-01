# Justine Paul Viernes — Laravel Portfolio

IT ELEC01 – Advanced Web Development, Block 4. Midterm: Portfolio CRUD with Validation.

## Run the converted portfolio

The working application uses Laravel 12, Inertia.js 2, React 19, Tailwind CSS 4, and XAMPP MySQL/MariaDB. Your original `index.html`, `js/`, and `images/` remain as the static design reference; opening `index.html` does **not** run the database-backed version.

Start **MySQL** in the XAMPP Control Panel. The database is **`viernes_portfolio`**. In the public portfolio, scroll to **Projects**: use **Add project** above the carousel, or click the middle carousel image to find **Edit project** / **Delete project** inside its details popup. The forms open directly on the portfolio. The separate Index/Create/Edit pages remain available for the assignment.

After the initial setup below, run this in PowerShell from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/serve.ps1
```

- Public portfolio: http://127.0.0.1:8000
- Project manager: http://127.0.0.1:8000/projects
- Stop the server with Ctrl+C. Use `-Port 8001` if port 8000 is busy.

The launcher uses PHP from XAMPP when present and sets upload limits for the 4 MB image validator. It only listens on localhost. It does not change your system PHP configuration.

## Initial setup on another computer

For the full online app on Vercel, see [Vercel deployment](docs/VERCEL-DEPLOYMENT.md). Use the **Container** preset with `Dockerfile.vercel`, a hosted database, S3-compatible upload storage, and owner login. XAMPP stays available for local testing with separate credentials and records.

Requires PHP 8.2+ with PDO MySQL, PDO SQLite (for isolated tests and importing the old database), mbstring, XML, fileinfo, cURL and GD; Composer; and Node.js 20.19+ or 22.12+ with npm. Start MySQL in XAMPP before setup. The dependency lockfiles are included. Development was verified with PHP 8.5 and Node 24; Composer resolves dependencies against PHP 8.2 for classroom compatibility.

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php scripts/setup-mysql.php
php artisan storage:link
npm ci
npm run build
powershell -ExecutionPolicy Bypass -File scripts/serve.ps1
```

Only copy `.env.example` and generate an application key during initial setup. Configure the `DB_*` settings for your own XAMPP credentials if they differ from the local defaults. `setup-mysql.php` creates the configured database and runs migrations; if the table is empty, it imports existing SQLite projects or seeds the original five. It never overwrites existing MySQL projects. Do not overwrite an existing `.env` or run `migrate:fresh` on data you want to keep. `npm run build` copies the original images into `public/images` before compiling the frontend. If Windows blocks `storage:link`, enable Developer Mode or run that single command in an elevated terminal, then confirm `public/storage` points to `storage/app/public`.

The previous SQLite database remains at `database/database.sqlite`; an additional pre-conversion backup and environment copy are in the ignored `.local/before-xampp-mysql/` folder. The application now reads and writes MariaDB. In phpMyAdmin, select `viernes_portfolio` and open `projects` to inspect the records. Apache is needed for phpMyAdmin, while the portfolio itself uses the PHP launch script above.

On macOS/Linux use `cp .env.example .env` instead of `Copy-Item`, then run a local server from the public directory:

```sh
cd public
php -d upload_max_filesize=8M -d post_max_size=12M -S 127.0.0.1:8000 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php
```

For frontend editing, run `npm run dev` in a second terminal while the PHP server runs. Rebuild with `npm run build` after editing if Vite is not running. The existing portfolio design, images, fonts, dark/light mode, mobile menu, scroll reveal, 3D carousel and project popup are retained.

## Implemented requirements

- Projects database table with nine meaningful fields, Eloquent `$fillable`, and a dedicated resource controller.
- Index/Create/Edit pages, shared form and field components, inline errors and retained input.
- Required, string, min/max, integer, between, unique, in, image, and MIME validation; custom messages.
- Unique title and display-order validation ignore the current model on update. Display-order conflicts appear immediately as the number changes.
- JPG/PNG/WebP uploads up to 4 MB; optional replacement on edit; cleanup of replaced/deleted uploads.
- Create/update/delete success messages dismiss after four seconds; deletion requires a keyboard-accessible confirmation dialog. Save changes is disabled until a field changes.
- Add, edit and delete controls directly in the portfolio's Projects section, using the same reusable form and Laravel resource endpoints.
- Public carousel reads sorted database records, including safe empty/one/many-record rendering.
- Original five projects seeded with their original text, images and order.

Management routes stay available for local classroom review. Online deployments require the owner login at `/login`, and visitors cannot create, edit or delete projects. See `docs/VERCEL-DEPLOYMENT.md` for the owner email/password-hash configuration and external database/storage setup. Publishing this source repository does not deploy the Laravel application.

## Tests and submission material

```powershell
php artisan test
# Or invoke PHPUnit directly:
php vendor/phpunit/phpunit/phpunit --log-junit tmp/test-results.xml
npm run build
```

The default automated tests use an isolated in-memory SQLite database and fake upload storage. MySQL integration tests use the separately named `viernes_portfolio_test` database via `phpunit.mysql.xml`. They do not delete your development projects. See `docs/VALIDATION-TESTS.md` for recorded cases and `docs/VIDEO-GUIDE.md` for the required uncut live change and explanation checklist. `docs/IMPLEMENTATION.md` describes the fields and design choices. The documentation PDF is generated at `output/pdf/Midterm-Documentation-Draft.pdf` by `scripts/build-documentation.py` (requires Python, reportlab and Pillow).

To run the MySQL integration suite, create an empty database named `viernes_portfolio_test` in XAMPP and run `php vendor/phpunit/phpunit/phpunit -c phpunit.mysql.xml`. That dedicated test database is reset by the test runner; never change its configuration to point at your working database.

Before final submission, personalize the reflection and code explanations, finish any existing portfolio content placeholders, record the video in your own voice, add its viewable link, then regenerate the PDF. The existing Git remote is `https://github.com/justinepaulviernes8-dev/Portfolio.git`.

## Important files

| Purpose | Location |
|---|---|
| Public entry point | `routes/web.php`, `PortfolioController.php`, `resources/js/Pages/Portfolio.jsx` |
| CRUD and validation | `app/Http/Controllers/ProjectController.php` |
| Model | `app/Models/Project.php` |
| Schema and original data | `database/migrations/2026_11_01_000001_create_projects_table.php`, `database/seeders/` |
| Management screens | `resources/js/Pages/Projects/` |
| Shared form | `resources/js/Components/ProjectForm.jsx`, `FormField.jsx` |
| Public carousel and modal | `resources/js/Components/ProjectsCarousel.jsx`, `ProjectModal.jsx` |
| Original interactions with React cleanup | `resources/js/Hooks/usePortfolioEffects.js` |
| Styling | `resources/css/app.css` |

## Original static portfolio notes

The following notes describe the preserved pre-conversion files, not the Laravel application.

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
│   ├── logo/               logo.png (160px, used on the site) + logo-original.png
│   ├── profile/            profile-light.png (light mode), profile-dark.png (dark mode)
│   └── projects/           project screenshots (Laravel, FlutterAndDart, Figma, Blender, NetBeansGUI)
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
| Project pop-up does not open, shows wrong content, or won't close | `js/project-modal.js` (listens for the `open-project` event sent by `js/project-carousel.js`); each slide needs `data-project` |
| Hover glow/zoom on the center card | `#project-carousel [data-project].is-active:hover` in the `<style>` block in `index.html` `<head>` |
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

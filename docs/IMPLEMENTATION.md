# Portfolio CRUD with Validation - local review draft

Author: Justine Paul Viernes  
Course: IT ELEC01 - Advanced Web Development  
Section: Block 4  
Date: November 1, 2026  
Instructor: Giobet T. Aban

## Section chosen and justification

The Projects section changes whenever a new school project is completed or an existing description needs revision. Storing it in XAMPP's MariaDB database allows those updates through a form without editing the carousel markup. The five original records, images, order, colors, typography and responsive carousel styling were retained during conversion. Add, Edit and Delete controls are available directly within that section of the portfolio.

## Fields

| Field | Database type | Purpose and validation |
|---|---|---|
| title | varchar(120), unique | Project identity; required string, max 120, unique except current record on edit. |
| category | varchar(60) | Category badge; required string, max 60. |
| description | text | Text below the carousel; required string, 10-500 characters. |
| details | text | Longer popup explanation; required string, 20-3000 characters. |
| tech_stack | varchar(200) | Comma-separated tool badges; required string, max 200. |
| image_path | varchar(255) | Server-generated path to the screenshot. The image form field is required on create, optional on edit, a real JPG/PNG/WebP, max 4096 KB. Never accepts a path from the browser. |
| image_alt | varchar(255) | Screen-reader description; required string, max 255. |
| image_fit | varchar(10) | Preserves cover/contain behavior of original screenshots; required, one of cover or contain. |
| display_order | unsigned integer | Public carousel order; required integer from 0 to 999, unique across other projects. The form immediately warns about occupied numbers; Laravel also validates uniqueness on save. |

`id`, `created_at` and `updated_at` are additional framework fields and are not counted toward the five-field minimum.

## Request flow

1. The portfolio's Add or Edit button opens `ProjectEditorDialog`, which renders the shared `ProjectForm`. That form uses Inertia `useForm` to POST the fields and image. Updates use POST with `_method=put` so PHP receives multipart uploads correctly. The required separate Create and Edit pages reuse this same form.
2. `routes/web.php` dispatches to a `ProjectController` resource method. Route model binding resolves the project for edit/update/delete, or returns 404.
3. `validatedData()` calls Laravel validation with shared rules and custom messages. Invalid data redirects back with session errors; Inertia shares those errors with React and the form retains its values.
4. Validated fields are passed to the Eloquent model. `$fillable` limits mass assignment, while the controller generates the image path. The migration's unique index also protects the title at database level.
5. Inline submissions include `return_to=portfolio`, so the controller redirects back to the portfolio with a success flash message. Only that known destination is accepted; an arbitrary submitted URL cannot become an external redirect. Submissions from the separate pages still return to the index. `HandleInertiaRequests` makes the message available as a React page prop.
6. The public controller queries the same database records in display order and renders `Portfolio`. The React carousel and modal display those props with the original layout.

## Design decisions

The separate controller keeps routing concise and groups the six CRUD actions in one place. `Route::resource()->except('show')` creates index, create, store, edit, update and destroy routes; the public carousel popup provides the read/detail view, so a separate management Show page is unnecessary.

Validation is centralized in one private controller method so create and update enforce the same rules. The current model is passed to `Rule::unique()->ignore()` rather than trusting an ID from the submitted form. Image validation runs before storing a file, and uploaded files are removed when replaced or deleted; the original bundled images remain untouched.

The reusable `ProjectForm` handles both Create and Edit. `FormField` consistently associates labels, hints and errors; `SectionTitle` preserves repeated public headings. Public sections have their own components, and the original DOM effects register cleanup callbacks to avoid duplicate listeners when navigating with Inertia.

The working database is `viernes_portfolio` on XAMPP's MySQL/MariaDB service, using Laravel's `mysql` connection. Existing SQLite records were copied into it, and the old SQLite file plus a backup were retained. The public disk stores uploaded images; `storage:link` exposes them through `/storage`. Tailwind is compiled with Vite, so the portfolio no longer depends on the browser Tailwind CDN. Google Fonts remains the original external font source.

The portfolio controls use native dialogs so management is available without leaving the original page. The same form, validation, model and resource controller serve both those dialogs and the separate assignment pages. The carousel's reveal wrapper remains mounted when the database is empty so adding the first project can display it correctly without a reload.

## Local review notes

- Source code is maintained on GitHub; running the Laravel application requires the setup steps in README.md.
- The project manager has no login because this is a localhost review and login is optional in the rubric.
- The original contact form remains a frontend validation demo; its success text now clearly states that it does not send email.
- Existing education/certification and project-detail placeholders remain for the author to finish. The original static contact links also include placeholder destinations; confirm the intended links before final submission.
- The narration and three personal reflection paragraphs must be supplied by the author. This draft does not claim personal learning experiences on the author's behalf.

## Reflection prompts to personalize before submission

1. Hardest part: describe the actual conversion problem you found hardest, the symptom you saw, and the fix you now understand. Possible discussion points from this implementation are JSX conversion, preserving carousel geometry, and cleaning up event listeners after Inertia navigation.
2. Validation learning: explain a specific difference between browser checks and Laravel validation that you learned while testing. Mention one test you ran yourself and what the error revealed.
3. Second dynamic section: explain what you would reuse and what you would change, such as extracting Form Requests, adding login/authorization, or using a related table for tools.

## Submission links

Repository: https://github.com/justinepaulviernes8-dev/Portfolio.  
Video: pending author recording and a viewable Google Drive or unlisted YouTube link.

## Reference documentation

- Laravel validation: https://laravel.com/docs/12.x/validation
- Inertia server setup: https://inertiajs.com/docs/v2/installation/server-side-setup
- Inertia multipart uploads: https://inertiajs.com/docs/v2/the-basics/file-uploads

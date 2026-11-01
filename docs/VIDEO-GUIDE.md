# Video demonstration guide

Use your own voice and explain the code in your own words. This guide is a rehearsal outline, not a substitute for the required recording. Face camera is optional. Keep the live-change segment uncut.

## 1. Introduction

Introduce yourself as Justine Paul Viernes, Block 4, IT ELEC01. Show the public portfolio and explain why Projects benefits from database management. Point out that the original design and carousel were preserved.

## 2. Folder structure

Show the project migration, `Project` model, `ProjectController`, `PortfolioController`, `routes/web.php`, `resources/js/Pages/Projects`, `Portfolio.jsx`, and shared components. Show `HandleInertiaRequests` and the seeded original project records.

## 3. Explain the flow

Trace Create from `ProjectForm` and `useForm.post()` to the resource route, controller validation, Eloquent model, redirect/flash message, Inertia props and React index. Explain that server validation errors travel through the session and Inertia props; normal form submission does not reload the entire document. Trace the portfolio controller separately to show where public carousel records come from.

## 4. CRUD demonstration

Start MySQL in XAMPP and open the portfolio's Projects section. Use **Add project** above the carousel to create a temporary project with a real screenshot; show the success message and select its new carousel dot. Use **Edit project** beneath the selected project's details to change its description while keeping the same title and image. Open Delete, cancel once, then delete that temporary record and show the success message. In phpMyAdmin, open the `viernes_portfolio` database and its `projects` table to show that the data is stored in XAMPP. Also briefly show the separate Index/Create/Edit pages required by the assignment. Leave the original projects intact.

## 5. Validation demonstration

Use the cases in `VALIDATION-TESTS.md`: empty form, 121-character title, short description, duplicate title, unchanged unique title on edit, order outside 0-999, a non-image file, and an image over 4 MB. Show errors next to the fields and that previously entered values remain. Explain why renaming a text file to `.png` does not make it a valid image.

## 6. Uncut live change: add an optional project URL

Rehearse on a disposable copy first. Do the following while recording without cuts. This field is deliberately not already implemented in the application, so you can demonstrate the actual change.

1. Generate a **new** migration; do not edit the migration already run:

```sh
php artisan make:migration add_project_url_to_projects_table --table=projects
```

2. In `up()`, add the column. In `down()`, drop it:

```php
Schema::table('projects', function (Blueprint $table) {
    $table->string('project_url', 2000)->nullable();
});
// down():
Schema::table('projects', function (Blueprint $table) {
    $table->dropColumn('project_url');
});
```

3. Run `php artisan migrate` and add `'project_url'` to `Project::$fillable`.
4. Add the controller validation rule inside `validatedData()`:

```php
'project_url' => ['nullable', 'url:http,https', 'max:2000'],
```

5. Add a custom message:

```php
'project_url.url' => 'Enter a valid http or https project URL.',
```

6. Add `project_url: project?.project_url ?? ''` to the `useForm` data in `ProjectForm.jsx`. Add a field before the submit buttons:

```jsx
<FormField name="project_url" label="Project URL" required={false}
    error={form.errors.project_url}>
    <input {...attributes('project_url')} required={false} type="url" />
</FormField>
```

7. With `npm run dev` running, reload Edit. Enter `not-a-url`, save, and show the custom error with input retained. Enter `https://example.com`, save, reopen Edit and show the persisted value. Existing projects stay valid because the field is nullable.
8. Optionally add a conditional link in `ProjectModal.jsx` and show it in the public popup:

```jsx
{project.project_url && <a href={project.project_url} target="_blank"
    rel="noopener noreferrer" className="text-blue-700 underline dark:text-blue-300">
    Visit project
</a>}
```

After the recording, add validation tests for this field and regenerate documentation so the submitted code and screenshots match the final application. Do not run `migrate:fresh` on your working database just to demonstrate the new field.

## Questions to explain confidently

- **Separate controller:** groups CRUD responsibilities and avoids putting database/file/validation logic into the routes file.
- **Resource routes:** GET index, GET create, POST store, GET edit, PUT/PATCH update, DELETE destroy. The usual GET show route is excluded; public details appear in the carousel modal.
- **Removing `$fillable`:** with Eloquent's default guarded behavior, mass assignment would reject these attributes, so `create()` and `update()` would no longer work as written. Do not solve that by trusting all input.
- **Server validation:** browser controls can be bypassed; Laravel must protect database and file writes for every request.
- **Inertia errors:** Laravel redirects with session errors, the middleware shares them, and `useForm.errors` connects them to the fields while preserving state.
- **Reusable form:** one component keeps create and edit field layout and error handling consistent.

## Finish later, after local review

Record and upload to Google Drive (viewable link) or YouTube (unlisted), add the actual link to the documentation, personalize all reflection paragraphs, and verify every source-code explanation. Only push to GitHub after you decide the local version is ready. The current local work is not pushed.

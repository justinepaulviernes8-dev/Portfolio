# Recorded validation and CRUD checks

Run date: November 1, 2026. Automated tests: `tests/Feature/ProjectCrudTest.php`. The default suite passed 22 tests with 216 assertions using an isolated in-memory database and fake upload storage. The XAMPP integration suite passed 21 feature tests with 215 assertions using the separate `viernes_portfolio_test` MariaDB database. Browser checks used the working `viernes_portfolio` database and a temporary project that was removed after testing.

| # | Test case | Input used | Expected result | Actual result | Status |
|---|---|---|---|---|---|
| 1 | Empty form | All fields absent | Errors for each required field; no row | Nine required fields rejected; no project saved | Pass (PHPUnit) |
| 2 | Title too long | 121 `a` characters | Title max error | Error on title; no row | Pass (PHPUnit) |
| 3 | Description too short | `short` | Custom min-length error | “Describe your project in at least 10 characters.” | Pass (PHPUnit) |
| 4 | Invalid order type | `letters`, then `1.5` | Integer rule fails | Order rejected | Pass (PHPUnit) |
| 5 | Order outside range | -1 and 1000 | Between rule fails | Order rejected; no rows | Pass (PHPUnit) |
| 6 | Duplicate title | Existing project title on create | Unique rule fails | Title error; existing row unchanged | Pass (PHPUnit) |
| 7 | Same title on update | Existing title unchanged, edited description | Save succeeds | Saved; original image retained | Pass (PHPUnit + browser) |
| 8 | Another record's title | Update second project to first title | Unique rule fails | Second title unchanged | Pass (PHPUnit) |
| 9 | File disguised as image | Text data named fake.png | Image validation fails | Image rejected; no stored file | Pass (PHPUnit) |
| 10 | Disallowed image format | Valid GIF | MIME rule fails | GIF rejected | Pass (PHPUnit) |
| 11 | Oversized upload | Valid PNG sized 4097 KB | 4096 KB maximum fails | Image rejected; no stored file | Pass (PHPUnit) |
| 12 | Input retention and inline errors | Blank title, valid description | Description stays; title error beside field | Laravel shared field error; React retained typed text and focused title | Pass (PHPUnit + browser) |
| 13 | Valid create | Complete fields + PNG | Save, success message, public record | Row and file created; image loaded; carousel received it | Pass (PHPUnit + browser) |
| 14 | Replacement image | POST with `_method=put` and new PNG | Replace image; delete old upload | New file exists; old file removed | Pass (PHPUnit) |
| 15 | Delete / cancel | Temporary browser test record | Cancel keeps row; confirm removes it | Cancel retained record; confirm returned success; original five remain | Pass (browser + PHPUnit deletion) |
| 16 | Original image protection | Delete seeded record in isolated test | Original bundled image stays | Original asset retained | Pass (PHPUnit) |
| 17 | Public ordering | Two records with order 5 and 0 | 0 displays first | Public props ordered correctly | Pass (PHPUnit) |
| 18 | Unknown ID | Edit/update/delete ID 999 | HTTP 404 | HTTP 404 for all three | Pass (PHPUnit) |
| 19 | Unvalidated path injection | `image_path=../../private.txt` on update | Path is ignored | Original server-controlled path unchanged | Pass (PHPUnit) |
| 20 | Inline portfolio create/update/delete | `return_to=portfolio` | Same portfolio page refreshes with feedback | Form stays on the portfolio; changes saved in XAMPP | Pass (PHPUnit + MariaDB + browser) |
| 21 | Inline validation | Blank title in portfolio dialog | Dialog remains open; values and field errors retained | Error displayed in dialog and description retained | Pass (PHPUnit + MariaDB + browser) |
| 22 | Submitted redirect URL | `return_to=https://example.com` | External URL ignored | Redirect stays on local project index | Pass (PHPUnit + MariaDB) |
| 23 | First and last project | Add to empty test database, then delete its only record | Carousel appears without reload; empty state returns cleanly | Visible carousel after create; empty state after delete; no browser errors | Pass (browser, isolated MariaDB database) |

## Corrections made during verification

- The Laravel skeleton smoke test initially failed because the newly database-driven homepage needs migrations in its isolated test database. Added `RefreshDatabase` and disabled Vite inside that test; it then passed.
- XAMPP defaulted to a 2 MB PHP upload limit, below the application's 4 MB limit. The local launcher sets an 8 MB PHP upload limit and 12 MB POST limit so Laravel can validate normal oversized test images itself.
- At a 375 px mobile viewport, long contact links forced the contact grid beyond the screen. Added minimum-width and wrapping rules to keep the original cards within the viewport while preserving their styling.
- Form submissions retain scroll position on validation errors and return to the top after a successful save/delete so the success feedback is visible.
- Windows sandbox restrictions blocked a build output directory and the public storage link. Rebuilt with the permitted local command and verified uploaded images load in the browser.

The form intentionally uses `noValidate` so deliberate invalid input reaches Laravel in the demonstration. Browser input hints improve usability, while the server remains authoritative.

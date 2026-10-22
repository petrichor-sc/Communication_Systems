# Communication Systems — GitHub Pages edition

An interactive Communication Systems notebook: Lectures 0–2, 15 learning sections, nine types of signal experiment, two guided exercise sheets, personal notes, and textbook references.

**Start here:** publish the included, already-built `docs` folder. You do not need Node.js, an API key, an account system, a database, or a build command for the first publication.

## 1. Publish using GitHub’s website

1. Extract this ZIP. Open the resulting `communication-systems-github-pages` folder.
2. On GitHub, create a new repository, for example `communication-systems`. Choose **Public** for the straightforward GitHub Free setup. This can be a separate repository from your existing website.
3. Upload the **contents** of the extracted folder into the repository. At the repository’s top level you should see `docs`, `src`, `package.json`, and this README. Upload the extracted files, not the ZIP itself and not an extra containing folder.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**. Select **main**, then **/docs**, then **Save**.
6. When GitHub finishes deployment, use **Visit site** on the Pages settings page.
7. Share that website link with your friends. It normally has the form `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

The prebuilt site uses relative asset paths, so you can choose your own repository name. Keep the `docs/assets` directory alongside `docs/index.html`. The hidden `.nojekyll` file is included in `docs`; keep it when uploading with a Git client.

GitHub’s deployment can take a few minutes. The repository’s **Actions** tab shows the publishing run and any errors. If your default branch is not named `main`, select your actual branch in step 5.

## 2. What each friend gets

Everyone opens the same lessons and experiments, but notes and progress are saved in their own browser. No visitor’s notes are uploaded to the repository or sent to another visitor.

Browser storage is not an account or automatic device synchronization. Clearing site data, using a private/incognito session, changing browsers, or moving to another site origin can remove or separate that local notebook.

In **My notes**:

- **Download backup** saves a JSON file containing all personal notes and reviewed sections.
- **Import backup / notes** restores a JSON backup, or imports a Communication Systems Markdown export (including exports from the earlier Signal Notes version). Imports merge with existing notes; different text in the same section is appended rather than silently deleted.
- **Export notes** in the top bar creates readable Markdown notes for studying, printing through another editor, or sharing deliberately.

Back up before clearing browser data. To move to another device, download the JSON on the first device and import it on the second. Your friends do not need GitHub accounts to read a public Pages site.

## 3. Bring your course PDFs

The original textbook, lecture PDFs, and problem sheets are **not bundled in this public package**. The rewritten study content and experiments are included.

Open **Source materials → Attach PDF** to attach your own copies of:

- `lec0.pdf`, `lec1.pdf`, `lec2.pdf`
- `ps1.pdf`, `ex2.pdf`
- `SoftwareReceiverDesign-2011.pdf`

You select which resource a PDF belongs to, so its filename can differ. PDFs are stored in this browser through IndexedDB. They are not uploaded to GitHub. Each person can attach their own course files.

After attaching the textbook, **Open this book section** in a lesson opens the local PDF at its page reference. Printed textbook page 44 corresponds to PDF page 60 in the supplied edition.

PDFs are not included in JSON backups. Keep your original PDFs so you can attach them on another device.

## 4. Move notes from the earlier hosted version

In the earlier notebook, use **Export notes** to download its Markdown file. Open this GitHub Pages notebook, go to **My notes → Import backup / notes**, and choose that Markdown file. Review the imported sections, then download a new JSON backup.

This transfer is manual because the two websites have separate browser storage and account boundaries.

## 5. Edit the application locally

For development, install **Node.js 24**. Node 22.13 or later is also supported by this project. In a terminal opened inside the extracted project:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. Do not open `index.html` by double-clicking; browser security rules restrict module scripts and storage on local file URLs.

After making changes:

```bash
npm test
npm run build
```

`npm run build` type-checks the source and regenerates `docs`. Commit/upload the updated source and the updated **whole `docs` directory**. Branch-based Pages will publish the rebuilt files. If uploading in a browser, stale hashed files can remain harmlessly, but always upload the current `docs/index.html` and its referenced assets together.

You can inspect the built output locally with:

```bash
npm run preview
```

Follow the URL printed by Vite.

## 6. Where to make changes

| File | Purpose |
| --- | --- |
| `src/course.ts` | Chapters, lesson text, note outlines, book references, recall checks, and guided problems |
| `src/experiments.tsx` | Interactive plots and their controls |
| `src/signals.ts` | Signal calculations: cosines, aliases, power, noise, spectra |
| `src/notebook.tsx` | Notebook layout, navigation, notes, and progress |
| `src/storage.ts` | Backup parsing, Markdown export/import, note merging |
| `src/materials.tsx` | Local PDF attachment and book-page opening |
| `src/globals.css` | Appearance and responsive layout |
| `tests/verify.mjs` | Numerical and notebook-data checks |
| `vite.config.ts` | Relative deployment base and `docs` output folder |

Keep existing lesson and problem `id` values unchanged: notes and progress are attached to those IDs. To add a lecture, extend the `chapters`, `lessons`, and `resources` arrays in `src/course.ts`, using the next sequential chapter number. Rebuild afterward.

The visualizations are SVG plots rendered by React. No Three.js installation is needed. This provides a clean starting point for adding a 3D phasor view later.

## 7. Optional: build automatically on GitHub

The first method is easiest because the build is already included. For automatic builds after editing the source:

1. Copy `deployment/github-pages.yml` to `.github/workflows/pages.yml` in your repository.
2. In **Settings → Pages**, change Source to **GitHub Actions**.
3. Push/commit the workflow. It installs the pinned dependencies, runs tests, builds `docs`, and deploys that output.

The workflow assumes a `main` branch; edit the branch name if needed. `deployment/github-pages.yml` is an inactive example until copied to `.github/workflows/`, avoiding a second deployment mechanism during the simple branch-based setup. No personal token or API secret is needed for the included workflow; it uses GitHub’s workflow permissions.

## 8. Quick fixes

- **404 after publishing:** confirm the selected branch and `/docs`, and check that the repository actually contains `docs/index.html` at that path.
- **Blank page or missing styles:** upload the current `docs/index.html` and `docs/assets` together. Check the Actions run, then hard-refresh the browser.
- **My source edits are not visible:** rebuild with `npm run build`, or enable the optional automatic workflow.
- **A PDF reference does not open:** attach your PDF in Source materials. Browser popup settings may require allowing the new PDF tab.
- **Notes do not appear on another device:** transfer a JSON backup; this static edition does not provide cloud sync.
- **Notes disappeared after changing the site URL:** return to the original URL/browser if possible, export a backup, then import it at the new URL.
- **Browser storage unavailable:** the app shows an export reminder. Download a backup before leaving the page.

The note storage key is separated by repository path. Hosting another notebook under another path therefore starts a separate local notebook. Export/import is the supported migration path.

## 9. What was checked

The source passes TypeScript checking and a production Vite build. The included tests check aliases, cosine power, the spectrum of a squared cosine, JSON/Markdown round-trips, nested headings in notes, non-destructive merging, invalid backup handling, and separation of storage keys by repository path. The deployment output is checked for relative local assets and absence of server endpoints or bundled private notes.

Publishing in your own GitHub account is a separate step performed by you; this ZIP does not create a repository or change your existing site.

## Official references

- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Vite static deployment](https://vite.dev/guide/static-deploy)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

This study companion should be used alongside the original course material. Guided checkpoints do not replace your own full derivations or every subpart of the original exercises.

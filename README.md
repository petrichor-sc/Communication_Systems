# Communication Systems — GitHub Pages edition

An interactive Communication Systems lab and notebook: Lectures 0–2, 15 learning sections, nine types of signal experiment, two guided exercise sheets, personal notes, and textbook references.

**Start here:** publish the included, already-built `docs` folder. You do not need Node.js, an API key, an account system, a database, or a build command for the first publication.

The default appearance is now a high-contrast dark theme with purple accents, brighter graph labels, and larger text throughout.

## Version 1.3: open the transmitter and receiver separately

Choose an explorer below the message box, or use **Explore transmitter / Explore receiver** inside the outlined regions of the whole-journey map.

- **Explore transmitter:** text, coder, discrete PAM symbols, pulse shaping, baseband, frequency translation, and passband/RF. Click a byte or character to inspect its actual hex and bits. A space is encoded too. Separate source-coding and repetition error-coding toys explain slide 22; they do not silently change the main transmitted message.
- **Physical channel:** the branching diagram from slide 18, with direct-path gain/fading and delay, multipath echoes, a narrowband interferer, and repeatable noise. Inspect each contribution, combine effects, and compare the received text. Presets isolate the effects.
- **Explore receiver:** received RF, frequency translation, baseband, sampling, symbol quantization, decoding, and reconstructed text. ADC voltage codes and PAM symbol decisions are explicitly distinguished.
- **Inside the software receiver:** the six blocks from slide 24, with working focused experiments for carrier mismatch, rectangular matched filtering, timing-adjusted downsampling, a known one-symbol echo inverse, nearest-level decisions, and frame correlation.
- **ASP / DSP:** FDM band selection, the 868 − 864.43 = 3.57 MHz mixer example, filtering/AGC, time sampling/aliasing versus amplitude resolution, and every ASP/DSP task from slide 21.
- **Lecture 0 guide:** every printed slide 1–25 is covered in grouped topics, with dedicated entries for slides 18–24, experiment links, book references, and prompts for your own notes. PDF page numbers differ because the lecture contains animation builds.

Each path has its own **Play**, **Pause**, **Replay**, previous/next controls, and reading pace. Playback stays in that path. Changing a control, selecting a block, editing the message, or scrolling in the live illustration pauses it. The two panels stay aligned on desktop; the Data → Voltage → EM field → Voltage → Data legend has its own clear strip above the main diagram.

### A first walkthrough

1. Type **Hello**. In the transmitter, open Coder and Symbols: H = 0x48 = 01001000 = −1, −3, +1, −3.
2. Play the transmitter path; compare rectangular and raised-cosine pulses.
3. Choose **Physical channel → Echo**, then click **Received signal**. Compare the text and bit errors.
4. Open the receiver, then **Inside the software receiver**. Toggle the known echo inverse and inspect Decider/Decoder. This is a separate focused receiver experiment, using the same message.
5. In ASP / DSP, calculate RF/LO/IF, then reduce the ADC sample frequency and inspect aliasing. Finish by saving one observation in your own words.

### What the models calculate

The main 4-PAM link computes a real equivalent-baseband signal, an actual finite-resolution ADC measurement, gain/timing correction using selected known parameters, nearest-level symbol decisions, and UTF-8 decoding. Its channel includes a smooth fading model, fixed delay, one echo, a sinusoidal interferer, and deterministic band-limited noise. It does not estimate these parameters adaptively or equalize the echo automatically.

The separate software receiver uses rectangular pulses, 16 measurements per symbol, a normalized post-mixer baseband model, an 8-bit ADC over ±8 V, a causal boxcar matched filter, and an optional known one-symbol echo inverse. Its frame-correlation demonstration adds a clean seven-symbol training marker before the payload and searches a known acquisition window. Source/error coding toys are separate. RF/EM drawings and ideal band-selection graphics explain the operations; they are not full physical RF simulations or the Chapter 15 M6 receiver.

## New: a live signal illustration beside the map

The map now sits beside a **live signal illustration**. Choose a step without scrolling away. Playback pauses when you adjust a control, scroll inside the illustration, or open the detailed explanation. **Hold this step** freezes the journey; **Animate signal** keeps a waveform moving while you study one step.

The header credits **Sarthak Chadha** and links to the new **About** page. All pages use a high-contrast dark theme with purple accents and brighter, larger labels.

This package focuses on the Communication Systems app. It remains a standalone static app with relative asset paths, ready to integrate into a website later. The `docs` layout still updates your existing GitHub Pages site.

## New: follow your own message through the radio

The home page is now an interactive transmitter/receiver map. Type a message and choose **Play journey**, or click any of its ten nodes:

**Text → encoding → PAM pulses → DAC → RF + antenna → EM field → receive RF → ADC → DSP decisions → decoded text.**

- Click characters to see their real UTF-8 bytes, hexadecimal values, and binary bits. ASCII `Hello` is 5 bytes, 40 bits, and 20 4-PAM symbols.
- Inspect the binary logic waveform, bit pairs, and the corresponding rectangular PAM waveform. Switch to raised-cosine pulses and change the symbol rate.
- Compare held DAC values with an ideal reconstructed voltage, and see how multiplying by a carrier makes an RF waveform.
- Explore the antenna, electric/magnetic fields, and the hardware at each end.
- Change sample rate and ADC resolution. Inspect individual measured values, quantization errors, and the ADC's binary amplitude codes.
- Change gain, noise, and decision timing; compare the received text and actual bit errors. **Animate signal** runs a waveform cursor and live ADC readouts without changing the selected step.
- Open **Course map** for a connected view of all chapters. The old permanent sidebar is now a **Chapters** drawer; notes expand only when you want them.

The simulation uses the lecture/book's 4-PAM mapping. RF and electromagnetic views are explanatory models; the main receiver calculation uses equivalent baseband, ideal carrier alignment, and actual quantized ADC samples. The software receiver experiment separately exposes carrier mismatch and selected recovery operations. Read **About this learning model** on the page for its assumptions.

### If your GitHub Pages site is already published

1. Download and extract this updated ZIP.
2. Replace the files in the **same repository** with the extracted project contents, including the complete updated `docs` directory. Keep `docs` at the repository root.
3. Commit/push the change. Leave Pages set to **main → /docs**.
4. Wait for the Pages deployment, then refresh the website. Hard-refresh if the browser still displays the earlier layout.

The note storage keys and section IDs are unchanged, so existing browser notes remain available at the same site URL. JSON and Markdown imports from the earlier version are still supported. Download a backup before migrating to another URL or device.

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
| `src/about.tsx` | Developer page and project acknowledgements |
| `src/dark.css` | Dark purple theme and live illustration layout |
| `src/journey.tsx` | Interactive signal journey and connected course map |
| `src/transmission.ts` | UTF-8 encoding, pulse shaping, channel, ADC, and PAM recovery |
| `src/journey.css` | Map workspace, top navigation, responsive visual experiments |
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

The source passes TypeScript checking and a production Vite build. The included tests check aliases, cosine power, the spectrum of a squared cosine, JSON/Markdown round-trips, nested headings in notes, non-destructive merging, invalid backup handling, and separation of storage keys by repository path. They also verify UTF-8/emoji encoding, exact Hello bit and PAM mapping, clean end-to-end reception for both pulse shapes, ADC codes and clipping, gain correction, reproducible noise, low-resolution errors, and symbol decisions made from actual ADC samples. The deployment output is checked for relative local assets and absence of server endpoints or bundled private notes.

Publishing in your own GitHub account is a separate step performed by you; this ZIP does not create a repository or change your existing site.

## Official references

- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Vite static deployment](https://vite.dev/guide/static-deploy)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

This study companion should be used alongside the original course material. Guided checkpoints do not replace your own full derivations or every subpart of the original exercises.

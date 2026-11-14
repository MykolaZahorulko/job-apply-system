---
name: 01-onboarding
description: First-run setup (works from zero state even when workspace/ does not exist yet). Creates workspace/, saves original CVs/templates into workspace/01-originals/, acts as a Jobscan/Jobstep-style ATS coach to iterate on workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html with live market-fit %, then generates <Firstname>-<Lastname>-CV-Base.pdf on approval and builds workspace/02-profile/master-profile.md. Use when workspace/, workspace/02-profile/master-profile.md, or workspace/03-base-cv/*-CV-Base.html is missing, or when asked to start/redo onboarding.
---

# Onboarding: zero-state -> originals -> coached base CV -> master-profile

Read first: `references/ats-rules.md`, `references/coaching.md`, `references/profile-interview.md`.
Outputs: `workspace/02-profile/config.yml`, `workspace/02-profile/master-profile.md`, `workspace/02-profile/market-research.md`, `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html`, `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.pdf`, and (when cover letters are enabled) `workspace/03-base-cv/<Firstname>-<Lastname>-Cover-Letter-Base.html` + `.pdf`.
Ask ONE topic per message. Never assume from outside context; infer only from the user's files, and **confirm**.
**100% domain-agnostic:** works identically for any profession (sound designer, marketer, accountant, designer, engineer). Research *that* field's market and ask *that* field's impact questions - zero IT bias.
Defaults, never asked: A4, exactly 1 page, no photo, **short hyphens (`-`) only - never use long dashes (`—` or `–`)**.

## Step 0 — Zero-State Start: language, workspace setup + original files
1. **Greet & explain the Jobstep-style flow:** Even if `workspace/` does not exist yet (fresh repo clone), welcome the user and explain briefly that you will guide them step by step from zero (or from an existing CV) to an ATS-safe base CV, base cover letter (if wanted), master profile, Notion tracker, and tailored job applications. Ask: **which language should we talk in?** (System/repo files stay English.)
2. **Initialize `workspace/` automatically** when onboarding begins:
   - Create `workspace/01-originals/my-cv/`, `workspace/01-originals/my-cover-letters/`, `workspace/01-originals/style-references/`, `workspace/02-profile/`, `workspace/03-base-cv/source/`, and `workspace/04-applications/`.
3. **Collect starting materials (one clear question):**
   - Ask: **"Do you already have a CV or cover letter (PDF, Word, Canva, etc.), or any style templates/screenshots you'd like to use as a visual reference - or are we building from scratch?"**
   - If they have files/links, ask **where they are** (or have them share/drop paths) and copy them untouched into `workspace/01-originals/`:
     - `workspace/01-originals/my-cv/` - user's own CV(s): source of **content** (and base design);
     - `workspace/01-originals/my-cover-letters/` - user's own existing cover letter(s) / motivational letters: source of **structure, tone, and facts to verify**;
     - `workspace/01-originals/style-references/` - others' CVs/cover letters, templates, screenshots: **design ideas only** (never copy someone else's personal data).
4. **Inspect every provided file:** Run `node tools/check-pdf.mjs` for PDFs; inspect images or broken/complex PDFs visually (render PDF or view directly if `check-pdf.mjs` flags parser/XRef errors). Report briefly what each file is, its ATS readability (explicitly flag parser crashes or missing contact headers), typos, and unverified claims. Confirm each file's role.
5. **Choose onboarding path:**
   - **Path A (own CV exists):** parse existing CV, verify honesty, analyze market fit, and coach section by section.
   - **Path B (only style references, no own CV):** run `references/profile-interview.md` section-by-section first to build `workspace/02-profile/master-profile.md`, then apply the chosen reference style in an ATS-safe HTML template.
   - **Path C (starting completely from scratch):** run `references/profile-interview.md` one topic at a time (starting with name, contacts, target role, experience/projects, education), then propose 2-3 clean ATS-safe HTML template designs from `examples/starter-template.html` and local fonts (`../../assets/fonts/`).

## Step 1 — Region & language settings
- Path A: infer from the CV (country/city, CV language, heading language, consent clause, date format) and **confirm** in one message.
- Path B / C: ask directly: country/region; country-specific items (e.g. in Poland/EU: data-processing consent clause / RODO, **student status** if under 26 - big hiring advantage in PL - plus any local norms). Include only if the user agrees and it's customary. Never ask about photos.
- Ask language & cover letter preferences cleanly:
  - CV language policy (`follow_vacancy` vs `fixed`), and whether section headings stay constant (usually English) while body follows the vacancy;
  - **Cover letter preferences:** whether to generate cover letters (`always` / `ask` per vacancy / `never`), cover letter language (`follow_cv`, `follow_vacancy`, or fixed), and output format (recommend **`pdf+txt`**: ATS-safe PDF synced with CV style + clean copy-paste `.txt` in `source/` for web form textareas);
  - Job analysis language (`job_analysis_language`: `follow_vacancy` vs `user_language`);
  - Notion hub & tracker language (`notion.notion_language`).
- Save to `workspace/02-profile/config.yml` (copied from `examples/config.example.yml`).

## Step 2 — Target position
- If a CV exists: infer target role, seniority, specialization and **confirm**; ask about adjacent roles, cities/remote.
- If not (Path B/C): ask directly (`target_roles`, `locations`, `work_mode`).
- Save to `workspace/02-profile/config.yml` and `workspace/02-profile/master-profile.md` (along with the user's `Full name` so filenames `<Firstname>-<Lastname>-CV-Base.*` can be named properly).

## Step 3 — Market-fit score (Jobscan/Jobstep style)
1. **Market expectations:** web-search 5-10 current postings for that role + country (or ask for links if needed). Extract recurring hard skills, tools, keywords, seniority signals, and soft skills. Save to `workspace/02-profile/market-research.md` with sources.
2. **Score the current CV (or initial profile for Path B/C) 0-100%** with a 4-bucket table:
   - Keyword/skill match vs market (40%)
   - Experience relevance & seniority (25%)
   - Achievement quality: measurable, action-led (20%)
   - ATS format compatibility (15%)
3. Show strengths, missing keywords (split into "do you have this?" vs "true gaps"), weak bullets, and format issues. State score is an estimate.

## Step 4 — Coached base CV (`workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html`)
Act as a hands-on Jobstep/ATS coach leading the user step by step. **Iterate in HTML only - NO PNGs and NO intermediate PDFs.**
*(Sanitize `<Firstname>-<Lastname>` as ASCII TitleCase separated by hyphens, e.g. `Alex-Novak-CV-Base.html`.)*

1. **Style decision:**
   - Path A: describe the current CV's style in one sentence and name the main ATS risk. Offer 3 options, recommended first:
     1. **(Recommended) Keep the style, fix the layout** - same colors/font/heading look, single column, header band on top;
     2. Keep layout as is - only content/technical fixes (state remaining ATS risk);
     3. Different style (from `style-references/` or clean new layout).
   - Path B/C: propose 2-3 ATS-safe HTML preview options (e.g. Classic Navy Band, Minimalist Monochrome, Modern Clean Accent) using `examples/starter-template.html` or local OFL fonts in `assets/fonts/`.
2. **Live HTML preview right away.** Write `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` (with `@media screen` A4 sheet styling so it looks like a crisp page in a browser, and `@media print` for exact A4 output; link local fonts via `../../../assets/fonts/...`). Also save snapshot `workspace/03-base-cv/drafts/v1.html`.
   Make opening the preview effortless for non-technical users:
   - Share `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` per `AGENTS.md`: in a visual desktop app/IDE, open it in the native built-in browser/preview (or give a clickable `file://` link only); in a terminal/CLI, give a clickable `file://` link AND print the raw `file:///absolute/path/to/workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` URL (without backticks);
   - Explain on the first preview: *"Click the link or double-click `<Firstname>-<Lastname>-CV-Base.html` in your file manager - it opens in your browser as an A4 sheet. Keep that one tab open and press `Cmd+R` (Mac) or `F5` (Windows) after each update."*
   - Never open duplicate tabs; always overwrite the same `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` file.
3. **Section-by-section coaching** in order, one section per turn:
   Header -> Summary -> Skills -> Experience (one role at a time, digging for projects, scope, numbers) -> Projects -> Education & certificates -> Languages/extras.
   For each section (act like a proactive Jobstep coach - **drive the next step**, don't passively ask "is everything ok?" while gaps remain):
   - Diagnose what is weakest in the current score and why (ATS / recruiter);
   - Ask 1-3 concrete questions to pull out real projects, business scope, users/screens, or real numbers (never accept "just duties");
   - Propose before -> after;
   - After user OK: update `workspace/02-profile/master-profile.md` immediately, update `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html` + save snapshot `workspace/03-base-cv/drafts/vN.html`, verify 1-page A4 fill (never leave a large dead gap above footer/GDPR), give clickable link + `Cmd+R` reminder, and show the updated **estimated market-fit score (`start% -> prev% -> current%`)** PLUS the **next concrete coaching step** to push the score higher.
   Keep the base CV generic for the target role (vacancy-specific tailoring happens later in Skill 03). Record skills honestly in `workspace/02-profile/master-profile.md` by tier (`Core`, `Basic`, `Gap`).
4. **Approval -> final PDF & cleanup.**
   When the user confirms `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` looks great:
   1. Render `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.pdf` (`node tools/html-to-pdf.mjs workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.pdf`);
   2. Verify with `node tools/check-pdf.mjs workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.pdf` (1 page, reading order, no warnings);
   3. Delete `workspace/03-base-cv/drafts/` so `workspace/03-base-cv/` cleanly holds **only `<Firstname>-<Lastname>-CV-Base.pdf`** (plus `<Firstname>-<Lastname>-Cover-Letter-Base.pdf` if built) in the root, and HTML files inside `source/`;
   4. Show final before -> after score (`start% -> final%`).

## Step 4B — Coached Base Cover Letter (`workspace/03-base-cv/source/<Firstname>-<Lastname>-Cover-Letter-Base.html`)
Run this step whenever `cover_letter` in `workspace/02-profile/config.yml` is `always` or `ask`:
1. **Audit existing sample OR start from template:**
   - If the user placed a cover letter in `workspace/01-originals/my-cover-letters/`: inspect ATS readability (`node tools/check-pdf.mjs` + visual/text check), flag parser errors, typos, missing contact headers, generic openings, and run an **honesty check** against `workspace/02-profile/master-profile.md` (ask the user to confirm any new facts, projects, tools, contract preferences, or notice period before including them, and add confirmed facts to `master-profile.md`).
   - If building from scratch: start from `examples/starter-cover-letter-template.html` and match the **visual branding** of `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` (same header band, local fonts via `../../../assets/fonts/`, colors, clickable contacts, no GDPR/RODO clutter).
2. **Build & coach in HTML preview:**
   - Save `workspace/03-base-cv/source/<Firstname>-<Lastname>-Cover-Letter-Base.html` (plus optional `drafts/` snapshot during edits) and share the preview per `AGENTS.md` (native preview/clickable link in visual apps; clickable link + raw URL + `Cmd+R` / `F5` in terminal).
   - Keep the base template **ultra-short & scannable (80-130 words, 3 concise paragraphs, 1 page A4)** with no `City, Date`, no `"Re:"` / `"Dotyczy:"` clutter (just clean `[Company Name]`), and no RODO/GDPR block (that lives in the CV), using strictly short hyphens (`-`) and zero clichés.
3. **Approval -> final PDF verification:**
   - Once approved, render `workspace/03-base-cv/<Firstname>-<Lastname>-Cover-Letter-Base.pdf` via `node tools/html-to-pdf.mjs`, verify with `node tools/check-pdf.mjs` (`Pages: 1`, zero XRef/font errors, clickable links intact), delete `drafts/`, and share the PDF per `AGENTS.md`.

## Step 5 — Finish & Transition to Notion + Applying
Summarize created files (`workspace/01-originals/`, `workspace/02-profile/`, `workspace/03-base-cv/`), share `<Firstname>-<Lastname>-CV-Base.html`/`.pdf` (and `<Firstname>-<Lastname>-Cover-Letter-Base.html`/`.pdf` if created) per `AGENTS.md`, list remaining true skill gaps, and transition into applying:
- Confirm the base templates are ready to use and immediately launch `04-track-notion` Phase A (ask whether to connect/use an existing Notion page or create a new one, then offer top job-boards research for their country) before asking for the first job posting (`02-analyze-job`).

## Tooling
Node 18+ required. First time: `cd tools && npm install && npm run setup`.

## Rules
- Never invent achievements, numbers, skills, or projects. Facts from third-party rewrites/references must be confirmed.
- One topic at a time; keep the user's language.
- Do not commit anything inside `workspace/`.

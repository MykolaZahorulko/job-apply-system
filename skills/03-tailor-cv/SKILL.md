---
name: 03-tailor-cv
description: Jobstep-style ATS CV & Cover Letter tailoring engine. Reshapes workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html around source/<Target>-job.md to maximize honest ATS match % (exact vacancy title, verbatim keyword coverage across Summary/Skills/Experience, reordered bullets), drives an iterative score-climbing Q&A loop with the user in HTML preview, and renders ATS-verified PDFs into workspace/04-applications/<folder>/ upon approval.
---

# Tailor CV & Cover Letter (`03-tailor-cv`)

Read first: `workspace/04-applications/<folder>/source/<Target>-job.md`, `workspace/02-profile/config.yml`, `workspace/02-profile/master-profile.md`, `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html`, `skills/01-onboarding/references/ats-rules.md`.
Outputs:
- Working sources inside `workspace/04-applications/<folder>/source/`:
  - `<Target>-job.md`
  - `<Firstname>-<Lastname>-CV-<Target>.html`
  - optional `<Firstname>-<Lastname>-Cover-Letter-<Target>.html`
  - optional `<Firstname>-<Lastname>-Cover-Letter-<Target>.txt` (when `cover_letter_format: pdf+txt`, clean copy-paste text for web form textareas)
- Final deliverables in `workspace/04-applications/<folder>/` (rendered ONLY after user approval):
  - `<Firstname>-<Lastname>-CV-<Target>.pdf`
  - optional `<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf`

*(Where `<Firstname>-<Lastname>` comes from `master-profile.md`, e.g. `Alex-Novak`, and `<Target>` is the company name if known, or job title if undisclosed, e.g. `Acme` or `Frontend-Developer`.)*

## Core Rules
1. **Zero fabrication, maximum honest ATS match.** Only select, reorder, translate, and rephrase verified facts from `workspace/02-profile/master-profile.md` (plus new facts the user explicitly confirms during coaching). Never invent fake companies, dates, metrics, or unverified tools.
2. **Short hyphens (`-`) only.** Never use long dashes (`—` or `–`) anywhere in the CV or cover letter HTML/PDF.
3. **HTML preview first, PDF on approval.** Never generate PDFs during intermediate iterations. Overwrite `workspace/04-applications/<folder>/source/<Firstname>-<Lastname>-CV-<Target>.html` and let the user refresh (`Cmd+R` / `F5`) in their browser.
4. **Asset paths:** Because `workspace/04-applications/<folder>/source/<file>.html` is four directories deep, update any relative font/asset paths from `../../../assets/` (used in `workspace/03-base-cv/source/`) to `../../../../assets/`.
5. **1-page A4 balance:** Keep the exact 1-page A4 height (`297mm`) with evenly distributed sections (`justify-content: space-between` on `main`) so there is neither overflow onto page 2 nor a dead blank gap above the footer/GDPR clause.

## Step 1 — Language & Localization Setup
Check `workspace/02-profile/config.yml` (`cv_language_policy`, `cv_headings_language`, `cv_language_rules`, `country_fields`) against the vacancy language in `source/<Target>-job.md`:
- Keep section headings in `cv_headings_language` (default: English - `PROFILE`, `SKILLS`, `EXPERIENCE`, `EDUCATION`) unless configured otherwise.
- Write body text, dates, student status (`Status studenta` / `Student status`), and GDPR consent clause in the target body language determined by `cv_language_rules`:
  - **Polish body:** use the vacancy's exact custom RODO clause if provided in the posting (including specific company name/address!), otherwise use the standard Polish RODO clause.
  - **English body:** use the vacancy's exact custom GDPR clause if provided, otherwise:
    *"I hereby give consent for my personal data included in my application to be processed for the purposes of the recruitment process in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (GDPR)."*

## Step 2 — ATS-First Tailoring Rules (Maximize Match % Honestly)
Starting from `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html`, apply **all** high-impact ATS optimizations around `source/<Target>-job.md`:

1. **Exact Vacancy Title Mirroring (High ATS Weight):**
   - Set the CV header subtitle (`<div class="title">`) to **mirror the exact role title from the job posting** (e.g., if the posting asks for `React Frontend Developer` or `E-commerce Frontend Developer` or `Frontend Developer`, use that exact title whenever it honestly fits the user's background; drop internal qualifiers like `/ Developerka` only when normalizing cleanly).
   - For the current/past job title inside `EXPERIENCE`: keep the employer name and dates 100% real, and if the user's internal title can be framed closer to the vacancy's standard title without distorting seniority or duties (e.g., `E-commerce Frontend Developer` -> `Frontend Developer`), apply or confirm that adjustment with the user.

2. **Verbatim ATS Keyword Alignment (3-Zone Rule):**
   - ATS parsers often score exact token/phrase matches rather than loose synonyms. Mirror the posting's **exact spelling, phrasing, language, and acronyms** (and include both full form and acronym once, e.g. `Search Engine Optimization (SEO)`, `Responsive Web Design (RWD)`).
   - Weave every confirmed must-have & nice-to-have keyword naturally into **at least 2 of the 3 main zones**:
     1. **Profile / Summary (2-3 lines):** Lead with the target role title, real years/scope, and the top 4-6 core stack/domain keywords from the posting. De-emphasize niche tools the posting doesn't care about unless relevant.
     2. **Skills:** Place exact must-have keywords at the **very front** of the list, followed by confirmed nice-to-haves, and push unrelated tools to the back (or trim low-relevance noise so the top line hits 100% relevance).
     3. **Experience & Projects Bullets:** Reorder bullets so the most vacancy-relevant project/outcome is **Bullet #1** of the most recent role. Rewrite bullet phrasing to mirror the vacancy's exact action verbs and technical/domain terminology (e.g., `REST API`, `optymalizacja aplikacji`, `scalability`, `reusable components`, `B2B/B2C`, `Core Web Vitals`) without inventing facts.

3. **ATS Structural Integrity Check (Every Edit):**
   - Single-column source order (Name -> Target Title -> Contacts -> Profile -> Skills -> Experience -> Projects/Education -> Languages -> Consent).
   - Standard uppercase/clear headings, dates separated cleanly from job titles (not merged in flex text), clickable `mailto:`, `tel:`, and `https://` links.
   - Zero white/hidden text, zero keyword stuffing lists, zero em/en-dashes (`—` or `–`).

## Step 3 — Interactive Jobstep Score-Climbing Loop (Lead the User!)
Never treat the first tailored HTML as "done and passive". Act like a live **Jobstep / Jobscan coach**:
1. **After each HTML generation/update:**
   - Recalculate the **4-bucket match % score** (`Base CV %` -> `Prev %` -> `Current Tailored %`, showing exact bucket changes: `Keywords /40`, `Title & Experience /25`, `Achievements /20`, `ATS Format & Language /15`).
   - Show concisely what changed in `source/<Firstname>-<Lastname>-CV-<Target>.html` and share the preview per `AGENTS.md` (in visual desktop apps/IDEs: open `.html` in the built-in browser at `file:///...` or give `/browser file:///...` + clickable `file://` link; in terminal/CLI: clickable `file://` link + raw `file:///absolute/path/...` URL without backticks + `Cmd+R` / `F5` reminder).
   - List the **remaining highest-upside gaps / unexplored requirements** from `source/<Target>-job.md` (with estimated `+%` gain) and ask **2-4 targeted coaching questions** to uncover real experience the user hasn't added to `master-profile.md` yet (commercial, freelance, pet projects, university, tools, workflows like Scrum/CI/CD/testing, or metric details).
2. **Whenever the user answers or confirms new facts:**
   - Immediately record the verified fact (with accurate tier: `Core` vs `Basic` + real context) in `workspace/02-profile/master-profile.md` AND update `source/<Target>-job.md` matrix if applicable.
   - Immediately inject the newly confirmed keyword/detail across Summary, Skills, and Experience bullets in `source/<Firstname>-<Lastname>-CV-<Target>.html`, verify 1-page A4 balance, show the **new higher match % score**, and ask the next remaining high-upside question (or confirm we have reached the honest ceiling!).
3. Continue iterating smoothly until all honest upside is captured and the user says the CV looks great / approves generating the PDF.

## Step 4 — Cover Letter (`source/<Firstname>-<Lastname>-Cover-Letter-<Target>.html` + optional `.txt`)
Check `cover_letter`, `cover_letter_language_policy`, and `cover_letter_format` in `workspace/02-profile/config.yml`:
- If `cover_letter: never`, skip this step **unless the user explicitly asks for a Cover Letter** (for this application or to start using cover letters now).
- If `cover_letter: ask`, ask the user concisely whether to generate a Cover Letter for this application (especially helpful when the vacancy asks for one, has specific screening questions, or match % benefits from framing relevant projects).
- If requested (or `always`):
  1. **Base & Visual Sync (Plus Late Onboarding Option):** Start from `workspace/03-base-cv/source/<Firstname>-<Lastname>-Cover-Letter-Base.html` if it exists (adjusting asset paths from `../../../assets/` to `../../../../assets/`), or from `examples/starter-cover-letter-template.html` styled identically to `source/<Firstname>-<Lastname>-CV-<Target>.html` (same header band, contacts, local fonts, accent color, 1-page A4). If `*-Cover-Letter-Base.html` does not exist yet (or `cover_letter` is still `never`), also offer to create and save the reusable Base Cover Letter template (`01-onboarding` Step 4B) and update `cover_letter` (`ask` / `always`) and `cover_letter_format` (`pdf+txt` / `pdf`) in `workspace/02-profile/config.yml`.
  2. **Vacancy-Specific Personalization (Ultra-Short, Direct & ATS-Synced):**
     - Determine language from `cover_letter_language_policy` (`follow_cv` by default).
     - Mirror the exact vacancy role title in the header subtitle when honest; show only the clean `<Company Name>` line above the greeting (no `City, Date`, no `"Dotyczy:"` / `"Re:"` prefix, and no RODO/GDPR clause since it is in the CV).
     - Keep it ultra-crisp (**80-130 words**, max 150 words, **3 short paragraphs** readable in 5-10 seconds):
       - **Paragraph 1 (Hook + Top Proof):** Exact target fit + top 1-2 verified shipped projects/outcomes from `master-profile.md` matching the vacancy's primary stack/needs with verbatim ATS keywords.
       - **Paragraph 2 (Secondary Fit / Workflow):** Relevant supporting tools, optimization/quality mindset, or workflow fit aligned to the posting (answering any critical screening prompt cleanly without repeating the CV bullet-for-bullet).
       - **Paragraph 3 (Logistics & CTA):** Location/work mode/contract availability + brief call to action and sign-off.
     - Strictly short hyphens (`-`) only, zero generic AI clichés (*"I am writing to express my strong interest..."*, *"thrilled"*, *"passionate visionary"*).
  3. **Preview & Copy-Paste `.txt`:**
     - Share `source/<Firstname>-<Lastname>-Cover-Letter-<Target>.html` per `AGENTS.md` (in visual apps: open `.html` in the built-in browser at `file:///...` or give `/browser file:///...` + clickable `file://` link; in terminal: clickable link + raw `file:///...` URL + `Cmd+R` / `F5`).
     - If `cover_letter_format: pdf+txt`, also write `workspace/04-applications/<folder>/source/<Firstname>-<Lastname>-Cover-Letter-<Target>.txt` containing ONLY the clean greeting, paragraphs, and sign-off (zero repeated contact header, zero mid-paragraph line wraps) ready to paste directly into JustJoin.IT / NoFluffJobs / LinkedIn / ATS text fields.

## Step 5 — Approval, PDF Rendering & Verification
Once the user approves `source/<Firstname>-<Lastname>-CV-<Target>.html` (and cover letter if used):
1. Render the final PDF(s) directly into the root of `workspace/04-applications/<folder>/` (keeping `source/` clean for working files):
   ```bash
   node tools/html-to-pdf.mjs workspace/04-applications/<folder>/source/<Firstname>-<Lastname>-CV-<Target>.html workspace/04-applications/<folder>/<Firstname>-<Lastname>-CV-<Target>.pdf
   ```
   (And if a cover letter exists: `node tools/html-to-pdf.mjs workspace/04-applications/<folder>/source/<Firstname>-<Lastname>-Cover-Letter-<Target>.html workspace/04-applications/<folder>/<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf`.)
2. Verify every generated PDF with `check-pdf.mjs`:
   ```bash
   node tools/check-pdf.mjs workspace/04-applications/<folder>/<Firstname>-<Lastname>-CV-<Target>.pdf
   ```
   (And `node tools/check-pdf.mjs workspace/04-applications/<folder>/<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf` when present.)
   Confirm:
   - `Pages: 1`
   - Clean reading order, zero XRef/font warnings, no glued text runs
   - Zero em/en-dashes (`—` or `–`)
   - Clickable links intact
3. Delete any temporary draft files in `workspace/04-applications/<folder>/drafts/` if present so the application folder cleanly holds `<Firstname>-<Lastname>-CV-<Target>.pdf` (plus optional cover letter PDF) and `source/` (`<Target>-job.md`, `<Firstname>-<Lastname>-CV-<Target>.html`, optional cover letter HTML + `.txt`).
4. Share the final PDF(s) per `AGENTS.md` (open in native preview or provide clickable `file://` markdown links in visual apps; clickable `file://` links alongside raw `file:///absolute/path/...` URLs without backticks in terminal/CLI). If a Cover Letter was generated (`cover_letter_format: pdf+txt`), also print its clean plain-text body inside a fenced code block in the chat response so the user can 1-click copy it into web form textareas without opening `source/`.
5. **Immediately trigger `04-track-notion` (Phase C):** If Notion is configured (`workspace/02-profile/config.yml` -> `notion.mode != none` / `unset`), create the new application row in the Notion Applications database, populate its properties, upload `<Firstname>-<Lastname>-CV-<Target>.pdf` (plus `<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf` if generated) via `notion-create-file-upload`, and embed the `<pdf>` block(s) at the top of the Notion page alongside the vacancy analysis.

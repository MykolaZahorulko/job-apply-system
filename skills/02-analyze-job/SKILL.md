---
name: 02-analyze-job
description: Analyzes a job posting (URL, text, or screenshot) against workspace/02-profile/master-profile.md and the base CV HTML in workspace/03-base-cv/. Extracts exact ATS keywords, must-haves vs nice-to-haves, scores current vs potential match % by bucket, ranks missing keywords by % upside, and saves workspace/04-applications/<target>-<YYYY-MM-DD>/source/<Target>-job.md before launching iterative Jobstep tailoring.
---

# Analyze Job Posting (`02-analyze-job`)

Prerequisite check: if `workspace/`, `workspace/02-profile/master-profile.md`, or `workspace/03-base-cv/*-CV-Base.html` does not exist yet, stop and run `skills/01-onboarding/SKILL.md` first.
Read first: `workspace/02-profile/config.yml`, `workspace/02-profile/master-profile.md`, `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html`, `skills/01-onboarding/references/ats-rules.md`.
Output: `workspace/04-applications/<folder>/source/<Target>-job.md`.
Language of `<Target>-job.md`: follow `job_analysis_language` in `workspace/02-profile/config.yml` (`follow_vacancy` = write in the vacancy's language, `user_language` = write in chat language). If `job_analysis_language` is missing/unset, ask the user once and save it to `workspace/02-profile/config.yml` before continuing.
**100% domain-agnostic:** works for any profession. Never fabricate skills or experience.

## Step 1 — Ingest the job posting
1. Accept a URL, pasted text, or screenshot(s) from the user.
2. If given a URL, fetch the page content.
   - **Important:** Many job boards (LinkedIn, Workday, Pracuj.pl, OLX, NoFluffJobs, Cloudflare/CloudFront-protected pages) block automated fetchers or render via client-side JS. If fetching returns incomplete text or an anti-bot wall, immediately stop fetching and ask the user to paste the job description text (or a screenshot). Note this clearly so the user isn't surprised.
3. Identify the **ATS platform** if visible from the URL or page structure (e.g., Workday, Greenhouse, Lever, SmartRecruiters, Teamtailor, Traffit, eRecruiter, Ashby, BambooHR, Recruitee) and note any platform-specific parsing quirks (e.g. Workday/Taleo strict exact-title and exact-keyword matching).

## Step 2 — Extract requirements & exact ATS keywords
Parse the posting in its original language and extract:
- **Metadata:** Company name (if disclosed) & Company website/profile URL (if available), Job Posting URL, **exact Role Title** (as written in the posting), Seniority level, Location, Work Mode (remote/hybrid/onsite), Contract type & Salary range (if listed), Vacancy Language, and any **custom RODO/GDPR wording**.
- **Role Description & Context:** Concise summary of the project/team and what the person will actually build, manage, or deliver.
- **Technologies & Tools:** Complete list of technologies, frameworks, platforms, methodologies, and tools mentioned.
- **Must-have requirements:** Core hard skills, tools, domain experience, languages, degrees/certifications explicitly required.
- **Nice-to-have requirements:** Bonus skills, secondary tools, optional domain exposure.
- **Exact ATS keywords & phrases:** Verbatim terms, exact phrasing, tools, soft/process skills (e.g. `Scrum`, `CI/CD`, `Code Review`, `SSR/SSG`), and acronyms used in the posting (both full form and acronym if applicable).

## Step 3 — Score & rank upside (Jobstep / Jobscan Engine)
Calculate two transparent scores (0-100%) using the 4-bucket ATS rubric:
1. **Current Base CV Score** (how `workspace/03-base-cv/<Firstname>-<Lastname>-CV-Base.html` scores right now without edits)
2. **Initial Tailored Score** (what `03-tailor-cv` achieves right now using already-verified facts in `workspace/02-profile/master-profile.md` + exact ATS title/keyword alignment + language adaptation)
3. **Max Realistic Score** (if the user confirms the unexplored/basic requirements they might genuinely have)

| Bucket | Weight | What to evaluate |
|---|---|---|
| **1. Exact Keywords & Hard Skills** | 40% | Verbatim match of must-have (70% of bucket) and nice-to-have (30% of bucket) keywords in Summary + Skills + Experience |
| **2. Title, Experience & Seniority** | 25% | Exact role title alignment (header title + role framing), years of experience, domain relevance |
| **3. Achievements & Scope** | 20% | Concrete shipped work, scale/metrics, and domain outcomes directly proving the vacancy's core responsibilities |
| **4. ATS Format & Language** | 15% | Single-column parseability, standard headings, vacancy language match, custom consent clause if required |

Categorize every requirement into 3 honest tiers and **estimate the % upside of each missing item**:
- **Matched (Core):** Verified in `master-profile.md`. Note whether it is already on the base CV or sitting in `master-profile.md` ready to be injected verbatim.
- **To Clarify (Highest-Upside Jobstep Questions - Never Stop at `master-profile.md`!):**
  1. Items marked `Working / Basic` in `master-profile.md` that appear in the vacancy; AND
  2. **Unexplored vacancy requirements** (technologies, tools, testing frameworks, methodologies like Scrum/Agile, CI/CD, Docker, analytics, leadership, or role-title framing) missing from `master-profile.md` simply because they weren't covered during onboarding; AND
  3. **Title / Experience phrasing adjustments** where an existing role's subtitle or bullet wording could more accurately mirror the posting's terminology once confirmed by the user.
  Rank these by **estimated +% impact** so you ask about the highest-value items first!
- **Confirmed Gap:** Confirmed as never used -> report honestly and never fabricate.

## Step 4 — Determine `<Target>` & Save `<Target>-job.md`
Determine `<Target>` cleanly:
- **If company name is known:** `<Target>` = concise clean company name (e.g. `Acme`, `Stripe`, `Allegro`), and `<target-slug>` = lowercase kebab-case (`acme`, `stripe`, `allegro`).
  - Folder: `workspace/04-applications/<company-slug>-<YYYY-MM-DD>/source/` (e.g. `workspace/04-applications/acme-2026-11-14/source/`).
  - *(Collision rule: if a folder for the same company + date already exists for a different role, append `-<role-slug>` to both folder and `<Target>`, e.g. `acme-react-2026-11-14/` and `Acme-React`.)*
- **If company name is missing/confidential:** `<Target>` = clean TitleCase job title (e.g. `Frontend-Developer`), and `<target-slug>` = lowercase kebab-case (`frontend-developer`).
  - Folder: `workspace/04-applications/<role-slug>-<YYYY-MM-DD>/source/` (e.g. `workspace/04-applications/frontend-developer-2026-11-14/source/`).

Write `workspace/04-applications/<folder>/source/<Target>-job.md` with:
1. **Job Metadata** (Company, Company URL, Job URL, Exact Role Title, Seniority, Location, Work Mode, Contract, Salary, Language, Likely ATS)
2. **Role Description & Responsibilities** (clear summary of what the job entails)
3. **Technologies & Requirements** (Technologies/tools list, Must-have vs Nice-to-have, Verbatim ATS keywords)
4. **Score Breakdown** (`Current Base CV %` -> `Initial Tailored %` -> `Max Realistic %`, broken down by the 4 buckets)
5. **3-Tier Keyword & Requirement Matrix** (`Matched`, `To Clarify with +% Upside`, `True Gaps`)
6. **Concrete ATS Tailoring Plan for Skill 03** (exact header role title, target CV language, verbatim keywords for Summary/Skills/Experience, bullets to rephrase/reorder, custom RODO/GDPR clause if any)
7. **Raw Job Posting** at the bottom for future reference and interview prep.

## Step 5 — Report & launch Jobstep Score-Climbing Loop (`03-tailor-cv`)
Proceed directly into `03-tailor-cv` (HTML preview stage only - do NOT generate PDF yet) and present one clear, proactive Jobstep coaching message in `user_language`:
1. Concise summary of the vacancy (Company + link, Exact Role Title, Key Stack) and the **4-bucket match % score** (`Base CV %` -> `Tailored Preview v1 %` + realistic ceiling if missing items are confirmed).
2. Brief summary of **ATS adaptations already applied** (e.g. mirrored role title, reordered skills, verbatim keyword alignment, rewritten summary & bullets) and **confirmed gaps**.
3. **Focused Jobstep coaching questions (highest +% upside first, 2-4 crisp questions at a time):** ask specifically about unexplored requirements, `Basic` tools, or real project details/metrics/title nuances that can legitimately unlock extra % in the next iteration.
4. Preview links to `workspace/04-applications/<folder>/source/<Firstname>-<Lastname>-CV-<Target>.html` (and `source/<Target>-job.md`) following `AGENTS.md` (in visual desktop apps/IDEs: open the `.html` in the built-in browser at `file:///...` or provide `/browser file:///...` + clickable `file://` links for `.md`/`.html`; in terminal/CLI: clickable `file://` links alongside the raw `file:///absolute/path/...` URL without backticks), reminding the user to inspect it, answer the coaching questions to boost the match %, or approve PDF generation when satisfied.

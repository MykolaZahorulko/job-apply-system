---
name: 05-job-scout
description: Sets up a Suggested Vacancies database/table (localized name, e.g., "Suggested Vacancies" / "Пропоновані вакансії") below Applications, runs deduplicated job discovery against master-profile.md and job-boards.md, and guides the user step-by-step to configure automated recurring checks (e.g., 09:00 and 17:00 daily) via Antigravity Desktop App (/automation), OS scheduler (launchd / Task Scheduler), or Cloud/External runners.
---

# Job Scout & Automated Discovery (`05-job-scout`)

Prerequisite check: `workspace/02-profile/config.yml`, `workspace/02-profile/master-profile.md`, and `workspace/02-profile/job-boards.md` must exist (run `01-onboarding` and `04-track-notion` first if missing).
Outputs: creates/updates the **Suggested Vacancies** database (Notion `notion.scout_db_id` / `notion.scout_data_source_url`) or equivalent sheet/section in the user's chosen tracker, logs deduplicated matching leads, and records `scout.*` automation settings in `workspace/02-profile/config.yml`.

## Phase A — Suggested Vacancies Database / Table Setup
If `notion.scout_db_id` (or alternative `tracker.scout_path`) is not yet configured:
1. **Confirm naming & placement:**
   - Use an intuitive localized title matching `notion.notion_language` (or `user_language` for non-Notion trackers), e.g., `"Suggested Vacancies"` (en), `"Пропоновані вакансії"` (uk), `"Proponowane oferty"` (pl).
   - **Notion:** create the inline database on `notion.parent_page_url` **immediately below the Applications database** and **above the collapsible Fast-Apply Playbook** (no redundant `##` heading above the inline database).
   - **Excel / CSV / Markdown / Notes:** add a dedicated sheet (`Suggested Vacancies` / localized) or section directly below Applications.
2. **Canonical Schema (Notion single-word CamelCase properties / matching columns in Excel & Markdown):**
   - `Role` (`TITLE` - exact job title, e.g., `Frontend Developer (React)`)
   - `Company` (`RICH_TEXT` - company name, or `Undisclosed`)
   - `CompanySite` (`URL` - company website URL, if disclosed/found)
   - `Found` (`CREATED_TIME` - auto-populated discovery timestamp used for sorting)
   - `Date` (`FORMULA('formatDate(prop("Found"), "DD.MM.YYYY")')` - compact date shown in table view)
   - `Status` (`SELECT('New':blue, 'Reviewed':yellow, 'Applied':green, 'Skipped':gray)`)
   - `Match` (`NUMBER FORMAT 'percent'` - decimal, e.g., `0.78` -> `78%`)
   - `Platform` (`SELECT` - source board name)
   - `JobURL` (`URL` - direct posting link, used for deduplication)
   - `WorkMode` (`SELECT('Remote':green, 'Hybrid':blue, 'Onsite':orange)`)
   - `Location` (`RICH_TEXT` - city / country)
   - **Default Table View (`notion-update-view`):**
     Keep the collapsed table compact with logical order and widths that never clip column headers (`CompanySite`, `Platform`, `WorkMode`, `Location` stay visible inside opened cards or full-page DB view):
     `CLEAR SORT; SORT BY "Found" DESC, "Match" DESC; SHOW "Date", "Role", "Company", "Status", "Match", "JobURL"; WIDTH "Date" 90, "Role" 200, "Company" 130, "Status" 80, "Match" 90, "JobURL" 160`
     *(Note: Notion assigns column-header icons by property type and shows row page icons automatically when rows have body content; inform the user they can hide row page icons in 2 clicks via database `•••` -> Customize -> Show page icon -> Off.)*
3. **Save IDs:** store `notion.scout_db_id` and `notion.scout_data_source_url` (or `tracker.scout_*`) in `workspace/02-profile/config.yml`.

## Phase B — Job Discovery & Deduplication Run (On-Demand or Scheduled)
1. **Load search criteria:**
   - Read `target_roles`, `locations`, `work_mode`, `country` from `workspace/02-profile/config.yml`.
   - Read skills, experience level, and verified facts from `workspace/02-profile/master-profile.md`.
   - Read open vs anti-bot boards from `workspace/02-profile/job-boards.md`.
2. **Fetch & search deeply and broadly across skills, levels, and platforms:**
   - **Calibrate experience levels:** Search **both Junior/Junior+ and Mid/Regular** listings matching the candidate's real years of experience in `master-profile.md`. Actively **filter out** Senior-only roles, roles requiring 4+ years, or roles centered on an unrelated primary framework (e.g., Angular/Vue-only when candidate's stack is React/JS).
   - **Broad multi-skill & multi-title discovery:** Never rely on a single keyword or a single page. Sweep multiple pages and queries derived from `target_roles` and `master-profile.md` (e.g., `Frontend Developer`, `React Developer`, `JavaScript Developer`, `Web Developer`, `E-commerce Developer`, `UI Developer`, `Fullstack JS/React`, `HTML/CSS`, `CMS/Shopify/IdoSell`) to inspect **50–100+ candidate listings** before shortlisting.
   - **All maximally accessible platforms (never rely on just 1–2 boards):**
     - **Open boards:** query all auto-fetchable boards from `job-boards.md` (e.g., in Poland: `JustJoin.IT`, `NoFluffJobs`, `RocketJobs`, `Solid.jobs`), inspecting full posting details (and company website for `CompanySite`) before scoring.
     - **Google / Web Search indexing across anti-bot boards:** run targeted `site:` web searches across `OLX`, `Pracuj.pl`, `TheProtocol.it`, `Bulldogjob`, `Indeed`, and company career pages (e.g. `site:olx.pl/oferta/praca frontend OR react OR web developer remote OR lublin`, `site:pracuj.pl/praca frontend OR react zdalna OR lublin`) so vacancies on HTTP-403 boards are still discovered.
     - **Browser researcher mode (when `scout.browser_enabled: true` and browser tools are available):** open Google and public job boards (`OLX`, `Pracuj.pl`, `TheProtocol.it`, `Bulldogjob`, `RocketJobs`, `Indeed`) in the browser like a human researcher — scroll listings, click into cards, read full descriptions, and collect matching offers.
     - **Strict safety boundary:** **Never** bypass CAPTCHAs, "verify you are human" gates, or login walls; if a board presents a CAPTCHA or login requirement during a run, skip that gated board cleanly and continue with Google search + remaining boards.
3. **Deduplicate strictly across ALL statuses:**
   - Query **all** existing rows (regardless of `Status` - including `New`, `Reviewed`, `Applied`, `Skipped`, `Closed`, `Hired`, or any archived/inactive status) in **both** `Applications` (`applications_data_source_url` / tracker) and `Suggested Vacancies` (`scout_data_source_url` / tracker).
   - **Never** re-add a vacancy whose `JobURL` (normalized without query/tracking params) or `(Company + Role)` already appears in either list, even if its status is `Closed`, `Skipped`, or `Applied`.
4. **Score & log relevant leads:**
   - Estimate honest **Match %** against `master-profile.md` (same 4-bucket criteria as `02-analyze-job`).
   - Filter out clearly irrelevant roles (or below `scout.min_match`, default `0.55`).
   - Add each qualifying new vacancy to **Suggested Vacancies** with `Status: "New"`, `Company`, `CompanySite`, `Match`, `Platform`, `JobURL`, `WorkMode`, `Location`, and a concise page body (Key Requirements, Why It Matches, Gaps/Risks, Raw Snippet).
   - Summarize newly added vacancies concisely for the user (and remind them they can reply with any row/URL to start tailoring a CV via `02-analyze-job` -> `03-tailor-cv`).

## Phase C — Jobstep Guide: Configure Automated Schedule (Ask One Topic at a Time)
Guide the user step-by-step without dumping walls of text (stays 100% agent/LLM-agnostic):

1. **Confirm automation & agree on hours, Match % threshold, and search scope (ask one topic at a time):**
   - **Want automation? (and preferred hours):** Ask whether they want automatic recurring checks for new vacancies (suggest default: twice daily at **`09:00` and `17:00`** in their local timezone, or custom hours). If declined, set `scout.enabled: false` in `config.yml` and note they can run manual scouts anytime.
   - **Minimum Match % (`scout.min_match`):** Explain the trade-off clearly (too low = noisy junk; too high = too few leads) and agree on a balanced threshold (recommend **`55%–60%`**).
   - **Broad search & Browser researcher mode (`scout.browser_enabled`):** Confirm that searches span multiple role titles, core skills, open boards, AND Google `site:` queries across protected boards (`OLX`, `Pracuj.pl`, etc.), and ask whether to enable **browser researcher mode** (scrolling & opening public cards when browser tools are available and ungated by CAPTCHA/login).

2. **Choose between the 2 primary runner paths (always offer Native App first):**
   - **Option 1 (First / Recommended): Native App Automation (e.g., Antigravity Desktop App `/automation` / Scheduled Tasks, or the user's AI desktop app):**
     - **If currently running inside the native app:** ask for confirmation of the agreed hours and **create/configure the automation directly** (without redundant cron text inside the prompt if the UI sets the schedule), then guide the user to toggle **Paused -> Active** and enable **Run in background** / **Prevent sleep** (plus **Browser Allowlist** if browser mode is enabled).
     - **If currently running from terminal/CLI (`agy`):** explain clearly that native app automations live in the desktop app (whereas a terminal-session `/schedule` dies if the terminal is closed), give the **exact ready-to-paste self-contained prompt** referencing the project path, `skills/05-job-scout/SKILL.md`, `config.yml`, `master-profile.md`, `job-boards.md`, and the target DB/tracker, and walk them step-by-step through activating it in the app — OR let them choose Option 2.
   - **Option 2: Terminal / OS Scheduler or Other Variations:**
     - If the user prefers running from the terminal/OS (or doesn't use a native AI desktop app), show clearly **how it will look and work** before configuring:
       - **OS Background Scheduler (`launchd` on macOS / Task Scheduler on Windows / `cron` on Linux running headless CLI like `agy -p`):** runs even when the terminal window is closed, as long as the computer is powered on and awake; covers open boards + Google `site:` searches cleanly (without interactive GUI browser scrolling). Offer to generate the ready-to-load config + log path.
       - **Other Variations (proposed by user or agent, e.g., Cloud / GitHub Actions / ChatGPT Tasks / n8n / manual on-demand):** explain 24/7 pros/requirements (needed tokens/secrets, headless search scope) and provide the exact prompt + cron (`0 9,17 * * *` + IANA timezone).

3. **Persist configuration:**
   - Save `scout.enabled`, `scout.schedule` (e.g. `"0 9,17 * * *"`), `scout.timezone`, `scout.runner` (`antigravity_app` | `launchd` | `task_scheduler` | `cloud` | `manual`), `scout.min_match`, and `scout.browser_enabled` in `workspace/02-profile/config.yml`.

---
name: 04-track-notion
description: Connects Notion (via MCP or API), sets up a canonical Job Search Hub page (existing or newly created) with concise ranked country job boards + inline Applications tracker (no redundant section heading, sorted newest-first, percent Match, 3 statuses, clean table columns, populated New template) + collapsible playbook, and logs each vacancy analysis + embedded PDF.
---

# Notion Hub, Job Boards & Application Tracker (`04-track-notion`)

Prerequisite check: if `workspace/02-profile/config.yml` does not exist yet, run `skills/01-onboarding/SKILL.md` first.
Read first: `workspace/02-profile/config.yml`, `workspace/02-profile/master-profile.md`.
Outputs: updates `workspace/02-profile/config.yml` (`notion.*`), creates `workspace/02-profile/job-boards.md`, and builds/updates the canonical Notion Job Search Hub page + Applications database + default `New` page template.
**100% domain-agnostic & language-configurable:** research job boards for *the user's* actual country and profession, and write Notion content in `notion.notion_language` (agreed with the user, defaulting to `user_language`).

## Phase 0 — Choose Tracker Destination (Ask First)
Before connecting to Notion, **always ask the user** whether they use **Notion** or prefer another tracker format (e.g., **Excel / CSV**, **local Markdown / Notes** on Mac or Windows, **Google Sheets**, or another tool):
- **If Notion:** proceed to **Phase A** -> **Phase B** -> **Phase C**.
- **If NOT Notion (Excel, CSV, Notes, Markdown, etc.):**
  - Save `notion.mode: none` and `tracker.type` (e.g. `excel`, `csv`, `markdown`, `notes`, `sheets`) + `tracker.path` (if local file) in `workspace/02-profile/config.yml`.
  - Run **Phase B (Steps 1–2)** for the country job-boards research, then follow **Phase D** to build and maintain the tracker in the user's chosen format with the **same canonical structure** as Notion.

## Phase A — Check Connection & Agree on Hub Page
1. **Check Notion connection:**
   - Call `notion-get-self` (or check Notion API credentials).
   - **If Notion is NOT connected:** guide the user step by step to connect Notion (via Notion MCP OAuth or Notion Integration API token) before continuing.
   - **If connected:** confirm the connected workspace name briefly.
2. **Choose the Notion page & language (ask one topic):**
   - Ask whether the user **already has an existing Notion page** where they want the job-search hub placed (ask for its URL or exact title, then inspect it with `notion-fetch`), **or wants you to create a new Notion page**.
   - Confirm the **Notion language** (`notion.notion_language`) if not already agreed.
   - Save `notion.mode` (`existing` | `create` | `none`), `notion.parent_page_url`, and `notion.notion_language` in `workspace/02-profile/config.yml`.

## Phase B — Country Job Boards Research & Hub Layout
1. **Confirm country & platforms:**
   - Confirm the target country (`workspace/02-profile/config.yml` -> `country`) and profession (`target_roles`), and invite the user to name any extra platforms or additional countries to include.
2. **Research & rank platforms:**
   - Web-search all good active job platforms for that country and field, ranked from **highest volume / broadest reach** down to specialized/niche boards.
   - Verify which platforms block automated URL fetching (HTTP 403 / CloudFront / Cloudflare / login walls, e.g. in Poland: LinkedIn, Pracuj.pl, TheProtocol.it, OLX, Bulldogjob, Indeed, Useme) vs open links (e.g. JustJoin.IT, NoFluffJobs, RocketJobs, Solid.jobs).
   - Save the verified list to `workspace/02-profile/job-boards.md`.
3. **Canonical Notion Hub Page Layout (Top -> Bottom):**
   Before writing to Notion, read `notion://docs/notion-flavored-markdown-spec` via `notion-fetch`. Keep `<database ...>` tags intact when updating existing pages:
   - **1. Top Section — Job Boards (`##`):**
     - Very brief callout (`ℹ️`) explaining the legend: `ℹ️` next to a platform = manual text/screenshot paste required (anti-bot/login); no icon = usually auto-fetchable by URL.
     - Ranked numbered list with clickable links, `ℹ️` mark beside protected boards, and **ultra-short** 1-phrase description (no clutter).
   - **2. Middle Section (Immediately below Platforms) — Inline Applications Database:**
     - **Do NOT add a redundant `##` heading directly above the inline database** - the database's own title serves as the header.
     - **Schema** (use single-word CamelCase property names so MCP tools serialize them without space/colon errors):
       - `Company` (`TITLE` - exact company name without date, OR exact job title if company is undisclosed)
       - `Created` (`CREATED_TIME` - auto-populated with exact creation date/time on every row)
       - `Status` (`SELECT('Applied':yellow, 'Hired':green, 'Closed':red)` - keep ONLY 3 simple, logical statuses!)
       - `Match` (`NUMBER FORMAT 'percent'` - pass decimals like `0.62` so Notion displays `62%`)
       - `Platform` (`SELECT` - populated with the country's platforms)
       - `JobURL` (`URL` - direct link to the vacancy posting)
       - `WorkMode` (`SELECT('Remote':green, 'Hybrid':blue, 'Onsite':orange)`)
       - `CompanySite` (`URL` - company website)
     - **Default Table View (`notion-update-view`):**
       - Hide secondary columns (`WorkMode`, `CompanySite`) from the collapsed table row while keeping them inside opened cards.
       - Show only essential columns in logical order and sort **newest at the top**:
         `CLEAR SORT; SORT BY "Created" DESC; SHOW "Created", "Company", "Status", "Match", "Platform", "JobURL"`
     - **Default Page Template (`default_page_template`):**
       - Populate the database's default `"New page"` template with the structured entry layout below (and `Status: "Applied"`), so clicking **New** in Notion opens the ready-to-use structure automatically.
     - Save `notion.applications_db_id` and `notion.applications_data_source_url` in `workspace/02-profile/config.yml`.
   - **3. Optional Section (Immediately below Applications, above Playbook) — Suggested Vacancies (`05-job-scout`):**
     - **Ask the user** during hub setup whether they also want a separate database for **Suggested Vacancies** (use an intuitive localized name in `notion.notion_language`, e.g., `"Пропоновані вакансії"` in Ukrainian, `"Suggested Vacancies"` in English, `"Proponowane oferty"` in Polish) where the agent collects matching job leads found automatically or on demand.
     - **If YES:** create that inline database directly **below Applications** (no redundant `##` heading above it), save `notion.scout_db_id` and `notion.scout_data_source_url` in `workspace/02-profile/config.yml`, and immediately follow **`skills/05-job-scout/SKILL.md` (Phase C)** to offer and configure automated scheduled checks (e.g. `09:00` and `17:00` daily) using the user's preferred runner.
   - **4. Bottom Section (Below Databases) — Collapsible Fast-Apply Playbook:**
     - Place the concise fast-apply tips inside a collapsed `<toggle heading="h2">` block at the bottom of the page so it stays available without pushing the tracker down:
       1. Tailor CV per vacancy; 2. Apply early; 3. Message recruiters directly; 4. Research company & interviewer; 5. Treat every interview as training.

## Phase C — Canonical Notion Entry Format (Triggered After PDF Approval)
Create the new row in the Notion Applications database (`parent.data_source_id`) **only after** the user approves the CV and `workspace/04-applications/<folder>/<Firstname>-<Lastname>-CV-<Target>.pdf` has been generated:
1. **Properties:**
   - `Company` (`TITLE`): exact company name without date (e.g. `Acme Corp.`), OR exact job/role title if company is undisclosed (e.g. `Frontend Developer`) - never add the date here because `Created` records the exact date/time automatically.
   - `Status`: `"Applied"` by default
   - `Match`: decimal (e.g. `0.62` -> `62%`)
   - `Platform`, `JobURL`, `WorkMode`, `CompanySite`.
2. **Upload & Embed the PDF(s):**
   - Call `notion-create-file-upload` with `filename` matching the generated CV (`<Firstname>-<Lastname>-CV-<Target>.pdf`, e.g. `Alex-Novak-CV-Acme.pdf`), then upload `workspace/04-applications/<folder>/<Firstname>-<Lastname>-CV-<Target>.pdf` via multipart `POST` to `upload_url` with `upload_headers`.
   - If `<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf` was also generated for this application, upload it via `notion-create-file-upload` + multipart `POST` as well.
   - Place the returned `<pdf source="file-upload://..." />` embed block(s) right at the **very top** of the Notion page body (CV first, Cover Letter directly below it if present).
3. **Page Body (in `notion.notion_language`):**
   - Do **not** include local folder paths, `file://` links, or references to `<Target>-job.md` - the embedded `<pdf>` and the page content itself are self-contained.
   - **Structured Content (below the embedded `<pdf>`):**
     - Metadata table (Company, Company Website, Role, Job Link, Location & Work Mode, Match %)
     - Role Description & Business Context
     - Tech Stack & Requirements (Must-have, Nice-to-have, ATS Keywords)
     - Match % Breakdown & 3-Tier Matrix (Matched, To Clarify, Gaps & Risks)
     - Tailoring Summary (what was adapted in the CV)
     - Raw Job Posting (at the bottom for interview prep)

## Phase D — Alternative Tracker Formats (Non-Notion Users)
When `notion.mode: none` (the user does not use Notion), deliver the **exact same canonical hub & application structure** in the user's preferred format:
1. **Hub Setup (once, after `job-boards.md` is ready):**
   - **Excel / CSV** (e.g., `workspace/04-applications/applications-tracker.xlsx` or `.csv`, or a user-specified path):
     - Sheet 1 (`Applications`): columns `Created`, `Company`, `Status` (`Applied` / `Hired` / `Closed`), `Match %`, `Platform`, `JobURL`, `WorkMode`, `CompanySite`, `CV_PDF`, `CoverLetter_PDF`, sorted newest-first.
     - Sheet 2 (`Job Boards`): ranked platforms with clickable URLs, `ℹ️` manual-paste indicator, and 1-phrase description.
     - Sheet 3 (`Playbook`): the 5 fast-apply tips.
     - Optional Sheet (`Suggested Vacancies` / localized equivalent, placed logically alongside `Applications`): ask the user if they want it; if yes, add the Scout table and hand off to `skills/05-job-scout/SKILL.md` (Phase C) for automation setup.
   - **Local Markdown / Notes** (e.g., `workspace/04-applications/Job-Search-Hub.md`, Apple Notes, Obsidian, or Windows Notepad/OneNote):
     - Top: Ranked Job Boards with `ℹ️` legend and clickable links.
     - Middle: Markdown Applications table (`Created | Company | Status | Match | Platform | JobURL`) sorted newest-first, with links to each application's PDF and `<Target>-job.md`.
     - Below Applications (optional): Suggested Vacancies table/list (if requested by the user) + handoff to `skills/05-job-scout/SKILL.md` (Phase C).
     - Bottom: Collapsible/delimited Fast-Apply Playbook.
2. **Per-Application Logging (after PDF approval):**
   - Append/prepend the new row at the top (newest-first) with `Status: Applied`, `Match %`, `Platform`, `JobURL`, `WorkMode`, `CompanySite`, and clickable links/paths to the generated CV and Cover Letter PDFs.
   - Include or link the structured vacancy breakdown (Metadata, Role Description, Tech Stack, Match % Breakdown, Tailoring Summary, Raw Job Posting) in the same format as Phase C.

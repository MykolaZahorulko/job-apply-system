# Job Apply System

An AI-guided, ATS-first career coach and job application workflow built on `AGENTS.md` and modular `skills/`. Any LLM coding agent (Antigravity, Claude Code, Codex, Cursor, etc.) can guide a user step by step from an empty workspace to an ATS-safe Base CV, optional Cover Letter template, tailored job applications, PDF exports, application tracking (Notion or local Excel/CSV/Markdown), and optional automated Job Scout runs.

## Key Features

- **Zero-State Guided Onboarding (`01-onboarding`):** Automatically starts when `workspace/` is missing. Walks the user through one topic at a time: preferred language, importing existing CVs or starting from scratch, region and target role market research, cover letter preferences, section-by-section coaching in HTML, and final Base PDF export.
- **Job Analysis & Honest Score-Climbing (`02-analyze-job` -> `03-tailor-cv`):** Extracts ATS keywords, computes a 4-bucket match score (`Base % -> Tailored %`), ranks gaps by upside, and asks targeted questions to uncover real, unrecorded experience before re-tailoring—strictly without fabrication.
- **Browser Preview First, Verified PDF on Approval (`tools/`):** Iterates in clean single-column HTML with locally bundled fonts (`assets/fonts/RobotoCondensed.ttf`). Once approved, renders A4/Letter PDFs via Playwright (`tools/html-to-pdf.mjs`) and verifies ATS text extractability and page count (`tools/check-pdf.mjs`).
- **Flexible Application Tracking (`04-track-notion`):** Supports **Notion** (via Notion MCP, including country/role job boards research, an inline Applications tracker, and embedded PDF previews) or **non-Notion** local alternatives (Excel/CSV, Markdown, Google Sheets, Notes) with the same structured fields.
- **Optional Job Scout (`05-job-scout`):** Searches across relevant boards, calibrates against user seniority and skills, deduplicates against both Applied and Suggested databases, and guides the user to schedule recurring runs via native desktop automation, OS schedulers (`launchd` / Task Scheduler), or cloud runners.

## Prerequisites

- **Node.js** (v18+ recommended) for HTML-to-PDF rendering and ATS PDF checks
- An AI agent workspace/CLI that reads [`AGENTS.md`](AGENTS.md)
- *(Optional)* **Notion MCP server** connected to your agent if you want automated Notion logging and Suggested Vacancies syncing

## Quick Start (For a New User)

1. **Clone the repository and install PDF tools:**
   ```bash
   git clone <your-repo-url> job-apply-system
   cd job-apply-system/tools
   npm install
   npm run setup
   cd ..
   ```
   *(If `npm run setup` prompts or needs browser dependencies on Linux, follow Playwright's printed command.)*

2. **Open the repository root in your AI agent** (Antigravity, Claude Code, Cursor, Codex, etc.).

3. **Say `start` or `hi` in any language.**
   Because `workspace/` does not exist on a fresh clone, [`AGENTS.md`](AGENTS.md) automatically triggers [`skills/01-onboarding/SKILL.md`](skills/01-onboarding/SKILL.md) and guides you through:
   1. Setting your chat and CV language, target role/region, and cover letter preferences
   2. Optionally dropping existing CVs, cover letters, or style references into `workspace/01-originals/`
   3. Building `workspace/02-profile/master-profile.md` and `workspace/02-profile/config.yml`
   4. Iterating on `workspace/03-base-cv/source/<Firstname>-<Lastname>-CV-Base.html` in your browser until ready, then exporting your Base PDF
   5. Setting up your tracker (`skills/04-track-notion/SKILL.md`: Notion or CSV/Markdown/Excel) and optional Job Scout (`skills/05-job-scout/SKILL.md`)

4. **Apply to jobs:** Paste any job posting URL, description, or screenshot. The agent analyzes it, tailors your HTML CV (and optional cover letter), walks you through honest score-climbing questions, renders verified PDFs upon approval, and logs the application in your tracker.

## Repository Structure

### Tracked System Core (Shared Template)

```text
.
├── AGENTS.md                         # Master agent workflow, rules, and skill routing
├── README.md                         # Setup and usage guide
├── .gitignore                        # Keeps personal workspace/ and dependencies private
├── assets/
│   └── fonts/                        # Bundled OFL font files (no network font loading)
├── examples/
│   ├── config.example.yml            # Config schema for user preferences, tracker, and scout
│   ├── master-profile.template.md    # Structured source-of-truth profile template
│   ├── starter-template.html         # ATS-safe Base CV HTML starter
│   └── starter-cover-letter-template.html
├── skills/
│   ├── 01-onboarding/                # Zero-state setup, market benchmark, Base CV coaching
│   ├── 02-analyze-job/               # Job parsing, ATS keywords, match scoring, gap ranking
│   ├── 03-tailor-cv/                 # HTML CV & cover letter tailoring + PDF generation
│   ├── 04-track-notion/              # Notion or local CSV/Markdown tracker & job boards
│   └── 05-job-scout/                 # Suggested Vacancies discovery & recurring runner setup
└── tools/
    ├── package.json                  # Playwright + pdf-parse scripts
    ├── html-to-pdf.mjs               # Renders A4/Letter PDF from HTML
    └── check-pdf.mjs                 # Verifies ATS text extraction and page count
```

### Git-Ignored Personal Workspace (Created Automatically)

`workspace/` is excluded in `.gitignore` and never present in a fresh clone:

```text
workspace/
├── 01-originals/                     # Original user CVs, cover letters, style references
├── 02-profile/                       # config.yml, master-profile.md, market-research.md, job-boards.md
├── 03-base-cv/                       # Base CV/Cover Letter PDFs + source/*.html
└── 04-applications/                  # Per-application folders (<target>-<YYYY-MM-DD>/)
```

## Tooling Commands (`tools/`)

```bash
# Render an HTML file to PDF (A4 or Letter)
node tools/html-to-pdf.mjs <input.html> <output.pdf> --format=A4

# Check ATS text extraction and page count on a generated PDF
node tools/check-pdf.mjs <file.pdf>
```

## Privacy & Safety

- All personal data lives inside `workspace/`, which is ignored by `.gitignore`.
- Never commit `workspace/` or personal PDFs/HTMLs to a public repository.
- Before pushing changes to the template core, verify no personal names, links, or IDs appear in `AGENTS.md`, `skills/`, `examples/`, or `tools/`.

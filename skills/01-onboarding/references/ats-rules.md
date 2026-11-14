# ATS rules (apply to every template and CV)

## Layout
- Single column. No tables for layout, text boxes, headers/footers holding key info, or multi-column grids.
- Real text only: no text in images, no icon fonts, no skill bars/stars/charts, no photos.
- Standard fonts (Arial, Calibri, Helvetica, Georgia, Times) or bundled OFL fonts; body 10-11pt; headings 11-14pt.
- Exactly 1 page, A4 (project default; change only if the user edits `workspace/02-profile/config.yml`).

## Headings (use exact standard names, in CV language)
Summary / Skills / Experience (or Work Experience) / Education / Certifications / Projects / Languages.
Avoid creative names ("My Journey", "What I Do").

## Content
- Dates: consistent format across the CV - `MM/YYYY - MM/YYYY` or full `Month YYYY - Present` in the CV's body language (e.g. `Październik 2024 - obecnie`).
- **Punctuation:** Use ONLY short hyphens (`-`). Never use em-dashes (`—`) or en-dashes (`–`) anywhere in the CV or cover letter.
- Job title, company, location, dates on every role.
- Bullets: action verb + what + how (tools) + outcome/scope. 3-6 per role, most recent most detailed. Concrete shipped projects, domains, and integrations beat vague duties; never invent `%` - ATS does not require fake percentages.
- Keywords: copy job-posting wording exactly; include both long form and acronym once ("Search Engine Optimization (SEO)"). Place them in Summary, Skills AND experience bullets.
- Contact info in the body, plain text with clickable links: `mailto:` on email, `tel:` on phone, and `https://` on LinkedIn/GitHub/portfolio (`<a href="https://linkedin.com/in/...">LinkedIn</a>` or clean visible URL).

## HTML gotchas (verified with check-pdf)
- Title and date in one flex row get merged by parsers ("ACME09/2024"). Put the date on its own line, or keep a visible separator (" | ") inside the same text run.
- Name must be first in HTML source; avoid sidebars (parsers read the sidebar first).
- Bundle fonts locally (`assets/fonts/`), never load them from the network:
  - In `workspace/03-base-cv/source/*.html`: `url("../../../assets/fonts/...")`
  - In `workspace/04-applications/<folder>/source/*.html`: `url("../../../../assets/fonts/...")`
- To avoid a dead blank gap above the footer/GDPR on a 1-page A4 CV, wrap each main section in `<section>` inside `main { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }` on `.page { height: 297mm; }`.

## Forbidden
- White/hidden text, keyword stuffing, invented skills or titles.

## File Naming & Verification
- Text-based PDF (generated from HTML, not a screenshot).
- Base CV: `<Firstname>-<Lastname>-CV-Base.pdf` (inside `workspace/03-base-cv/`).
- Base Cover Letter (optional): `<Firstname>-<Lastname>-Cover-Letter-Base.pdf` (inside `workspace/03-base-cv/`).
- Tailored CV & Cover Letter: `<Firstname>-<Lastname>-CV-<Target>.pdf` and optional `<Firstname>-<Lastname>-Cover-Letter-<Target>.pdf` (inside `workspace/04-applications/<target>-<YYYY-MM-DD>/`), where `<Target>` is the company name if disclosed, or the job title if company is undisclosed.
- Always verify every generated PDF with `node tools/check-pdf.mjs <file.pdf>` (shows what a parser sees and confirms zero XRef/font errors).

## Cover Letter ATS & Recruiter Rules
- **Consistent Header Band (Same Look as CV):** Reuse the CV's clean header band (color/font/accent rule, slightly tighter padding optional) with full contact details and clickable `mailto:`, `tel:`, and `https://` links so the letter stays self-contained and forms one cohesive package with the CV. Omit `City, Date` and avoid clunky prefixes like `"Dotyczy:"` / `"Re:"` - simply place the clean `[Company Name]` (or nothing if undisclosed) above the greeting.
- **No GDPR/RODO Clause:** Do not duplicate the GDPR/RODO legal footer on the Cover Letter - it already sits at the bottom of the CV.
- **Ultra-Short & Scannable:** Exactly 1 page A4, **80-130 words (max ~150 words)** across **3 short paragraphs** readable in 5-10 seconds while keeping crisp verbatim ATS keywords.
- **Structure:** High-impact intro + top 1-2 shipped proofs with concrete stack/scope -> secondary relevance/workflow fit -> brief logistics + call to action.
- **Zero fluff & clichés:** Never use hollow openers (*"I am writing to express my strong interest..."*, *"I am thrilled to apply..."*, *"passionate self-starter"*). Never misspell stack/industry terms or start the body sentence in lowercase unless stylistically intentional.
- **Hybrid Format (`pdf+txt`):** Deliver a polished ATS-safe PDF in the application root, plus a clean plain-text `.txt` copy in `source/` (body paragraphs + greeting/sign-off only, no header boilerplate or hard line breaks mid-paragraph) for job boards that only provide a message textarea.

## Analyzing a user's existing template
Flag: columns, tables, icons, images, text boxes, header/footer content, non-standard headings, tiny fonts (<9pt), low contrast, scanned/no text layer. For each: severity (critical/minor) + fix.

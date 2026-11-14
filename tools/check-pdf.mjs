// Usage: node check-pdf.mjs <file.pdf>
// Prints the text an ATS parser would see + basic sanity checks.
import { readFileSync } from "node:fs";
import pdf from "pdf-parse";

const file = process.argv[2];
if (!file) { console.error("Usage: node check-pdf.mjs <file.pdf>"); process.exit(1); }
const data = await pdf(readFileSync(file));
const text = data.text.trim();

console.log(`Pages: ${data.numpages}`);
console.log(`Characters extracted: ${text.length}`);
const warnings = [];
if (text.length < 300) warnings.push("Very little text extracted — PDF may be image-based.");
if (!/@/.test(text)) warnings.push("No email found in extracted text.");
if (!/experience|employment|work history/i.test(text)) warnings.push("No standard 'Experience' heading found.");
if (!/education/i.test(text)) warnings.push("No standard 'Education' heading found.");
if (/[\uE000-\uF8FF]/.test(text)) warnings.push("Private-use glyphs found (icon fonts) — ATS will read garbage.");
console.log(warnings.length ? "WARNINGS:\n- " + warnings.join("\n- ") : "Basic checks passed.");
console.log("\n----- EXTRACTED TEXT -----\n" + text);

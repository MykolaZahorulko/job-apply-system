// Usage: node html-to-pdf.mjs <input.html> <output.pdf> [--format=A4|Letter]
// Renders HTML to a text-based (ATS-readable) PDF using headless Chromium.
import { chromium } from "playwright";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node html-to-pdf.mjs <input.html> <output.pdf> [--format=A4|Letter]");
  process.exit(1);
}
const format = (flags.find((f) => f.startsWith("--format=")) || "--format=A4").split("=")[1];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: resolve(output),
  format,
  printBackground: true,
  preferCSSPageSize: true, // margins come from @page in the HTML
});
await browser.close();
console.log(`PDF written: ${output}`);

#!/usr/bin/env node

/**
 * Sanitize auto-synced release notes for MDX compatibility.
 *
 * Release notes are synced from external repos via github-actions[bot].
 * The synced Markdown can contain bare `<` characters (e.g. `<100μs`,
 * `<ms>`) that break the Docusaurus MDX build because MDX interprets
 * `<` as the start of a JSX tag.
 *
 * This script processes the RELEASE_NOTES_START / RELEASE_NOTES_END
 * sections in all docs, replacing bare `<` with `&lt;` while leaving
 * inline code (`...`), fenced code blocks (```), and HTML comments
 * (<!-- -->) untouched.
 *
 * Wired as the npm `prebuild` script so it runs automatically before
 * every `docusaurus build`.
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("fs").promises ? { glob: null } : {};

// Simple recursive glob for .md files (no external dependencies)
function findMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Escape bare `<` characters in a single line of Markdown.
 *
 * Preserves:
 *  - Content inside backtick-delimited inline code spans
 *  - HTML comments (<!-- ... -->)
 *  - Already-escaped `&lt;`
 */
function escapeLine(line) {
  // Strategy: split the line into segments that are either "inside
  // inline code" or "outside inline code", and only escape in the
  // outside segments.
  const parts = [];
  let remaining = line;

  while (remaining.length > 0) {
    const tickIndex = remaining.indexOf("`");
    if (tickIndex === -1) {
      // No more backticks — rest is plain text
      parts.push({ text: remaining, isCode: false });
      break;
    }

    // Push the plain-text portion before the backtick
    if (tickIndex > 0) {
      parts.push({ text: remaining.slice(0, tickIndex), isCode: false });
    }

    // Determine the backtick run length (supports `` double backticks)
    let runLen = 1;
    while (
      tickIndex + runLen < remaining.length &&
      remaining[tickIndex + runLen] === "`"
    ) {
      runLen++;
    }
    const delimiter = remaining.slice(tickIndex, tickIndex + runLen);
    const afterOpen = remaining.slice(tickIndex + runLen);
    const closeIndex = afterOpen.indexOf(delimiter);

    if (closeIndex === -1) {
      // Unmatched backtick — treat the rest as plain text
      parts.push({ text: remaining.slice(tickIndex), isCode: false });
      break;
    }

    // Matched inline code span
    const codeContent = afterOpen.slice(0, closeIndex);
    parts.push({
      text: delimiter + codeContent + delimiter,
      isCode: true,
    });
    remaining = afterOpen.slice(closeIndex + runLen);
    continue;
  }

  // Now escape `<` only in non-code segments
  return parts
    .map((part) => {
      if (part.isCode) return part.text;
      // Replace `<` that is NOT:
      //  - part of an HTML comment (<!-- or -->)
      //  - already escaped as &lt;
      return part.text.replace(/<(?!!--|&lt;)/g, (match, offset, str) => {
        // Check if this `<` is already part of `&lt;` by looking behind
        // (the regex won't catch &lt; since it starts with &, not <, so
        // we only need to avoid <!-- which the negative lookahead handles)
        return "&lt;";
      });
    })
    .join("");
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  let inReleaseNotes = false;
  let inCodeFence = false;
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track release notes section boundaries
    if (line.includes("RELEASE_NOTES_START")) {
      inReleaseNotes = true;
      continue;
    }
    if (line.includes("RELEASE_NOTES_END")) {
      inReleaseNotes = false;
      inCodeFence = false; // Reset fence state at section boundary
      continue;
    }

    if (!inReleaseNotes) continue;

    // Track fenced code blocks (``` or ~~~)
    if (/^```|^~~~/.test(line.trimStart())) {
      inCodeFence = !inCodeFence;
      continue;
    }

    // Skip lines inside fenced code blocks
    if (inCodeFence) continue;

    // Skip lines that don't contain `<` at all
    if (!line.includes("<")) continue;

    // Skip pure HTML comment lines
    if (/^\s*<!--.*-->\s*$/.test(line)) continue;

    const escaped = escapeLine(line);
    if (escaped !== line) {
      lines[i] = escaped;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`  ✓ Sanitized: ${relPath}`);
  }

  return changed;
}

// --- Main ---
const docsDir = path.resolve(__dirname, "..", "docs");
const files = findMdFiles(docsDir);
let totalChanged = 0;

console.log("Sanitizing release notes for MDX compatibility...");

for (const file of files) {
  if (processFile(file)) totalChanged++;
}

if (totalChanged > 0) {
  console.log(`\nDone — ${totalChanged} file(s) sanitized.`);
} else {
  console.log("Done — no changes needed.");
}

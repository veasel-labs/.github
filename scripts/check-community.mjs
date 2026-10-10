import { access, readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "SUPPORT.md",
  "PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  "ISSUE_TEMPLATE/config.yml",
  "ISSUE_TEMPLATE/bug.yml",
  "ISSUE_TEMPLATE/feature.yml",
  ".github/workflows/validate-community.yml",
  ".node-version",
  "profile/README.md",
];

export function markdownTargets(markdown) {
  return [...markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map(
    (match) => match[1],
  );
}

export async function brokenMarkdownLinks(rootDirectory, sourceFile, markdown) {
  const broken = [];
  const resolvedRoot = await realpath(rootDirectory);
  for (const target of markdownTargets(markdown)) {
    if (target.startsWith("#")) continue;
    const scheme = /^([a-z][a-z\d+.-]*):/i.exec(target)?.[1].toLowerCase();
    if (scheme) {
      if (!["http", "https", "mailto"].includes(scheme)) {
        broken.push(target);
        continue;
      }
      try {
        const url = new URL(target);
        if (
          (scheme === "http" || scheme === "https") &&
          (!url.hostname || url.username || url.password)
        ) {
          broken.push(target);
        }
        if (scheme === "mailto" && !url.pathname) broken.push(target);
      } catch {
        broken.push(target);
      }
      continue;
    }
    if (target.startsWith("//")) {
      try {
        const url = new URL(`https:${target}`);
        if (!url.hostname || url.username || url.password) broken.push(target);
      } catch {
        broken.push(target);
      }
      continue;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(target.split("#", 1)[0].split("?", 1)[0]);
    } catch {
      broken.push(target);
      continue;
    }
    if (!pathname) continue;
    const resolved = path.resolve(path.dirname(sourceFile), pathname);
    const relative = path.relative(rootDirectory, resolved);
    if (
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      broken.push(target);
      continue;
    }
    try {
      const resolvedTarget = await realpath(resolved);
      const realRelative = path.relative(resolvedRoot, resolvedTarget);
      if (
        realRelative === ".." ||
        realRelative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(realRelative)
      ) {
        broken.push(target);
      }
    } catch {
      broken.push(target);
    }
  }
  return broken;
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      if (entry.name === ".git") return [];
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(entryPath)
        : entry.name.endsWith(".md")
          ? [entryPath]
          : [];
    }),
  );
  return nested.flat();
}

async function checkCommunityFiles() {
  const failures = [];
  for (const file of requiredFiles) {
    try {
      await access(path.join(root, file));
    } catch {
      failures.push(`Missing required community file: ${file}`);
    }
  }

  for (const file of await markdownFiles(root)) {
    const content = await readFile(file, "utf8");
    for (const target of await brokenMarkdownLinks(root, file, content)) {
      failures.push(`${path.relative(root, file)}: unresolved link ${target}`);
    }
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(
    `Validated ${requiredFiles.length} community files and local Markdown links.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await checkCommunityFiles();
}

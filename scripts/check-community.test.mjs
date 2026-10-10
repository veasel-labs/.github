import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { brokenMarkdownLinks, markdownTargets } from "./check-community.mjs";

const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), "veasel-community-"),
);
const outsideRoot = await mkdtemp(path.join(os.tmpdir(), "veasel-outside-"));
const docs = path.join(temporaryRoot, "docs");
await mkdir(docs);
await writeFile(path.join(docs, "guide.md"), "Guide");
const outsideFile = path.join(outsideRoot, "secret.md");
await writeFile(outsideFile, "outside repository");
await symlink(outsideFile, path.join(docs, "escape.md"));
after(async () => {
  await Promise.all([
    rm(temporaryRoot, { recursive: true, force: true }),
    rm(outsideRoot, { recursive: true, force: true }),
  ]);
});

describe("community Markdown validation", () => {
  it("extracts inline link destinations", () => {
    assert.deepEqual(
      markdownTargets("[guide](docs/guide.md) [site](https://example.com)"),
      ["docs/guide.md", "https://example.com"],
    );
  });

  it("accepts existing in-repository links", async () => {
    assert.deepEqual(
      await brokenMarkdownLinks(
        temporaryRoot,
        path.join(temporaryRoot, "README.md"),
        "[guide](docs/guide.md)",
      ),
      [],
    );
  });

  it("rejects missing and outside-repository targets", async () => {
    assert.deepEqual(
      await brokenMarkdownLinks(
        temporaryRoot,
        path.join(temporaryRoot, "README.md"),
        "[missing](missing.md) [outside](../secret.md)",
      ),
      ["missing.md", "../secret.md"],
    );
  });

  it("rejects a Markdown link whose symlink target leaves the repository", async () => {
    assert.deepEqual(
      await brokenMarkdownLinks(
        temporaryRoot,
        path.join(temporaryRoot, "README.md"),
        "[escape](docs/escape.md)",
      ),
      ["docs/escape.md"],
    );
  });

  it("accepts HTTP links and rejects unsupported or malformed schemes", async () => {
    assert.deepEqual(
      await brokenMarkdownLinks(
        temporaryRoot,
        path.join(temporaryRoot, "README.md"),
        "[site](https://example.com/) [email](mailto:team@example.com) [bad](javascript:alert) [malformed](https://[)",
      ),
      ["javascript:alert", "https://["],
    );
  });
});

# Release and automation ownership

[Veasel Code](https://github.com/veasel-labs/veasel) owns the single V-native
coding runtime and backend, the versioned HTTP API, TUI and Desktop clients
that use that API, and the release manifest. Clients share this backend rather
than owning duplicate runtimes. The personal
[Agent Toolkit](https://github.com/ulises-jeremias/agent-toolkit) supplies
portable capabilities and has its own release schedule. The Veasel Labs
[plugin marketplace](https://github.com/veasel-labs/agent-toolkit) references
reviewed plugins by version and commit.

## Release responsibilities

| Repository | Responsibility | Evidence to retain |
| --- | --- | --- |
| [veasel](https://github.com/veasel-labs/veasel) | Build and publish immutable releases of the V runtime/backend, versioned HTTP API, and TUI and Desktop clients. | Tag, source commit, asset digests, platform/build results, installer signature status, and separately recorded installed-product acceptance. |
| [website](https://github.com/veasel-labs/website) | Publish the download links, shipped capability information, and user journeys. | Exact deployed commit and the manifest tag and digests shown on the public downloads page. |
| [homebrew-tap](https://github.com/veasel-labs/homebrew-tap) | Distribute the declared macOS package. | Reviewed package commit and install, upgrade, version, and uninstall checks against the intended release. |
| [aur-package](https://github.com/veasel-labs/aur-package) | Maintain the Arch packaging mirror and publish the AUR package. | Reviewed package commit, build validation, and an AUR lookup confirming the published package version. |
| [agent-toolkit](https://github.com/veasel-labs/agent-toolkit) | Curate the Veasel marketplace and generate client manifests. | Pinned source and digest, declared capabilities, review decision, and generated manifests. |
| [.github](https://github.com/veasel-labs/.github) | Publish shared contributor and release policy. | Required checks and the PR for each policy change. |

A release starts with Veasel's published manifest. Compare each consumer with
its expected tag, source commit and asset digest. Verify the deployed website
and published package separately from their repository state. A published
installer can still have pending real-device acceptance.

## Cross-repository release acceptance

Track distribution and product acceptance as separate results. Passing CI or
publishing a tag proves neither that every consumer serves the same build nor
that a person can complete real work with the installed product.

### Release identity and build

- [ ] Record the release tag and full source commit from the immutable Veasel
  release manifest.
- [ ] Confirm required Linux, macOS, Windows, TUI, Desktop, security, and
  packaging checks passed for that source commit. A stale green run does not
  count after the release candidate changed.
- [ ] Verify `release.json`, `SHA256SUMS`, signatures where published, and
  platform asset names against the built artifacts.

### Consumer synchronization

- [ ] Website deployment serves the intended release tag and links to its
  exact assets and checksums; record the deployed commit and public URLs.
- [ ] Homebrew points at the same tag and asset digest; install, upgrade, show
  the expected `--version`, and uninstall in a disposable environment.
- [ ] AUR builds the same release; verify the published package version and
  the documented CLI/TUI and optional Desktop installation paths.
- [ ] Record each consumer repository commit and CI result. Do not infer
  publication from a merged PR or infer correctness from repository files
  alone.

### Installed-product acceptance

- [ ] Install the actual release on each required daily-driver host from the
  product's acceptance plan. For the current Veasel pilot, include HorneroOS
  as recorded in the [Veasel implementation plan](https://github.com/veasel-labs/veasel/blob/main/docs/IMPLEMENTATION_PLAN.md).
- [ ] Launch the packaged TUI and Desktop, select an already authenticated
  supported coding agent, open a real repository, and complete a real task
  that exercises review and approval behavior.
- [ ] Verify session sharing, restart/recovery, cancellation, and the relevant
  permission boundaries with the installed build. Do not substitute fixtures,
  screenshots, mocked provider responses, or source-tree launches for this
  journey.
- [ ] Store a sanitized receipt with release tag, source commit, OS, installed
  binary versions and hashes, journey result, and evidence links. Keep tokens,
  private paths, prompts, and provider data out of public artifacts.

### Release disposition

Record each gate as `pass`, `fail`, or `blocked`, with its evidence link and
owner. Mark a release **distribution verified** only when every consumer gate
passes. Mark it **daily-driver accepted** only when installed-product
acceptance also passes. A published release with blocked product acceptance
must remain visibly labeled as such; passing automation or closing issues does
not change that disposition.

## Changes to automation

Assign one workflow or maintainer to each repository write, PR update, merge,
and external publish. Other workflows may observe and produce a report.
Before moving an effect to a different workflow, verify the replacement on a
draft and remove the old workflow's authority for that effect. Retrying the
same release should reconcile an existing PR or publication.

Validate the candidate head using the repository's required checks before
integrating it. Revalidate when the head changes. Introduce required checks
only after confirming that the current Actions workflow reports them for human
and bot PRs. Changes to publication credentials, release permissions, and
marketplace approval policy require maintainer review.

Marketplace updates follow the
[repository review policy](https://github.com/veasel-labs/agent-toolkit/blob/main/docs/REVIEW_POLICY.md).
Keep review linked to the candidate content. The public listing reflects the
review state and permission declarations.

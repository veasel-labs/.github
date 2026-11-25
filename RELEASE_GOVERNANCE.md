# Release and automation ownership

[Veasel Code](https://github.com/veasel-labs/veasel) owns the coding runtime,
TUI, Desktop, and release manifest. The personal
[Agent Toolkit](https://github.com/ulises-jeremias/agent-toolkit) supplies
portable capabilities and has its own release schedule. The Veasel Labs
[plugin marketplace](https://github.com/veasel-labs/agent-toolkit) references
reviewed plugins by version and commit.

## Release responsibilities

| Repository | Responsibility | Evidence to retain |
| --- | --- | --- |
| [veasel](https://github.com/veasel-labs/veasel) | Build and publish immutable Veasel releases. | Tag, source commit, asset digests, platform/build results, installer signature status, and separately recorded installed-product acceptance. |
| [website](https://github.com/veasel-labs/website) | Publish the download links, shipped capability information, and user journeys. | Exact deployed commit and the manifest tag and digests shown on the public downloads page. |
| [homebrew-tap](https://github.com/veasel-labs/homebrew-tap) | Distribute the declared macOS package. | Reviewed package commit and install, upgrade, version, and uninstall checks against the intended release. |
| [aur-package](https://github.com/veasel-labs/aur-package) | Maintain the Arch packaging mirror and publish the AUR package. | Reviewed package commit, build validation, and an AUR lookup confirming the published package version. |
| [agent-toolkit](https://github.com/veasel-labs/agent-toolkit) | Curate the Veasel marketplace and generate client manifests. | Pinned source and digest, declared capabilities, review decision, and generated manifests. |
| [.github](https://github.com/veasel-labs/.github) | Publish shared contributor and release policy. | Required checks and the PR for each policy change. |

A release starts with Veasel's published manifest. Compare each consumer with
its expected tag, source commit and asset digest. Verify the deployed website
and published package separately from their repository state. A published
installer can still have pending real-device acceptance.

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

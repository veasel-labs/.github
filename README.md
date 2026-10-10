# Veasel Labs community health

[![Community file checks](https://github.com/veasel-labs/.github/actions/workflows/validate-community.yml/badge.svg?branch=main)](https://github.com/veasel-labs/.github/actions/workflows/validate-community.yml)
[![Veasel Code CI](https://github.com/veasel-labs/veasel/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/veasel-labs/veasel/actions/workflows/ci.yml)
[![Website CI](https://github.com/veasel-labs/website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/veasel-labs/website/actions/workflows/ci.yml)
[![Website](https://img.shields.io/badge/website-veasel.dev-3b6b54)](https://www.veasel.dev/)

This repository supplies shared community health files for public Veasel Labs
repositories. GitHub uses supported files here as defaults when a repository
does not provide its own version. Product-specific contribution steps and
security reporting instructions in each repository take precedence.

## Shared guidance

- [Code of conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Support channels](SUPPORT.md)
- [Bug report form](ISSUE_TEMPLATE/bug.yml)
- [Feature request form](ISSUE_TEMPLATE/feature.yml)
- [Pull request template](PULL_REQUEST_TEMPLATE.md)
- [Issue form settings](ISSUE_TEMPLATE/config.yml)
- [Organization profile](profile/README.md)
- [Community validation workflow](.github/workflows/validate-community.yml)
- [GitHub Actions update schedule](.github/dependabot.yml)

## Repositories

- [Veasel Code](https://github.com/veasel-labs/veasel) — V-native coding agent
  runtime, terminal client, and provider integrations.
- [Website and field guide](https://github.com/veasel-labs/website) — product
  documentation, downloads, and project roadmap.

## Issue labels

The public repositories share a common triage vocabulary: `bug`,
`enhancement`, `documentation`, `question`, `help wanted`, `good first issue`,
`security`, `performance`, `testing`, `CI`, `release`, and `community`, along
with GitHub's standard duplicate, invalid, and wontfix labels. Add labels to
all active repositories when introducing a shared category so contributors
can filter issues consistently.

## Maintaining these files

Keep shared guidance actionable and concise. Put build, test, release, and
project-specific security instructions in the relevant product repository.
Check all links and status badges when changing repository names or workflows.

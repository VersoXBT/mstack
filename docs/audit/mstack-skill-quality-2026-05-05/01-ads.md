# m-ads audit

Subagent focus: audit the ads skill for channel specificity, Codex/Claude portability, compliance gates, and production handoff quality.

Quality read: 6/10. The skill was usable for ad drafting, but platform schemas, Google Display support, character limits, and compliance checks were too implicit.

Changes landed:
- Added campaign-fit intake before creative generation.
- Added Google Display as a first-class output path.
- Added platform-specific output schemas with character limits, UTM fields, and pass/fail checks.
- Added compliance and proof gates for claims, targeting, and regulated language.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

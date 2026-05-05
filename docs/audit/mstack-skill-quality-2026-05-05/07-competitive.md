# m-competitive audit

Subagent focus: audit the competitive skill for evidence quality, competitor taxonomy, channel sampling, and confidence-aware recommendations.

Quality read: 6/10. The skill could compare competitors, but it needed a stronger evidence ledger and clearer distinction between direct, indirect, SERP, and status-quo alternatives.

Changes landed:
- Added competitor taxonomy and SERP discovery steps.
- Added an evidence log with source IDs.
- Added pricing and proof lenses.
- Added channel sampling rules.
- Added confidence and evidence IDs to the matrix and opportunity recommendations.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

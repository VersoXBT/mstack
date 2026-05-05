# m-edit audit

Subagent focus: audit the edit skill for preserving intent, channel-aware editing, revision control, and practical operator output.

Quality read: 7/10. The skill was one of the stronger ones, but it needed clearer edit boundaries and channel-specific checks.

Changes landed:
- Added an edit-control hierarchy and edit budget.
- Added preserve-intent rules.
- Added channel-specific headline and copy checks.
- Made AI-vocabulary cleanup context-aware.
- Added a "what was not changed" summary expectation.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

# m-audit audit

Subagent focus: audit the audit skill for evidence discipline, scoring quality, prioritization, and operator handoff clarity.

Quality read: 6/10. The workflow had useful structure, but evidence quality, weighted scoring, and priority math were not strict enough for repeatable audits.

Changes landed:
- Added a required evidence standard and unknown-state handling.
- Added weighted scoring instead of flat qualitative judgments.
- Added URL inventory expectations.
- Added an action table with `Impact x Confidence x Urgency / Effort` prioritization.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

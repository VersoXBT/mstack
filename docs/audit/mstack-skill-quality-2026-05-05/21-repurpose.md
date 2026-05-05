# m-repurpose audit

Subagent focus: audit the repurpose skill for source inventory, claim reuse, channel specs, tracking, asset handoff, and production metadata.

Quality read: 5/10. The skill could transform content, but it needed stronger source discipline and better downstream packaging.

Changes landed:
- Added learnings search and source inventory.
- Added claim ledger guidance.
- Added generation rules and channel specs.
- Fixed UTM URL handling for `?` versus `&`.
- Added asset matrix and handoff metadata.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

# m-social audit

Subagent focus: audit the social skill for claim gates, tracking, approval workflow, X thread support, and engagement follow-up.

Quality read: 5.5/10. The skill wrote posts, but it needed a stronger operational contract around proof, review status, and follow-up.

Changes landed:
- Added learnings search and proof/input gates.
- Added shared output contract and three-variant expectations.
- Added X thread outline support.
- Added UTM fields.
- Added approval/status workflow and engagement follow-up.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

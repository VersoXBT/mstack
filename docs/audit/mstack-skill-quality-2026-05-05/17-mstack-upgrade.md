# m-upgrade audit

Subagent focus: audit the upgrade skill for host-aware install safety, dirty-worktree handling, rollback clarity, setup correctness, and Windows compatibility.

Quality read: 4/10. The skill had risky upgrade assumptions around ambiguous install targets, dirty git state, and rollback path selection.

Changes landed:
- Added host-aware roots for Claude, global Codex, local Codex, and `MSTACK_ROOT`.
- Added ambiguous-install rejection.
- Added clean-worktree requirements and fast-forward-only merge guidance.
- Made setup host-specific and fatal on failure.
- Fixed skill-count verification locations.
- Added latest-backup rollback lookup.
- Reworked setup copy behavior to avoid stale managed directories.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, bash syntax checks, and `git diff --check`.

# m-positioning audit

Subagent focus: audit the positioning skill for proof discipline, alternatives mapping, anti-positioning, validation, and downstream handoff quality.

Quality read: 6/10. The skill produced useful positioning, but it needed more proof traceability and clearer handoff artifacts.

Changes landed:
- Added `icp.yaml` and brand checks.
- Added proof ledger expectations.
- Added alternatives and status-quo mapping.
- Added anti-positioning guidance.
- Added downstream handoff and validation experiment tables.
- Added approval options for brand and positioning artifacts.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

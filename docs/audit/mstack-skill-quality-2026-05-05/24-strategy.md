# m-strategy audit

Subagent focus: audit the strategy skill for upstream artifact consumption, diagnostics, channel prioritization, cadence, and downstream handoffs.

Quality read: 5.5/10. The skill had broad strategic coverage, but it needed stricter diagnosis and a clearer operating model.

Changes landed:
- Added upstream artifact checks and input inventory.
- Added diagnostic scorecard.
- Added scored segmentation and weighted channel-bet matrices.
- Added resource planning.
- Added operating cadence, risk, KPI, campaign, and calendar handoff sections.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

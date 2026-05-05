# m-campaign audit

Subagent focus: audit the campaign skill for strategic inputs, asset planning, measurement design, risk handling, and reusable output paths.

Quality read: 6/10. The campaign workflow had useful strategy pieces, but it lacked enough operational structure for execution.

Changes landed:
- Added learnings search and existing artifact discovery.
- Added default save-path guidance.
- Added asset, measurement, and risk matrices.
- Expanded campaign intake so the skill can connect positioning, audience, channels, and proof before writing assets.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

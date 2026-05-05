# m-calendar audit

Subagent focus: audit the calendar skill for operational usability, owner/status tracking, campaign alignment, and asset reuse.

Quality read: 6.5/10. The skill produced planning output, but it needed more production columns and stronger links to campaigns, keywords, and repurposing.

Changes landed:
- Added learnings, campaign, keyword, and repurpose discovery.
- Added an asset reuse pass.
- Added campaign alignment and pipeline/status separation.
- Added due-date math and expanded CSV columns for owners, status, assets, dependencies, and measurement.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

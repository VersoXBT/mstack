# m-report audit

Subagent focus: audit the report skill for credential contracts, metric definitions, data-quality gates, attribution caveats, and dashboard handoff.

Quality read: 4/10. The skill had useful reporting intent, but the credential and data contract needed correction before dependable use.

Changes landed:
- Aligned the API contract around `GA4_CREDENTIALS`, `GA4_PROPERTY_ID`, `SEARCH_CONSOLE_CREDENTIALS`, and `GSC_SITE_URL`.
- Added data contract and metric definitions.
- Added data-quality and directional labels.
- Added variance, seasonality, and attribution caveats.
- Added decision memo, dashboard spec, privacy, and data-quality notes.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

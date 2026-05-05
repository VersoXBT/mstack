# m-keywords audit

Subagent focus: audit the keywords skill for locale handling, evidence capture, clustering, cannibalization checks, and production exports.

Quality read: 5.5/10. The skill had keyword research coverage, but it needed stricter data-source discipline and more usable output schemas.

Changes landed:
- Added locale, market, and goal inputs.
- Added data-source evidence rules and SEMrush locale database guidance.
- Added Ahrefs caveats and buyer-stage fields.
- Added clustering, same-intent cannibalization, and opportunity scoring.
- Added CSV and JSON export expectations.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

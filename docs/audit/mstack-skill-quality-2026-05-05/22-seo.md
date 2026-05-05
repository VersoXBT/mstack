# m-seo audit

Subagent focus: audit the SEO skill for crawl/indexability evidence, keyword intent, cannibalization, structured-data safety, and measured performance work.

Quality read: 5/10. The skill covered many SEO tasks, but it needed stronger evidence capture and safer structured-data and Core Web Vitals guidance.

Changes landed:
- Added setup fields and evidence model.
- Added crawl and indexability evidence requirements.
- Made keyword work intent-first.
- Added same-intent cannibalization checks.
- Added policy-safe schema caveats.
- Made Core Web Vitals measured-first.
- Added JSON issue output.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

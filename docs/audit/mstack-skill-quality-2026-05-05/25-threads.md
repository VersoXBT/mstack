# m-threads audit

Subagent focus: audit the threads skill for source discipline, claim traceability, X and LinkedIn support, link accounting, tracking, and engagement metadata.

Quality read: 4.5/10. The skill could outline threads, but it needed stronger platform-native behavior and source governance.

Changes landed:
- Added learnings search and source/claim ledger.
- Added platform selector and X/LinkedIn limits.
- Added UTM and link-accounting rules.
- Added hook scoring and full variants.
- Added LinkedIn-native output, CTA, engagement plan, and save metadata.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

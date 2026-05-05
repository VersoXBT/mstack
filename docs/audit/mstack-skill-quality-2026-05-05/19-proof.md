# m-proof audit

Subagent focus: audit the proof skill for evidence governance, consent and rights handling, claim traceability, regulated-claim safety, and reusable proof libraries.

Quality read: 3/10. The skill needed the most governance work because proof assets can create legal and reputational risk when claims are not auditable.

Changes landed:
- Added learnings search and richer raw evidence intake.
- Added an evidence register.
- Added consent and rights gates.
- Added a claim ledger.
- Added regulated-claim rules.
- Added downstream proof packs and reusable proof-library guidance.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

# m-engage audit

Subagent focus: audit the engage skill for reply quality, risk handling, escalation, speaker identity, and platform-appropriate variants.

Quality read: 7/10. The skill had good engagement instincts, but it needed stronger boundaries for risky replies and public-account identity.

Changes landed:
- Added speaker identity and disclosure rules.
- Added risk levels and high-risk escalation.
- Added conflict playbooks.
- Added medium/high skip options.
- Expanded variant requirements for safer operator choice.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

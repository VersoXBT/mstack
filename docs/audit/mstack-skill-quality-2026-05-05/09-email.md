# m-email audit

Subagent focus: audit the email skill for lifecycle strategy, consent/compliance, deliverability, preview text, testing, and measurement.

Quality read: 5.5/10. The skill could write emails, but it under-specified lifecycle state, consent boundaries, suppression logic, and QA.

Changes landed:
- Added learnings search and lifecycle defaults.
- Added consent, legal posture, suppression, frequency, and footer requirements.
- Added preview text and deliverability checks.
- Added QA, measurement, and test-plan sections.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

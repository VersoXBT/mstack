# m-brief audit

Subagent focus: audit the brief skill for source intake, writer handoff quality, evidence planning, and downstream SEO/content usefulness.

Quality read: 7/10. The skill had a good brief shape, but it needed stronger source loading and section-level execution guidance.

Changes landed:
- Added learnings search and `icp.yaml` detection.
- Added explicit brief inputs and an evidence plan.
- Added competitor gap mapping.
- Added section-level reader question, proof, visual, internal-link, and CTA cues.
- Added a writer handoff block.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

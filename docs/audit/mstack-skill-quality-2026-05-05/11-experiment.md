# m-experiment audit

Subagent focus: audit the experiment skill for hypothesis quality, metrics, sample-size caveats, instrumentation, and decision rules.

Quality read: 5.5/10. The skill needed more rigor around test design before it could reliably guide marketing experiments.

Changes landed:
- Added a hypothesis standard.
- Added metric design and instrumentation requirements.
- Added sample-size caveats.
- Added stricter decision rules.
- Added ethics and follow-up branching guidance.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

# m-launch audit

Subagent focus: audit the launch skill for launch classification, readiness gates, timeline planning, asset readiness, QA, analytics, and post-launch learning.

Quality read: 4/10. The launch workflow was too high-level for real execution and needed stronger operational controls.

Changes landed:
- Added launch classification.
- Added messaging source-of-truth checks.
- Added readiness gates and T-minus timeline guidance.
- Added asset matrix, risk register, QA, and analytics requirements.
- Added post-launch review and go/no-go status handling.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

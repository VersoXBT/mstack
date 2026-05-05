# m-icp audit

Subagent focus: audit the ICP skill for evidence quality, segmentation, anti-ICP guidance, and downstream structured output.

Quality read: 6.5/10. The skill had useful ICP thinking, but it needed stronger evidence capture and a canonical machine-readable artifact.

Changes landed:
- Added `icp.yaml` checks and canonical output guidance.
- Added evidence standards and segment scoring.
- Added pain economics and JTBD extensions.
- Added anti-ICP and disqualifier sections.
- Added completion confidence guidance.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

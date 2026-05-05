# m-brand audit

Subagent focus: audit the brand skill for portable runtime behavior, structured brand memory, buyer clarity, and voice calibration.

Quality read: 6.5/10. The skill was directionally strong, but it relied on hardcoded helper paths and did not capture enough reusable brand data.

Changes landed:
- Replaced hardcoded brand helper calls with the portable `MSTACK_BIN` resolver.
- Expanded intake around category, tagline, buyer/user split, triggers, and indirect competitors.
- Added negative voice examples for tighter tone calibration.
- Expanded `brand.yaml` with schema version, core offer, CTA, proof, claims, and messaging pillars.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, and `git diff --check`.

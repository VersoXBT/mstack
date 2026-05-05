# m-learn audit

Subagent focus: audit the learn skill for functional correctness, JSONL schema consistency, search flags, manual-add behavior, and pruning semantics.

Quality read: 4/10. The skill had real functional defects: manual add guidance wrote Markdown-shaped data to a JSONL workflow, and search/prune semantics were inconsistent.

Changes landed:
- Standardized confidence on a 1-10 scale and documented the canonical JSONL schema.
- Fixed search usage around `--query`, `--limit`, and `--cross-project`.
- Removed references to a nonexistent global store.
- Changed manual add guidance to use `mstack-learnings-log`.
- Changed prune guidance to use tombstone records instead of unsafe deletion.
- Updated runtime search support for tombstoned records.

Verification: covered by `bun run test`, `bun run skill:check`, host dry-run generation, bash syntax checks, and `git diff --check`.

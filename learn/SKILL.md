---
name: m-learn
preamble-tier: 1
version: 1.0.0
description: |
  Manage marketing learnings. View all learnings, search by type or keyword, prune
  old entries, and export. Uses mstack-learnings-search CLI. Simple utility for
  reviewing and maintaining what mstack has learned about your marketing.
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/mstack/bin/mstack-update-check 2>/dev/null || .claude/skills/mstack/bin/mstack-update-check 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
mkdir -p ~/.mstack/sessions
touch ~/.mstack/sessions/"$PPID"
_SESSIONS=$(find ~/.mstack/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.mstack/sessions -mmin +120 -type f -exec rm {} + 2>/dev/null || true
_PROACTIVE=$(~/.claude/skills/mstack/bin/mstack-config get proactive 2>/dev/null || echo "true")
_PROACTIVE_PROMPTED=$([ -f ~/.mstack/.proactive-prompted ] && echo "yes" || echo "no")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
_SKILL_PREFIX=$(~/.claude/skills/mstack/bin/mstack-config get skill_prefix 2>/dev/null || echo "false")
echo "PROACTIVE: $_PROACTIVE"
echo "PROACTIVE_PROMPTED: $_PROACTIVE_PROMPTED"
echo "SKILL_PREFIX: $_SKILL_PREFIX"
source <(~/.claude/skills/mstack/bin/mstack-repo-mode 2>/dev/null) || true
REPO_MODE=${REPO_MODE:-unknown}
echo "REPO_MODE: $REPO_MODE"
_SESSION_ID="$$-$(date +%s)"
# Learnings count
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
_LEARN_FILE="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}/learnings.jsonl"
if [ -f "$_LEARN_FILE" ]; then
  _LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null | tr -d ' ')
  echo "LEARNINGS: $_LEARN_COUNT entries loaded"
  if [ "$_LEARN_COUNT" -gt 5 ] 2>/dev/null; then
    ~/.claude/skills/mstack/bin/mstack-learnings-search --limit 3 2>/dev/null || true
  fi
else
  echo "LEARNINGS: 0"
fi
# Session timeline: record skill start (local-only, never sent anywhere)
~/.claude/skills/mstack/bin/mstack-timeline-log '{"skill":"m-learn","event":"started","branch":"'"$_BRANCH"'","session":"'"$_SESSION_ID"'"}' 2>/dev/null &
# Check if CLAUDE.md has routing rules
_HAS_ROUTING="no"
if [ -f CLAUDE.md ] && grep -q "## Skill routing" CLAUDE.md 2>/dev/null; then
  _HAS_ROUTING="yes"
fi
_ROUTING_DECLINED=$(~/.claude/skills/mstack/bin/mstack-config get routing_declined 2>/dev/null || echo "false")
echo "HAS_ROUTING: $_HAS_ROUTING"
echo "ROUTING_DECLINED: $_ROUTING_DECLINED"
# Detect spawned session (OpenClaw or other orchestrator)
[ -n "$OPENCLAW_SESSION" ] && echo "SPAWNED_SESSION: true" || true
```

If `PROACTIVE` is `"false"`, do not proactively suggest mstack skills AND do not
auto-invoke skills based on conversation context. Only run skills the user explicitly
types (e.g., /qa, /ship). If you would have auto-invoked a skill, instead briefly say:
"I think /skillname might help here — want me to run it?" and wait for confirmation.
The user opted out of proactive behavior.

If `SKILL_PREFIX` is `"true"`, the user has namespaced skill names. When suggesting
or invoking other mstack skills, use the `/mstack-` prefix (e.g., `/mstack-qa` instead
of `/qa`, `/mstack-ship` instead of `/ship`). Disk paths are unaffected — always use
`~/.claude/skills/mstack/[skill-name]/SKILL.md` for reading skill files.

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/mstack/mstack-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running mstack v{to} (just updated!)" and continue.

If `PROACTIVE_PROMPTED` is `no`:
Ask the user about proactive behavior. Use AskUserQuestion:

> mstack can proactively figure out when you might need a skill while you work —
> like suggesting /qa when you say "does this work?" or /investigate when you hit
> a bug. We recommend keeping this on — it speeds up every part of your workflow.

Options:
- A) Keep it on (recommended)
- B) Turn it off — I'll type /commands myself

If A: run `~/.claude/skills/mstack/bin/mstack-config set proactive true`
If B: run `~/.claude/skills/mstack/bin/mstack-config set proactive false`

Always run:
```bash
touch ~/.mstack/.proactive-prompted
```

This only happens once. If `PROACTIVE_PROMPTED` is `yes`, skip this entirely.

If `HAS_ROUTING` is `no` AND `ROUTING_DECLINED` is `false` AND `PROACTIVE_PROMPTED` is `yes`:
Check if a CLAUDE.md file exists in the project root. If it does not exist, create it.

Use AskUserQuestion:

> mstack works best when your project's CLAUDE.md includes skill routing rules.
> This tells Claude to use specialized workflows (like /ship, /investigate, /qa)
> instead of answering directly. It's a one-time addition, about 15 lines.

Options:
- A) Add routing rules to CLAUDE.md (recommended)
- B) No thanks, I'll invoke skills manually

If A: Append this section to the end of CLAUDE.md:

```markdown

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Content writing, blog posts, articles → invoke m-write
- SEO analysis, keyword research, on-page optimization → invoke m-seo
- Social media posts, captions, engagement copy → invoke m-social
- Ad campaigns, ad copy, paid creative → invoke m-ads
- Marketing strategy, go-to-market, positioning → invoke m-strategy
- Brand voice, messaging, tone guidelines → invoke m-brand
- Competitor analysis, market research → invoke m-competitive
- Content calendar, editorial planning → invoke m-calendar
- Marketing report, performance summary → invoke m-report
```

Then commit the change: `git add CLAUDE.md && git commit -m "chore: add mstack skill routing rules to CLAUDE.md"`

If B: run `~/.claude/skills/mstack/bin/mstack-config set routing_declined true`
Say "No problem. You can add routing rules later by running `mstack-config set routing_declined false` and re-running any skill."

This only happens once per project. If `HAS_ROUTING` is `yes` or `ROUTING_DECLINED` is `true`, skip this entirely.

If `SPAWNED_SESSION` is `"true"`, you are running inside a session spawned by an
AI orchestrator (e.g., OpenClaw). In spawned sessions:
- Do NOT use AskUserQuestion for interactive prompts. Auto-choose the recommended option.
- Do NOT run upgrade checks or routing injection prompts.
- Focus on completing the task and reporting results via prose output.
- End with a completion report: what shipped, decisions made, anything uncertain.

## Voice

**Tone:** direct, concrete, sharp, never corporate, never academic. Sound like a builder, not a consultant. Name the file, the function, the command. No filler, no throat-clearing.

**Writing rules:** No em dashes (use commas, periods, "..."). No AI vocabulary (delve, crucial, robust, comprehensive, nuanced, etc.). Short paragraphs. End with what to do.

The user always has context you don't. Cross-model agreement is a recommendation, not a decision — the user decides.

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** — Completed, but with issues the user should know about. List each concern.
- **BLOCKED** — Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Operational Self-Improvement

Before completing, reflect on this session:
- Did any commands fail unexpectedly?
- Did you take a wrong approach and have to backtrack?
- Did you discover a project-specific quirk (build order, env vars, timing, auth)?
- Did something take longer than expected because of a missing flag or config?

If yes, log an operational learning for future sessions:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-log '{"skill":"SKILL_NAME","type":"operational","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"observed"}'
```

Replace SKILL_NAME with the current skill name. Only log genuine operational discoveries.
Don't log obvious things or one-time transient errors (network blips, rate limits).
A good test: would knowing this save 5+ minutes in a future session? If yes, log it.

## Session Complete

When the skill workflow completes, report the outcome (success, error, or abort) to the user.

## Plan Mode Safe Operations

When in plan mode, these operations are always allowed because they produce
artifacts that inform the plan, not code changes:

- `$B` commands (browse: screenshots, page inspection, navigation, snapshots)
- `$D` commands (design: generate mockups, variants, comparison boards, iterate)
- `codex exec` / `codex review` (outside voice, plan review, adversarial challenge)
- Writing to `~/.mstack/` (config, analytics, review logs, design artifacts, learnings)
- Writing to the plan file (already allowed by plan mode)
- `open` commands for viewing generated artifacts (comparison boards, HTML previews)

These are read-only in spirit — they inspect the live site, generate visual artifacts,
or get independent opinions. They do NOT modify project source files.

## Skill Invocation During Plan Mode

If a user invokes a skill during plan mode, that invoked skill workflow takes
precedence over generic plan mode behavior until it finishes or the user explicitly
cancels that skill.

Treat the loaded skill as executable instructions, not reference material. Follow
it step by step. Do not summarize, skip, reorder, or shortcut its steps.

If the skill says to use AskUserQuestion, do that. Those AskUserQuestion calls
satisfy plan mode's requirement to end turns with AskUserQuestion.

If the skill reaches a STOP point, stop immediately at that point, ask the required
question if any, and wait for the user's response. Do not continue the workflow
past a STOP point, and do not call ExitPlanMode at that point.

If the skill includes commands marked "PLAN MODE EXCEPTION — ALWAYS RUN," execute
them. The skill may edit the plan file, and other writes are allowed only if they
are already permitted by Plan Mode Safe Operations or explicitly marked as a plan
mode exception.

Only call ExitPlanMode after the active skill workflow is complete and there are no
other invoked skill workflows left to run, or if the user explicitly tells you to
cancel the skill or leave plan mode.

## Plan Status Footer

When you are in plan mode and about to call ExitPlanMode:

1. Check if the plan file already has a `## MSTACK REVIEW REPORT` section.
2. If it DOES — skip (a review skill already wrote a richer report).
3. If it does NOT — run this command:

\`\`\`bash
~/.claude/skills/mstack/bin/mstack-review-read
\`\`\`

Then write a `## MSTACK REVIEW REPORT` section to the end of the plan file:

- If the output contains review entries (JSONL lines before `---CONFIG---`): format the
  standard report table with runs/status/findings per skill, same format as the review
  skills use.
- If the output is `NO_REVIEWS` or empty: write this placeholder table:

\`\`\`markdown
## MSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| Strategy Review | \`/m-strategy\` | Scope & positioning | 0 | — | — |
| Brand Review | \`/m-brand\` | Voice & messaging consistency | 0 | — | — |
| SEO Review | \`/m-seo\` | Search visibility gaps | 0 | — | — |
| Content Review | \`/m-write\` | Copy quality & completeness | 0 | — | — |

**VERDICT:** NO REVIEWS YET — run individual reviews above to populate this table.
\`\`\`

**PLAN MODE EXCEPTION — ALWAYS RUN:** This writes to the plan file, which is the one
file you are allowed to edit in plan mode. The plan file review report is part of the
plan's living status.

## Setup

Check if learnings exist:

```bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
PROJECT_DIR="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}"
LEARNINGS_FILE="$PROJECT_DIR/learnings.jsonl"

if [ -f "$LEARNINGS_FILE" ]; then
  ENTRY_COUNT=$(grep -c "^##" "$LEARNINGS_FILE" 2>/dev/null || echo "0")
  echo "Learnings file found: $LEARNINGS_FILE"
  echo "Entries: $ENTRY_COUNT"
else
  echo "No learnings file found at: $LEARNINGS_FILE"
fi
```

Use AskUserQuestion:
> "What would you like to do with your marketing learnings?
> A) View all learnings
> B) Search by keyword or type
> C) Prune old or outdated entries
> D) Export to a file
> E) Add a learning manually"

STOP and wait.

## View All Learnings

If user chose A:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-search "" 2>/dev/null || \
  cat "$LEARNINGS_FILE" 2>/dev/null || \
  echo "No learnings found."
```

Display all entries. Summarize:
- Total entries: {count}
- Entry types breakdown (if tagged): {type: count}
- Date range: {oldest to newest}

## Search Learnings

If user chose B:

Use AskUserQuestion:
> "What are you looking for?
> - Type a keyword (e.g., 'Twitter', 'email', 'landing page')
> - Or a type (e.g., 'what-worked', 'what-failed', 'audience-insight')"

```bash
~/.claude/skills/mstack/bin/mstack-learnings-search "{search term}" 2>/dev/null || \
  grep -i "{search term}" "$LEARNINGS_FILE" 2>/dev/null || \
  echo "No matches found."
```

Display matching entries with context.

## Prune Old Entries

If user chose C:

```bash
cat "$LEARNINGS_FILE" 2>/dev/null
```

Review entries and flag for pruning:
- Entries older than 90 days that contradict newer learnings
- Duplicate or near-duplicate insights
- Learnings that no longer apply (old product state, deprecated channels)

Present flagged entries to the user:
> "I found {N} entries that may be outdated or redundant:
> [list them]
> Which should I remove? (comma-separated numbers, or 'all', or 'none')"

STOP and wait for confirmation before removing anything.

Remove approved entries:
```bash
# Remove specific entries from learnings file
# Back up first
cp "$LEARNINGS_FILE" "${LEARNINGS_FILE}.bak"
# Edit file to remove flagged entries
```

Report: "{N} entries removed. Backup saved to {path}.bak"

## Export Learnings

If user chose D:

Use AskUserQuestion:
> "Where should I export the learnings?
> A) Markdown file (default: `docs/learnings-export-{date}.md`)
> B) Plain text
> C) Tell me a path"

```bash
cp "$LEARNINGS_FILE" "{export path}" 2>/dev/null || \
  cat "$LEARNINGS_FILE" > "{export path}"
echo "Exported to: {export path}"
```

## Add Learning Manually

If user chose E:

Use AskUserQuestion:
> "Describe the learning. Include:
> 1. What you tried or observed
> 2. The result or insight
> 3. Type: what-worked / what-failed / audience-insight / channel-insight / other"

Format and append to learnings file:
```bash
cat >> "$LEARNINGS_FILE" << 'EOF'
## {date} — {type}
{learning text}
EOF
```

Confirm: "Learning added to {path}"

## Completion

Report:
- Action taken: {action}
- Entries processed: {count}
- Learnings file: {path}

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/mstack/bin/mstack-update-check 2>/dev/null || .claude/skills/mstack/bin/mstack-update-check 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
mkdir -p ~/.mstack/sessions
touch ~/.mstack/sessions/"$PPID"
_SESSIONS=$(find ~/.mstack/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.mstack/sessions -mmin +120 -type f -exec rm {} + 2>/dev/null || true
_PROACTIVE=$(~/.claude/skills/mstack/bin/mstack-config get proactive 2>/dev/null || echo "true")
_PROACTIVE_PROMPTED=$([ -f ~/.mstack/.proactive-prompted ] && echo "yes" || echo "no")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
_SKILL_PREFIX=$(~/.claude/skills/mstack/bin/mstack-config get skill_prefix 2>/dev/null || echo "false")
echo "PROACTIVE: $_PROACTIVE"
echo "PROACTIVE_PROMPTED: $_PROACTIVE_PROMPTED"
echo "SKILL_PREFIX: $_SKILL_PREFIX"
source <(~/.claude/skills/mstack/bin/mstack-repo-mode 2>/dev/null) || true
REPO_MODE=${REPO_MODE:-unknown}
echo "REPO_MODE: $REPO_MODE"
_SESSION_ID="$$-$(date +%s)"
# Learnings count
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
_LEARN_FILE="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}/learnings.jsonl"
if [ -f "$_LEARN_FILE" ]; then
  _LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null | tr -d ' ')
  echo "LEARNINGS: $_LEARN_COUNT entries loaded"
  if [ "$_LEARN_COUNT" -gt 5 ] 2>/dev/null; then
    ~/.claude/skills/mstack/bin/mstack-learnings-search --limit 3 2>/dev/null || true
  fi
else
  echo "LEARNINGS: 0"
fi
# Session timeline: record skill start (local-only, never sent anywhere)
~/.claude/skills/mstack/bin/mstack-timeline-log '{"skill":"m-learn","event":"started","branch":"'"$_BRANCH"'","session":"'"$_SESSION_ID"'"}' 2>/dev/null &
# Check if CLAUDE.md has routing rules
_HAS_ROUTING="no"
if [ -f CLAUDE.md ] && grep -q "## Skill routing" CLAUDE.md 2>/dev/null; then
  _HAS_ROUTING="yes"
fi
_ROUTING_DECLINED=$(~/.claude/skills/mstack/bin/mstack-config get routing_declined 2>/dev/null || echo "false")
echo "HAS_ROUTING: $_HAS_ROUTING"
echo "ROUTING_DECLINED: $_ROUTING_DECLINED"
# Detect spawned session (OpenClaw or other orchestrator)
[ -n "$OPENCLAW_SESSION" ] && echo "SPAWNED_SESSION: true" || true
```

If `PROACTIVE` is `"false"`, do not proactively suggest mstack skills AND do not
auto-invoke skills based on conversation context. Only run skills the user explicitly
types (e.g., /qa, /ship). If you would have auto-invoked a skill, instead briefly say:
"I think /skillname might help here — want me to run it?" and wait for confirmation.
The user opted out of proactive behavior.

If `SKILL_PREFIX` is `"true"`, the user has namespaced skill names. When suggesting
or invoking other mstack skills, use the `/mstack-` prefix (e.g., `/mstack-qa` instead
of `/qa`, `/mstack-ship` instead of `/ship`). Disk paths are unaffected — always use
`~/.claude/skills/mstack/[skill-name]/SKILL.md` for reading skill files.

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/mstack/mstack-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running mstack v{to} (just updated!)" and continue.

If `PROACTIVE_PROMPTED` is `no`:
Ask the user about proactive behavior. Use AskUserQuestion:

> mstack can proactively figure out when you might need a skill while you work —
> like suggesting /qa when you say "does this work?" or /investigate when you hit
> a bug. We recommend keeping this on — it speeds up every part of your workflow.

Options:
- A) Keep it on (recommended)
- B) Turn it off — I'll type /commands myself

If A: run `~/.claude/skills/mstack/bin/mstack-config set proactive true`
If B: run `~/.claude/skills/mstack/bin/mstack-config set proactive false`

Always run:
```bash
touch ~/.mstack/.proactive-prompted
```

This only happens once. If `PROACTIVE_PROMPTED` is `yes`, skip this entirely.

If `HAS_ROUTING` is `no` AND `ROUTING_DECLINED` is `false` AND `PROACTIVE_PROMPTED` is `yes`:
Check if a CLAUDE.md file exists in the project root. If it does not exist, create it.

Use AskUserQuestion:

> mstack works best when your project's CLAUDE.md includes skill routing rules.
> This tells Claude to use specialized workflows (like /ship, /investigate, /qa)
> instead of answering directly. It's a one-time addition, about 15 lines.

Options:
- A) Add routing rules to CLAUDE.md (recommended)
- B) No thanks, I'll invoke skills manually

If A: Append this section to the end of CLAUDE.md:

```markdown

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Content writing, blog posts, articles → invoke m-write
- SEO analysis, keyword research, on-page optimization → invoke m-seo
- Social media posts, captions, engagement copy → invoke m-social
- Ad campaigns, ad copy, paid creative → invoke m-ads
- Marketing strategy, go-to-market, positioning → invoke m-strategy
- Brand voice, messaging, tone guidelines → invoke m-brand
- Competitor analysis, market research → invoke m-competitive
- Content calendar, editorial planning → invoke m-calendar
- Marketing report, performance summary → invoke m-report
```

Then commit the change: `git add CLAUDE.md && git commit -m "chore: add mstack skill routing rules to CLAUDE.md"`

If B: run `~/.claude/skills/mstack/bin/mstack-config set routing_declined true`
Say "No problem. You can add routing rules later by running `mstack-config set routing_declined false` and re-running any skill."

This only happens once per project. If `HAS_ROUTING` is `yes` or `ROUTING_DECLINED` is `true`, skip this entirely.

If `SPAWNED_SESSION` is `"true"`, you are running inside a session spawned by an
AI orchestrator (e.g., OpenClaw). In spawned sessions:
- Do NOT use AskUserQuestion for interactive prompts. Auto-choose the recommended option.
- Do NOT run upgrade checks or routing injection prompts.
- Focus on completing the task and reporting results via prose output.
- End with a completion report: what shipped, decisions made, anything uncertain.

## Voice

**Tone:** direct, concrete, sharp, never corporate, never academic. Sound like a builder, not a consultant. Name the file, the function, the command. No filler, no throat-clearing.

**Writing rules:** No em dashes (use commas, periods, "..."). No AI vocabulary (delve, crucial, robust, comprehensive, nuanced, etc.). Short paragraphs. End with what to do.

The user always has context you don't. Cross-model agreement is a recommendation, not a decision — the user decides.

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** — Completed, but with issues the user should know about. List each concern.
- **BLOCKED** — Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Operational Self-Improvement

Before completing, reflect on this session:
- Did any commands fail unexpectedly?
- Did you take a wrong approach and have to backtrack?
- Did you discover a project-specific quirk (build order, env vars, timing, auth)?
- Did something take longer than expected because of a missing flag or config?

If yes, log an operational learning for future sessions:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-log '{"skill":"SKILL_NAME","type":"operational","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"observed"}'
```

Replace SKILL_NAME with the current skill name. Only log genuine operational discoveries.
Don't log obvious things or one-time transient errors (network blips, rate limits).
A good test: would knowing this save 5+ minutes in a future session? If yes, log it.

## Session Complete

When the skill workflow completes, report the outcome (success, error, or abort) to the user.

## Plan Mode Safe Operations

When in plan mode, these operations are always allowed because they produce
artifacts that inform the plan, not code changes:

- `$B` commands (browse: screenshots, page inspection, navigation, snapshots)
- `$D` commands (design: generate mockups, variants, comparison boards, iterate)
- `codex exec` / `codex review` (outside voice, plan review, adversarial challenge)
- Writing to `~/.mstack/` (config, analytics, review logs, design artifacts, learnings)
- Writing to the plan file (already allowed by plan mode)
- `open` commands for viewing generated artifacts (comparison boards, HTML previews)

These are read-only in spirit — they inspect the live site, generate visual artifacts,
or get independent opinions. They do NOT modify project source files.

## Skill Invocation During Plan Mode

If a user invokes a skill during plan mode, that invoked skill workflow takes
precedence over generic plan mode behavior until it finishes or the user explicitly
cancels that skill.

Treat the loaded skill as executable instructions, not reference material. Follow
it step by step. Do not summarize, skip, reorder, or shortcut its steps.

If the skill says to use AskUserQuestion, do that. Those AskUserQuestion calls
satisfy plan mode's requirement to end turns with AskUserQuestion.

If the skill reaches a STOP point, stop immediately at that point, ask the required
question if any, and wait for the user's response. Do not continue the workflow
past a STOP point, and do not call ExitPlanMode at that point.

If the skill includes commands marked "PLAN MODE EXCEPTION — ALWAYS RUN," execute
them. The skill may edit the plan file, and other writes are allowed only if they
are already permitted by Plan Mode Safe Operations or explicitly marked as a plan
mode exception.

Only call ExitPlanMode after the active skill workflow is complete and there are no
other invoked skill workflows left to run, or if the user explicitly tells you to
cancel the skill or leave plan mode.

## Plan Status Footer

When you are in plan mode and about to call ExitPlanMode:

1. Check if the plan file already has a `## MSTACK REVIEW REPORT` section.
2. If it DOES — skip (a review skill already wrote a richer report).
3. If it does NOT — run this command:

\`\`\`bash
~/.claude/skills/mstack/bin/mstack-review-read
\`\`\`

Then write a `## MSTACK REVIEW REPORT` section to the end of the plan file:

- If the output contains review entries (JSONL lines before `---CONFIG---`): format the
  standard report table with runs/status/findings per skill, same format as the review
  skills use.
- If the output is `NO_REVIEWS` or empty: write this placeholder table:

\`\`\`markdown
## MSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| Strategy Review | \`/m-strategy\` | Scope & positioning | 0 | — | — |
| Brand Review | \`/m-brand\` | Voice & messaging consistency | 0 | — | — |
| SEO Review | \`/m-seo\` | Search visibility gaps | 0 | — | — |
| Content Review | \`/m-write\` | Copy quality & completeness | 0 | — | — |

**VERDICT:** NO REVIEWS YET — run individual reviews above to populate this table.
\`\`\`

**PLAN MODE EXCEPTION — ALWAYS RUN:** This writes to the plan file, which is the one
file you are allowed to edit in plan mode. The plan file review report is part of the
plan's living status.

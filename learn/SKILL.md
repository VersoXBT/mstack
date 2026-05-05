---
name: m-learn
preamble-tier: 1
version: 2.0.0
description: |
  Manage marketing learnings. View, search, prune, export, and add entries.
  Learnings are typed by marketing category (content, seo, social, ads, audience,
  operational) and scored by confidence. Highlights high-confidence insights and
  cross-project signals that should influence upcoming /m-write or /m-social runs.
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

If `PROACTIVE` is `"false"`, do not proactively suggest mstack skills and do not
auto-invoke skills based on conversation context. Only run skills the user explicitly
types (for example, /m-write, /m-audit, /m-campaign). If you would have auto-invoked
a skill, briefly say: "I think /skillname might help here. Want me to run it?" and
wait for confirmation. The user opted out of proactive behavior.

If `SKILL_PREFIX` is `"true"`, the user has namespaced skill names. When suggesting
or invoking other mstack skills, use the `/m-` prefix (for example, `/m-write`
instead of `/write`, `/m-audit` instead of `/audit`). Disk paths are unaffected;
always use `~/.claude/skills/mstack/[skill-name]/SKILL.md` for reading skill files.

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/mstack/mstack-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running mstack v{to} (just updated!)" and continue.

If `PROACTIVE_PROMPTED` is `no`:
Ask the user about proactive behavior. Use AskUserQuestion:

> mstack can proactively figure out when you might need a skill while you work,
> like suggesting /m-audit when you ask "what should we fix first?", /m-write
> when you need campaign copy, or /m-report when you paste performance data.
> We recommend keeping this on, it speeds up marketing execution.

Options:
- A) Keep it on (recommended)
- B) Turn it off, I'll type /commands myself

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
> This tells Claude Code to use specialized workflows (like /m-brand, /m-audit, /m-write)
> instead of answering directly. It's a one-time addition, about 15 lines.

Options:
- A) Add routing rules to CLAUDE.md (recommended)
- B) No thanks, I'll invoke skills manually

If A: Append this section to the end of CLAUDE.md:

```markdown

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do not answer directly and do not use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Content writing, blog posts, articles -> invoke m-write
- SEO analysis, keyword research, on-page optimization -> invoke m-seo
- Social media posts, captions, engagement copy -> invoke m-social
- Ad campaigns, ad copy, paid creative -> invoke m-ads
- Marketing strategy, go-to-market, positioning -> invoke m-strategy
- Brand voice, messaging, tone guidelines -> invoke m-brand
- Competitor analysis, market research -> invoke m-competitive
- Content calendar, editorial planning -> invoke m-calendar
- Marketing report, performance summary -> invoke m-report
```

Then commit the change: `git add CLAUDE.md && git commit -m "chore: add mstack skill routing rules"`

If B: run `~/.claude/skills/mstack/bin/mstack-config set routing_declined true`
Say "No problem. You can add routing rules later by running `mstack-config set routing_declined false` and re-running any skill."

This only happens once per project. If `HAS_ROUTING` is `yes` or `ROUTING_DECLINED` is `true`, skip this entirely.

If `SPAWNED_SESSION` is `"true"`, you are running inside a session spawned by an
AI orchestrator (for example, OpenClaw). In spawned sessions:
- Do not use AskUserQuestion for interactive prompts. Auto-choose the recommended option.
- Do not run upgrade checks or routing injection prompts.
- Focus on completing the task and reporting results via prose output.
- End with a completion report: what shipped, decisions made, anything uncertain.

## Voice

Tone: direct, concrete, sharp, never corporate, never academic. Sound like a builder, not a consultant. Name the file, the function, the command. No filler, no throat-clearing.

Writing rules: No em dashes. Use commas, periods, or "...". No AI vocabulary (delve, crucial, robust, comprehensive, nuanced, etc.). Short paragraphs. End with what to do.

The user always has context you don't. Cross-model agreement is a recommendation, not a decision. The user decides.

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- DONE: All steps completed successfully. Evidence provided for each claim.
- DONE_WITH_CONCERNS: Completed, but with issues the user should know about. List each concern.
- BLOCKED: Cannot proceed. State what is blocking and what was tried.
- NEEDS_CONTEXT: Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, stop and escalate.
- If you are uncertain about a security-sensitive change, stop and escalate.
- If the scope of work exceeds what you can verify, stop and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Operator Mode

Default to action. Draft with explicit assumptions when the missing context is not
material to the outcome. Ask only when the answer would change the strategy,
claims, audience, compliance posture, or distribution channel.

When context is thin, produce:
- the best usable draft or plan;
- the assumptions you made;
- the exact inputs that would improve version 2.

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

- `$B` commands when available (SERP checks, screenshots, page inspection, snapshots)
- `codex exec` / `codex review` for outside-voice critique when the host supports it
- Writing to `~/.mstack/` for config, brand context, project memory, and learnings
- Writing to the plan file (already allowed by plan mode)
- `open` commands for viewing generated artifacts (comparison boards, HTML previews)

These are read-only in spirit: they inspect the market, collect local context,
or get independent opinions. They do not modify project source files.

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

If the skill includes commands marked "PLAN MODE EXCEPTION - ALWAYS RUN," execute
them. The skill may edit the plan file, and other writes are allowed only if they
are already permitted by Plan Mode Safe Operations or explicitly marked as a plan
mode exception.

Only call ExitPlanMode after the active skill workflow is complete and there are no
other invoked skill workflows left to run, or if the user explicitly tells you to
cancel the skill or leave plan mode.

## Plan Status Footer

When you are in plan mode and about to call ExitPlanMode:

1. Check if the plan file already has a `## MSTACK MARKETING STATUS` section.
2. If it does, update it instead of appending a duplicate.
3. If it does not, append this section:

\`\`\`markdown
## MSTACK MARKETING STATUS

| Area | Suggested skill | Why | Status |
|------|-----------------|-----|--------|
| Brand | \`/m-brand\` | Voice, audience, positioning | Not run |
| Strategy | \`/m-strategy\` | Channel plan, offer, roadmap | Not run |
| Content | \`/m-brief\`, \`/m-write\` | Briefs and copy | Not run |
| Distribution | \`/m-social\`, \`/m-calendar\` | Platform execution | Not run |
| Measurement | \`/m-report\` | Performance review | Not run |

**NEXT STEP:** Pick the highest-leverage skill for the current marketing goal.
\`\`\`

PLAN MODE EXCEPTION - ALWAYS RUN: This writes to the plan file, which is the one
file you are allowed to edit in plan mode. The marketing status section is part of the
plan's living status.

## Setup

Check if learnings exist:

```bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
PROJECT_DIR="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}"
LEARNINGS_FILE="$PROJECT_DIR/learnings.jsonl"

if [ -f "$LEARNINGS_FILE" ]; then
  ENTRY_COUNT=$(wc -l < "$LEARNINGS_FILE" 2>/dev/null | tr -d ' ')
  echo "Learnings file found: $LEARNINGS_FILE"
  echo "Entries: $ENTRY_COUNT"
else
  echo "No learnings file found at: $LEARNINGS_FILE"
fi
```

Use AskUserQuestion:
> "What would you like to do with your marketing learnings?
> A) View all learnings (grouped by type, highest-confidence first)
> B) Search by keyword or category
> C) Prune old or low-confidence entries
> D) Export to markdown (for team sharing or strategy docs)
> E) Add a learning manually"

STOP and wait.

## Learning Categories

Every learning belongs to one of these marketing-specific types:

| Type | What it captures |
|------|-----------------|
| `content` | Topics, formats, lengths, CTAs that drive engagement or conversions |
| `seo` | Ranking patterns, keyword clusters, algorithm changes, internal linking wins |
| `social` | Engagement triggers, posting cadence, viral patterns per platform |
| `ads` | Creative performance, audience segments, bidding insights, ROAS patterns |
| `audience` | Behavioral patterns, preferences, objections, feedback signals |
| `operational` | Tool quirks, API limits, workflow bottlenecks, process improvements |

Confidence score: 1–5 (1 = anecdotal, 5 = replicated across multiple runs/campaigns).

## View All Learnings

If user chose A:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-search "" 2>/dev/null || \
  cat "$LEARNINGS_FILE" 2>/dev/null || \
  echo "No learnings found."
```

Display entries grouped by type in this order: `content`, `seo`, `social`, `ads`, `audience`, `operational`.
Within each group, sort highest confidence first.

Summarize at the top:
- Total entries: {count}
- Breakdown: {type: count, e.g. content: 4, seo: 2, social: 6 ...}
- Date range: {oldest to newest}
- High-confidence items (score ≥ 4): {count} — list their one-line summaries

Then highlight actionable signals:
> **What to apply next run:**
> - /m-write: {top content/seo insights that should influence the next piece}
> - /m-social: {top social/audience insights that should influence the next post}

## Search Learnings

If user chose B:

Use AskUserQuestion:
> "What are you looking for?
> - Keyword (e.g. 'LinkedIn', 'long-form', 'landing page', 'open rate')
> - Category (e.g. 'content', 'seo', 'social', 'ads', 'audience', 'operational')
> - Question (e.g. 'what content format works best', 'which channels drive signups', 'LinkedIn posting patterns that increased reach')"

```bash
~/.claude/skills/mstack/bin/mstack-learnings-search "{search term}" 2>/dev/null || \
  grep -i "{search term}" "$LEARNINGS_FILE" 2>/dev/null || \
  echo "No matches found."
```

Display matching entries with full context. After results, check the global learnings store for cross-project signals:

```bash
GLOBAL_LEARNINGS="${MSTACK_HOME:-$HOME/.mstack}/global/learnings.jsonl"
grep -i "{search term}" "$GLOBAL_LEARNINGS" 2>/dev/null || true
```

If a cross-project match exists, surface it clearly:
> **Cross-project signal:** In project {project-name}, {insight summary} — confidence {score}. This may apply here too.

## Prune Old Entries

If user chose C:

```bash
cat "$LEARNINGS_FILE" 2>/dev/null
```

Review entries and flag for pruning using these criteria:
- Confidence score below 3 with no reinforcement in 90+ days
- Older than 6 months with no subsequent entry that confirmed or built on it
- Directly contradicted by a newer, higher-confidence learning
- Duplicate or near-duplicate of another entry (keep the higher-confidence one)
- Tied to a deprecated channel, tool, or product state that no longer exists

Present flagged entries to the user:
> "I found {N} entries that may be outdated, low-confidence, or redundant:
>
> [list each with: date, type, confidence, reason for flagging]
>
> Which should I remove? (comma-separated numbers, or 'all', or 'none')"

STOP and wait for confirmation before removing anything.

Remove approved entries:
```bash
# Back up first
cp "$LEARNINGS_FILE" "${LEARNINGS_FILE}.bak"
# Remove approved lines — edit file to exclude flagged entries
```

Report: "{N} entries removed. {M} entries remain. Backup saved to {path}.bak"

## Export Learnings

If user chose D:

Use AskUserQuestion:
> "Where should I export the learnings?
> A) Markdown file (default: `docs/learnings-export-{date}.md`) — clean format for sharing with team or pasting into strategy docs
> B) Plain text
> C) Custom path — tell me where"

Generate the markdown export in this structure:

```markdown
# Marketing Learnings — {project name}
Exported: {date} | Total entries: {count}

## Key Insights (Confidence ≥ 4)
{bullet list of highest-confidence learnings across all types}

## By Category

### Content
{entries sorted by confidence desc}

### SEO
{entries sorted by confidence desc}

### Social
{entries sorted by confidence desc}

### Ads
{entries sorted by confidence desc}

### Audience
{entries sorted by confidence desc}

### Operational
{entries sorted by confidence desc}

---
*Generated by mstack /m-learn*
```

Write the file:
```bash
cat > "{export path}" << 'EXPORT'
{formatted markdown content}
EXPORT
echo "Exported to: {export path}"
```

## Add Learning Manually

If user chose E:

Use AskUserQuestion:
> "Describe the learning. Include:
> 1. What you tried or observed (be specific: channel, format, audience)
> 2. The result or insight (include numbers if available)
> 3. Category: content / seo / social / ads / audience / operational
> 4. Confidence score 1–5 (1 = one-off observation, 5 = replicated multiple times)"

Format and append:
```bash
cat >> "$LEARNINGS_FILE" << EOF
## {date} — {type} — confidence:{score}
{learning text}
EOF
```

After appending, check if this learning reinforces or contradicts an existing entry. If it does, surface the related entry so the user can consider updating or pruning the older one.

Confirm: "Learning added to {path} (type: {type}, confidence: {score})"

## Completion

Report:
- Action taken: {action}
- Entries processed: {count}
- Learnings file: {path}
- Next suggested action: {e.g. "Run /m-write — 3 high-confidence content insights are ready to apply" or "Run /m-social — LinkedIn posting pattern (confidence 4) not yet applied"}

## Capture Learnings

If you discovered a non-obvious pattern, pitfall, or architectural insight during
this session, log it for future sessions:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-log '{"skill":"m-learn","type":"TYPE","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"SOURCE","files":["path/to/relevant/file"]}'
```

**Types:** `pattern` (reusable approach), `pitfall` (what NOT to do), `preference`
(user stated), `architecture` (structural decision), `tool` (library/framework insight),
`operational` (project environment/CLI/workflow knowledge).

**Sources:** `observed` (you found this in the code), `user-stated` (user told you),
`inferred` (AI deduction), `cross-model` (both Claude and Codex agree).

**Confidence:** 1-10. Be honest. An observed pattern you verified in the code is 8-9.
An inference you're not sure about is 4-5. A user preference they explicitly stated is 10.

**files:** Include the specific file paths this learning references. This enables
staleness detection: if those files are later deleted, the learning can be flagged.

**Only log genuine discoveries.** Don't log obvious things. Don't log things the user
already knows. A good test: would this insight save time in a future session? If yes, log it.

## Privacy Boundary

mstack does not send telemetry, usage analytics, stable identifiers, or marketing
content to any mstack-operated service. The only persistent files it writes are
explicit workspace outputs and local project memory under `~/.mstack/`.

Network access may still happen when a workflow explicitly needs live marketing
research, such as SERP checks, competitor page review, or API-backed reporting.
When live research is used, say which source or API was queried in the final
output.

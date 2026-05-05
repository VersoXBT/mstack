---
name: m-upgrade
preamble-tier: 1
version: 1.1.0
description: |
  Self-update for mstack. Detects vendored vs global install, checks current and
  remote versions, shows a changelog preview, backs up config before upgrading,
  applies the upgrade, verifies skills registered, and provides rollback instructions
  if anything breaks. Run when asked to "update mstack", "upgrade mstack", or
  "get latest mstack".
allowed-tools:
  - Bash
  - Read
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

## Setup: Detect Install Location

Detect whether mstack is installed for Claude, global Codex, or local Codex, and
capture the working directory so every later step uses the same path.

```bash
HOST="${MSTACK_HOST:-}"
INSTALL_DIR="${MSTACK_ROOT:-}"
INSTALL_TYPE=""
SETUP_HOST=""

if [ -n "$INSTALL_DIR" ] && [ -d "$INSTALL_DIR/.git" ]; then
  INSTALL_TYPE="override"
fi

if [ -z "$INSTALL_DIR" ]; then
  CANDIDATES=(
    "claude|global|$HOME/.claude/skills/mstack"
    "codex|global|$HOME/.codex/skills/mstack"
    "codex|local|$(pwd)/.agents/skills/mstack"
    "claude|local|$(pwd)/.claude/skills/mstack"
  )
  MATCHES=()
  for item in "${CANDIDATES[@]}"; do
    IFS='|' read -r h t p <<< "$item"
    [ -n "$HOST" ] && [ "$HOST" != "$h" ] && continue
    [ -d "$p/.git" ] && MATCHES+=("$item")
  done
  if [ "${#MATCHES[@]}" -eq 1 ]; then
    IFS='|' read -r SETUP_HOST INSTALL_TYPE INSTALL_DIR <<< "${MATCHES[0]}"
  elif [ "${#MATCHES[@]}" -gt 1 ]; then
    printf '%s\n' "ERROR: multiple mstack installs found. Set MSTACK_HOST or MSTACK_ROOT."
    printf '%s\n' "${MATCHES[@]}"
    exit 1
  fi
fi

if [ -z "$INSTALL_DIR" ]; then
  echo "ERROR: mstack not found. Expected ~/.claude/skills/mstack, ~/.codex/skills/mstack, or .agents/.claude local install."
  exit 1
fi

[ -n "$SETUP_HOST" ] || SETUP_HOST="${HOST:-all}"

echo "HOST:         $SETUP_HOST"
echo "INSTALL_TYPE: $INSTALL_TYPE"
echo "INSTALL_DIR:  $INSTALL_DIR"
```

Report the install type and directory to the user before proceeding.

## Step 1: Read Current Version

```bash
# Read local VERSION file first; fall back to package.json
if [ -f "$INSTALL_DIR/VERSION" ]; then
  LOCAL_VERSION=$(cat "$INSTALL_DIR/VERSION" | tr -d '[:space:]')
else
  LOCAL_VERSION=$(grep '"version"' "$INSTALL_DIR/package.json" 2>/dev/null \
    | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
fi

echo "Local version:  ${LOCAL_VERSION:-unknown}"

# Show git context
cd "$INSTALL_DIR"
git log --oneline -1 2>/dev/null || echo "(no git history)"
git remote get-url origin 2>/dev/null || echo "(no remote configured)"
```

## Step 2: Fetch Remote Version

```bash
cd "$INSTALL_DIR"

# Fetch without applying changes
git fetch origin 2>&1

# Count commits between HEAD and remote main
BEHIND=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")

# Read VERSION from the remote tip
REMOTE_VERSION=$(git show origin/main:VERSION 2>/dev/null | tr -d '[:space:]')
if [ -z "$REMOTE_VERSION" ]; then
  # Fallback: parse version from remote package.json
  REMOTE_VERSION=$(git show origin/main:package.json 2>/dev/null \
    | grep '"version"' | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
fi

echo "Local version:  ${LOCAL_VERSION:-unknown}"
echo "Remote version: ${REMOTE_VERSION:-unknown}"
echo "Commits behind: $BEHIND"
```

## Step 3: Compare Versions and Preview Changelog

If `BEHIND=0`:
> "mstack is already up to date (v{local_version}). Nothing to do."

Stop here.

If updates are available, show a detailed changelog preview:

```bash
cd "$INSTALL_DIR"

echo "=== Changelog: HEAD..origin/main ==="
git log HEAD..origin/main --oneline 2>/dev/null | head -30

echo ""
echo "=== Changed files ==="
git diff --name-status HEAD..origin/main 2>/dev/null | head -40

echo ""
echo "=== Diff summary ==="
git diff --stat HEAD..origin/main 2>/dev/null | tail -5

echo ""
echo "=== Local status ==="
git status --short
echo "Ahead/behind: $(git rev-list --left-right --count HEAD...origin/main 2>/dev/null)"
echo "Planned setup command: bash ./setup --host $SETUP_HOST"
```

Present the changelog clearly, then use AskUserQuestion:

> "mstack update available: v{local_version} → v{remote_version} ({N} commits)
>
> Changes:
> {commit list}
>
> Files changed: {diff summary}
>
> How would you like to proceed?
> A) Upgrade — backup config, pull latest, re-run setup, verify skills
> B) Skip — stay on v{local_version}"

STOP and wait for the user's answer.

## Step 4: Backup Before Upgrade

If user chose A, back up the current config and any brand contexts before
touching the repository:

```bash
BACKUP_DIR="$HOME/.mstack/backups/pre-upgrade-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup main config
if [ -f "$HOME/.mstack/config.yaml" ]; then
  cp "$HOME/.mstack/config.yaml" "$BACKUP_DIR/config.yaml"
  echo "Backed up config.yaml → $BACKUP_DIR/config.yaml"
else
  echo "No config.yaml found at ~/.mstack/config.yaml — skipping"
fi

# Backup brand contexts directory if it exists
if [ -d "$HOME/.mstack/brands" ]; then
  cp -r "$HOME/.mstack/brands" "$BACKUP_DIR/brands"
  echo "Backed up brands/ → $BACKUP_DIR/brands/"
fi

# Record the pre-upgrade git ref so rollback is easy
cd "$INSTALL_DIR"
PRE_UPGRADE_REF=$(git rev-parse HEAD)
echo "$PRE_UPGRADE_REF" > "$BACKUP_DIR/pre-upgrade-ref.txt"
echo "$BACKUP_DIR" > "$HOME/.mstack/backups/latest"
echo "Pre-upgrade commit: $PRE_UPGRADE_REF"
echo "Backup complete: $BACKUP_DIR"
```

## Step 5: Apply Upgrade

```bash
cd "$INSTALL_DIR"

if [ -n "$(git status --short)" ]; then
  echo "ERROR: local changes present. Stash explicitly with git stash push -u before upgrading, or commit them."
  git status --short
  exit 1
fi

# Preview the exact diff before applying
echo "=== Final diff preview (HEAD..origin/main) ==="
git diff HEAD..origin/main --stat 2>/dev/null

# Fast-forward only
BRANCH=$(git branch --show-current 2>/dev/null || echo main)
git merge --ff-only "origin/${BRANCH:-main}" 2>&1
PULL_STATUS=$?

if [ $PULL_STATUS -ne 0 ]; then
  echo "ERROR: fast-forward upgrade failed (exit $PULL_STATUS). Rollback instructions below."
  echo "To revert: cd $INSTALL_DIR && git reset --hard $PRE_UPGRADE_REF"
  exit 1
fi

# Read new version
if [ -f "VERSION" ]; then
  NEW_VERSION=$(cat VERSION | tr -d '[:space:]')
else
  NEW_VERSION=$(grep '"version"' package.json 2>/dev/null \
    | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
fi

echo "Upgraded: ${LOCAL_VERSION:-unknown} → ${NEW_VERSION:-unknown}"
```

Re-run setup to regenerate skills:

```bash
cd "$INSTALL_DIR"

if [ -x "./setup" ]; then
  bash ./setup --host "$SETUP_HOST" 2>&1
  SETUP_STATUS=$?
  if [ $SETUP_STATUS -ne 0 ]; then
    echo "ERROR: setup failed (exit $SETUP_STATUS)"
    exit $SETUP_STATUS
  fi
  echo "Setup: success"
elif [ -x "./install.sh" ]; then
  bash ./install.sh 2>&1
else
  echo "No setup script found — skills may need manual registration"
fi
```

## Step 6: Post-Upgrade Verification

Verify the upgrade landed correctly:

```bash
cd "$INSTALL_DIR"

echo "=== Version check ==="
if [ -f "VERSION" ]; then
  echo "VERSION file: $(cat VERSION | tr -d '[:space:]')"
fi

echo ""
echo "=== Git status ==="
git log --oneline -3 2>/dev/null
git status --short 2>/dev/null

echo ""
echo "=== Skill count ==="
# Count registered skills in host install locations
CLAUDE_COUNT=$(ls "$HOME/.claude/skills/" 2>/dev/null | wc -l | tr -d ' ')
CODEX_COUNT=$(ls "$HOME/.codex/skills/" 2>/dev/null | wc -l | tr -d ' ')
LOCAL_CODEX_COUNT=$(ls "$(pwd)/.agents/skills/" 2>/dev/null | wc -l | tr -d ' ')
echo "Claude skills:      $CLAUDE_COUNT"
echo "Codex skills:       $CODEX_COUNT"
echo "Local Codex skills: $LOCAL_CODEX_COUNT"

echo ""
echo "=== Config survived? ==="
if [ -f "$HOME/.mstack/config.yaml" ]; then
  echo "config.yaml: present ($(wc -l < "$HOME/.mstack/config.yaml") lines)"
else
  echo "config.yaml: MISSING — restore from $BACKUP_DIR/config.yaml"
fi

echo ""
echo "=== Test suite ==="
if command -v bun >/dev/null 2>&1 && [ -f "package.json" ] && grep -q '"test"' package.json 2>/dev/null; then
  bun test 2>&1
  TEST_STATUS=$?
  [ $TEST_STATUS -eq 0 ] && echo "Tests: PASSED" || echo "Tests: FAILED (exit $TEST_STATUS)"
else
  echo "Tests: skipped (bun not available or no test script)"
fi
```

## Step 7: Rollback (if verification fails)

If any verification step fails, provide these rollback instructions:

```bash
# Rollback to the pre-upgrade commit
cd "$INSTALL_DIR"

# Read the saved ref
LATEST_BACKUP=$(cat "$HOME/.mstack/backups/latest" 2>/dev/null || true)
PRE_UPGRADE_REF=$(cat "$LATEST_BACKUP/pre-upgrade-ref.txt" 2>/dev/null)

if [ -n "$PRE_UPGRADE_REF" ]; then
  echo "Rolling back to: $PRE_UPGRADE_REF"
  git reset --hard "$PRE_UPGRADE_REF"
  echo "Rollback complete"
else
  echo "Ref file not found — use: git reflog | head -20"
  echo "Then: git reset --hard <commit-hash>"
fi

# Restore config if missing
if [ ! -f "$HOME/.mstack/config.yaml" ] && [ -n "$BACKUP_DIR" ]; then
  cp "$BACKUP_DIR/config.yaml" "$HOME/.mstack/config.yaml" 2>/dev/null \
    && echo "Config restored from backup"
fi

# Re-run setup after rollback
bash ./setup --host "$SETUP_HOST" 2>&1 || echo "Setup failed after rollback — check manually"
```

## Completion

**Upgrade succeeded:**
- Install type: {vendored|global}
- Previous version: v{old_version}
- New version: v{new_version}
- Backup saved: ~/.mstack/backups/pre-upgrade-{timestamp}/
- Setup: complete
- Skills registered: {count}
- Tests: passed|skipped

**Already up to date:**
- Version: v{version}
- Status: up to date

**Upgrade failed — rollback applied:**
- Error: {error_message}
- Rolled back to: {pre_upgrade_ref}
- Config: restored|intact
- Manual recovery: `cd {install_dir} && git reflog | head -20`

## Privacy Boundary

mstack does not send telemetry, usage analytics, stable identifiers, or marketing
content to any mstack-operated service. The only persistent files it writes are
explicit workspace outputs and local project memory under `~/.mstack/`.

Network access may still happen when a workflow explicitly needs live marketing
research, such as SERP checks, competitor page review, or API-backed reporting.
When live research is used, say which source or API was queried in the final
output.

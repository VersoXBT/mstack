# mstack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an open-source marketing skill suite for AI agents, modeled after gstack's infrastructure but with marketing-focused skills and a persistent brand context system.

**Architecture:** Thin fork of gstack's infrastructure (setup, gen:skill-docs, config, learnings, hosts, bin/). All engineering skills deleted. 21 new marketing skill templates. New brand context system. No compiled binaries. Pure SKILL.md templates.

**Tech Stack:** Bun (build scripts), TypeScript (gen:skill-docs, resolvers, host configs), Bash (bin/ CLI tools, setup script), Markdown (SKILL.md templates)

**Repo:** `https://github.com/VersoXBT/mstack` (private)
**Local:** `/Users/daniel/Desktop/mstack/`
**Spec:** `/Users/daniel/docs/superpowers/specs/2026-04-05-mstack-design.md`

---

## Phase 1: Infrastructure Fork & Rename

### Task 1: Copy gstack infrastructure files

**Files:**
- Create: `package.json`
- Create: `scripts/gen-skill-docs.ts`
- Create: `scripts/host-config.ts`
- Create: `scripts/host-config-export.ts`
- Create: `scripts/dev-skill.ts`
- Create: `scripts/skill-check.ts`
- Create: `scripts/resolvers/types.ts`
- Create: `scripts/resolvers/index.ts`
- Create: `hosts/claude.ts`
- Create: `hosts/codex.ts`
- Create: `hosts/index.ts`
- Create: `hosts/factory.ts`
- Create: `hosts/kiro.ts`
- Create: `hosts/opencode.ts`
- Create: `hosts/slate.ts`
- Create: `hosts/cursor.ts`
- Create: `hosts/openclaw.ts`
- Create: `bin/mstack-config`
- Create: `bin/mstack-slug`
- Create: `bin/mstack-learnings-log`
- Create: `bin/mstack-learnings-search`
- Create: `bin/mstack-update-check`
- Create: `bin/mstack-relink`
- Create: `bin/mstack-repo-mode`
- Create: `bin/mstack-timeline-log`
- Create: `setup`

- [ ] **Step 1: Copy infrastructure directories from gstack**

```bash
cd /Users/daniel/Desktop/mstack

# Copy scripts/ (build infrastructure)
cp -r ~/.claude/skills/gstack/scripts/ scripts/

# Copy hosts/ (multi-host configs)
cp -r ~/.claude/skills/gstack/hosts/ hosts/

# Copy bin/ tools (rename will happen in next task)
mkdir -p bin
for f in ~/.claude/skills/gstack/bin/gstack-config \
         ~/.claude/skills/gstack/bin/gstack-slug \
         ~/.claude/skills/gstack/bin/gstack-learnings-log \
         ~/.claude/skills/gstack/bin/gstack-learnings-search \
         ~/.claude/skills/gstack/bin/gstack-update-check \
         ~/.claude/skills/gstack/bin/gstack-relink \
         ~/.claude/skills/gstack/bin/gstack-repo-mode \
         ~/.claude/skills/gstack/bin/gstack-timeline-log; do
  base=$(basename "$f" | sed 's/gstack/mstack/')
  cp "$f" "bin/$base"
done

# Copy setup script
cp ~/.claude/skills/gstack/setup setup
chmod +x setup
```

- [ ] **Step 2: Copy package.json**

```bash
cp ~/.claude/skills/gstack/package.json package.json
```

- [ ] **Step 3: Delete gstack-specific files from scripts/resolvers/**

Remove resolvers that are engineering-specific. Keep only types.ts, index.ts, preamble.ts, learning.ts:

```bash
cd /Users/daniel/Desktop/mstack/scripts/resolvers

# Keep: types.ts, index.ts, preamble.ts, learning.ts
# Delete everything else
find . -name "*.ts" \
  ! -name "types.ts" \
  ! -name "index.ts" \
  ! -name "preamble.ts" \
  ! -name "learning.ts" \
  -exec rm {} +
```

- [ ] **Step 4: Delete gstack-specific files from scripts/**

Remove host adapters and other gstack-specific build scripts that reference browse/design:

```bash
cd /Users/daniel/Desktop/mstack/scripts
rm -rf host-adapters/ 2>/dev/null
```

- [ ] **Step 5: Verify copied files exist**

```bash
cd /Users/daniel/Desktop/mstack
ls -la setup package.json
ls scripts/gen-skill-docs.ts scripts/host-config.ts
ls scripts/resolvers/types.ts scripts/resolvers/index.ts scripts/resolvers/preamble.ts scripts/resolvers/learning.ts
ls hosts/claude.ts hosts/index.ts
ls bin/mstack-config bin/mstack-slug bin/mstack-learnings-log bin/mstack-learnings-search
```

Expected: All files exist.

- [ ] **Step 6: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add -A
git commit -m "chore: copy gstack infrastructure for mstack fork"
```

---

### Task 2: Rename all gstack references to mstack

**Files:**
- Modify: All files in `bin/`
- Modify: `setup`
- Modify: `package.json`
- Modify: All files in `hosts/`
- Modify: All files in `scripts/`

- [ ] **Step 1: Rename in bin/ scripts**

All bin/ scripts need `gstack` replaced with `mstack`, `GSTACK` with `MSTACK`, `~/.gstack` with `~/.mstack`:

```bash
cd /Users/daniel/Desktop/mstack

for f in bin/mstack-*; do
  sed -i '' \
    -e 's/gstack-config/mstack-config/g' \
    -e 's/gstack-slug/mstack-slug/g' \
    -e 's/gstack-learnings-log/mstack-learnings-log/g' \
    -e 's/gstack-learnings-search/mstack-learnings-search/g' \
    -e 's/gstack-update-check/mstack-update-check/g' \
    -e 's/gstack-relink/mstack-relink/g' \
    -e 's/gstack-repo-mode/mstack-repo-mode/g' \
    -e 's/gstack-timeline-log/mstack-timeline-log/g' \
    -e 's/gstack-patch-names/mstack-patch-names/g' \
    -e 's/gstack-telemetry-log/mstack-telemetry-log/g' \
    -e 's/GSTACK_HOME/MSTACK_HOME/g' \
    -e 's/GSTACK_STATE_DIR/MSTACK_STATE_DIR/g' \
    -e 's/GSTACK_DIR/MSTACK_DIR/g' \
    -e 's/~\/.gstack/~\/.mstack/g' \
    -e 's/\.gstack\//\.mstack\//g' \
    -e 's/skills\/gstack/skills\/mstack/g' \
    -e 's/gstack setup/mstack setup/g' \
    -e 's/gstack v/mstack v/g' \
    "$f"
done
chmod +x bin/*
```

- [ ] **Step 2: Rename in setup script**

```bash
cd /Users/daniel/Desktop/mstack

sed -i '' \
  -e 's/gstack/mstack/g' \
  -e 's/GSTACK/MSTACK/g' \
  "$PWD/setup"
```

- [ ] **Step 3: Rename in package.json**

```bash
cd /Users/daniel/Desktop/mstack

sed -i '' \
  -e 's/"name": "gstack"/"name": "mstack"/' \
  -e 's/gstack/mstack/g' \
  package.json
```

- [ ] **Step 4: Rename in hosts/**

```bash
cd /Users/daniel/Desktop/mstack

for f in hosts/*.ts; do
  sed -i '' \
    -e "s/'gstack'/'mstack'/g" \
    -e 's/gstack/mstack/g' \
    -e 's/GSTACK/MSTACK/g' \
    "$f"
done
```

- [ ] **Step 5: Rename in scripts/**

```bash
cd /Users/daniel/Desktop/mstack

for f in scripts/*.ts scripts/resolvers/*.ts; do
  [ -f "$f" ] && sed -i '' \
    -e 's/gstack/mstack/g' \
    -e 's/GSTACK/MSTACK/g' \
    "$f"
done
```

- [ ] **Step 6: Verify no gstack references remain**

```bash
cd /Users/daniel/Desktop/mstack
grep -r "gstack" --include="*.ts" --include="*.json" --include="*.sh" bin/ scripts/ hosts/ setup package.json || echo "CLEAN: No gstack references found"
```

Expected: `CLEAN: No gstack references found` (or only references in comments explaining the fork origin, which are acceptable).

- [ ] **Step 7: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add -A
git commit -m "chore: rename all gstack references to mstack"
```

---

### Task 3: Clean up setup script for mstack

The setup script needs to be stripped of browse/design binary builds and adapted for a template-only project.

**Files:**
- Modify: `setup`

- [ ] **Step 1: Read current setup to understand structure**

Read the full setup file and identify sections to remove (browse binary builds, design binary builds, Playwright bootstrap, bun compilation steps).

- [ ] **Step 2: Rewrite setup script**

Replace the setup script with a simplified version. The core logic:
1. Detect hosts
2. Prompt for skill prefix
3. Generate SKILL.md files (or use pre-generated)
4. Create skill symlink directories
5. Init config
6. Detect optional gstack browse
7. Report available API keys

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "mstack setup — marketing skill suite for AI agents"
echo ""

# --- Detect install location ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MSTACK_DIR="$SCRIPT_DIR"

# --- Detect platform ---
OS="$(uname -s)"
case "$OS" in
  Darwin*) PLATFORM="macos" ;;
  Linux*)  PLATFORM="linux" ;;
  MINGW*|MSYS*|CYGWIN*) PLATFORM="windows" ;;
  *) PLATFORM="unknown" ;;
esac

# --- Init config ---
mkdir -p ~/.mstack
CONFIG_FILE=~/.mstack/config.yaml

if [ ! -f "$CONFIG_FILE" ]; then
  cat > "$CONFIG_FILE" << 'YAML'
# mstack configuration
proactive: true
skill_prefix: true
telemetry: off
auto_upgrade: false
browse_path: ""
default_language: "en"
YAML
  echo "Created config: $CONFIG_FILE"
fi

# --- Skill prefix preference ---
CURRENT_PREFIX=$("$MSTACK_DIR/bin/mstack-config" get skill_prefix 2>/dev/null || echo "true")

if [ ! -f ~/.mstack/.prefix-prompted ]; then
  echo "Skill naming preference:"
  echo "  A) Prefixed:  /m-write, /m-audit, /m-ads (recommended, avoids collisions)"
  echo "  B) Short:     /write, /audit, /ads"
  echo ""
  read -r -p "Choose [A/B]: " PREFIX_CHOICE
  case "$PREFIX_CHOICE" in
    [bB]) "$MSTACK_DIR/bin/mstack-config" set skill_prefix false; CURRENT_PREFIX="false" ;;
    *)    "$MSTACK_DIR/bin/mstack-config" set skill_prefix true; CURRENT_PREFIX="true" ;;
  esac
  touch ~/.mstack/.prefix-prompted
fi

# --- Detect hosts ---
HOSTS=()
command -v claude >/dev/null 2>&1 && HOSTS+=("claude")
command -v codex >/dev/null 2>&1 && HOSTS+=("codex")
command -v kiro >/dev/null 2>&1 && HOSTS+=("kiro")

if [ ${#HOSTS[@]} -eq 0 ]; then
  HOSTS=("claude")
  echo "No AI agents detected, defaulting to claude"
fi

echo "Detected hosts: ${HOSTS[*]}"

# --- Generate SKILL.md files if bun available ---
if command -v bun >/dev/null 2>&1; then
  echo "Generating SKILL.md files..."
  cd "$MSTACK_DIR"
  for host in "${HOSTS[@]}"; do
    bun run scripts/gen-skill-docs.ts --host "$host" 2>/dev/null || true
  done
else
  echo "bun not found — using pre-generated SKILL.md files"
fi

# --- Create skill symlink directories ---
SKILL_DIRS=(
  brand competitive positioning icp strategy
  audit keywords brief write edit seo
  social threads engage
  ads landing
  repurpose calendar report learn mstack-upgrade
)

# Determine target skill root
if [ -d ~/.claude/skills ]; then
  SKILL_ROOT=~/.claude/skills
else
  SKILL_ROOT=~/.claude/skills
  mkdir -p "$SKILL_ROOT"
fi

for skill in "${SKILL_DIRS[@]}"; do
  if [ "$CURRENT_PREFIX" = "true" ]; then
    TARGET_NAME="m-$skill"
  else
    TARGET_NAME="$skill"
  fi

  TARGET_DIR="$SKILL_ROOT/$TARGET_NAME"
  mkdir -p "$TARGET_DIR"

  # Symlink SKILL.md
  if [ -f "$MSTACK_DIR/$skill/SKILL.md" ]; then
    ln -sf "$MSTACK_DIR/$skill/SKILL.md" "$TARGET_DIR/SKILL.md"
  fi
done

# --- Detect optional gstack browse ---
BROWSE_PATH=""
if [ -x ~/.claude/skills/gstack/browse/dist/browse ]; then
  BROWSE_PATH=~/.claude/skills/gstack/browse/dist/browse
  "$MSTACK_DIR/bin/mstack-config" set browse_path "$BROWSE_PATH"
  echo "gstack browse detected: $BROWSE_PATH"
else
  echo "gstack browse not found (optional — skills work without it)"
fi

# --- Check for marketing API keys ---
echo ""
echo "API key detection:"
[ -n "${SEMRUSH_API_KEY:-}" ] && echo "  SEMRUSH_API_KEY: found" || echo "  SEMRUSH_API_KEY: not set"
[ -n "${AHREFS_API_KEY:-}" ] && echo "  AHREFS_API_KEY: not set" || echo "  AHREFS_API_KEY: not set"
[ -n "${GA4_CREDENTIALS:-}" ] && echo "  GA4_CREDENTIALS: found" || echo "  GA4_CREDENTIALS: not set"
[ -n "${SEARCH_CONSOLE_CREDENTIALS:-}" ] && echo "  SEARCH_CONSOLE_CREDENTIALS: found" || echo "  SEARCH_CONSOLE_CREDENTIALS: not set"
echo "(API keys are optional — skills adapt based on availability)"

echo ""
echo "mstack setup complete!"
echo "  Config: ~/.mstack/config.yaml"
echo "  Skills: ${#SKILL_DIRS[@]} marketing skills registered"
echo "  Prefix: $([ "$CURRENT_PREFIX" = "true" ] && echo "/m-*" || echo "short names")"
echo ""
echo "Get started: run /m-brand to set up your brand context"
```

- [ ] **Step 3: Make setup executable and test it runs**

```bash
cd /Users/daniel/Desktop/mstack
chmod +x setup
# Don't run it yet — skills don't exist yet. Just verify syntax:
bash -n setup && echo "Syntax OK"
```

Expected: `Syntax OK`

- [ ] **Step 4: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add setup
git commit -m "feat: rewrite setup script for mstack (no binaries, template-only)"
```

---

### Task 4: Clean up package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Rewrite package.json**

Strip browse/design binary build steps, remove playwright/puppeteer deps:

```json
{
  "name": "mstack",
  "version": "1.0.0",
  "description": "Marketing skill suite for AI agents",
  "scripts": {
    "build": "bun run gen:skill-docs --host all",
    "gen:skill-docs": "bun run scripts/gen-skill-docs.ts",
    "test": "bun test",
    "test:evals": "bun run test/skill-llm-eval.test.ts",
    "skill:check": "bun run scripts/skill-check.ts",
    "dev:skill": "bun run scripts/dev-skill.ts"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.78.0",
    "diff": "^7.0.0"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add package.json
git commit -m "chore: simplify package.json for template-only project"
```

---

### Task 5: Create new marketing resolvers

**Files:**
- Create: `scripts/resolvers/brand.ts`
- Create: `scripts/resolvers/browse-optional.ts`
- Create: `scripts/resolvers/api-keys.ts`
- Modify: `scripts/resolvers/index.ts`

- [ ] **Step 1: Create brand.ts resolver**

```typescript
// scripts/resolvers/brand.ts
import type { TemplateContext } from './types';

/**
 * {{BRAND_CONTEXT}} resolver
 * Injects bash that reads brand.yaml and outputs a condensed summary.
 * Falls back to "BRAND: not configured" if file doesn't exist.
 */
export function resolveBrandContext(_ctx: TemplateContext): string {
  return `
## Brand Context (run this check)

\`\`\`bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
_BRAND_FILE="\${MSTACK_HOME:-$HOME/.mstack}/projects/\${SLUG:-unknown}/brand.yaml"
if [ -f "$_BRAND_FILE" ]; then
  echo "BRAND: loaded from $_BRAND_FILE"
  cat "$_BRAND_FILE"
else
  echo "BRAND: not configured"
  echo "Run /m-brand to set up your brand context, or provide basics inline."
fi
\`\`\`

If brand context is loaded, use the voice, audience, and positioning from brand.yaml
for all content in this skill. If not configured, ask the user for:
1. Target audience
2. Tone (formal, casual, technical, friendly)
3. Any phrases or terms to avoid
`.trim();
}
```

- [ ] **Step 2: Create browse-optional.ts resolver**

```typescript
// scripts/resolvers/browse-optional.ts
import type { TemplateContext } from './types';

/**
 * {{BROWSE_OPTIONAL}} resolver
 * Detects gstack browse binary. Sets $B if found, or injects fallback guidance.
 */
export function resolveBrowseOptional(_ctx: TemplateContext): string {
  return `
## Browse Detection (optional)

\`\`\`bash
_BROWSE_PATH=$(~/.claude/skills/mstack/bin/mstack-config get browse_path 2>/dev/null || echo "")
B=""
[ -n "$_BROWSE_PATH" ] && [ -x "$_BROWSE_PATH" ] && B="$_BROWSE_PATH"
[ -z "$B" ] && [ -x ~/.claude/skills/gstack/browse/dist/browse ] && B=~/.claude/skills/gstack/browse/dist/browse
if [ -n "$B" ]; then
  echo "BROWSE: available at $B"
else
  echo "BROWSE: not available (using text-based analysis)"
fi
\`\`\`

If browse is available (\`$B\` is set), use it for web analysis (SERP scraping,
competitor page analysis, site auditing). If not available, fall back to:
- WebSearch/WebFetch tools if available
- Asking the user to paste content or provide URLs
`.trim();
}
```

- [ ] **Step 3: Create api-keys.ts resolver**

```typescript
// scripts/resolvers/api-keys.ts
import type { TemplateContext } from './types';

/**
 * {{API_KEYS}} resolver
 * Checks environment for marketing API keys and reports availability.
 */
export function resolveApiKeys(_ctx: TemplateContext): string {
  return `
## API Key Detection

\`\`\`bash
echo "API keys:"
[ -n "\${SEMRUSH_API_KEY:-}" ] && echo "  SEMRUSH: available" || echo "  SEMRUSH: not set"
[ -n "\${AHREFS_API_KEY:-}" ] && echo "  AHREFS: available" || echo "  AHREFS: not set"
[ -n "\${GA4_CREDENTIALS:-}" ] && echo "  GA4: available" || echo "  GA4: not set"
[ -n "\${SEARCH_CONSOLE_CREDENTIALS:-}" ] && echo "  SEARCH_CONSOLE: available" || echo "  SEARCH_CONSOLE: not set"
[ -n "\${OPENAI_API_KEY:-}" ] && echo "  OPENAI: available" || echo "  OPENAI: not set"
\`\`\`

Adapt your approach based on available APIs:
- **SEMRUSH/AHREFS available**: Use API for keyword data, backlink analysis, domain metrics
- **GA4 available**: Pull real traffic data for reports
- **No APIs**: Use browse-based SERP analysis, or ask user to provide data
`.trim();
}
```

- [ ] **Step 4: Update resolver index**

Read the current `scripts/resolvers/index.ts` and add the new resolvers. The file maps placeholder names to resolver functions:

```typescript
// scripts/resolvers/index.ts
import { resolveBrandContext } from './brand';
import { resolveBrowseOptional } from './browse-optional';
import { resolveApiKeys } from './api-keys';
import { resolvePreamble } from './preamble';
import { resolveLearnings, resolveOperationalLearning } from './learning';

export type ResolverFn = (ctx: import('./types').TemplateContext) => string;

export const RESOLVERS: Record<string, ResolverFn> = {
  PREAMBLE: resolvePreamble,
  BRAND_CONTEXT: resolveBrandContext,
  BROWSE_OPTIONAL: resolveBrowseOptional,
  API_KEYS: resolveApiKeys,
  LEARNINGS_SEARCH: resolveLearnings,
  OPERATIONAL_LEARNING: resolveOperationalLearning,
};
```

Note: The actual index.ts may have a different structure from gstack. Read it first, then adapt. The key point is registering the 3 new resolvers alongside the kept ones.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /Users/daniel/Desktop/mstack
bun run scripts/resolvers/index.ts 2>&1 || echo "Check imports"
```

- [ ] **Step 6: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add scripts/resolvers/brand.ts scripts/resolvers/browse-optional.ts scripts/resolvers/api-keys.ts scripts/resolvers/index.ts
git commit -m "feat: add brand, browse-optional, and api-keys resolvers"
```

---

### Task 6: Create mstack-brand CLI helper

**Files:**
- Create: `bin/mstack-brand`

- [ ] **Step 1: Write mstack-brand script**

```bash
#!/usr/bin/env bash
# mstack-brand — read/write brand context
set -euo pipefail

eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || SLUG="unknown"
MSTACK_HOME="${MSTACK_HOME:-$HOME/.mstack}"
BRAND_DIR="$MSTACK_HOME/projects/${SLUG}"
BRAND_FILE="$BRAND_DIR/brand.yaml"

case "${1:-read}" in
  read)
    if [ -f "$BRAND_FILE" ]; then
      cat "$BRAND_FILE"
    else
      echo "NO_BRAND"
    fi
    ;;
  write)
    mkdir -p "$BRAND_DIR"
    # Read from stdin
    cat > "$BRAND_FILE"
    echo "Brand context saved to $BRAND_FILE"
    ;;
  path)
    echo "$BRAND_FILE"
    ;;
  exists)
    [ -f "$BRAND_FILE" ] && echo "true" || echo "false"
    ;;
  *)
    echo "Usage: mstack-brand [read|write|path|exists]"
    echo "  read   — output brand.yaml (or NO_BRAND)"
    echo "  write  — write stdin to brand.yaml"
    echo "  path   — print brand.yaml path"
    echo "  exists — print true/false"
    exit 1
    ;;
esac
```

- [ ] **Step 2: Make executable**

```bash
chmod +x /Users/daniel/Desktop/mstack/bin/mstack-brand
```

- [ ] **Step 3: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add bin/mstack-brand
git commit -m "feat: add mstack-brand CLI helper for brand context"
```

---

## Phase 2: Root Skill Template & First Skills

### Task 7: Create root SKILL.md.tmpl

**Files:**
- Create: `SKILL.md.tmpl`

- [ ] **Step 1: Write root template**

This is the entry point when a user invokes mstack directly. It shows available skills and runs the preamble.

```markdown
---
name: mstack
preamble-tier: 1
version: 1.0.0
description: |
  Marketing skill suite for AI agents. 21 skills covering SEO/Content, Social Media,
  Paid Ads, and Brand/Strategy. Unified by a persistent brand context that ensures
  consistent voice across all marketing workflows. Use /m-brand to get started.
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

{{PREAMBLE}}

# mstack — Marketing Skill Suite

## Available Skills

### Foundation
| Skill | Purpose |
|-------|---------|
| `/m-brand` | Brand workshop — set up voice, audience, positioning |
| `/m-competitive` | Competitor analysis |
| `/m-positioning` | Positioning & messaging framework |
| `/m-icp` | Ideal customer profile |
| `/m-strategy` | Marketing strategy & 90-day roadmap |

### SEO & Content
| Skill | Purpose |
|-------|---------|
| `/m-audit` | Full marketing audit (SEO + content + social) |
| `/m-keywords` | Keyword research & content gaps |
| `/m-brief` | Content brief from topic or keyword |
| `/m-write` | Blog posts, articles, page copy |
| `/m-edit` | Copy editing against brand voice |
| `/m-seo` | On-page SEO optimization |

### Social Media
| Skill | Purpose |
|-------|---------|
| `/m-social` | Platform-specific social posts |
| `/m-threads` | Twitter/X thread writing |
| `/m-engage` | Community engagement responses |

### Paid Ads
| Skill | Purpose |
|-------|---------|
| `/m-ads` | Ad campaign creation (Google, Meta, LinkedIn) |
| `/m-landing` | Landing page copy |

### Utility
| Skill | Purpose |
|-------|---------|
| `/m-repurpose` | Atomize content across platforms |
| `/m-calendar` | Content calendar planning |
| `/m-report` | Marketing performance report |
| `/m-learn` | View/search marketing learnings |
| `/m-upgrade` | Update mstack |

## Getting Started

1. Run `/m-brand` to set up your brand context (voice, audience, positioning)
2. Run `/m-strategy` to create a marketing strategy
3. Use content skills (`/m-write`, `/m-social`, `/m-ads`) for day-to-day work

Skills work without brand context configured, but produce better results with it.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add SKILL.md.tmpl
git commit -m "feat: add root SKILL.md.tmpl with skill overview"
```

---

### Task 8: Create /m-brand skill (foundation)

**Files:**
- Create: `brand/SKILL.md.tmpl`

- [ ] **Step 1: Write brand workshop skill template**

```markdown
---
name: m-brand
preamble-tier: 1
version: 1.0.0
description: |
  Brand workshop — guided setup for your brand context. Defines voice, audience,
  positioning, competitors, and channels. Creates brand.yaml that all mstack skills
  reference for consistent messaging. Run once per project, update anytime.
  Use when asked to "set up brand", "define brand voice", or "configure mstack".
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
---

{{PREAMBLE}}

# Brand Workshop

## Setup

Check if brand context already exists:

```bash
BRAND_EXISTS=$(~/.claude/skills/mstack/bin/mstack-brand exists)
echo "BRAND_EXISTS: $BRAND_EXISTS"
if [ "$BRAND_EXISTS" = "true" ]; then
  echo "Current brand:"
  ~/.claude/skills/mstack/bin/mstack-brand read
fi
```

If brand exists, use AskUserQuestion:
> "You already have a brand context configured. Do you want to:
> A) Update it (guided walkthrough)
> B) View it and make specific edits
> C) Start fresh"

If brand does not exist, proceed to Step 1.

## Step 1: Core Identity

Use AskUserQuestion:
> "Let's set up your brand. What's the name of your product/company?"

After they answer, ask:
> "In one sentence, what does it do? (e.g., 'On-chain analytics platform for DeFi traders')"

## Step 2: Target Audience

Use AskUserQuestion:
> "Who is your primary audience? Describe them in 1-2 sentences.
> (e.g., 'DeFi developers who need real-time on-chain data for trading bots')"

Then ask:
> "What are their top 2-3 pain points?
> (e.g., 'Slow data, fragmented tools, no alerts')"

Then ask:
> "Do you have a secondary audience? If so, describe them briefly. If not, say 'no'."

## Step 3: Competitors

Use AskUserQuestion:
> "Name 2-4 competitors. For each, what's their main weakness?
> Format: CompetitorName — weakness
> (e.g., 'Dune — slow, query-based, not real-time')"

## Step 4: Positioning

Use AskUserQuestion:
> "What makes you different from these competitors? One sentence.
> (e.g., 'Real-time on-chain analytics built for developers, not analysts')"

## Step 5: Brand Voice

Use AskUserQuestion:
> "How should your brand sound? Pick the closest match or describe your own:
> A) Technical and precise — like Stripe's docs
> B) Casual and friendly — like a smart friend explaining things
> C) Bold and opinionated — like a founder's blog
> D) Professional and authoritative — like McKinsey
> E) Custom — describe it yourself"

Then ask:
> "Any words or phrases to AVOID in your content?
> (e.g., 'no corporate buzzwords, no emojis, no exclamation marks')"

Then ask:
> "Paste 1-2 sentences that sound like your brand. This could be from your website, a tweet,
> or just something you'd write. These become reference examples for AI-generated content."

## Step 6: Channels

Use AskUserQuestion:
> "Which marketing channels are you actively using? (comma-separated)
> e.g., Twitter/X, Blog, Discord, LinkedIn, Reddit, YouTube, Newsletter, TikTok"

Then ask:
> "Any channels you're planning to add? (comma-separated, or 'none')"

## Step 7: Keywords (optional)

Use AskUserQuestion:
> "What are 3-5 keywords or phrases your audience searches for?
> (e.g., 'on-chain analytics, DeFi dashboard, blockchain data API')
> Say 'skip' if you're not sure — you can add these later with /m-keywords."

## Step 8: URLs

Use AskUserQuestion:
> "Share any relevant URLs (website, social profiles, blog). One per line.
> Say 'skip' if not ready."

## Step 9: Generate brand.yaml

Assemble all answers into brand.yaml format:

```yaml
name: "{name}"
tagline: "{tagline}"
voice:
  tone: "{tone from step 5}"
  personality: "{personality description}"
  avoid: ["{avoid items}"]
  examples:
    - "{example sentence 1}"
    - "{example sentence 2}"
audience:
  primary:
    description: "{primary audience}"
    pain_points: ["{pain 1}", "{pain 2}", "{pain 3}"]
    channels: ["{channels}"]
  secondary:
    description: "{secondary audience or 'none'}"
    pain_points: ["{pain points}"]
    channels: ["{channels}"]
positioning:
  category: "{category}"
  differentiator: "{differentiator}"
  competitors:
    - name: "{competitor 1}"
      weakness: "{weakness}"
    - name: "{competitor 2}"
      weakness: "{weakness}"
channels:
  active: ["{active channels}"]
  planned: ["{planned channels}"]
keywords:
  primary: ["{keywords}"]
  secondary: []
urls:
  website: "{url}"
```

Present the generated YAML to the user. Use AskUserQuestion:
> "Here's your brand context. Does this look right?
> A) Yes, save it
> B) I want to change something"

If B, ask what to change, update, and re-present.

## Step 10: Save

Write the approved YAML to brand.yaml:

```bash
~/.claude/skills/mstack/bin/mstack-brand write << 'BRAND_EOF'
{the approved yaml content}
BRAND_EOF
```

## Completion

Report:
- Brand context saved to `~/.mstack/projects/{slug}/brand.yaml`
- Fields configured: voice, audience, positioning, competitors, channels

Suggest next steps:
- "Run `/m-strategy` to build a marketing strategy based on this brand context"
- "Run `/m-competitive` for a deeper competitor analysis"
- "Run `/m-write` to start creating content in your brand voice"

{{OPERATIONAL_LEARNING}}

{{TELEMETRY}}
```

- [ ] **Step 2: Create brand directory**

```bash
mkdir -p /Users/daniel/Desktop/mstack/brand
```

- [ ] **Step 3: Save the template**

Save the content above to `brand/SKILL.md.tmpl`.

- [ ] **Step 4: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add brand/
git commit -m "feat: add /m-brand workshop skill"
```

---

### Task 9: Create /m-write skill (content creation)

**Files:**
- Create: `write/SKILL.md.tmpl`

- [ ] **Step 1: Write content creation skill template**

```markdown
---
name: m-write
preamble-tier: 2
version: 1.0.0
description: |
  Write marketing content in your brand voice. Blog posts, articles, landing pages,
  email copy. Reads brand context for tone, audience, and positioning. Produces
  publish-ready content with SEO basics. Use when asked to "write a blog post",
  "draft content", "write copy", or "create an article".
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

{{PREAMBLE}}

{{BRAND_CONTEXT}}

## Setup

Parse the user's request. Determine:
- **Content type**: blog post, article, landing page, email, or other
- **Topic**: what to write about
- **Target keyword**: if provided, or ask
- **Word count**: if specified, or use defaults (blog: 1200-1800, landing: 600-1000, email: 300-500)
- **Brief**: if the user ran /m-brief first, check for a brief file in the project

If brand context is not configured and the preamble reported `BRAND: not configured`,
ask these questions before writing:
1. Who is the target audience for this piece?
2. What tone — formal, casual, technical, friendly?
3. Any phrases or terms to avoid?

If the user didn't specify a target keyword, use AskUserQuestion:
> "What's the main keyword or topic for this piece? This helps with SEO and focus."

## Step 1: Research

{{BROWSE_OPTIONAL}}

If browse is available ($B is set):
```bash
$B goto "https://www.google.com/search?q={target keyword}"
$B text
```

Analyze top 3-5 search results for:
- Common structure and headings
- Content depth and word count
- Angles and gaps to exploit
- Questions people ask (People Also Ask)

If browse is not available, use WebSearch if available, or ask the user:
> "Any reference articles or competitor content I should look at?"

## Step 2: Outline

Present an outline before writing:

```
Title: {title with target keyword}
Meta description: {~155 chars}

H2: {section 1}
  - {key point}
  - {key point}
H2: {section 2}
  - {key point}
H2: {section 3}
  - {key point}
...
CTA: {what the reader should do next}
```

Use AskUserQuestion:
> "Here's the outline. Want me to adjust anything before writing?"

STOP and wait for approval.

## Step 3: Write

Write the full content following these rules:

**Brand voice** (from brand.yaml):
- Match the tone and personality
- Use the voice examples as reference
- Avoid words/phrases in the avoid list

**SEO basics:**
- Target keyword in title, first paragraph, and 2-3 H2 headings
- Meta description under 155 characters with keyword
- Natural keyword usage (not stuffed)

**Writing quality:**
- Short paragraphs (2-3 sentences max)
- No AI vocabulary: never use "delve", "crucial", "robust", "comprehensive",
  "landscape", "game-changer", "leverage", "utilize", "in today's world"
- Active voice
- Specific examples over vague claims
- End with a clear CTA

**Format:**
- Start with frontmatter (title, meta, date, author)
- Use H2 for main sections, H3 for subsections
- Include a TL;DR or key takeaway at the top for blog posts

Save to the file path the user specifies, or use AskUserQuestion:
> "Where should I save this? (default: `content/{slug}-{date}.md`)"

## Step 4: Self-Edit

Review the draft against brand voice. Check:
1. Does it match the tone from brand.yaml?
2. Any AI vocabulary that slipped through? (check the avoid list above)
3. Are all paragraphs under 4 sentences?
4. Is the CTA clear and specific?
5. Does the opening hook grab attention in the first sentence?

Fix issues inline without asking. This is a quality pass, not a rewrite.

## Completion

Report:
- Content type and title
- Word count
- Target keyword
- File path where saved

Suggest next steps:
- "Run `/m-edit` for a deeper copy edit against your brand voice"
- "Run `/m-seo` to optimize on-page SEO elements"
- "Run `/m-repurpose` to create social posts from this content"

{{OPERATIONAL_LEARNING}}

{{TELEMETRY}}
```

- [ ] **Step 2: Create directory and save**

```bash
mkdir -p /Users/daniel/Desktop/mstack/write
```

Save the content above to `write/SKILL.md.tmpl`.

- [ ] **Step 3: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add write/
git commit -m "feat: add /m-write content creation skill"
```

---

### Task 10: Create /m-strategy skill (foundation)

**Files:**
- Create: `strategy/SKILL.md.tmpl`

- [ ] **Step 1: Write strategy skill template**

```markdown
---
name: m-strategy
preamble-tier: 4
version: 1.0.0
description: |
  Build a marketing strategy with channel priorities, messaging framework, and
  90-day roadmap. Reads brand context, competitive analysis, and ICP if available.
  Produces a structured strategy document. Use when asked to "create marketing
  strategy", "plan marketing", or "build go-to-market".
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

{{PREAMBLE}}

{{BRAND_CONTEXT}}

{{API_KEYS}}

{{LEARNINGS_SEARCH}}

{{BROWSE_OPTIONAL}}

## Setup

Check for existing artifacts that inform the strategy:

```bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
PROJECT_DIR="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}"

# Check for brand context
[ -f "$PROJECT_DIR/brand.yaml" ] && echo "BRAND: found" || echo "BRAND: not found"

# Check for previous strategy docs
find . -name "*strategy*" -o -name "*marketing-plan*" 2>/dev/null | head -5
```

If brand context is not configured, strongly recommend running /m-brand first:
> "I recommend running `/m-brand` first to set up your brand context. It takes 5 minutes
> and makes the strategy much more targeted. Want to do that now, or proceed without it?"

STOP and wait for response.

## Step 1: Audit Current State

If browse is available, analyze the user's current web presence:
```bash
$B goto "{website URL from brand.yaml}"
$B text
$B links
```

If not, ask:
> "Brief overview of your current marketing: what channels are you using,
> what's working, what's not? (2-3 sentences is fine)"

## Step 2: Define Goals

Use AskUserQuestion:
> "What's your primary marketing goal for the next 90 days?
> A) Brand awareness — get known in your space
> B) Lead generation — drive signups, demos, waitlist
> C) User activation — get existing users to engage more
> D) Community building — grow an engaged audience
> E) Other — describe it"

Then ask:
> "Any specific metric targets? (e.g., '1000 Twitter followers', '500 signups',
> '10 blog posts published'). Say 'no specific targets' if unsure."

## Step 3: Channel Strategy

Based on brand.yaml channels, audience, and goals, recommend a channel mix.

For each recommended channel, provide:
- **Why this channel**: how it connects to the audience and goals
- **Content type**: what to post (threads, articles, short-form, etc.)
- **Frequency**: realistic cadence
- **KPI**: what to measure

Present as a table:

| Channel | Content Type | Frequency | KPI |
|---------|-------------|-----------|-----|
| Twitter/X | Threads, insights, engagement | 5x/week | Impressions, followers |
| Blog | SEO articles, tutorials | 2x/month | Organic traffic, time on page |
| ... | ... | ... | ... |

Use AskUserQuestion:
> "Does this channel mix look right? Want to add, remove, or adjust any channels?"

STOP and wait.

## Step 4: Messaging Framework

Based on positioning and audience, create:

1. **Primary message**: one sentence that captures the core value
2. **Supporting messages**: 3 pillar messages that expand on the primary
3. **Proof points**: evidence for each pillar (features, metrics, testimonials)
4. **Tone guidelines**: specific to this strategy (derived from brand voice)

Present and get approval.

## Step 5: 90-Day Roadmap

Break into 3 phases:

**Month 1: Foundation**
- Set up channels, create initial content, establish publishing cadence
- Specific deliverables with dates

**Month 2: Growth**
- Increase cadence, launch campaigns, engage community
- Specific deliverables with dates

**Month 3: Optimize**
- Analyze what worked, double down, cut what didn't
- Specific deliverables with dates

Include a week-by-week content calendar for Month 1.

## Step 6: Save Strategy Document

Save the complete strategy to a markdown file:

Use AskUserQuestion:
> "Where should I save the strategy document? (default: `docs/marketing-strategy-{date}.md`)"

Write the document with all sections: goals, channel strategy, messaging framework, 90-day roadmap.

## Completion

Report:
- Strategy document saved to {path}
- Channels covered: {list}
- 90-day roadmap: {month 1 focus}, {month 2 focus}, {month 3 focus}

Suggest next steps:
- "Run `/m-calendar` to build a detailed content calendar from this strategy"
- "Run `/m-brief` to create your first content brief"
- "Run `/m-keywords` to research keywords for your SEO content"

{{OPERATIONAL_LEARNING}}

{{TELEMETRY}}
```

- [ ] **Step 2: Create directory and save**

```bash
mkdir -p /Users/daniel/Desktop/mstack/strategy
```

Save the content above to `strategy/SKILL.md.tmpl`.

- [ ] **Step 3: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add strategy/
git commit -m "feat: add /m-strategy marketing strategy skill"
```

---

### Task 11: Create /m-ads skill (paid ads)

**Files:**
- Create: `ads/SKILL.md.tmpl`

- [ ] **Step 1: Write ads skill template**

```markdown
---
name: m-ads
preamble-tier: 3
version: 1.0.0
description: |
  Create ad campaigns for Google, Meta, or LinkedIn. Generates campaign structure,
  ad groups, headlines, descriptions, and audience targeting. Reads brand context
  for messaging alignment. Use when asked to "create ads", "write ad copy",
  "build a campaign", or "Google/Meta/LinkedIn ads".
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - AskUserQuestion
---

{{PREAMBLE}}

{{BRAND_CONTEXT}}

{{API_KEYS}}

{{LEARNINGS_SEARCH}}

## Setup

Use AskUserQuestion:
> "What platform are you creating ads for?
> A) Google Ads (Search)
> B) Google Ads (Display)
> C) Meta (Facebook/Instagram)
> D) LinkedIn Ads
> E) Multiple — I'll help with each"

Then ask:
> "What's the goal of this campaign?
> A) Drive traffic to a landing page
> B) Generate leads (signups, demos)
> C) Brand awareness
> D) App installs
> E) Retargeting existing visitors"

Then ask:
> "What's the product/feature you're promoting? (1-2 sentences)"

Then ask:
> "What's your monthly budget range?
> A) Under $500
> B) $500 - $2,000
> C) $2,000 - $10,000
> D) $10,000+
> E) Not sure yet"

## Step 1: Audience Definition

Based on brand.yaml audience and campaign goal, define targeting:

**For Google Search:**
- Target keywords (use brand.yaml keywords + campaign-specific)
- Negative keywords
- Match types (broad, phrase, exact)

**For Meta:**
- Demographics (age, location, interests)
- Custom audiences (website visitors, email list)
- Lookalike audiences

**For LinkedIn:**
- Job titles, industries, company size
- Skills, groups, interests

Present targeting and get approval via AskUserQuestion.

STOP and wait.

## Step 2: Campaign Structure

Create the campaign hierarchy:

```
Campaign: {campaign name}
├── Ad Group 1: {theme}
│   ├── Ad 1: {headline focus}
│   └── Ad 2: {headline focus}
├── Ad Group 2: {theme}
│   ├── Ad 1: {headline focus}
│   └── Ad 2: {headline focus}
└── Ad Group 3: {theme}
    ├── Ad 1: {headline focus}
    └── Ad 2: {headline focus}
```

## Step 3: Write Ad Copy

For each ad, write platform-specific copy:

**Google Search Ads:**
- 3 headlines (30 chars each)
- 2 descriptions (90 chars each)
- Display URL path
- Sitelink extensions (4)
- Callout extensions (4)

**Meta Ads:**
- Primary text (125 chars above fold)
- Headline (40 chars)
- Description (30 chars)
- CTA button choice
- Image/video guidance

**LinkedIn Ads:**
- Intro text (150 chars)
- Headline (70 chars)
- Description (100 chars)
- CTA choice

Write all copy in the brand voice from brand.yaml. Avoid the brand's avoid list.

For each ad group, write 2-3 ad variations for A/B testing.

## Step 4: Landing Page Alignment

Check if the landing page matches the ad messaging:
- Does the headline echo the ad headline?
- Is the CTA consistent?
- Does the page deliver on the ad's promise?

If no landing page exists, suggest:
> "Run `/m-landing` to create a landing page that matches these ads."

## Step 5: Save Campaign

Use AskUserQuestion:
> "Where should I save the campaign document? (default: `campaigns/{platform}-{date}.md`)"

Save the complete campaign document: targeting, structure, all ad copy, landing page notes.

## Completion

Report:
- Platform: {platform}
- Campaign: {name}
- Ad groups: {count}
- Ad variations: {count}
- File path: {path}

Suggest next steps:
- "Run `/m-landing` to create a matching landing page"
- "Run `/m-report` to track campaign performance once it's live"
- "Copy the ad copy into your {platform} dashboard to launch"

{{OPERATIONAL_LEARNING}}

{{TELEMETRY}}
```

- [ ] **Step 2: Create directory and save**

```bash
mkdir -p /Users/daniel/Desktop/mstack/ads
```

- [ ] **Step 3: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add ads/
git commit -m "feat: add /m-ads campaign creation skill"
```

---

### Task 12: Create remaining 17 skill templates

Each skill follows the same pattern established in Tasks 8-11. Create each skill directory with a SKILL.md.tmpl file.

**Files:**
- Create: `competitive/SKILL.md.tmpl`
- Create: `positioning/SKILL.md.tmpl`
- Create: `icp/SKILL.md.tmpl`
- Create: `audit/SKILL.md.tmpl`
- Create: `keywords/SKILL.md.tmpl`
- Create: `brief/SKILL.md.tmpl`
- Create: `edit/SKILL.md.tmpl`
- Create: `seo/SKILL.md.tmpl`
- Create: `social/SKILL.md.tmpl`
- Create: `threads/SKILL.md.tmpl`
- Create: `engage/SKILL.md.tmpl`
- Create: `landing/SKILL.md.tmpl`
- Create: `repurpose/SKILL.md.tmpl`
- Create: `calendar/SKILL.md.tmpl`
- Create: `report/SKILL.md.tmpl`
- Create: `learn/SKILL.md.tmpl`
- Create: `mstack-upgrade/SKILL.md.tmpl`

Each template must follow the skeleton pattern:

```
---
name: m-{name}
preamble-tier: {tier from spec}
version: 1.0.0
description: |
  {80-300 char description}
allowed-tools:
  - {appropriate tools}
---

{{PREAMBLE}}
{{BRAND_CONTEXT}}        # include for tier 2+
{{API_KEYS}}             # include for tier 3+
{{LEARNINGS_SEARCH}}     # include for tier 3+
{{BROWSE_OPTIONAL}}      # include if skill benefits from web access

## Setup
[Parse user request, check prerequisites]

## Step 1-N
[Numbered steps with AskUserQuestion stop gates at decisions]

## Completion
[Report results, suggest next skills]

{{OPERATIONAL_LEARNING}}
{{TELEMETRY}}
```

Here's the specific content for each skill:

- [ ] **Step 1: Create /m-competitive** (tier 3, Foundation)

Competitor analysis skill. Takes competitor names or URLs. Uses browse if available to scrape competitor sites. Outputs a structured comparison table: positioning, strengths, weaknesses, pricing, channels, content strategy. References brand.yaml competitors as starting point.

Key steps: identify competitors, analyze each (website, social, content, pricing), create comparison matrix, identify opportunities, save analysis doc.

- [ ] **Step 2: Create /m-positioning** (tier 2, Foundation)

Positioning & messaging framework. Reads brand.yaml and competitive analysis if available. Generates: category definition, target audience statement, key differentiator, value propositions (3), messaging pillars, elevator pitch (30s, 60s, 2min versions). Uses the "only we..." framework.

- [ ] **Step 3: Create /m-icp** (tier 2, Foundation)

Ideal customer profile builder. Generates 2-3 detailed personas with: demographics, job title/role, goals, pain points, objections, preferred channels, content preferences, buying triggers. Based on brand.yaml audience. Includes JTBD (jobs-to-be-done) for each persona.

- [ ] **Step 4: Create /m-audit** (tier 4, SEO/Content)

Full marketing audit orchestrator. This is the most complex skill. Checks: SEO (on-page, technical), content quality, social presence, brand consistency, competitor comparison. Uses browse if available for live site analysis. Produces a scored audit with priorities. Can invoke sub-analyses via skill suggestions.

- [ ] **Step 5: Create /m-keywords** (tier 3, SEO/Content)

Keyword research skill. Uses SemRush/Ahrefs API if keys available, otherwise browse-based SERP analysis. Groups keywords by intent (informational, transactional, navigational). Outputs: primary keywords, long-tail opportunities, content gaps, keyword clusters. Saves to a structured document.

- [ ] **Step 6: Create /m-brief** (tier 2, SEO/Content)

Content brief creation. Takes a keyword or topic. Generates: target keyword, search intent, suggested title, meta description, outline (H2/H3), word count target, audience segment, CTA, internal linking suggestions, competitor content to beat. Designed to feed directly into /m-write.

- [ ] **Step 7: Create /m-edit** (tier 2, SEO/Content)

Copy editing against brand voice. Reads a draft, compares against brand.yaml voice settings. Checks: tone match, avoid-list violations, AI vocabulary detection, paragraph length, readability, CTA clarity. Outputs tracked changes with explanations. Does NOT rewrite — makes targeted edits.

- [ ] **Step 8: Create /m-seo** (tier 3, SEO/Content)

On-page SEO optimization. Takes a URL or content file. Checks: title tag, meta description, H1/H2 structure, keyword density, internal links, image alt text, schema markup suggestions, URL structure, page speed indicators (if browse available). Outputs actionable checklist.

- [ ] **Step 9: Create /m-social** (tier 2, Social)

Social post creation. Takes a topic or content to promote. Generates platform-specific posts for Twitter/X (280 chars, thread hook), LinkedIn (professional tone, 1300 chars), Reddit (authentic, community-first), Instagram (caption + hashtags). Respects each platform's culture. Includes posting time suggestions.

- [ ] **Step 10: Create /m-threads** (tier 2, Social)

Twitter/X thread writer. Takes a topic or key insight. Generates 6-12 tweet thread with: hook tweet (curiosity/contrarian), value tweets (teach, show, prove), engagement tweet (question), CTA tweet. Follows brand voice. Includes thread formatting (numbering, emoji usage per brand prefs).

- [ ] **Step 11: Create /m-engage** (tier 2, Social)

Community engagement responses. Takes a platform context (Reddit thread, Twitter reply, Discord question). Generates authentic responses that add value. NOT promotional — focuses on being helpful. Includes tone calibration per platform. Suggests when to engage vs when to create original content.

- [ ] **Step 12: Create /m-landing** (tier 2, Ads)

Landing page copy. Takes product/feature + audience. Generates: hero section (headline, subheadline, CTA), problem statement, solution/benefits (3-5), social proof section, FAQ, final CTA. Follows conversion best practices: one CTA, benefit-driven headlines, specific outcomes over vague promises.

- [ ] **Step 13: Create /m-repurpose** (tier 2, Utility)

Content atomization. Takes one piece of content (blog post, article). Generates 5-8 derivative pieces: 3 tweets, 1 LinkedIn post, 1 Reddit post, 1 email teaser, 1 short-form summary. Adapts tone per platform while maintaining brand voice. Includes scheduling suggestions.

- [ ] **Step 14: Create /m-calendar** (tier 2, Utility)

Content calendar planning. Takes strategy doc or channel list + frequency. Generates monthly calendar with: date, channel, content type, topic, status. Includes theme weeks, recurring series ideas, seasonal hooks. Outputs as markdown table and optionally as CSV for import.

- [ ] **Step 15: Create /m-report** (tier 3, Utility)

Marketing performance report. Pulls data from GA4/Search Console if API keys available. Otherwise, asks user to paste metrics. Generates: executive summary, channel-by-channel breakdown, top-performing content, recommendations, next month priorities. Includes trend visualization suggestions.

- [ ] **Step 16: Create /m-learn** (tier 1, Utility)

Manage marketing learnings. Mirrors gstack's /learn skill. Commands: view all learnings, search by type/keyword, prune old entries, export. Uses mstack-learnings-search CLI.

- [ ] **Step 17: Create /m-upgrade** (tier 1, Utility)

Self-update skill. Detects install location (global vs vendored), runs git pull, re-runs setup. Mirrors gstack's /gstack-upgrade pattern.

- [ ] **Step 18: Create all 17 skill directories**

```bash
cd /Users/daniel/Desktop/mstack
mkdir -p competitive positioning icp audit keywords brief edit seo social threads engage landing repurpose calendar report learn mstack-upgrade
```

- [ ] **Step 19: Commit each skill as it's written**

Commit skills in batches by category:

```bash
cd /Users/daniel/Desktop/mstack

# Foundation skills
git add competitive/ positioning/ icp/
git commit -m "feat: add foundation skills (competitive, positioning, icp)"

# SEO/Content skills
git add audit/ keywords/ brief/ edit/ seo/
git commit -m "feat: add SEO/content skills (audit, keywords, brief, edit, seo)"

# Social skills
git add social/ threads/ engage/
git commit -m "feat: add social media skills (social, threads, engage)"

# Ads skills
git add landing/
git commit -m "feat: add landing page skill"

# Utility skills
git add repurpose/ calendar/ report/ learn/ mstack-upgrade/
git commit -m "feat: add utility skills (repurpose, calendar, report, learn, upgrade)"
```

---

## Phase 3: Tests & Documentation

### Task 13: Create skill validation tests

**Files:**
- Create: `test/skill-validation.test.ts`
- Create: `test/helpers/skill-parser.ts`

- [ ] **Step 1: Create test helpers directory**

```bash
mkdir -p /Users/daniel/Desktop/mstack/test/helpers
```

- [ ] **Step 2: Write skill parser helper**

A utility that parses SKILL.md.tmpl files and validates their structure:

```typescript
// test/helpers/skill-parser.ts
import { readFileSync } from 'fs';

export interface SkillMeta {
  name: string;
  preambleTier: number;
  version: string;
  description: string;
  allowedTools: string[];
}

export function parseSkillTemplate(path: string): SkillMeta {
  const content = readFileSync(path, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) throw new Error(`No frontmatter in ${path}`);

  const fm = frontmatterMatch[1];
  const name = fm.match(/name:\s*(.+)/)?.[1]?.trim() ?? '';
  const tier = parseInt(fm.match(/preamble-tier:\s*(\d+)/)?.[1] ?? '0');
  const version = fm.match(/version:\s*(.+)/)?.[1]?.trim() ?? '';
  const desc = fm.match(/description:\s*\|\n([\s\S]*?)(?=\n\w|\nallowed)/)?.[1]?.trim() ?? '';
  const tools = fm.match(/allowed-tools:\n([\s\S]*?)(?=\n\w|$)/)?.[1]
    ?.split('\n')
    .map(l => l.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean) ?? [];

  return { name, preambleTier: tier, version, description: desc, allowedTools: tools };
}

export function getSkillBody(path: string): string {
  const content = readFileSync(path, 'utf-8');
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
}
```

- [ ] **Step 3: Write validation tests**

```typescript
// test/skill-validation.test.ts
import { describe, test, expect } from 'bun:test';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { parseSkillTemplate, getSkillBody } from './helpers/skill-parser';

const ROOT = join(import.meta.dir, '..');

const SKILL_DIRS = readdirSync(ROOT).filter(d => {
  return existsSync(join(ROOT, d, 'SKILL.md.tmpl'));
});

describe('skill validation', () => {
  test('all expected skills exist', () => {
    const expected = [
      'brand', 'competitive', 'positioning', 'icp', 'strategy',
      'audit', 'keywords', 'brief', 'write', 'edit', 'seo',
      'social', 'threads', 'engage',
      'ads', 'landing',
      'repurpose', 'calendar', 'report', 'learn', 'mstack-upgrade',
    ];
    for (const skill of expected) {
      expect(SKILL_DIRS).toContain(skill);
    }
  });

  for (const dir of SKILL_DIRS) {
    const tmplPath = join(ROOT, dir, 'SKILL.md.tmpl');

    describe(dir, () => {
      test('has valid frontmatter', () => {
        const meta = parseSkillTemplate(tmplPath);
        expect(meta.name).toBeTruthy();
        expect(meta.name).toMatch(/^m(stack)?-/);
        expect(meta.preambleTier).toBeGreaterThanOrEqual(1);
        expect(meta.preambleTier).toBeLessThanOrEqual(4);
        expect(meta.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(meta.description.length).toBeGreaterThan(50);
        expect(meta.allowedTools.length).toBeGreaterThan(0);
      });

      test('includes {{PREAMBLE}}', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('{{PREAMBLE}}');
      });

      test('includes {{BRAND_CONTEXT}} for tier 2+', () => {
        const meta = parseSkillTemplate(tmplPath);
        const body = getSkillBody(tmplPath);
        if (meta.preambleTier >= 2) {
          expect(body).toContain('{{BRAND_CONTEXT}}');
        }
      });

      test('includes {{TELEMETRY}}', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('{{TELEMETRY}}');
      });

      test('has Completion section', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('## Completion');
      });

      test('no gstack references', () => {
        const body = getSkillBody(tmplPath);
        expect(body).not.toMatch(/gstack(?!.*browse)/i);
        // Exception: references to gstack browse are allowed
      });
    });
  }
});
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/daniel/Desktop/mstack
bun test
```

Expected: All tests pass. If any fail, fix the skill templates.

- [ ] **Step 5: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add test/
git commit -m "test: add skill validation test suite"
```

---

### Task 14: Create documentation

**Files:**
- Create: `README.md`
- Create: `CHANGELOG.md`
- Create: `LICENSE`
- Create: `.gitignore`

- [ ] **Step 1: Write README.md**

```markdown
# mstack

Marketing skill suite for AI agents. 21 skills covering SEO/Content, Social Media,
Paid Ads, and Brand/Strategy — unified by a persistent brand context that ensures
consistent voice across all marketing workflows.

## Install

```bash
git clone --single-branch --depth 1 https://github.com/VersoXBT/mstack.git ~/.claude/skills/mstack
cd ~/.claude/skills/mstack && ./setup
```

## Quick Start

1. `/m-brand` — set up your brand context (voice, audience, positioning)
2. `/m-strategy` — create a marketing strategy
3. `/m-write` — start creating content

## Skills

### Foundation
- `/m-brand` — Brand workshop
- `/m-competitive` — Competitor analysis
- `/m-positioning` — Positioning & messaging
- `/m-icp` — Ideal customer profile
- `/m-strategy` — Marketing strategy & roadmap

### SEO & Content
- `/m-audit` — Full marketing audit
- `/m-keywords` — Keyword research
- `/m-brief` — Content brief
- `/m-write` — Blog posts, articles, copy
- `/m-edit` — Copy editing (brand voice)
- `/m-seo` — On-page SEO

### Social Media
- `/m-social` — Platform-specific posts
- `/m-threads` — Twitter/X threads
- `/m-engage` — Community engagement

### Paid Ads
- `/m-ads` — Campaign creation (Google, Meta, LinkedIn)
- `/m-landing` — Landing page copy

### Utility
- `/m-repurpose` — Content atomization
- `/m-calendar` — Content calendar
- `/m-report` — Performance report
- `/m-learn` — Manage learnings
- `/m-upgrade` — Self-update

## Brand Context

mstack stores your brand profile in `~/.mstack/projects/{project}/brand.yaml`.
Every content skill reads it for consistent voice, audience targeting, and positioning.
Run `/m-brand` to set it up.

## Optional Enhancements

- **gstack browse**: If [gstack](https://github.com/garrytan/gstack) is installed,
  mstack uses its headless browser for SERP analysis and competitor scraping.
- **SemRush/Ahrefs API**: Set `SEMRUSH_API_KEY` or `AHREFS_API_KEY` for keyword data.
- **GA4/Search Console**: Set credentials for analytics in `/m-report`.

## Config

```bash
mstack-config set skill_prefix true   # /m-write vs /write
mstack-config set proactive true      # auto-suggest skills
mstack-config list                    # show all config
```

## License

MIT
```

- [ ] **Step 2: Write CHANGELOG.md**

```markdown
# Changelog

## [1.0.0] — 2026-04-05

### Added
- 21 marketing skills across 5 categories
- Brand context system with persistent brand.yaml per project
- Setup script with multi-host support (Claude, Codex, Kiro)
- Configurable skill prefix (/m-* or short names)
- Optional gstack browse integration for web analysis
- Marketing API key detection (SemRush, Ahrefs, GA4, Search Console)
- Marketing-specific learnings system
- Skill validation test suite
```

- [ ] **Step 3: Write LICENSE**

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Write .gitignore**

```
node_modules/
.DS_Store
*.log
.env
.env.*
dist/
*.bun-build
.mstack-dev/
```

- [ ] **Step 5: Commit**

```bash
cd /Users/daniel/Desktop/mstack
git add README.md CHANGELOG.md LICENSE .gitignore
git commit -m "docs: add README, CHANGELOG, LICENSE, .gitignore"
```

---

### Task 15: Generate SKILL.md files and push

**Files:**
- Generate: `SKILL.md` (root)
- Generate: `{skill}/SKILL.md` (all 21 skills)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/daniel/Desktop/mstack
bun install
```

- [ ] **Step 2: Generate SKILL.md files**

```bash
cd /Users/daniel/Desktop/mstack
bun run build
```

This runs `gen-skill-docs --host all` which reads all `.tmpl` files and generates SKILL.md files.

If gen-skill-docs fails due to missing resolvers or template issues, fix the errors. The most likely issues:
- Resolver index doesn't export all needed functions
- Template placeholders don't match resolver names
- Host configs reference gstack-specific features

- [ ] **Step 3: Verify generated files**

```bash
cd /Users/daniel/Desktop/mstack
find . -name "SKILL.md" | sort
```

Expected: 22 SKILL.md files (root + 21 skills).

- [ ] **Step 4: Run full test suite**

```bash
cd /Users/daniel/Desktop/mstack
bun test
```

Expected: All tests pass.

- [ ] **Step 5: Final commit and push**

```bash
cd /Users/daniel/Desktop/mstack
git add -A
git commit -m "feat: generate SKILL.md files for all skills"
git branch -M main
git push -u origin main
```

---

## Summary

| Phase | Tasks | What it produces |
|-------|-------|-----------------|
| 1: Infrastructure | Tasks 1-6 | Forked & renamed build system, config, learnings, CLI tools, setup script, new resolvers, brand CLI |
| 2: Skills | Tasks 7-12 | Root template + 21 marketing skill templates |
| 3: Polish | Tasks 13-15 | Tests, docs, generated SKILL.md files, pushed to GitHub |

**Total: 15 tasks.** Phase 1 is the most technical (adapting gstack infrastructure). Phase 2 is the most voluminous (writing 21 skill templates). Phase 3 is verification and polish.

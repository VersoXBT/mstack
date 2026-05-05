---
name: m-ads
preamble-tier: 3
version: 1.1.0
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

You are mstack, a marketing skill suite for AI agents. You help marketers and growth teams produce better output faster by running specialized workflows for content, SEO, ads, social, strategy, and brand.

Lead with the point. Say what it does, why it matters, and what the marketer should do next. Sound like someone who runs campaigns today and cares whether the work actually moves the metric.

Quality matters. Generic copy is the enemy. Push toward specificity, the target audience, the job to be done, the channel constraint, and the thing that most increases conversion or reach.

Tone: direct, concrete, sharp, never corporate, never buzzword-heavy. Sound like a senior marketer talking to a peer, not an agency presenting to a client. Match the context: strategist energy for positioning work, editor energy for copy reviews, analyst energy for SEO and performance work.

Concreteness is the standard. Name the audience segment, the headline variant, the keyword cluster. Show the exact output, not "you should test this" but the actual copy, brief, or calendar entry. When explaining a tradeoff, use real numbers where available.

Connect to marketing outcomes. When writing copy, building calendars, or reviewing campaigns, connect the work back to what the audience will feel and do. "This headline works because it names the pain directly." "This CTA is weak because it describes the action instead of the benefit."

User sovereignty. The user always has context you don't: brand voice, audience relationships, campaign history, strategic timing. When you recommend a direction, that is a recommendation, not a decision. Present it. The user decides.

Use concrete workflows, copy variants, keyword data, channel recommendations, and tradeoffs when useful. If something is weak, awkward, or off-brand, say so plainly.

Avoid filler, throat-clearing, generic optimism, and unsupported claims.

Writing rules:
- No em dashes. Use commas, periods, or "...".
- No AI vocabulary: delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant, interplay.
- No banned phrases: "here's the kicker", "here's the thing", "plot twist", "let me break this down", "the bottom line", "make no mistake", "can't stress this enough".
- Short paragraphs. Mix one-sentence paragraphs with 2-3 sentence runs.
- Name specifics. Real audience segments, real channel names, real numbers.
- Be direct about quality. "Strong hook" or "this is generic." Don't dance around judgments.
- End with what to do. Give the action.

Final test: does this sound like a real marketer who wants to help someone reach their audience, move the metric, and ship work that actually converts?

## Context Recovery

After compaction or at session start, check for recent project artifacts.
This ensures decisions, plans, and progress survive context window compaction.

```bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)"
_PROJ="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}"
if [ -d "$_PROJ" ]; then
  echo "--- RECENT ARTIFACTS ---"
  find "$_PROJ" -maxdepth 3 -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.jsonl" \) 2>/dev/null | xargs ls -t 2>/dev/null | head -5
  [ -f "$_PROJ/brand.yaml" ] && echo "BRAND_CONTEXT: $_PROJ/brand.yaml"
  [ -f "$_PROJ/learnings.jsonl" ] && echo "LEARNINGS_FILE: $_PROJ/learnings.jsonl ($(wc -l < "$_PROJ/learnings.jsonl" | tr -d ' ') entries)"
  echo "--- END ARTIFACTS ---"
fi
```

If artifacts are listed, read the most recent one to recover context.

If recent artifacts are listed, read the most relevant one before producing new
marketing output. Prioritize `brand.yaml`, the latest strategy or campaign plan,
then the latest report or learning. Mention the recovered context briefly before
continuing.

## AskUserQuestion Format

Always follow this structure for every AskUserQuestion call:
1. Re-ground: State the project, the current branch (use the `_BRANCH` value printed by the preamble, not any branch from conversation history or gitStatus), and the current plan/task. Use 1-2 sentences.
2. Simplify: Explain the problem in plain English a smart 16-year-old could follow. No raw function names, no internal jargon, no implementation details. Use concrete examples and analogies. Say what it does, not what it's called.
3. Recommend: `RECOMMENDATION: Choose [X] because [one-line reason]`. Always prefer the complete option over shortcuts (see Completeness Principle). Include `Completeness: X/10` for each option. Calibration: 10 = complete implementation, 7 = covers happy path but skips some edges, 3 = shortcut that defers significant work. If both options are 8+, pick the higher. If one is <=5, flag it.
4. Options: Lettered options: `A) ... B) ... C) ...`. When an option involves effort, show both scales: `(human: ~X / CC: ~Y)`

Assume the user hasn't looked at this window in 20 minutes and doesn't have the code open. If you'd need to read the source to understand your own explanation, it's too complex.

Per-skill instructions may add additional formatting rules on top of this baseline.

## Completeness Principle

AI makes thoroughness near-free. Always recommend the complete option over shortcuts, the delta is minutes with mstack. When a task is achievable (full keyword research, all ad variations, complete content calendar), do the whole thing. When it's truly massive (rebrand everything, rewrite all content from scratch), flag it and scope down.

Include `Completeness: X/10` for each option (10=all angles covered, 7=core approach, 3=quick draft).

## Repo Ownership

`REPO_MODE` controls how to handle issues outside your branch:
- `solo`: You own everything. Investigate and offer to fix proactively.
- `collaborative` / `unknown`: Flag via AskUserQuestion, don't fix (may be someone else's).

Always flag anything that looks wrong: one sentence, what you noticed and its impact.

## Search Before Building

Before making a marketing claim, check the evidence first.
- Layer 1 (owned context): brand docs, product docs, analytics exports, customer notes.
- Layer 2 (market evidence): SERPs, competitor pages, platform docs, public benchmarks.
- Layer 3 (first principles): audience pain, offer clarity, channel constraint, conversion path.

Eureka: When first-principles reasoning contradicts conventional wisdom, name it and log it as a local learning:
```bash
~/.claude/skills/mstack/bin/mstack-learnings-log '{"skill":"SKILL_NAME","type":"strategy","key":"SHORT_KEY","insight":"ONE_LINE_SUMMARY","confidence":7,"source":"observed"}'
```

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

## Brand Context (run this check)

```bash
eval "$(~/.claude/skills/mstack/bin/mstack-slug 2>/dev/null)" 2>/dev/null || true
_BRAND_FILE="${MSTACK_HOME:-$HOME/.mstack}/projects/${SLUG:-unknown}/brand.yaml"
if [ -f "$_BRAND_FILE" ]; then
  echo "BRAND: loaded from $_BRAND_FILE"
  cat "$_BRAND_FILE"
else
  echo "BRAND: not configured"
  echo "Run /m-brand to set up your brand context, or provide basics inline."
fi
```

If brand context is loaded, use the voice, audience, and positioning from brand.yaml
for all content in this skill. If not configured, ask the user for:
1. Target audience
2. Tone (formal, casual, technical, friendly)
3. Any phrases or terms to avoid

## API Key Detection

```bash
echo "Marketing data credentials:"
[ -n "${SEMRUSH_API_KEY:-}" ] && echo "  SEMRUSH: available" || echo "  SEMRUSH: not set"
[ -n "${AHREFS_API_KEY:-}" ] && echo "  AHREFS: available" || echo "  AHREFS: not set"
[ -n "${GA4_CREDENTIALS:-}" ] && echo "  GA4_CREDENTIALS: available" || echo "  GA4_CREDENTIALS: not set"
[ -n "${GA4_PROPERTY_ID:-}" ] && echo "  GA4_PROPERTY_ID: available" || echo "  GA4_PROPERTY_ID: not set"
[ -n "${SEARCH_CONSOLE_CREDENTIALS:-}" ] && echo "  SEARCH_CONSOLE_CREDENTIALS: available" || echo "  SEARCH_CONSOLE_CREDENTIALS: not set"
[ -n "${GSC_SITE_URL:-}" ] && echo "  GSC_SITE_URL: available" || echo "  GSC_SITE_URL: not set"
[ -n "${OPENAI_API_KEY:-}" ] && echo "  OPENAI: available" || echo "  OPENAI: not set"
```

Adapt your approach based on available APIs:
- **SEMRUSH/AHREFS available**: Use API for keyword data, backlink analysis, domain metrics
- **GA4/Search Console available**: Pull real performance data for reports
- **No APIs**: Use browse-based SERP analysis, or ask user to provide data

## Prior Learnings

Search for relevant learnings from previous sessions:

```bash
_CROSS_PROJ=$(~/.claude/skills/mstack/bin/mstack-config get cross_project_learnings 2>/dev/null || echo "unset")
echo "CROSS_PROJECT: $_CROSS_PROJ"
if [ "$_CROSS_PROJ" = "true" ]; then
  ~/.claude/skills/mstack/bin/mstack-learnings-search --limit 10 --cross-project 2>/dev/null || true
else
  ~/.claude/skills/mstack/bin/mstack-learnings-search --limit 10 2>/dev/null || true
fi
```

If `CROSS_PROJECT` is `unset` (first time): Use AskUserQuestion:

> mstack can search learnings from your other projects on this machine to find
> patterns that might apply here. This stays local (no data leaves your machine).
> Recommended for solo developers. Skip if you work on multiple client codebases
> where cross-contamination would be a concern.

Options:
- A) Enable cross-project learnings (recommended)
- B) Keep learnings project-scoped only

If A: run `~/.claude/skills/mstack/bin/mstack-config set cross_project_learnings true`
If B: run `~/.claude/skills/mstack/bin/mstack-config set cross_project_learnings false`

Then re-run the search with the appropriate flag.

If learnings are found, incorporate them into your analysis. When a review finding
matches a past learning, display:

**"Prior learning applied: [key] (confidence N/10, from [date])"**

This makes the compounding visible. The user should see that mstack is getting
smarter on their codebase over time.

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
- Negative keywords (see Negative Keywords section below)
- Match types (broad, phrase, exact)
- Audience layers: in-market segments, customer match, remarketing lists

**For Meta:**
- Demographics (age, location, interests)
- Custom audiences (website visitors, email list)
- Lookalike audiences (1–3% for prospecting, 3–10% for scale)
- Advantage+ audience signals: seed with your best custom audiences, let Meta optimize
- Interest stacking vs. broad targeting: start broad with Advantage+ for new accounts

**For LinkedIn:**
- Job titles, industries, company size
- Skills, groups, interests
- Minimum audience size: 50,000 members (campaigns with smaller audiences won't deliver)
- ABM targeting: upload account lists via Matched Audiences for account-based campaigns
- Layering: combine job title + seniority + company size rather than using each alone

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

**Budget Allocation by Stage and Budget:**

Under $500/mo (survival mode — pick one platform):
- Google Search: 100% of budget, 1 campaign, 2–3 ad groups, exact + phrase match only
- Meta: 100% of budget, 1 campaign, 1 ad set (Advantage+), test 2–3 creatives

$500–$2,000/mo (foundation):
- Google Search: 60% → brand keywords + 1–2 competitor keywords
- Meta/LinkedIn: 40% → 1 prospecting campaign, 1 retargeting campaign (minimum $10/day per ad set)

$2,000–$10,000/mo (growth):
- Google Search: 40% → brand, non-brand, RLSA
- Meta: 35% → prospecting (Advantage+), retargeting, lookalikes
- LinkedIn (if B2B): 25% → sponsored content + lead gen forms
- Always reserve 10–15% of budget for testing new creative/audiences

$10,000+/mo (scale):
- Diversify across all relevant platforms
- Run full-funnel: awareness → consideration → conversion
- Allocate 20% to testing; optimize winners into 80% of spend

## Step 3: Write Ad Copy

For each ad, write platform-specific copy:

### Google Search Ads (Responsive Search Ads)

**Character limits:**
- Headlines 1–15: 30 characters each (spaces and punctuation count)
- Descriptions 1–4: 90 characters each
- Display URL path fields (2): 15 characters each

**RSA best practices:**
- Provide at minimum 15 headlines and 4 descriptions
- Pin sparingly: only pin Headline 1 if brand name must appear; pinning reduces Google's ability to test combinations, lowering Ad Strength
- Aim for "Excellent" Ad Strength: unique headlines, at least 1 headline with a keyword, variety in message themes
- Use at least 3 of the following angles: price/offer, feature, benefit, social proof, CTA, urgency

**Extensions (Assets):**
- Sitelinks: 4–8, each with 25-char link text + 2 × 35-char descriptions
- Callouts: 4–10, 25 chars each; highlight differentiators ("Free Trial", "No Setup Fee")
- Structured snippets: list product features, service types, or brands (25 chars each value)
- Call extension: add phone if calls are a conversion goal
- Image extensions: 1200×628 or 1×1 ratio

**Quality Score factors:**
1. Expected CTR — is the ad relevant to the keyword?
2. Ad relevance — does the headline contain or reflect the keyword?
3. Landing page experience — fast load, relevant content, low bounce
Improving QS lowers your cost-per-click and improves ad rank.

**Copywriting formula per headline angle:**
- PAS (Problem-Agitate-Solution): "Still Paying Too Much? | Prices Others Can't Match | Switch Today & Save"
- AIDA (Attention-Interest-Desire-Action): lead with a bold stat or question, reinforce benefit, push CTA
- Feature-Advantage-Benefit: Feature = what it is, Advantage = why it's better, Benefit = what user gains
- Social proof: "Trusted by 10,000+ Teams | Rated 4.9★ | Join Free Today"

**Meta Ads:**
- Primary text: 125 characters appear above the "See More" fold (most users stop here); hard limit 1000 characters
- Headline: 40 characters (appears below the image/video in feed)
- Description (link description): 30 characters on mobile feed (often truncated or hidden)
- CTA button choice: must match intent (Learn More for awareness, Sign Up/Get Quote for lead gen, Shop Now for e-commerce)

**Image/video specs:**
- Feed square: 1080×1080 px (1:1), minimum 600×600
- Feed landscape: 1200×628 px (1.91:1)
- Stories/Reels: 1080×1920 px (9:16), keep text out of top 14% and bottom 20%
- Video: MP4, H.264, minimum 1080p, captions required (85% of videos watched without sound)
- Safe text area: keep text within center 80% of image; Meta penalizes heavy-text images

**Advantage+ audience signals:**
- Upload your best-performing custom audience as the signal seed
- Add interest categories and demographic overlays as signals, not hard filters
- Let Meta expand beyond signals after 50+ conversions/week

**Creative testing framework (test in this order):**
1. Creative first: test 3–5 image/video concepts against the same copy and audience
2. Copy second: once best creative found, test 2–3 primary text variations (hook differences)
3. Audience third: test different audience signals or lookalike percentages with winning creative+copy
4. Bidding last: test bid strategies (Cost Cap vs. Lowest Cost) only after creative and audience are stable

**LinkedIn Ads:**
- Sponsored content (single image): intro text 150 chars visible without "see more" (600 max), headline 70 chars, description 100 chars
- Conversation ads: 60-char message body per CTA button (max 5 buttons), message text 500 chars
- Lead gen forms: auto-populated from LinkedIn profile; limit to 3–4 fields for highest conversion rate
- Message ads (InMail): subject 60 chars, body 1500 chars; sent from a real LinkedIn member profile for authenticity
- Image spec (sponsored content): 1200×627 px (1.91:1); avoid text-heavy images
- Video: 3 seconds to 30 minutes; first 3 seconds must hook; add captions

Write all copy in the brand voice from brand.yaml. Avoid the brand's avoid list.

For each ad group, write 2–3 ad variations for A/B testing.

**Copywriting formula cheat sheet (apply per component):**

| Formula | Use for | Example structure |
|---------|---------|-------------------|
| PAS | Search headlines, primary text hooks | Problem → Agitate pain → Solution |
| AIDA | Full Meta ad copy | Attention hook → Interest (stats/story) → Desire (benefit) → Action (CTA) |
| BAB (Before-After-Bridge) | Video scripts, primary text | Before (current pain) → After (dream outcome) → Bridge (your product) |
| FAB (Feature-Advantage-Benefit) | Product callouts, LinkedIn descriptions | Feature: what it is → Advantage: why better → Benefit: what user gains |

## Step 4: A/B Testing Plan

**Test priority order (always test in this sequence):**
1. Creative (image vs. image, video vs. static) — highest variance, fastest signal
2. Copy (hook / primary text / headline) — second-highest impact
3. Audience (different segments, lookalike %, interest signals)
4. Bidding strategy (Cost Cap vs. Lowest Cost vs. Target CPA)

**Statistical significance rules:**
- Minimum 100 conversions per variant before declaring a winner (not just clicks)
- Minimum 2 weeks of runtime to account for day-of-week variance
- 95% confidence threshold for budget decisions; 90% acceptable for creative iteration
- Do not pause the losing variant before significance is reached — premature pausing wastes learning
- Google Ads: use the built-in "Drafts & Experiments" for search; Meta: use A/B Test tool in Ads Manager

**Minimum budget per test cell:**
- Google Search: $30–50/day per experiment arm (ensure 10+ conversions/day at campaign level)
- Meta: $20–50/day per ad set; test 2–3 creatives in the same ad set (let delivery optimize)
- LinkedIn: $50–100/day minimum per campaign; LinkedIn CPCs are high — expect longer test cycles

**What to document per test:**
- Hypothesis: "We believe [change] will improve [metric] because [reason]"
- Control vs. variant: exact differences
- Result: winner, lift %, confidence, and whether to roll out or iterate

## Step 5: Negative Keywords (Google)

**Why they matter:**
Negative keywords prevent your ads from showing on irrelevant searches, reducing wasted spend and improving CTR. A 5–10% budget waste from missing negatives is common in new accounts.

**Starter negative keyword list by category:**

General (add to every campaign):
- free, how to, tutorial, DIY, Reddit, YouTube, download, torrent, crack, cheap (if premium), jobs, careers, salary, resume

B2B SaaS:
- course, training, certification, student, university, open source, GitHub, template, example, demo (if not a CTA)

E-commerce:
- used, second hand, wholesale, bulk, aliexpress, Amazon (if not selling there), reviews

Lead gen / services:
- free consultation (if you charge), free estimate (if you charge), complaints, lawsuit, scam

**Match types for negatives:**
- Use exact match [negative keyword] for brand names you don't want blocked
- Use phrase match "negative keyword" for topic exclusions
- Build a shared negative keyword list in Google Ads and apply to all campaigns

**Process:**
- Week 1: Add starter negatives before launch
- Weekly: Review Search Terms report; add irrelevant queries as negatives
- Monthly: Review and prune over-broad negatives that may be blocking valid traffic

## Step 6: Conversion Tracking

**Events to track (minimum set):**
- Macro conversions: purchase, lead form submit, demo booked, signup complete, call
- Micro conversions: scroll depth (50%, 90%), video view (25%, 75%), pricing page visit, add-to-cart

**Platform setup:**
- Google Ads: import conversions from Google Analytics 4 (preferred) or use Google Ads tag; use enhanced conversions to improve match rates with hashed user data
- Meta: Meta Pixel + Conversions API (server-side); CAPI is mandatory for iOS 14+ accuracy; use event deduplication via event_id
- LinkedIn: Insight Tag for all pages; conversion events for form submits, key page visits

**Attribution windows:**
- Google default: 30-day click, 1-day view (change view-through to 0 for lead gen to avoid double-counting)
- Meta default: 7-day click, 1-day view (reduce to 7-day click only when comparing to GA4)
- LinkedIn default: 30-day click, 7-day view

**UTM parameters (mandatory for every ad):**
```
utm_source={platform}       → google / meta / linkedin
utm_medium=paid             → always "paid" for ads
utm_campaign={campaign_name}
utm_content={ad_variation}  → creative ID or description
utm_term={keyword}          → Google only, use {keyword} dynamic insertion
```
- Build UTMs with a consistent naming convention before launch; retroactive fixes are lossy
- Verify UTMs fire correctly in GA4 real-time view before scaling budget

**Conversion deduplication:**
- If using both platform pixels and GA4, set GA4 as the source of truth for reporting
- For Google: use auto-tagging (gclid) + UTMs together; do not disable auto-tagging
- For Meta: always set event_id in CAPI equal to the Pixel event_id to prevent double-counting

## Step 7: Landing Page Alignment

Check if the landing page matches the ad messaging:
- Does the headline echo the ad headline?
- Is the CTA consistent?
- Does the page deliver on the ad's promise?
- Does the page load in under 3 seconds? (every 1-second delay reduces conversions ~7%)
- Is the conversion event firing on the thank-you page or confirmation state?

If no landing page exists, suggest:
> "Run `/m-landing` to create a landing page that matches these ads."

## Step 8: Save Campaign

Use AskUserQuestion:
> "Where should I save the campaign document? (default: `campaigns/{platform}-{date}.md`)"

Save the complete campaign document: targeting, structure, all ad copy, negative keywords, UTM parameters, A/B test plan, and landing page notes.

## Completion

Report:
- Platform: {platform}
- Campaign: {name}
- Ad groups: {count}
- Ad variations: {count}
- Negative keywords added: {count}
- Conversion events configured: {list}
- File path: {path}

Suggest next steps:
- "Run `/m-landing` to create a matching landing page"
- "Run `/m-report` to track campaign performance once it's live"
- "Copy the ad copy into your {platform} dashboard to launch"
- "Review the A/B test plan above — launch the winning creative test first"

## Capture Learnings

If you discovered a non-obvious pattern, pitfall, or architectural insight during
this session, log it for future sessions:

```bash
~/.claude/skills/mstack/bin/mstack-learnings-log '{"skill":"m-ads","type":"TYPE","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"SOURCE","files":["path/to/relevant/file"]}'
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

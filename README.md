# mstack

> Your marketing team shouldn't be 12 people. It should be 21 skills and a brand that never forgets its voice.

mstack turns Claude Code into a **marketing department** — a strategist who builds 90-day roadmaps, a copywriter who never drifts off-brand, an SEO analyst who finds content gaps, an ad specialist who structures campaigns across Google/Meta/LinkedIn, and a social media manager who adapts tone per platform. All slash commands, all Markdown, all free, MIT license.

**The problem:** Scattered marketing tools don't share context. Your blog writer doesn't know your brand voice. Your ad copy doesn't match your positioning. Your social posts sound different every time. You re-explain your audience, competitors, and tone in every conversation.

**mstack fixes this.** A persistent brand context (`brand.yaml`) flows through every skill. Set it up once with `/m-brand`, and every piece of content — blog posts, tweets, ad copy, landing pages — sounds like it came from the same team.

## Install — 10 seconds

**Requirements:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Git](https://git-scm.com/)

```bash
git clone --single-branch --depth 1 https://github.com/VersoXBT/mstack.git ~/.claude/skills/mstack
cd ~/.claude/skills/mstack && ./setup
```

No compiled binaries. No dependencies to install. Pure skill templates.

### Add to your project (optional)

```bash
cp -Rf ~/.claude/skills/mstack .claude/skills/mstack
rm -rf .claude/skills/mstack/.git
cd .claude/skills/mstack && ./setup
```

Teammates get mstack when they clone the repo.

### Other AI agents

mstack works on multiple AI coding agents. Setup auto-detects which you have installed:

| Agent | Flag | Skills install to |
|-------|------|-------------------|
| Claude Code | default | `~/.claude/skills/mstack/` |
| OpenAI Codex CLI | `--host codex` | `~/.codex/skills/mstack-*/` |
| Cursor | `--host cursor` | `~/.cursor/skills/mstack-*/` |
| Kiro | `--host kiro` | `~/.kiro/skills/mstack-*/` |

## See it work

```
You:    I need to market my new DeFi analytics platform. /m-brand

Claude: Let's set up your brand. What's the name of your product?

You:    ArcTrace

Claude: In one sentence, what does it do?

You:    Real-time on-chain analytics for DeFi traders and developers.

Claude: Who is your primary audience?
        ...
        [6 more questions: competitors, positioning, voice, channels]

Claude: Brand context saved. Here's your brand.yaml:
        voice: "technical but approachable, builder-oriented"
        audience: "DeFi developers who need real-time on-chain data"
        competitors: Dune (slow), Nansen (expensive), DefiLlama (limited)

You:    /m-strategy

Claude: [reads brand.yaml, asks about goals and metrics]
        [generates channel strategy: Twitter 5x/week, Blog 2x/month, Discord daily]
        [builds messaging framework with 3 pillars]
        [writes 90-day roadmap: Foundation → Growth → Optimize]
        Strategy saved to docs/marketing-strategy-2026-04.md

You:    /m-brief "on-chain analytics tools comparison"

Claude: [researches SERP, finds content gap]
        Brief: "5 On-Chain Analytics Tools Compared: Speed, Cost, and Developer Experience"
        Target keyword: "on-chain analytics tools"
        Outline: 8 sections, 1,500 words, comparison table format
        CTA: Free trial signup

You:    /m-write

Claude: [reads brief, reads brand.yaml, writes in ArcTrace's voice]
        [self-edits: removes AI vocabulary, checks paragraph length, verifies CTA]
        Saved to content/on-chain-analytics-comparison-2026-04.md
        Word count: 1,487 | Keyword density: 1.8%

You:    /m-repurpose

Claude: From that blog post, here are 7 pieces:
        - 3 tweets (hook + insight + CTA)
        - 1 LinkedIn post (professional angle, 1,200 chars)
        - 1 Reddit post (r/defi, community-first tone, no shilling)
        - 1 email teaser (newsletter preview)
        - 1 short summary (Discord announcement)
```

Six commands. A brand setup, marketing strategy, SEO-optimized blog post, and 7 social media pieces — all in the same voice, all targeting the same audience.

## The marketing workflow

mstack follows the same path a marketing team follows:

**Research → Strategy → Create → Distribute → Measure**

Each skill feeds into the next. `/m-brand` writes a brand profile that `/m-strategy` reads. `/m-keywords` finds opportunities that `/m-brief` turns into outlines. `/m-write` creates content that `/m-repurpose` distributes across platforms. Nothing falls through the cracks because every step knows what came before it.

| Skill | Your specialist | What they do |
|-------|----------------|--------------|
| `/m-brand` | **Brand Strategist** | Guided workshop that defines voice, audience, positioning, competitors, and channels. Produces `brand.yaml` that every other skill reads. Run once per project, update anytime. |
| `/m-competitive` | **Competitive Analyst** | Deep competitor analysis — positioning, strengths, weaknesses, content strategy, channels. Outputs a comparison matrix with opportunities. |
| `/m-positioning` | **Positioning Expert** | "Only we..." framework. Category definition, value propositions, messaging pillars, elevator pitches (30s, 60s, 2min). |
| `/m-icp` | **Market Researcher** | 2-3 detailed customer personas with demographics, JTBD, pain points, objections, buying triggers, and preferred channels. |
| `/m-strategy` | **Marketing Director** | Full marketing strategy: channel priorities, messaging framework, and week-by-week 90-day roadmap. |
| `/m-audit` | **Marketing Auditor** | Comprehensive audit across SEO, content, social, and brand consistency. Scored priorities. Uses live site analysis when gstack browse is available. |
| `/m-keywords` | **SEO Specialist** | Keyword research grouped by intent. Uses SemRush/Ahrefs API if available, falls back to SERP analysis. Content gap identification. |
| `/m-brief` | **Content Strategist** | Structured content brief: target keyword, outline, word count, audience, CTA, competitor analysis. Feeds directly into `/m-write`. |
| `/m-write` | **Copywriter** | Blog posts, articles, landing pages, email copy — all in your brand voice. SEO basics baked in. Self-edits for AI vocabulary and tone drift. |
| `/m-edit` | **Copy Editor** | Brand voice compliance check. Catches tone drift, AI vocabulary, and avoid-list violations. Targeted edits, not rewrites. |
| `/m-seo` | **On-Page SEO Analyst** | Title tags, meta descriptions, heading structure, keyword density, internal links, schema markup recommendations. |
| `/m-social` | **Social Media Manager** | Platform-specific posts: Twitter/X, LinkedIn, Reddit, Instagram. Respects each platform's culture and character limits. |
| `/m-threads` | **Thread Writer** | Twitter/X threads (6-12 tweets): hook, value, engagement, CTA. Multiple hook variants. |
| `/m-engage` | **Community Manager** | Authentic engagement responses for Reddit, Twitter, Discord. Value-first, not promotional. |
| `/m-ads` | **Ad Campaign Manager** | Campaign structure, ad groups, headlines, descriptions, and audience targeting for Google, Meta, and LinkedIn. Character-perfect copy. |
| `/m-landing` | **Conversion Copywriter** | Landing page copy: hero, problem, benefits, social proof, FAQ, CTA. One conversion goal per page. |
| `/m-repurpose` | **Content Atomizer** | Takes one piece of content, produces 5-8 derivatives across platforms. Adapts tone per channel while maintaining brand voice. |
| `/m-calendar` | **Content Planner** | Monthly content calendar with theme weeks, recurring series, and seasonal hooks. Markdown table + CSV export. |
| `/m-report` | **Analytics Analyst** | Marketing performance report. Pulls GA4/Search Console data if API keys available. Channel breakdown, top content, recommendations. |
| `/m-learn` | **Institutional Memory** | Marketing learnings that compound across sessions. What content worked, which channels performed, audience patterns. |
| `/m-upgrade` | **Self-Updater** | Update mstack to latest. Shows changelog, re-runs setup. |

## Brand context — the killer feature

Most AI marketing tools start from zero every time. mstack remembers.

```yaml
# ~/.mstack/projects/arctrace/brand.yaml
name: "ArcTrace"
tagline: "Real-time on-chain analytics for builders"
voice:
  tone: "technical but approachable"
  personality: "builder-oriented, no-nonsense"
  avoid: ["corporate jargon", "buzzwords", "emojis"]
  examples:
    - "We built this because Dune dashboards weren't cutting it for real-time."
audience:
  primary:
    description: "DeFi developers and traders"
    pain_points: ["slow analytics", "fragmented data", "no real-time alerts"]
positioning:
  category: "on-chain analytics"
  differentiator: "real-time, builder-first"
  competitors:
    - name: "Dune"
      weakness: "slow, query-based, not real-time"
```

Every skill reads this. `/m-write` matches the tone. `/m-ads` targets the audience. `/m-social` references the positioning. `/m-edit` checks against the avoid list. One source of truth, consistent output.

**Per-project, not global.** Switch to a different repo and mstack loads that project's brand. No cross-contamination between products.

## Optional enhancements

mstack works out of the box. These make it stronger:

| Enhancement | What it unlocks |
|-------------|----------------|
| [gstack](https://github.com/garrytan/gstack) browse | Live SERP scraping, competitor site analysis, on-page auditing via headless Chromium (~100ms/command) |
| `SEMRUSH_API_KEY` | Real keyword volume, difficulty, and competitor domain data |
| `AHREFS_API_KEY` | Backlink analysis, keyword explorer, content gap data |
| `GA4_CREDENTIALS` | Real traffic data for `/m-report` instead of manual input |
| `SEARCH_CONSOLE_CREDENTIALS` | Search performance data, keyword rankings, indexation status |

No API keys? Skills still work — they fall back to browse-based analysis, WebSearch, or asking you for data.

## Config

```bash
mstack-config set skill_prefix true    # /m-write vs /write (default: true)
mstack-config set proactive true       # auto-suggest skills based on context
mstack-config list                     # show all settings
```

**Skill prefix:** Default is `/m-*` to avoid collisions with other skill packs. Switch to short names with `mstack-config set skill_prefix false` if you prefer `/write` over `/m-write`.

## Troubleshooting

**Skill not showing up?** `cd ~/.claude/skills/mstack && ./setup`

**Want shorter commands?** `mstack-config set skill_prefix false` then re-run setup.

**Brand not loading?** Make sure you're in a git repo. Brand context is keyed by repo slug.

**Stale install?** Run `/m-upgrade` to pull latest and re-run setup.

## Privacy

**mstack collects zero data.** No telemetry, no analytics, no tracking, no phone-home. Everything runs locally on your machine. Your brand context, learnings, and content never leave your disk.

## License

MIT. Free forever. Go ship some content.

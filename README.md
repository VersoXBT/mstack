# mstack

Marketing skills for AI coding agents.

mstack turns Claude Code or OpenAI Codex into a practical marketing operator:
brand strategy, campaigns, lifecycle email, launch planning, SEO, content, ads,
social, proof assets, reporting, and local marketing memory.

It is inspired by gstack, but the workflows are marketing-first and privacy-first.

## What You Get

- 26 marketing skills.
- Claude Code support through `~/.claude/skills`.
- OpenAI Codex support through `~/.codex/skills`.
- Persistent per-project brand context under `~/.mstack/projects/<slug>/`.
- No mstack telemetry, tracking, analytics, stable device IDs, or background service.

## Install

Requirements:
- Git
- Claude Code, Codex CLI, or both
- Bun only if you want to regenerate skill docs from templates

Clone and run setup:

```bash
git clone https://github.com/VersoXBT/mstack.git ~/mstack
cd ~/mstack
./setup --host auto
```

Install for Claude only:

```bash
./setup --host claude
```

Install for Codex only:

```bash
./setup --host codex
```

Install for both:

```bash
./setup --host all
```

Setup writes local config to `~/.mstack/config.yaml`, installs skill links into
the selected host directories, and keeps `telemetry: off` plus `update_check:
false` by default.

## Skills

### Foundation

| Skill | Purpose |
| --- | --- |
| `/m-brand` | Brand workshop: voice, audience, positioning, competitors, channels |
| `/m-competitive` | Competitor analysis and market gaps |
| `/m-positioning` | Positioning and messaging framework |
| `/m-icp` | Ideal customer profile and buying triggers |
| `/m-strategy` | Marketing strategy and 90-day roadmap |

### Campaigns and Lifecycle

| Skill | Purpose |
| --- | --- |
| `/m-campaign` | Integrated campaign plan, channel roles, asset map |
| `/m-email` | Lifecycle emails, nurture, onboarding, launch sequences |
| `/m-launch` | Product, feature, content, or campaign launch plan |
| `/m-experiment` | CRO, messaging, lifecycle, and creative test design |
| `/m-proof` | Testimonials, case studies, quote banks, proof blocks |

### SEO and Content

| Skill | Purpose |
| --- | --- |
| `/m-audit` | Marketing audit across SEO, content, social, and brand |
| `/m-keywords` | Keyword research and content gaps |
| `/m-brief` | Content brief from topic or keyword |
| `/m-write` | Blog posts, articles, page copy, email copy |
| `/m-edit` | Brand voice and copy quality edit |
| `/m-seo` | On-page SEO optimization |

### Social, Ads, Utility

| Skill | Purpose |
| --- | --- |
| `/m-social` | Platform-specific social posts |
| `/m-threads` | Twitter/X threads |
| `/m-engage` | Community engagement replies |
| `/m-ads` | Google, Meta, LinkedIn ad campaign structure and copy |
| `/m-landing` | Landing page copy |
| `/m-repurpose` | Turn one asset into platform-specific derivatives |
| `/m-calendar` | Content calendar planning |
| `/m-report` | Marketing performance report |
| `/m-learn` | Search local marketing learnings |
| `/m-upgrade` | Update mstack |

## Recommended Flow

1. Run `/m-brand` once per project.
2. Run `/m-audit` or `/m-strategy` to pick the highest-leverage work.
3. Use `/m-campaign`, `/m-email`, `/m-launch`, and `/m-experiment` to execute.
4. Use `/m-report` and `/m-learn` to turn outcomes into reusable memory.

## Brand Context

mstack stores brand context per project:

```yaml
name: "ArcTrace"
tagline: "Real-time on-chain analytics for builders"
voice:
  tone: "technical but approachable"
  personality: "builder-oriented, no-nonsense"
  avoid: ["corporate jargon", "buzzwords", "emojis"]
audience:
  primary:
    description: "DeFi developers and traders"
    pain_points: ["slow analytics", "fragmented data", "no real-time alerts"]
positioning:
  category: "on-chain analytics"
  differentiator: "real-time, builder-first"
```

Every skill can read this context, so copy, campaigns, reports, and strategy stay
consistent across sessions.

## Optional Data Sources

Skills work without API keys. When present, these credentials improve research and
reporting:

| Variable | Used for |
| --- | --- |
| `SEMRUSH_API_KEY` | Keyword and competitor research |
| `AHREFS_API_KEY` | Backlinks, keyword explorer, content gaps |
| `GA4_CREDENTIALS` | GA4 reporting |
| `GA4_PROPERTY_ID` | GA4 property selection |
| `SEARCH_CONSOLE_CREDENTIALS` | Search Console reporting |
| `GSC_SITE_URL` | Search Console site selection |
| `OPENAI_API_KEY` | Optional model-backed local workflows |

Live browsing or API calls happen only when a workflow explicitly needs market
research, competitor review, SERP checks, or reporting data.

## Config

```bash
mstack-config list
mstack-config set skill_prefix true
mstack-config set proactive true
mstack-config set update_check false
mstack-config set telemetry off
```

`telemetry: off` is a compatibility key. mstack does not send telemetry.

## Development

```bash
bun test
bun run gen:skill-docs --host claude
bun run gen:skill-docs --host codex
bun run skill:check
```

Generated Codex skills are placed under `.agents/skills/` for local validation.
Do not edit generated `SKILL.md` or `agents/openai.yaml` files by hand; edit the
`.tmpl` source and regenerate.

## Privacy

mstack does not collect telemetry, usage analytics, stable identifiers, or
marketing content. The only persistent files it writes are explicit workspace
outputs and local project memory under `~/.mstack/`.

## License

MIT.

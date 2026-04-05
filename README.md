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

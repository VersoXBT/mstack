import type { TemplateContext } from './types';

export function resolveApiKeys(_ctx: TemplateContext): string {
  return `
## API Key Detection

\`\`\`bash
echo "Marketing data credentials:"
[ -n "\${SEMRUSH_API_KEY:-}" ] && echo "  SEMRUSH: available" || echo "  SEMRUSH: not set"
[ -n "\${AHREFS_API_KEY:-}" ] && echo "  AHREFS: available" || echo "  AHREFS: not set"
[ -n "\${GA4_CREDENTIALS:-}" ] && echo "  GA4_CREDENTIALS: available" || echo "  GA4_CREDENTIALS: not set"
[ -n "\${GA4_PROPERTY_ID:-}" ] && echo "  GA4_PROPERTY_ID: available" || echo "  GA4_PROPERTY_ID: not set"
[ -n "\${SEARCH_CONSOLE_CREDENTIALS:-}" ] && echo "  SEARCH_CONSOLE_CREDENTIALS: available" || echo "  SEARCH_CONSOLE_CREDENTIALS: not set"
[ -n "\${GSC_SITE_URL:-}" ] && echo "  GSC_SITE_URL: available" || echo "  GSC_SITE_URL: not set"
[ -n "\${OPENAI_API_KEY:-}" ] && echo "  OPENAI: available" || echo "  OPENAI: not set"
\`\`\`

Adapt your approach based on available APIs:
- **SEMRUSH/AHREFS available**: Use API for keyword data, backlink analysis, domain metrics
- **GA4/Search Console available**: Pull real performance data for reports
- **No APIs**: Use browse-based SERP analysis, or ask user to provide data
`.trim();
}

import type { TemplateContext } from './types';

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

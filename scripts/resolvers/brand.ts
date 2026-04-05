import type { TemplateContext } from './types';

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

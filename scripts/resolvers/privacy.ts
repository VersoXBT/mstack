import type { TemplateContext } from './types';

export function resolvePrivacyNote(_ctx: TemplateContext): string {
  return `
## Privacy Boundary

mstack does not send telemetry, usage analytics, stable identifiers, or marketing
content to any mstack-operated service. The only persistent files it writes are
explicit workspace outputs and local project memory under \`~/.mstack/\`.

Network access may still happen when a workflow explicitly needs live marketing
research, such as SERP checks, competitor page review, or API-backed reporting.
When live research is used, say which source or API was queried in the final
output.
`.trim();
}

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

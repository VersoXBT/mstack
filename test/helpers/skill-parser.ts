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

export interface ParsedCommand {
  line: number;
  command: string;
  text: string;
}

export interface SkillValidationResult {
  valid: ParsedCommand[];
  invalid: ParsedCommand[];
  snapshotFlagErrors: Array<{ command: ParsedCommand; error: string }>;
  warnings: string[];
}

const SHELL_KEYWORDS = new Set([
  'case',
  'do',
  'done',
  'elif',
  'else',
  'esac',
  'fi',
  'for',
  'function',
  'if',
  'then',
  'until',
  'while',
]);

function extractCommand(line: string): string | null {
  let text = line.trim();
  if (!text || text.startsWith('#')) return null;
  if (text.startsWith('```')) return null;
  if (/^(export|local|readonly)\s+/.test(text)) return RegExp.$1;
  if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(text)) return null;

  text = text
    .replace(/^\(?\s*/, '')
    .replace(/^\{?\s*/, '')
    .replace(/^sudo\s+/, '')
    .replace(/^command\s+/, '')
    .replace(/^time\s+/, '');

  const command = text.match(/^([A-Za-z0-9_.$/~:-]+)/)?.[1] ?? null;
  if (!command) return null;
  if (SHELL_KEYWORDS.has(command)) return null;
  return command;
}

function commandLooksUnsafe(command: ParsedCommand): string | null {
  const text = command.text;
  if (/\brm\s+-[^|;&\n]*r[^|;&\n]*f\b/.test(text)) {
    return 'contains recursive force delete';
  }
  if (/\bgit\s+reset\s+--hard\b/.test(text)) {
    return 'contains git reset --hard';
  }
  if (/\bgit\s+push\b.*\s--force\b/.test(text)) {
    return 'contains force push';
  }
  return null;
}

export function validateSkill(path: string): SkillValidationResult {
  const content = readFileSync(path, 'utf-8');
  const valid: ParsedCommand[] = [];
  const invalid: ParsedCommand[] = [];
  const snapshotFlagErrors: SkillValidationResult['snapshotFlagErrors'] = [];
  const warnings: string[] = [];

  let inBashBlock = false;
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index];
    const trimmed = raw.trim();
    if (trimmed.startsWith('```')) {
      inBashBlock = !inBashBlock && /^```(bash|sh)?\s*$/.test(trimmed);
      if (inBashBlock === false && /^```/.test(trimmed)) continue;
      continue;
    }
    if (!inBashBlock) continue;

    const command = extractCommand(raw);
    if (!command) continue;

    const parsed = { line: index + 1, command, text: raw.trim() };
    const unsafe = commandLooksUnsafe(parsed);
    if (unsafe) {
      snapshotFlagErrors.push({ command: parsed, error: unsafe });
      continue;
    }
    valid.push(parsed);
  }

  if (valid.length === 0 && snapshotFlagErrors.length === 0) {
    warnings.push('no bash commands found');
  }

  return { valid, invalid, snapshotFlagErrors, warnings };
}

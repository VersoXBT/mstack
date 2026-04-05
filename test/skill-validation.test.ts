import { describe, test, expect } from 'bun:test';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { parseSkillTemplate, getSkillBody } from './helpers/skill-parser';

const ROOT = join(import.meta.dir, '..');

const SKILL_DIRS = readdirSync(ROOT).filter(d => {
  return existsSync(join(ROOT, d, 'SKILL.md.tmpl'));
});

describe('skill validation', () => {
  test('all expected skills exist', () => {
    const expected = [
      'brand', 'competitive', 'positioning', 'icp', 'strategy',
      'audit', 'keywords', 'brief', 'write', 'edit', 'seo',
      'social', 'threads', 'engage',
      'ads', 'landing',
      'repurpose', 'calendar', 'report', 'learn', 'mstack-upgrade',
    ];
    for (const skill of expected) {
      expect(SKILL_DIRS).toContain(skill);
    }
  });

  for (const dir of SKILL_DIRS) {
    const tmplPath = join(ROOT, dir, 'SKILL.md.tmpl');

    describe(dir, () => {
      test('has valid frontmatter', () => {
        const meta = parseSkillTemplate(tmplPath);
        expect(meta.name).toBeTruthy();
        expect(meta.name).toMatch(/^m(stack)?-/);
        expect(meta.preambleTier).toBeGreaterThanOrEqual(1);
        expect(meta.preambleTier).toBeLessThanOrEqual(4);
        expect(meta.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(meta.description.length).toBeGreaterThan(50);
        expect(meta.allowedTools.length).toBeGreaterThan(0);
      });

      test('includes {{PREAMBLE}}', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('{{PREAMBLE}}');
      });

      test('includes {{BRAND_CONTEXT}} for tier 2+', () => {
        const meta = parseSkillTemplate(tmplPath);
        const body = getSkillBody(tmplPath);
        if (meta.preambleTier >= 2) {
          expect(body).toContain('{{BRAND_CONTEXT}}');
        }
      });

      test('includes {{TELEMETRY}}', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('{{TELEMETRY}}');
      });

      test('has Completion section', () => {
        const body = getSkillBody(tmplPath);
        expect(body).toContain('## Completion');
      });

      test('no gstack references (except browse)', () => {
        const body = getSkillBody(tmplPath);
        // Remove allowed gstack references (browse dependency)
        const cleaned = body.replace(/gstack\/browse/g, '').replace(/gstack browse/g, '');
        expect(cleaned.toLowerCase()).not.toContain('gstack');
      });
    });
  }
});

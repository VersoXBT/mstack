import type { HostConfig } from '../scripts/host-config';

const claude: HostConfig = {
  name: 'claude',
  displayName: 'Claude Code',
  cliCommand: 'claude',
  cliAliases: [],

  globalRoot: '.claude/skills/mstack',
  localSkillRoot: '.claude/skills/mstack',
  hostSubdir: '.claude',
  usesEnvVars: false,

  frontmatter: {
    mode: 'denylist',
    stripFields: ['sensitive', 'voice-triggers'],
    descriptionLimit: null,
  },

  generation: {
    generateMetadata: false,
    skipSkills: [],
  },

  pathRewrites: [],  // Claude is the primary host — no rewrites needed
  toolRewrites: {},
  suppressedResolvers: [],

  runtimeRoot: {
    globalSymlinks: ['bin', 'mstack-upgrade'],
    globalFiles: {},
  },

  install: {
    prefixable: true,
    linkingStrategy: 'real-dir-symlink',
  },

  coAuthorTrailer: 'Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>',
  learningsMode: 'full',
};

export default claude;

import type { HostConfig } from '../scripts/host-config';

const codex: HostConfig = {
  name: 'codex',
  displayName: 'OpenAI Codex CLI',
  cliCommand: 'codex',
  cliAliases: ['agents'],

  globalRoot: '.codex/skills/mstack',
  localSkillRoot: '.agents/skills/mstack',
  hostSubdir: '.agents',
  usesEnvVars: true,

  frontmatter: {
    mode: 'allowlist',
    keepFields: ['name', 'description'],
    descriptionLimit: 1024,
    descriptionLimitBehavior: 'error',
  },

  generation: {
    generateMetadata: true,
    metadataFormat: 'openai.yaml',
    skipSkills: ['codex'],
  },

  pathRewrites: [
    { from: '~/.claude/skills/mstack', to: '$MSTACK_ROOT' },
    { from: '.claude/skills/mstack', to: '.agents/skills/mstack' },
    { from: '.claude/skills', to: '.agents/skills' },
  ],

  suppressedResolvers: [],

  runtimeRoot: {
    globalSymlinks: ['bin', 'mstack-upgrade'],
    globalFiles: {},
  },

  sidecar: {
    path: '.agents/skills/mstack',
    symlinks: ['bin', 'mstack-upgrade'],
  },

  install: {
    prefixable: false,
    linkingStrategy: 'symlink-generated',
  },

  coAuthorTrailer: 'Co-Authored-By: OpenAI Codex <noreply@openai.com>',
  learningsMode: 'basic',
  boundaryInstruction:
    'Use the generated mstack skill instructions as marketing workflows. Do not edit generated agents/openai.yaml files by hand; regenerate them from templates. Keep repository source changes separate from local mstack project memory under ~/.mstack/.',
};

export default codex;

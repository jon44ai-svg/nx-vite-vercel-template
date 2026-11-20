import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import {
  DEFAULT_TEMPLATE_CONFIG,
  FEATURE_DEFINITIONS,
  type FeatureKey,
  type TemplateConfig,
  resolveActiveWorkspaces,
  resolveComposeProfiles,
  resolveDefaultBackend,
} from './config';

interface CliOptions {
  preset?: 'web-only' | 'full' | 'nest' | 'python';
  enable: FeatureKey[];
  disable: FeatureKey[];
  yes: boolean;
  dryRun: boolean;
  show: boolean;
}

const VALID_FEATURES = new Set<string>(FEATURE_DEFINITIONS.map((item) => item.key));

function parseFeatureList(value: string): FeatureKey[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is FeatureKey => {
      if (!item) return false;
      if (!VALID_FEATURES.has(item)) {
        throw new Error(
          `Unknown feature "${item}". Valid features: ${[...VALID_FEATURES].join(', ')}`,
        );
      }
      return true;
    });
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    enable: [],
    disable: [],
    yes: false,
    dryRun: false,
    show: false,
  };

  for (const arg of argv) {
    if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--show') {
      options.show = true;
    } else if (arg.startsWith('--preset=')) {
      const preset = arg.slice('--preset='.length);
      if (preset === 'web-only' || preset === 'full' || preset === 'nest' || preset === 'python') {
        options.preset = preset;
      } else {
        throw new Error(`Unsupported preset "${preset}". Use web-only, nest, python, or full.`);
      }
    } else if (arg.startsWith('--enable=')) {
      options.enable.push(...parseFeatureList(arg.slice('--enable='.length)));
    } else if (arg.startsWith('--disable=')) {
      options.disable.push(...parseFeatureList(arg.slice('--disable='.length)));
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Template Startup CLI

Usage:
  bun run setup [options]

Options:
  --show                      Print current template configuration
  --preset=<name>             Apply preset: web-only | nest | python | full
  --enable=<f1,f2>            Enable comma-separated features
  --disable=<f1,f2>           Disable comma-separated features
  --yes, -y                   Skip interactive prompts
  --dry-run                   Preview generated files without writing
  --help, -h                  Show this help

Features:
  ${FEATURE_DEFINITIONS.map((f) => `${f.key.padEnd(15)} ${f.description}`).join('\n  ')}`);
      process.exit(0);
    }
  }

  return options;
}

function applyPreset(config: TemplateConfig, preset: NonNullable<CliOptions['preset']>): void {
  if (preset === 'web-only') {
    config.features = {
      web: true,
      pwa: true,
      tanstackStart: false,
      expo: false,
      storybook: true,
      apiNest: false,
      apiPython: false,
      auth: false,
      admin: false,
      docker: false,
    };
  } else if (preset === 'nest') {
    config.features = {
      ...DEFAULT_TEMPLATE_CONFIG.features,
      apiNest: true,
      apiPython: false,
      auth: true,
      admin: true,
    };
  } else if (preset === 'python') {
    config.features = {
      ...DEFAULT_TEMPLATE_CONFIG.features,
      apiNest: false,
      apiPython: true,
      auth: true,
      admin: true,
    };
  } else if (preset === 'full') {
    config.features = {
      web: true,
      pwa: true,
      tanstackStart: true,
      expo: true,
      storybook: true,
      apiNest: true,
      apiPython: true,
      auth: true,
      admin: true,
      docker: true,
    };
  }
}

async function readCurrentConfig(rootDir: string): Promise<TemplateConfig> {
  const file = Bun.file(join(rootDir, 'template.config.json'));
  if (!(await file.exists())) {
    return structuredClone(DEFAULT_TEMPLATE_CONFIG);
  }
  const parsed = (await file.json()) as Partial<TemplateConfig>;
  return {
    ...DEFAULT_TEMPLATE_CONFIG,
    ...parsed,
    features: {
      ...DEFAULT_TEMPLATE_CONFIG.features,
      ...(parsed.features ?? {}),
    },
  };
}

async function promptForFeatures(config: TemplateConfig): Promise<TemplateConfig> {
  const rl = createInterface({ input, output });
  try {
    console.log('\nModular Template Setup\nPress Enter to keep the current value.\n');
    const nameAnswer = await rl.question(`Project name (${config.projectName}): `);
    if (nameAnswer.trim()) {
      config.projectName = nameAnswer.trim();
    }

    for (const def of FEATURE_DEFINITIONS) {
      const current = config.features[def.key];
      const hint = current ? 'Y/n' : 'y/N';
      const answer = (await rl.question(`${def.label} — ${def.description} [${hint}]: `))
        .trim()
        .toLowerCase();

      if (answer === 'y' || answer === 'yes') {
        config.features[def.key] = true;
      } else if (answer === 'n' || answer === 'no') {
        config.features[def.key] = false;
      }
    }
  } finally {
    rl.close();
  }
  return config;
}

async function syncWorkspaceFiles(rootDir: string, config: TemplateConfig, dryRun: boolean) {
  config.defaultBackend = resolveDefaultBackend(config.features);
  const activeWorkspaces = resolveActiveWorkspaces(config.features);
  const composeProfiles = resolveComposeProfiles(config.features);

  const generatedFeatures = {
    generatedAt: new Date().toISOString(),
    projectName: config.projectName,
    defaultBackend: config.defaultBackend,
    features: config.features,
    activeWorkspaces,
    composeProfiles,
  };

  const pkgPath = join(rootDir, 'package.json');
  const pkg = (await Bun.file(pkgPath).json()) as {
    workspaces?: string[];
    scripts?: Record<string, string>;
    [key: string]: unknown;
  };

  const nextScripts: Record<string, string> = {
    ...(pkg.scripts ?? {}),
    dev: 'bun run --cwd apps/web vite',
    build: 'bun run --cwd apps/web vite build',
    test: 'vitest run',
    'test:e2e': 'bun tools/e2e/web-smoke.ts',
    'test:all': 'bun run test && bun run test:e2e',
    lint: 'oxlint',
    format: 'oxfmt',
    'format:check': 'oxfmt --check',
    typecheck: 'bunx tsc --noEmit -p apps/web/tsconfig.json',
    doctor: 'bunx react-doctor apps/web --no-supply-chain --no-score',
    'verify:template': 'bun tools/verify-template.ts',
    setup: 'bun tools/template-cli/index.ts',
  };

  if (config.features.storybook) {
    nextScripts.storybook = 'storybook dev -p 6006';
    nextScripts['build-storybook'] = 'storybook build -o dist/storybook';
  } else {
    delete nextScripts.storybook;
    delete nextScripts['build-storybook'];
  }

  if (config.features.apiNest) {
    nextScripts['dev:nest'] = 'bun run --cwd apps/api-nest dev';
    nextScripts['build:nest'] = 'bun run --cwd apps/api-nest build';
  } else {
    delete nextScripts['dev:nest'];
    delete nextScripts['build:nest'];
  }

  if (config.features.apiPython) {
    nextScripts['dev:python'] =
      'uv run --directory apps/api-python uvicorn app.main:app --reload --port 8000';
  } else {
    delete nextScripts['dev:python'];
  }

  if (config.features.tanstackStart) {
    nextScripts['dev:tanstack'] = 'bun run --cwd apps/web-tanstack dev';
  } else {
    delete nextScripts['dev:tanstack'];
  }

  if (config.features.expo) {
    nextScripts['dev:expo'] = 'bun run --cwd apps/mobile-expo start';
  } else {
    delete nextScripts['dev:expo'];
  }

  pkg.workspaces = activeWorkspaces;
  pkg.scripts = nextScripts;

  if (dryRun) {
    console.log('\n[dry-run] template.config.json:\n', JSON.stringify(config, null, 2));
    console.log(
      '\n[dry-run] .template/features.json:\n',
      JSON.stringify(generatedFeatures, null, 2),
    );
    console.log('\n[dry-run] active workspaces:', activeWorkspaces);
    console.log('[dry-run] compose profiles:', composeProfiles);
    return;
  }

  await writeFile(join(rootDir, 'template.config.json'), `${JSON.stringify(config, null, 2)}\n`);
  await mkdir(join(rootDir, '.template'), { recursive: true });
  await writeFile(
    join(rootDir, '.template', 'features.json'),
    `${JSON.stringify(generatedFeatures, null, 2)}\n`,
  );
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const profileHint =
    composeProfiles.length > 0
      ? `docker compose ${composeProfiles.map((p) => `--profile ${p}`).join(' ')} up --build`
      : 'docker compose up --build';

  console.log('\nUpdated template.config.json, .template/features.json, and package.json.');
  console.log(`Active workspaces: ${activeWorkspaces.join(', ')}`);
  console.log(`Docker Compose command: ${profileHint}`);
  console.log('Run `bun install` if you toggled workspace apps.');
}

async function main() {
  const rootDir = process.cwd();
  const options = parseArgs(process.argv.slice(2));
  const config = await readCurrentConfig(rootDir);

  if (options.show) {
    console.log(JSON.stringify(config, null, 2));
    return;
  }

  if (options.preset) {
    applyPreset(config, options.preset);
  }
  for (const key of options.enable) {
    config.features[key] = true;
  }
  for (const key of options.disable) {
    config.features[key] = false;
  }

  const shouldPrompt =
    !options.yes && !options.preset && options.enable.length === 0 && options.disable.length === 0;

  const finalConfig = shouldPrompt ? await promptForFeatures(config) : config;
  await syncWorkspaceFiles(rootDir, finalConfig, options.dryRun);
}

await main();

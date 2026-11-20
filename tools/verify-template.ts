type PackageManifest = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const decoder = new TextDecoder();

function output(result: ReturnType<typeof Bun.spawnSync>) {
  return decoder.decode(result.stdout).trim();
}

const audit = Bun.spawnSync(['bun', 'audit', '--json'], {
  stderr: 'pipe',
  stdout: 'pipe',
});
const auditOutput = output(audit);
const auditReport = auditOutput ? (JSON.parse(auditOutput) as Record<string, unknown[]>) : {};
const advisories = Object.values(auditReport).flat();

if (advisories.length > 0) {
  console.error(`Bun audit found ${advisories.length} advisory(ies).`);
  for (const advisory of advisories) {
    if (typeof advisory === 'object' && advisory && 'title' in advisory) {
      console.error(`- ${String(advisory.title)}`);
    }
  }
}

const deprecated: Array<{ packageName: string; message: string }> = [];
const seenSpecs = new Set<string>();
const packageFiles = new Bun.Glob('**/package.json');

for await (const file of packageFiles.scan({ cwd: '.', onlyFiles: true })) {
  if (file.split('/').includes('node_modules')) continue;

  const manifest = (await Bun.file(file).json()) as PackageManifest;
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.optionalDependencies,
  };

  for (const [packageName, version] of Object.entries(dependencies)) {
    if (version.startsWith('workspace:') || version.startsWith('npm:')) continue;
    const spec = `${packageName}@${version}`;
    if (seenSpecs.has(spec)) continue;
    seenSpecs.add(spec);

    const metadata = Bun.spawnSync(['bun', 'pm', 'view', spec, 'deprecated', '--json'], {
      stderr: 'ignore',
      stdout: 'pipe',
    });
    const message = output(metadata);
    let parsedMessage: unknown = message;

    try {
      parsedMessage = JSON.parse(message);
    } catch {
      // Bun returns plain text for a deprecated package and JSON for errors.
    }

    if (typeof parsedMessage === 'string' && parsedMessage.length > 0 && parsedMessage !== 'null') {
      deprecated.push({ message: parsedMessage, packageName });
    }
  }
}

if (deprecated.length > 0) {
  console.error(`Found ${deprecated.length} deprecated dependency declaration(s).`);
  for (const dependency of deprecated) {
    console.error(`- ${dependency.packageName}: ${dependency.message}`);
  }
}

if (advisories.length > 0 || deprecated.length > 0) {
  process.exit(1);
}

console.log(
  `Template dependency audit passed (${seenSpecs.size} unique dependencies checked, 0 advisories, 0 deprecated).`,
);

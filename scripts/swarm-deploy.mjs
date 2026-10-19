import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(process.argv[2] ?? '.env.development');
const env = { ...process.env };

for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const separator = trimmed.indexOf('=');
  if (separator === -1) continue;
  const key = trimmed.slice(0, separator).trim();
  let value = trimmed.slice(separator + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const result = spawnSync(
  'docker',
  ['stack', 'deploy', '--resolve-image', 'never', '-c', 'deploy/swarm/stack.yml', 'kernoon'],
  { stdio: 'inherit', env },
);

process.exit(result.status ?? 1);

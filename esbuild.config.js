import { readFileSync } from 'node:fs';
import { build, context } from 'esbuild';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  external: Object.keys(pkg.dependencies || {}),
  logLevel: 'info',
  banner: {
    js: '#!/usr/bin/env node',
  },
};

// Development build
export const dev = async () => {
  const ctx = await context({
    ...baseConfig,
  });

  await ctx.watch();
  console.log('Watching for changes...');
  return ctx;
};

// Production build
export const prod = async () => {
  await build({
    ...baseConfig,
    minify: true,
    sourcemap: false,
  });

  console.log('Production build completed');
};

// Default export for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'dev';
  if (mode === 'prod') {
    prod();
  } else {
    dev();
  }
}

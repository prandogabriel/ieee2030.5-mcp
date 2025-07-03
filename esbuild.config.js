import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

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
};

// Development build
export const dev = async () => {
  const context = await build({
    ...baseConfig,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('Watch build failed:', error);
        else console.log('Watch build succeeded:', result);
      },
    },
  });

  console.log('Watching for changes...');
  return context;
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

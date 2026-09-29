/**
 * DEV-ONLY build script — bundles devPreview.tsx with esbuild for in-sandbox
 * verification only (real consumers of this component use Vite/Storybook's
 * own bundler; this file is not part of the deliverable).
 */
const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/devPreview.tsx'],
    bundle: true,
    outfile: 'devPreview.bundle.js',
    jsx: 'automatic',
    loader: { '.tsx': 'tsx', '.ts': 'ts' },
    define: { 'process.env.NODE_ENV': '"development"' },
    logLevel: 'info',
  })
  .then(() => console.log('BUILD OK'))
  .catch((err) => {
    console.error('BUILD FAILED', err);
    process.exit(1);
  });

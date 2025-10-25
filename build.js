const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/index.js',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
  },
  resolveExtensions: ['.tsx', '.ts', '.js'],
  logLevel: 'info',
}).catch(() => process.exit(1));

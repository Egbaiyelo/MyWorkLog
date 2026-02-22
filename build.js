import * as esbuild from 'esbuild';

esbuild.build({
    entryPoints: {
        'content.bundle': 'extension/content.js',
        'home.bundle': 'extension/pages/home.js'
    },
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'extension/dist', 
    target: ['es2020'],
    format: 'esm', 
}).catch(() => process.exit(1));
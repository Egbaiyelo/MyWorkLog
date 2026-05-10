import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

// Toggle production mode
const isProd = process.argv.includes('--prod');

esbuild.build({
    entryPoints: {
        'content.bundle': 'extension/content.js',
        'home.bundle': 'extension/pages/home.js',
        'pages.bundle': 'extension/pages/pages.scss'
    },
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    outdir: 'extension/dist', 
    target: ['es2020'],
    format: 'esm', 
    plugins: [sassPlugin()],
}).catch(() => process.exit(1));
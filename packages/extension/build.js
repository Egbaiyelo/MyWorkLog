import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import copy from 'esbuild-plugin-copy';

// Toggle production mode
const isProd = process.argv.includes('--prod');

esbuild.build({
    entryPoints: {
        'content.bundle': 'src/content.js',
        'pages/home.bundle': 'src/pages/home.js',
        'pages/pages.bundle': 'src/pages/pages.scss',
        'background.bundle': 'src/background.js',
    },
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    outdir: 'dist', 
    target: ['es2020'],
    format: 'esm', 
    plugins: [
        sassPlugin(), 
        copy({
            assets: [
                { from: ['./src/manifest.json'], to: ['./'], },
                { from: ['./src/**/*.html'], to: ['./'], },
                { from: ['./src/icons/*'], to: ['./icons'] },
                { from: ['./src/style.css'], to: ['./'] }
            ],
        }),
    ],
}).catch((err) => {console.error(err); process.exit(1)});
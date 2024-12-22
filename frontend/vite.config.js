import path from 'path';
import fs from 'fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from '@svgr/rollup';
import { imagetools } from 'vite-imagetools';
import viteImagemin from 'vite-plugin-imagemin';

// ----------------------------------------------------------------------

export default defineConfig({
  build: {
    target: 'es2015', // Target ES2015 for wider browser support
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024,
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024,
    }),
    visualizer({
      filename: './dist/stats.html', // Output location for the report
      open: false, // Automatically opens the visualizer after build
      gzipSize: true, // Show gzip size
      brotliSize: true, // Show brotli size
    }),
    svgr(), // SVGR for using SVG as React components
    // imagetools(), // Image optimization plugin
    // viteImagemin({
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false,
    //   },
    //   optipng: {
    //     optimizationLevel: 7,
    //   },
    //   mozjpeg: {
    //     quality: 75,
    //   },
    //   pngquant: {
    //     quality: [0.65, 0.9],
    //     speed: 4,
    //   },
    //   svgo: {
    //     plugins: [
    //       { name: 'preset-default' },
    //       { name: 'removeTitle', active: false },
    //       { name: 'removeViewBox', active: false },
    //       { name: 'removeEmptyAttrs', active: false },
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5032, // Dev server port
    proxy: {
      '/api': {
        target: 'http://pickup-pointe-backend-env.eba-dhvnhmrk.us-east-1.elasticbeanstalk.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 5032, // Preview server port
  },
});
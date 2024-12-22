// vite.config.js
import path from "path";
import fs from "fs/promises";
import { defineConfig } from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteCompression from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import svgr from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/@svgr/rollup/dist/index.js";
import { imagetools } from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/vite-imagetools/dist/index.js";
import viteImagemin from "file:///F:/Works/Web/PickupPointe/frontend/node_modules/vite-plugin-imagemin/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    target: "es2015",
    // Target ES2015 for wider browser support
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: "brotliCompress",
      threshold: 1024
    }),
    viteCompression({
      algorithm: "gzip",
      threshold: 1024
    }),
    visualizer({
      filename: "./dist/stats.html",
      // Output location for the report
      open: false,
      // Automatically opens the visualizer after build
      gzipSize: true,
      // Show gzip size
      brotliSize: true
      // Show brotli size
    }),
    svgr()
    // SVGR for using SVG as React components
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
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5032,
    // Dev server port
    proxy: {
      "/api": {
        target: "http://pickup-pointe-backend-env.eba-dhvnhmrk.us-east-1.elasticbeanstalk.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  preview: {
    port: 5032
    // Preview server port
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxXb3Jrc1xcXFxXZWJcXFxcUGlja3VwUG9pbnRlXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxXb3Jrc1xcXFxXZWJcXFxcUGlja3VwUG9pbnRlXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Xb3Jrcy9XZWIvUGlja3VwUG9pbnRlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XHJcbmltcG9ydCBzdmdyIGZyb20gJ0BzdmdyL3JvbGx1cCc7XHJcbmltcG9ydCB7IGltYWdldG9vbHMgfSBmcm9tICd2aXRlLWltYWdldG9vbHMnO1xyXG5pbXBvcnQgdml0ZUltYWdlbWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzMjAxNScsIC8vIFRhcmdldCBFUzIwMTUgZm9yIHdpZGVyIGJyb3dzZXIgc3VwcG9ydFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxyXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQsXHJcbiAgICB9KSxcclxuICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQsXHJcbiAgICB9KSxcclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBmaWxlbmFtZTogJy4vZGlzdC9zdGF0cy5odG1sJywgLy8gT3V0cHV0IGxvY2F0aW9uIGZvciB0aGUgcmVwb3J0XHJcbiAgICAgIG9wZW46IGZhbHNlLCAvLyBBdXRvbWF0aWNhbGx5IG9wZW5zIHRoZSB2aXN1YWxpemVyIGFmdGVyIGJ1aWxkXHJcbiAgICAgIGd6aXBTaXplOiB0cnVlLCAvLyBTaG93IGd6aXAgc2l6ZVxyXG4gICAgICBicm90bGlTaXplOiB0cnVlLCAvLyBTaG93IGJyb3RsaSBzaXplXHJcbiAgICB9KSxcclxuICAgIHN2Z3IoKSwgLy8gU1ZHUiBmb3IgdXNpbmcgU1ZHIGFzIFJlYWN0IGNvbXBvbmVudHNcclxuICAgIC8vIGltYWdldG9vbHMoKSwgLy8gSW1hZ2Ugb3B0aW1pemF0aW9uIHBsdWdpblxyXG4gICAgLy8gdml0ZUltYWdlbWluKHtcclxuICAgIC8vICAgZ2lmc2ljbGU6IHtcclxuICAgIC8vICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcclxuICAgIC8vICAgICBpbnRlcmxhY2VkOiBmYWxzZSxcclxuICAgIC8vICAgfSxcclxuICAgIC8vICAgb3B0aXBuZzoge1xyXG4gICAgLy8gICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gICBtb3pqcGVnOiB7XHJcbiAgICAvLyAgICAgcXVhbGl0eTogNzUsXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyAgIHBuZ3F1YW50OiB7XHJcbiAgICAvLyAgICAgcXVhbGl0eTogWzAuNjUsIDAuOV0sXHJcbiAgICAvLyAgICAgc3BlZWQ6IDQsXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyAgIHN2Z286IHtcclxuICAgIC8vICAgICBwbHVnaW5zOiBbXHJcbiAgICAvLyAgICAgICB7IG5hbWU6ICdwcmVzZXQtZGVmYXVsdCcgfSxcclxuICAgIC8vICAgICAgIHsgbmFtZTogJ3JlbW92ZVRpdGxlJywgYWN0aXZlOiBmYWxzZSB9LFxyXG4gICAgLy8gICAgICAgeyBuYW1lOiAncmVtb3ZlVmlld0JveCcsIGFjdGl2ZTogZmFsc2UgfSxcclxuICAgIC8vICAgICAgIHsgbmFtZTogJ3JlbW92ZUVtcHR5QXR0cnMnLCBhY3RpdmU6IGZhbHNlIH0sXHJcbiAgICAvLyAgICAgXSxcclxuICAgIC8vICAgfSxcclxuICAgIC8vIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogL15zcmMoLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBlc2J1aWxkOiB7XHJcbiAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuW3RqXXN4PyQvLFxyXG4gICAgZXhjbHVkZTogW10sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGVzYnVpbGRPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgc2V0dXAoYnVpbGQpIHtcclxuICAgICAgICAgICAgYnVpbGQub25Mb2FkKHsgZmlsdGVyOiAvc3JjXFwvLipcXC5qcyQvIH0sIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcG9ydDogNTAzMiwgLy8gRGV2IHNlcnZlciBwb3J0XHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vcGlja3VwLXBvaW50ZS1iYWNrZW5kLWVudi5lYmEtZGh2bmhtcmsudXMtZWFzdC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiA1MDMyLCAvLyBQcmV2aWV3IHNlcnZlciBwb3J0XHJcbiAgfSxcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUyxPQUFPLFVBQVU7QUFDblQsT0FBTyxRQUFRO0FBQ2YsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8scUJBQXFCO0FBQzVCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGtCQUFrQjtBQUMzQixPQUFPLGtCQUFrQjtBQUl6QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVM7QUFBQSxVQUN4RTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGdCQUFnQjtBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsV0FBVztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsZ0JBQWdCO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsSUFDYixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUE7QUFBQSxNQUNWLE1BQU07QUFBQTtBQUFBLE1BQ04sVUFBVTtBQUFBO0FBQUEsTUFDVixZQUFZO0FBQUE7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUEwQlA7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxpQkFBaUI7QUFBQSxNQUN6RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDeEQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLFlBQy9DLEVBQUU7QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K

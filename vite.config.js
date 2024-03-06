import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'
import viteESLint from '@ehutch79/vite-eslint'

// https://vitejs.dev/config/
export default env => {
  // console.log(111, env);

  return defineConfig({
    // base: '/vue3-element-admin-site/',
    plugins: [
      vue(),
      viteMockServe({
        ignore: /^_/, // Ignore files starting with an underscore `_`
        mockPath: 'mock', // Specify that all files in the mock directory are mock interfaces
        supportTs: false, // Specify whether files in the `mockPath` directory support TypeScript (TS) files. If not using TypeScript, set it to false
        localEnabled: env.mode === 'mock', // Enable mock functionality in the development environment (can be specified by setting the `mode` to `mock` in the package.json start command)
        prodEnabled: env.mode === 'mock', // Enable mock functionality in the production environment
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `,
      }),
      viteSvgIcons({
        // Specify the icon folders that need to be cached
        iconDirs: [path.resolve(__dirname, 'src/assets/svg')],
        // Specify the format of `symbolId`
        symbolId: 'icon-[dir]-[name]',
      }),
      viteESLint({
        include: ['src/**/*.vue', 'src/**/*.js'],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // Global variables
          // additionalData: '@import "./src/assets/style/global-variables.scss";'
          additionalData: `@use "./src/assets/style/global-variables.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3001,
      open: true,
      proxy: {
        '/api': {
          target: 'http://dev.api.xxx.com', // Backend API domain
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    esbuild: false,
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Delete console
          drop_console: true,
        },
      },
      // Disabling this feature may improve the build performance of large projects
      brotliSize: false,
      rollupOptions: {
        output: {
          // Split into separate modules
          manualChunks: {
            'element-plus': ['element-plus'],
            mockjs: ['mockjs'],
          },
        },
      },
    },
  })
}

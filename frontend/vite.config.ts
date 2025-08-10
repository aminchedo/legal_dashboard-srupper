
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // Ensure correct asset paths on GitHub Pages or subpath deployments
        base: './',

        // Path resolution
        resolve: {
            conditions: ['import', 'module', 'browser', 'default'],
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
                '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
                '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
                '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
                '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
                '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
                '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
                'react-router-dom': 'react-router-dom/dist/index.js',

            },
        },

        // Development server configuration
        server: {
            host: true,
            port: 5173,
            strictPort: true,
            open: true, // Auto-open browser
            cors: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },

        // Preview configuration
        preview: {
            port: 5173,
            host: true,
            cors: true,
        },

        // Build configuration
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
            minify: 'esbuild',
            target: 'es2019',
            // Increase chunk size warning limit
            chunkSizeWarningLimit: 1000,
        },
        legacy: {
            buildSsrCjsExternalHeuristics: false,
        },

        // Environment variables
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },

        // Optimization
        optimizeDeps: {
            esbuildOptions: {
                conditions: ['import', 'module', 'browser', 'default'],
            },
        },

        // CSS configuration
        css: {
            postcss: './postcss.config.cjs',
            devSourcemap: true,
        },

        // ESBuild configuration
        esbuild: {
            logOverride: { 'this-is-undefined-in-esm': 'silent' },
        },
    };
});


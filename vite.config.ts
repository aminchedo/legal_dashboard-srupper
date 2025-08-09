import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // Path resolution
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
                '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
                '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
                '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
                '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
                '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
                '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            },
        },

        // Development server configuration
        server: {
            host: true,
            port: 5177,
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
            port: 5177,
            host: true,
            cors: true,
        },

        // Build configuration
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
            minify: 'esbuild',
            target: 'esnext',
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        antd: ['antd', '@ant-design/icons'],
                        router: ['react-router-dom'],
                        query: ['@tanstack/react-query'],
                        charts: ['recharts'],
                    },
                },
            },
            // Increase chunk size warning limit
            chunkSizeWarningLimit: 1000,
        },

        // Environment variables
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },

        // Optimization
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'react-router-dom',
                'antd',
                '@ant-design/icons',
                '@tanstack/react-query',
                'lucide-react',
                'recharts',
                'date-fns',
            ],
        },

        // CSS configuration
        css: {
            postcss: './postcss.config.js',
            devSourcemap: true,
        },

        // ESBuild configuration
        esbuild: {
            logOverride: { 'this-is-undefined-in-esm': 'silent' },
        },
    };
});
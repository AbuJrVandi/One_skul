import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: [
                'resources/**',
                '../backend/app/**',
                '../backend/routes/**',
                '../backend/resources/views/**',
            ],
            publicDirectory: '../backend/public',
            buildDirectory: 'build',
            hotFile: '../backend/public/hot',
        }),
        react(),
    ],
});

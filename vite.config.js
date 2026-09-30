import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({ logLevel: 'error', plugins: [react()], resolve: { alias: { '@': resolve(__dirname, 'src') } } });

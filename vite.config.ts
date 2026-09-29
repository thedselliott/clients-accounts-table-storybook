import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite config — this project has no routing or special build needs,
// it exists to host the Clients & Accounts Table components for Storybook.
export default defineConfig({
  plugins: [react()],
});

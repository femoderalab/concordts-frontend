import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React app
// Optimized for development and production builds
export default defineConfig({
  plugins: [react()], // Enable React support with Fast Refresh
  
  // Server configuration for development
  server: {
    port: 5173, // Frontend development server port
    open: true, // Automatically open browser on server start
    cors: true, // Enable CORS for API requests
    proxy: {
      // Proxy API requests to Django backend during development
      '/api': {
        target: 'http://localhost:8000', // Django backend URL
        changeOrigin: true, // Change origin header to target URL
        secure: false, // Allow self-signed certificates
      },
    },
  },
  
  // Build configuration for production
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: false, // Disable source maps in production
    minify: 'terser', // Use terser for minification
    rollupOptions: {
      output: {
        // Manual code splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['axios'],
        },
      },
    },
  },
  
  // Define global constants (accessible via import.meta.env)
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    ),
  },
})
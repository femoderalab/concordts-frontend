import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React app
// Optimized for development and production builds
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()], // Enable React support with Fast Refresh
    
    // Server configuration for development
    server: {
      port: 5173, // Frontend development server port
      open: true, // Automatically open browser on server start
      cors: true, // Enable CORS for API requests
      proxy: {
        // Proxy API requests to Django backend during development
        '/api': {
          target: 'https://concordts-backend.onrender.com/api', // Django backend URL
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
            'utils': ['axios', 'lodash'],
            'charts': ['chart.js', 'react-chartjs-2'],
            'pdf': ['jspdf', 'jspdf-autotable'],
          },
        },
      },
      // Ensure assets are properly handled
      assetsDir: 'assets',
      // Generate manifest for better caching
      manifest: true,
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },
    
    // Define global constants (accessible via import.meta.env)
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 'https://concordts-backend.onrender.com/api'
      ),
      'import.meta.env.VITE_SCHOOL_NAME': JSON.stringify(
        env.VITE_SCHOOL_NAME || 'Concord Tutors School'
      ),
      'import.meta.env.VITE_WHATSAPP_NUMBER': JSON.stringify(
        env.VITE_WHATSAPP_NUMBER || '2348035312904'
      ),
      'import.meta.env.VITE_CONTACT_EMAIL': JSON.stringify(
        env.VITE_CONTACT_EMAIL || 'concordtutorsnurprysch@gmail.com'
      ),
    },
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    },
  }
})
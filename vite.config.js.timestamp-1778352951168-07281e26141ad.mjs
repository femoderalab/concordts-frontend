// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/hp/Desktop/EDUFLOW%20BASIC/Concordts%20frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hp/Desktop/EDUFLOW%20BASIC/Concordts%20frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    // Enable React support with Fast Refresh
    // Server configuration for development
    server: {
      port: 5173,
      // Frontend development server port
      open: true,
      // Automatically open browser on server start
      cors: true,
      // Enable CORS for API requests
      proxy: {
        // Proxy API requests to Django backend during development
        "/api": {
          target: "https://concordts-backend.onrender.com/api",
          // Django backend URL
          changeOrigin: true,
          // Change origin header to target URL
          secure: false
          // Allow self-signed certificates
        }
      }
    },
    // Build configuration for production
    build: {
      outDir: "dist",
      // Output directory for production build
      sourcemap: false,
      // Disable source maps in production
      minify: "terser",
      // Use terser for minification
      rollupOptions: {
        output: {
          // Manual code splitting for better caching
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "utils": ["axios", "lodash"],
            "charts": ["chart.js", "react-chartjs-2"],
            "pdf": ["jspdf", "jspdf-autotable"]
          }
        }
      },
      // Ensure assets are properly handled
      assetsDir: "assets",
      // Generate manifest for better caching
      manifest: true
    },
    // Preview server configuration
    preview: {
      port: 4173,
      host: true
    },
    // Define global constants (accessible via import.meta.env)
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL || "https://concordts-backend.onrender.com/api"
      ),
      "import.meta.env.VITE_SCHOOL_NAME": JSON.stringify(
        env.VITE_SCHOOL_NAME || "Concord Tutors School"
      ),
      "import.meta.env.VITE_WHATSAPP_NUMBER": JSON.stringify(
        env.VITE_WHATSAPP_NUMBER || "2348035312904"
      ),
      "import.meta.env.VITE_CONTACT_EMAIL": JSON.stringify(
        env.VITE_CONTACT_EMAIL || "concordtutorsnurprysch@gmail.com"
      )
    },
    // Resolve aliases
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "axios"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxocFxcXFxEZXNrdG9wXFxcXEVEVUZMT1cgQkFTSUNcXFxcQ29uY29yZHRzIGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxocFxcXFxEZXNrdG9wXFxcXEVEVUZMT1cgQkFTSUNcXFxcQ29uY29yZHRzIGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ocC9EZXNrdG9wL0VEVUZMT1clMjBCQVNJQy9Db25jb3JkdHMlMjBmcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbi8vIFZpdGUgY29uZmlndXJhdGlvbiBmb3IgUmVhY3QgYXBwXG4vLyBPcHRpbWl6ZWQgZm9yIGRldmVsb3BtZW50IGFuZCBwcm9kdWN0aW9uIGJ1aWxkc1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIGVudiBmaWxlIGJhc2VkIG9uIGBtb2RlYCBpbiB0aGUgd29ya2luZyBkaXJlY3RvcnlcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcbiAgXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLCAvLyBFbmFibGUgUmVhY3Qgc3VwcG9ydCB3aXRoIEZhc3QgUmVmcmVzaFxuICAgIFxuICAgIC8vIFNlcnZlciBjb25maWd1cmF0aW9uIGZvciBkZXZlbG9wbWVudFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3MywgLy8gRnJvbnRlbmQgZGV2ZWxvcG1lbnQgc2VydmVyIHBvcnRcbiAgICAgIG9wZW46IHRydWUsIC8vIEF1dG9tYXRpY2FsbHkgb3BlbiBicm93c2VyIG9uIHNlcnZlciBzdGFydFxuICAgICAgY29yczogdHJ1ZSwgLy8gRW5hYmxlIENPUlMgZm9yIEFQSSByZXF1ZXN0c1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gUHJveHkgQVBJIHJlcXVlc3RzIHRvIERqYW5nbyBiYWNrZW5kIGR1cmluZyBkZXZlbG9wbWVudFxuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2NvbmNvcmR0cy1iYWNrZW5kLm9ucmVuZGVyLmNvbS9hcGknLCAvLyBEamFuZ28gYmFja2VuZCBVUkxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIENoYW5nZSBvcmlnaW4gaGVhZGVyIHRvIHRhcmdldCBVUkxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLCAvLyBBbGxvdyBzZWxmLXNpZ25lZCBjZXJ0aWZpY2F0ZXNcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBcbiAgICAvLyBCdWlsZCBjb25maWd1cmF0aW9uIGZvciBwcm9kdWN0aW9uXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogJ2Rpc3QnLCAvLyBPdXRwdXQgZGlyZWN0b3J5IGZvciBwcm9kdWN0aW9uIGJ1aWxkXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBEaXNhYmxlIHNvdXJjZSBtYXBzIGluIHByb2R1Y3Rpb25cbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsIC8vIFVzZSB0ZXJzZXIgZm9yIG1pbmlmaWNhdGlvblxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBNYW51YWwgY29kZSBzcGxpdHRpbmcgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICAgJ3V0aWxzJzogWydheGlvcycsICdsb2Rhc2gnXSxcbiAgICAgICAgICAgICdjaGFydHMnOiBbJ2NoYXJ0LmpzJywgJ3JlYWN0LWNoYXJ0anMtMiddLFxuICAgICAgICAgICAgJ3BkZic6IFsnanNwZGYnLCAnanNwZGYtYXV0b3RhYmxlJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAvLyBFbnN1cmUgYXNzZXRzIGFyZSBwcm9wZXJseSBoYW5kbGVkXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgLy8gR2VuZXJhdGUgbWFuaWZlc3QgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICB9LFxuICAgIFxuICAgIC8vIFByZXZpZXcgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAgICBwcmV2aWV3OiB7XG4gICAgICBwb3J0OiA0MTczLFxuICAgICAgaG9zdDogdHJ1ZSxcbiAgICB9LFxuICAgIFxuICAgIC8vIERlZmluZSBnbG9iYWwgY29uc3RhbnRzIChhY2Nlc3NpYmxlIHZpYSBpbXBvcnQubWV0YS5lbnYpXG4gICAgZGVmaW5lOiB7XG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMJzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVudi5WSVRFX0FQSV9CQVNFX1VSTCB8fCAnaHR0cHM6Ly9jb25jb3JkdHMtYmFja2VuZC5vbnJlbmRlci5jb20vYXBpJ1xuICAgICAgKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9TQ0hPT0xfTkFNRSc6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBlbnYuVklURV9TQ0hPT0xfTkFNRSB8fCAnQ29uY29yZCBUdXRvcnMgU2Nob29sJ1xuICAgICAgKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9XSEFUU0FQUF9OVU1CRVInOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW52LlZJVEVfV0hBVFNBUFBfTlVNQkVSIHx8ICcyMzQ4MDM1MzEyOTA0J1xuICAgICAgKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9DT05UQUNUX0VNQUlMJzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVudi5WSVRFX0NPTlRBQ1RfRU1BSUwgfHwgJ2NvbmNvcmR0dXRvcnNudXJwcnlzY2hAZ21haWwuY29tJ1xuICAgICAgKSxcbiAgICB9LFxuICAgIFxuICAgIC8vIFJlc29sdmUgYWxpYXNlc1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogJy9zcmMnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIE9wdGltaXplIGRlcGVuZGVuY2llc1xuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbScsICdheGlvcyddLFxuICAgIH0sXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VixTQUFTLGNBQWMsZUFBZTtBQUNwWSxPQUFPLFdBQVc7QUFJbEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUVqRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBO0FBQUE7QUFBQSxJQUdqQixRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQSxRQUVMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFDZCxRQUFRO0FBQUE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBR0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUNYLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUEsVUFFTixjQUFjO0FBQUEsWUFDWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDekQsU0FBUyxDQUFDLFNBQVMsUUFBUTtBQUFBLFlBQzNCLFVBQVUsQ0FBQyxZQUFZLGlCQUFpQjtBQUFBLFlBQ3hDLE9BQU8sQ0FBQyxTQUFTLGlCQUFpQjtBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsV0FBVztBQUFBO0FBQUEsTUFFWCxVQUFVO0FBQUEsSUFDWjtBQUFBO0FBQUEsSUFHQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBO0FBQUEsSUFHQSxRQUFRO0FBQUEsTUFDTixxQ0FBcUMsS0FBSztBQUFBLFFBQ3hDLElBQUkscUJBQXFCO0FBQUEsTUFDM0I7QUFBQSxNQUNBLG9DQUFvQyxLQUFLO0FBQUEsUUFDdkMsSUFBSSxvQkFBb0I7QUFBQSxNQUMxQjtBQUFBLE1BQ0Esd0NBQXdDLEtBQUs7QUFBQSxRQUMzQyxJQUFJLHdCQUF3QjtBQUFBLE1BQzlCO0FBQUEsTUFDQSxzQ0FBc0MsS0FBSztBQUFBLFFBQ3pDLElBQUksc0JBQXNCO0FBQUEsTUFDNUI7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUdBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLG9CQUFvQixPQUFPO0FBQUEsSUFDN0Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

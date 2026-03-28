// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/hp/Desktop/Concord%20Ts%20School/Concordts%20frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hp/Desktop/Concord%20Ts%20School/Concordts%20frontend/node_modules/@vitejs/plugin-react/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxocFxcXFxEZXNrdG9wXFxcXENvbmNvcmQgVHMgU2Nob29sXFxcXENvbmNvcmR0cyBmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaHBcXFxcRGVza3RvcFxcXFxDb25jb3JkIFRzIFNjaG9vbFxcXFxDb25jb3JkdHMgZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2hwL0Rlc2t0b3AvQ29uY29yZCUyMFRzJTIwU2Nob29sL0NvbmNvcmR0cyUyMGZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gVml0ZSBjb25maWd1cmF0aW9uIGZvciBSZWFjdCBhcHBcbi8vIE9wdGltaXplZCBmb3IgZGV2ZWxvcG1lbnQgYW5kIHByb2R1Y3Rpb24gYnVpbGRzXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52IGZpbGUgYmFzZWQgb24gYG1vZGVgIGluIHRoZSB3b3JraW5nIGRpcmVjdG9yeVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKVxuICBcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sIC8vIEVuYWJsZSBSZWFjdCBzdXBwb3J0IHdpdGggRmFzdCBSZWZyZXNoXG4gICAgXG4gICAgLy8gU2VydmVyIGNvbmZpZ3VyYXRpb24gZm9yIGRldmVsb3BtZW50XG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA1MTczLCAvLyBGcm9udGVuZCBkZXZlbG9wbWVudCBzZXJ2ZXIgcG9ydFxuICAgICAgb3BlbjogdHJ1ZSwgLy8gQXV0b21hdGljYWxseSBvcGVuIGJyb3dzZXIgb24gc2VydmVyIHN0YXJ0XG4gICAgICBjb3JzOiB0cnVlLCAvLyBFbmFibGUgQ09SUyBmb3IgQVBJIHJlcXVlc3RzXG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gRGphbmdvIGJhY2tlbmQgZHVyaW5nIGRldmVsb3BtZW50XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vY29uY29yZHRzLWJhY2tlbmQub25yZW5kZXIuY29tL2FwaScsIC8vIERqYW5nbyBiYWNrZW5kIFVSTFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gQ2hhbmdlIG9yaWdpbiBoZWFkZXIgdG8gdGFyZ2V0IFVSTFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsIC8vIEFsbG93IHNlbGYtc2lnbmVkIGNlcnRpZmljYXRlc1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFxuICAgIC8vIEJ1aWxkIGNvbmZpZ3VyYXRpb24gZm9yIHByb2R1Y3Rpb25cbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnZGlzdCcsIC8vIE91dHB1dCBkaXJlY3RvcnkgZm9yIHByb2R1Y3Rpb24gYnVpbGRcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIERpc2FibGUgc291cmNlIG1hcHMgaW4gcHJvZHVjdGlvblxuICAgICAgbWluaWZ5OiAndGVyc2VyJywgLy8gVXNlIHRlcnNlciBmb3IgbWluaWZpY2F0aW9uXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIC8vIE1hbnVhbCBjb2RlIHNwbGl0dGluZyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgICAndXRpbHMnOiBbJ2F4aW9zJywgJ2xvZGFzaCddLFxuICAgICAgICAgICAgJ2NoYXJ0cyc6IFsnY2hhcnQuanMnLCAncmVhY3QtY2hhcnRqcy0yJ10sXG4gICAgICAgICAgICAncGRmJzogWydqc3BkZicsICdqc3BkZi1hdXRvdGFibGUnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8vIEVuc3VyZSBhc3NldHMgYXJlIHByb3Blcmx5IGhhbmRsZWRcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgICAvLyBHZW5lcmF0ZSBtYW5pZmVzdCBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgIG1hbmlmZXN0OiB0cnVlLFxuICAgIH0sXG4gICAgXG4gICAgLy8gUHJldmlldyBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICAgIHByZXZpZXc6IHtcbiAgICAgIHBvcnQ6IDQxNzMsXG4gICAgICBob3N0OiB0cnVlLFxuICAgIH0sXG4gICAgXG4gICAgLy8gRGVmaW5lIGdsb2JhbCBjb25zdGFudHMgKGFjY2Vzc2libGUgdmlhIGltcG9ydC5tZXRhLmVudilcbiAgICBkZWZpbmU6IHtcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9BUElfQkFTRV9VUkwnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW52LlZJVEVfQVBJX0JBU0VfVVJMIHx8ICdodHRwczovL2NvbmNvcmR0cy1iYWNrZW5kLm9ucmVuZGVyLmNvbS9hcGknXG4gICAgICApLFxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX1NDSE9PTF9OQU1FJzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVudi5WSVRFX1NDSE9PTF9OQU1FIHx8ICdDb25jb3JkIFR1dG9ycyBTY2hvb2wnXG4gICAgICApLFxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX1dIQVRTQVBQX05VTUJFUic6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBlbnYuVklURV9XSEFUU0FQUF9OVU1CRVIgfHwgJzIzNDgwMzUzMTI5MDQnXG4gICAgICApLFxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0NPTlRBQ1RfRU1BSUwnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW52LlZJVEVfQ09OVEFDVF9FTUFJTCB8fCAnY29uY29yZHR1dG9yc251cnByeXNjaEBnbWFpbC5jb20nXG4gICAgICApLFxuICAgIH0sXG4gICAgXG4gICAgLy8gUmVzb2x2ZSBhbGlhc2VzXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiAnL3NyYycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJywgJ2F4aW9zJ10sXG4gICAgfSxcbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLFNBQVMsY0FBYyxlQUFlO0FBQ2xaLE9BQU8sV0FBVztBQUlsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBRWpELFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUUzQyxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBLElBR2pCLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBLFFBRUwsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBO0FBQUEsVUFDUixjQUFjO0FBQUE7QUFBQSxVQUNkLFFBQVE7QUFBQTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUE7QUFBQSxNQUNSLFdBQVc7QUFBQTtBQUFBLE1BQ1gsUUFBUTtBQUFBO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUE7QUFBQSxVQUVOLGNBQWM7QUFBQSxZQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUN6RCxTQUFTLENBQUMsU0FBUyxRQUFRO0FBQUEsWUFDM0IsVUFBVSxDQUFDLFlBQVksaUJBQWlCO0FBQUEsWUFDeEMsT0FBTyxDQUFDLFNBQVMsaUJBQWlCO0FBQUEsVUFDcEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxXQUFXO0FBQUE7QUFBQSxNQUVYLFVBQVU7QUFBQSxJQUNaO0FBQUE7QUFBQSxJQUdBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUE7QUFBQSxJQUdBLFFBQVE7QUFBQSxNQUNOLHFDQUFxQyxLQUFLO0FBQUEsUUFDeEMsSUFBSSxxQkFBcUI7QUFBQSxNQUMzQjtBQUFBLE1BQ0Esb0NBQW9DLEtBQUs7QUFBQSxRQUN2QyxJQUFJLG9CQUFvQjtBQUFBLE1BQzFCO0FBQUEsTUFDQSx3Q0FBd0MsS0FBSztBQUFBLFFBQzNDLElBQUksd0JBQXdCO0FBQUEsTUFDOUI7QUFBQSxNQUNBLHNDQUFzQyxLQUFLO0FBQUEsUUFDekMsSUFBSSxzQkFBc0I7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBR0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUdBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsb0JBQW9CLE9BQU87QUFBQSxJQUM3RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

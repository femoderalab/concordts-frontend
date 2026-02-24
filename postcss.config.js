// PostCSS configuration
// Required for Tailwind CSS to process utility classes
export default {
  plugins: {
    tailwindcss: {}, // Process Tailwind directives
    autoprefixer: {}, // Add vendor prefixes for browser compatibility
  },
}
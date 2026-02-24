/**
 * Main Entry Point
 * Renders the React app to the DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import Tailwind CSS and global styles

/**
 * Render the React application
 * Uses React 18's createRoot API for concurrent features
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



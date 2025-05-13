import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import React from 'react';
// import { MovieProvider } from './context/MovieContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      {/* <MovieProvider> */}
      <App />
      {/* </MovieProvider> */}
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create a div to mount our React app into
const appContainer = document.createElement('div');
appContainer.id = 'kwebbler-root';
document.body.appendChild(appContainer);

// Mount the React app
const root = ReactDOM.createRoot(appContainer);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

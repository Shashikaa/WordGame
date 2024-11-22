import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new root API
import App from './App'; // Import your main App component

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

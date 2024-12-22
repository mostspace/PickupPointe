import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import LogRocket from 'logrocket';

LogRocket.init('161asa/pickup-pointe');

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

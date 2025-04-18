import React from 'react';
import ReactDOM from 'react-dom/client'; // dùng 'react-dom/client'
import App from './App'; // Đường dẫn đơn giản



import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
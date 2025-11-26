import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Add global styles for inputs and buttons here to keep JSX clean
const style = document.createElement('style');
style.textContent = `
  .form-input {
    @apply w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 bg-white placeholder:text-slate-400 text-slate-800;
  }
  .form-select {
    @apply w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 bg-white text-slate-800 appearance-none;
  }
  .form-textarea {
     @apply w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 bg-white placeholder:text-slate-400 text-slate-800 resize-none;
  }
  .btn-primary {
    @apply flex items-center bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0;
  }
  .feature-pill {
    @apply flex items-center gap-2 text-xs font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
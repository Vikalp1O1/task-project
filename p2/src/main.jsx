import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ style: { fontFamily: 'inherit', fontSize: '12px' } }}
    />
  </React.StrictMode>,
);

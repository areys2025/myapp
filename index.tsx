
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Footer from './pages/footer'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
<BrowserRouter>
  <AuthProvider>
    <App />
            <Footer/>

  </AuthProvider>
</BrowserRouter>

  </React.StrictMode>
);

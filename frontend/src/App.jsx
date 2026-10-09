import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

// Lazy-load the heavy Admin portal and mapping bundle
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>Loading Administrative Portal...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

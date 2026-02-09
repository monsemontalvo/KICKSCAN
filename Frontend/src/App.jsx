import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import ARScene from './components/AR/ARScene';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La Splash dura 3 segundos y luego se quita
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SplashScreen key="splash" />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<ARScene />} />
          </Routes>
        </Router>
      )}
    </AnimatePresence>
  );
}

export default App;

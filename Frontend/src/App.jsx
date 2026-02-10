import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import SplashScreen from './components/SplashScreen'; // Importa el componente de pantalla de bienvenida
import Home from './pages/Home'; // Asegúrate de que la ruta sea correcta (pages o components)
import ARScene from './components/AR/ARScene'; // Importa el componente de escaneo de realidad aumentada
import VideoFilter from './components/VideoFilter'; // Importa el componente de edición de video

function App() { // Componente principal de la aplicación
  const [loading, setLoading] = useState(true); // Estado para controlar si se muestra el splash screen o la app principal

  useEffect(() => { // Efecto que se ejecuta al montar el componente
    // La Splash dura 3 segundos y luego se quita
    const timer = setTimeout(() => { // Después de 3 segundos, ocultar el splash screen
      setLoading(false); // Cambia el estado a false para mostrar la app principal
    }, 3000); // 3000 ms = 3 segundos

    // Limpiar el temporizador si el componente se desmonta antes de los 3 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait"> {/* Permite animar la entrada/salida de componentes */}
      {loading ? ( // Si loading es true, mostrar el splash screen
        <SplashScreen key="splash" /> 
      ) : ( // Si loading es false, mostrar la aplicación principal con rutas
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Ruta principal que muestra la página de inicio */}
            <Route path="/scanner" element={<ARScene />} /> {/* Ruta para el escáner de realidad aumentada */}
            
            <Route path="/video-editor" element={<VideoFilter />} />  {/* Ruta para el editor de video con filtros */}
            
          </Routes>
        </Router>
      )}
    </AnimatePresence> 
  );
}

export default App; 

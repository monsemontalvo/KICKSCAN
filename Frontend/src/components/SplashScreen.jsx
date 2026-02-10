import React from 'react';
import { motion as Motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  return (
    <Motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      {/* Logo o Texto Animado */}
      <Motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="text-center"
      >
        
        {/* 👇 AQUÍ ESTÁ EL CAMBIO DEL REBOTE 👇 */}
        <Motion.div 
            className="mb-6 inline-block"
            animate={{ y: [0, -40, 0] }} // 1. Empieza en 0, 2. Sube -40px, 3. Baja a 0
            transition={{
                duration: 0.8, // Tarda 0.8 segundos en hacer el rebote completo
                repeat: Infinity, // Se repite por siempre
                ease: "easeInOut" // Movimiento suave
            }}
        >
            <span className="text-9xl filter drop-shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              ⚽
            </span>
        </Motion.div>

        <h1 className="text-5xl font-black text-white tracking-widest font-sans">
          KICK<span className="text-blue-500">SCAN</span>
        </h1>
        <p className="text-blue-200/50 text-xs mt-3 tracking-[0.4em] uppercase font-bold">Aumented Reality</p>
      </Motion.div>

      {/* Barra de carga falsa */}
      <Motion.div 
        className="absolute bottom-20 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
      >
        <Motion.div 
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </Motion.div>
    </Motion.div>
  );
};

export default SplashScreen;
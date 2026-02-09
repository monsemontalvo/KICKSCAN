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
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(37,99,235,0.5)]">
            <span className="text-4xl">⚽</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-widest font-sans">
          KICK<span className="text-blue-500">SCAN</span>
        </h1>
        <p className="text-gray-400 text-xs mt-2 tracking-[0.3em] uppercase">Augmented Reality</p>
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
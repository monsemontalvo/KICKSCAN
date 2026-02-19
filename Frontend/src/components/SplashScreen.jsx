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
      <Motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="text-center flex flex-col items-center"
      >
        
        {/* IMAGEN PNG: Con resplandor VERDE neón (#22c55e) */}
        <Motion.div 
            className="mb-8 inline-block"
            animate={{ y: [0, -30, 0] }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <img 
              src="/img/soccer.png" 
              alt="Ball" 
              className="w-40 h-40 object-contain filter drop-shadow-[0_0_35px_#22c55e]"
            />
        </Motion.div>

        {/* TEXTO: KICK en blanco y SCAN en verde con sombra verde suave */}
        <h1 className="text-5xl font-black text-white tracking-widest font-sans uppercase">
          KICK<span className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">SCAN</span>
        </h1>
        
        {/* SUBTÍTULO: Verde esmeralda */}
        <p className="text-green-400/60 text-xs mt-3 tracking-[0.4em] uppercase font-bold">
          Aumented Reality
        </p>
      </Motion.div>

      {/* BARRA DE CARGA: Progreso verde con resplandor VERDE neón */}
      <div className="absolute bottom-20 w-48 h-1.5 bg-gray-900 rounded-full overflow-hidden">
        <Motion.div 
            className="h-full bg-green-500 shadow-[0_0_20px_#22c55e]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </Motion.div>
  );
};

export default SplashScreen;
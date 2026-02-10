// Importa React para poder usar JSX y definir componentes.
import React from 'react';
// Importa el componente `motion` de framer-motion y lo renombra a `Motion`.
import { motion as Motion } from 'framer-motion';

// Define el componente funcional `SplashScreen` que recibe la prop `onComplete`.
const SplashScreen = ({ onComplete }) => {
  // Retorna la estructura JSX del splash screen animado.
  return (
    // Componente Motion principal que cubre toda la pantalla.
    <Motion.div
      // Clase Tailwind que fija el elemento y centra su contenido.
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      // Estado inicial de la animación (opacidad al 100%).
      initial={{ opacity: 1 }}
      // Estado al salir (opacidad a 0 para desvanecer).
      exit={{ opacity: 0 }}
      // Duración de la transición de salida.
      transition={{ duration: 0.8 }}
      // Callback que se ejecuta cuando la animación termina; viene de las props.
      onAnimationComplete={onComplete}
    >
      {/* Contenedor para el logo o texto animado */}
      <Motion.div
        // Estado inicial de la animación interna (escala y opacidad).
        initial={{ scale: 0.5, opacity: 0 }}
        // Estado de animación a aplicar (escala completa y opacidad 1).
        animate={{ scale: 1, opacity: 1 }}
        // Transición con duración y tipo "spring" para rebote natural.
        transition={{ duration: 1, type: "spring" }}
        // Centra el texto dentro de este contenedor.
        className="text-center"
      >
        
        {/* ICONO ANIMADO: bloque que hace el rebote del emoji */}
        <Motion.div 
            // Margen inferior y display inline-block para centrar el rebote.
            className="mb-6 inline-block"
            // Animación vertical que sube y baja el icono (array de posiciones Y).
            animate={{ y: [0, -40, 0] }}
            // Transición que controla duración, repetición y easing.
            transition={{
                duration: 0.8, // Duración total del rebote.
                repeat: Infinity, // Repetir la animación infinitamente.
                ease: "easeInOut" // Movimiento suave de entrada/salida.
            }}
        >
            {/* Emoji usado como logo grande */}
            <span className="text-9xl filter drop-shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              ⚽
            </span>
        </Motion.div>

        {/* Título principal de la app con estilo de peso y tracking */}
        <h1 className="text-5xl font-black text-white tracking-widest font-sans">
          KICK<span className="text-blue-500">SCAN</span>
        </h1>
        {/* Subtítulo / descripción en texto pequeño */}
        <p className="text-blue-200/50 text-xs mt-3 tracking-[0.4em] uppercase font-bold">Aumented Reality</p>
      </Motion.div>

      {/* Barra de carga visual (simulada) posicionada en la parte inferior */}
      <Motion.div 
        // Contenedor de la barra: ancho fijo, altura pequeña y fondo oscuro.
        className="absolute bottom-20 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
      >
        {/* Elemento interno que animará su anchura para simular carga */}
        <Motion.div 
            className="h-full bg-blue-500"
            // Empieza con ancho 0% (vacío).
            initial={{ width: "0%" }}
            // Anima hasta 100% (completado).
            animate={{ width: "100%" }}
            // Duración y easing de la animación de la barra.
            transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </Motion.div>
    </Motion.div>
  );
};

// Exporta el componente para usarlo en la aplicación.
export default SplashScreen;
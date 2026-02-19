import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan } from 'lucide-react';
import { motion as Motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  // ==========================================
  // LÓGICA DE MOVIMIENTO 3D (SOLO BALÓN)
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150, mass: 0.8 }; 

  const ballRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const ballRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const ballX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-40, 40]), springConfig);
  const ballY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-40, 40]), springConfig);

  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
        className="relative h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden selection:bg-green-500/30"
        onMouseMove={handleMouseMove}
    >

      {/* --- CAPA Z-0: FONDO ESPACIAL --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a_0%,_#000000_100%)] z-0"></div>

      {/* --- CAPA Z-10: PERSPECTIVE GRID 3D RESPONSIVO --- */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none" style={{ perspective: '800px' }}>
        {/* El Plano 3D */}
        <div 
            className="absolute top-1/2 left-[-50vw] w-[200vw] h-[150vh] origin-top animate-[grid-flow_1.2s_linear_infinite]"
            style={{
                transform: 'rotateX(75deg)', // Crea la profundidad 3D inclinando el plano hacia adelante
                backgroundImage: `
                    linear-gradient(to right, rgba(34, 197, 94, 0.4) 2px, transparent 2px),
                    linear-gradient(to bottom, rgba(34, 197, 94, 0.4) 2px, transparent 2px)
                `,
                backgroundSize: '100px 100px', // Tamaño de la cuadrícula
                // Desvanecimiento gradual hacia el horizonte (arriba) y hacia el espectador (abajo)
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)'
            }}
        ></div>
        
        {/* Resplandor neón en la línea del horizonte */}
        <div className="absolute top-1/2 left-0 right-0 h-40 bg-gradient-to-b from-green-500/15 to-transparent blur-3xl -translate-y-1/2"></div>
      </div>


      {/* --- CAPA Z-20: BALÓN 3D --- */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ perspective: '1200px' }}>
        <Motion.div
            className="w-[450px] h-[450px] md:w-[800px] md:h-[800px] mt-20 md:mt-0"
            style={{ x: ballX, y: ballY, rotateX: ballRotateX, rotateY: ballRotateY }}
        >
            <img 
                src="/img/ball-3d.png"
                alt="Balón 3D"
                className="w-full h-full object-contain filter drop-shadow-[0_40px_50px_rgba(0,0,0,1)] opacity-95"
            />
        </Motion.div>
      </div>


      {/* --- CAPA Z-30: INTERFAZ CENTRAL --- */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-24 md:justify-center md:pt-0 pointer-events-none">
          
          <Motion.div
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center w-full px-4"
          >
              {/* TÍTULO PRINCIPAL */}
              <h1 className="font-display text-[6rem] md:text-[14rem] leading-[0.8] tracking-wider mb-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  MUNDIAL <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">26</span>
              </h1>
              
              {/* SUBTÍTULO */}
              <p className="font-sans text-green-400 text-xs md:text-sm mt-6 md:mt-8 tracking-[0.4em] md:tracking-[0.6em] font-semibold uppercase text-center bg-black/50 backdrop-blur-md px-12 py-3 rounded-full border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  Experiencia AR en Estadios
              </p>

              <div className="mt-12 md:mt-24 flex flex-col items-center gap-5 pointer-events-auto">
                  
                  {/* BOTÓN PRINCIPAL */}
                  <button 
                      onClick={() => navigate('/scanner')}
                      className="group relative overflow-hidden bg-green-500/10 backdrop-blur-sm border border-green-500/40 text-white px-10 py-5 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-4 transition-all duration-300 hover:bg-green-500 hover:border-green-400 hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] active:scale-95 w-full md:w-auto min-w-[300px]"
                  >
                      <Scan size={28} className="text-green-400 group-hover:text-white transition-colors" />
                      <span className="tracking-[0.15em] uppercase mt-1">Iniciar Escaneo</span>
                      
                      {/* Brillo dinámico en hover */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                  </button>

              </div>
          </Motion.div>
      </div>

      {/* DETALLES DECORATIVOS TECH */}
      <div className="absolute bottom-10 left-10 z-40 hidden md:flex flex-col opacity-60">
          <p className="font-display text-sm tracking-[0.2em] text-green-500 mb-1">KICKSCAN // SYSTEM_READY</p>
          <div className="w-32 h-[2px] bg-gradient-to-r from-green-500 via-green-400 to-transparent" />
      </div>

    </div>
  );
};

export default Home;
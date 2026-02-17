import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Calendar, Globe, ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// --- 1. DICCIONARIO DE TRADUCCIONES ---
const translations = {
  es: {
    heroTitle: "MUNDIAL",
    heroSubtitle: "EXPERIENCIA AR EN ESTADIOS",
    scanBtn: "INICIAR ESCANEO",
    matchesBtn: "PRÓXIMOS PARTIDOS",
    lang: "ESP"
  },
  en: {
    heroTitle: "WORLD CUP",
    heroSubtitle: "AR STADIUM EXPERIENCE",
    scanBtn: "START SCAN",
    matchesBtn: "UPCOMING MATCHES",
    lang: "ENG"
  },
  ko: {
    heroTitle: "월드컵",
    heroSubtitle: "경기장 AR 경험",
    scanBtn: "스캔 시작",
    matchesBtn: "다가오는 경기",
    lang: "한국어"
  },
  fr: {
    heroTitle: "COUPE DU MONDE",
    heroSubtitle: "EXPÉRIENCE AR EN STADE",
    scanBtn: "DÉMARRER LE SCAN",
    matchesBtn: "PROCHAINS MATCHS",
    lang: "FRA"
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('es');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[lang];

  // ==========================================
  // LÓGICA DE MOVIMIENTO 3D (SOLO BALÓN)
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150, mass: 0.8 }; 

  // --- BALÓN PRINCIPAL (Gigante) ---
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
  // ==========================================

  return (
    <div 
        // FONDO: Negro radial súper limpio y profundo
        className="relative h-screen w-full bg-[radial-gradient(ellipse_at_center,_#222222_0%,_#000000_100%)] text-white font-sans overflow-hidden selection:bg-white/30"
        onMouseMove={handleMouseMove}
        style={{ perspective: '1200px' }}
    >
      
      {/* --- TOP BAR (SELECTOR DE IDIOMA) --- */}
      <div className="absolute top-0 right-0 z-50 p-6 md:p-10">
          <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)} 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 pl-4 pr-5 py-2.5 rounded-full hover:bg-white/20 transition-colors shadow-lg"
              >
                  <Globe size={18} className="text-white" />
                  <span className="text-sm font-black tracking-wider text-white">{t.lang}</span>
                  <ChevronDown size={16} className={`text-white/70 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                  {isLangOpen && (
                      <Motion.div 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-3 w-36 bg-[#111] border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                          {Object.keys(translations).map((l) => (
                              <button
                                  key={l}
                                  onClick={() => { setLang(l); setIsLangOpen(false); }}
                                  className={`w-full text-left px-5 py-4 text-sm font-black hover:bg-white/10 transition-colors ${lang === l ? 'text-white bg-white/10' : 'text-gray-400'}`}
                              >
                                  {translations[l].lang}
                              </button>
                          ))}
                      </Motion.div>
                  )}
              </AnimatePresence>
          </div>
      </div>

      {/* --- CAPA Z-20: BALÓN COLOSAL 3D --- */}
      <Motion.div
          className="absolute top-1/2 left-1/2 -ml-[400px] -mt-[400px] md:-ml-[700px] md:-mt-[700px] w-[800px] h-[800px] md:w-[1400px] md:h-[1400px] z-20 pointer-events-none"
          style={{ x: ballX, y: ballY, rotateX: ballRotateX, rotateY: ballRotateY }}
      >
          <img 
              src="/img/ball-3d.png"
              alt="Balón 3D"
              // Sombra negra intensa para que se despegue del fondo
              className="w-full h-full object-contain filter drop-shadow-[0_80px_100px_rgba(0,0,0,0.95)] opacity-95"
          />
      </Motion.div>

      {/* --- CAPA Z-30: INTERFAZ CENTRAL (Textos y Botones) --- */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          
          <Motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center w-full px-4 drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]"
          >
              <h1 className="text-[5.5rem] md:text-[13rem] font-black leading-none tracking-tighter mb-0 text-white uppercase scale-y-110 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  {t.heroTitle} <span className="text-blue-500">26</span>
              </h1>
              
              <p className="text-white text-sm md:text-3xl mt-4 md:mt-8 tracking-[0.2em] md:tracking-[0.4em] font-black uppercase text-center bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                  {t.heroSubtitle}
              </p>

              {/* CONTENEDOR DE BOTONES */}
              <div className="mt-12 md:mt-20 flex flex-col items-center gap-5 pointer-events-auto">
                  
                  {/* BOTÓN PRINCIPAL: ESCANEO (Blanco) */}
                  <button 
                      onClick={() => navigate('/scanner')}
                      className="group bg-white text-black px-10 py-5 md:py-6 rounded-full font-black text-xl md:text-2xl flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 hover:bg-gray-200 active:scale-95 transition-all w-full md:w-auto min-w-[300px]"
                  >
                      <Scan size={32} />
                      <span className="tracking-widest uppercase">{t.scanBtn}</span>
                  </button>

                  {/* BOTÓN SECUNDARIO: PARTIDOS (Transparente) */}
                  <button 
                      onClick={() => navigate('/partidos')}
                      className="group bg-transparent text-white/80 border-2 border-white/40 hover:border-white hover:text-white px-8 py-4 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all w-full md:w-auto min-w-[300px] backdrop-blur-md"
                  >
                      <Calendar size={20} className="text-white/80 group-hover:text-white" />
                      <span className="tracking-widest uppercase">{t.matchesBtn}</span>
                  </button>

              </div>
          </Motion.div>
      </div>

    </div>
  );
};

export default Home;
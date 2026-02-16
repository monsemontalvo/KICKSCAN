import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, MapPin, Calendar, Globe, ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// --- 1. DICCIONARIO DE TRADUCCIONES ---
const translations = {
  es: {
    heroTitle: "MUNDIAL",
    heroSubtitle: "Vive la experiencia de realidad aumentada en los estadios de México.",
    scanBtn: "Iniciar Escaneo AR",
    matchesTitle: "Partidos en Monterrey",
    venue: "Sede México",
    lang: "Español"
  },
  en: {
    heroTitle: "WORLD CUP",
    heroSubtitle: "Live the augmented reality experience in the stadiums of Mexico.",
    scanBtn: "Start AR Scan",
    matchesTitle: "Matches in Monterrey",
    venue: "Host Mexico",
    lang: "English"
  },
  ko: {
    heroTitle: "월드컵",
    heroSubtitle: "멕시코 경기장에서 증강 현실 경험을 즐겨보세요.",
    scanBtn: "AR 스캔 시작",
    matchesTitle: "몬테레이 경기",
    venue: "개최국 멕시코",
    lang: "한국어"
  },
  fr: {
    heroTitle: "COUPE DU MONDE",
    heroSubtitle: "Vivez l'expérience de réalité augmentée dans les stades du Mexique.",
    scanBtn: "Démarrer le Scan AR",
    matchesTitle: "Matchs à Monterrey",
    venue: "Hôte Mexique",
    lang: "Français"
  }
};

// --- 2. COMPONENTE DE TARJETA DE PARTIDO MEJORADA ---
const MexicoMatch = ({ team1, team2, abbr1, abbr2, flag1, flag2, stadium, date, t }) => (
  <Motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="relative overflow-hidden bg-[#111318]/80 backdrop-blur-xl p-5 rounded-[24px] mb-5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group transition-all"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="flex justify-between items-center mb-5 relative z-10">
        <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10 uppercase tracking-widest">
            {t.venue}
        </span>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium bg-black/40 px-3 py-1 rounded-full border border-white/5">
            <Calendar size={12} className="text-blue-400" /> {date}
        </div>
    </div>

    <div className="flex items-center justify-between px-2 relative z-10">
        <div className="text-center w-[40%]">
            <div className="text-4xl mb-2 drop-shadow-lg">{flag1}</div>
            <div className="text-2xl font-black text-white mb-0.5 tracking-wider">{abbr1}</div>
            <p className="font-semibold text-[11px] text-gray-400 uppercase tracking-wide truncate">{team1}</p>
        </div>
        
        <div className="flex flex-col items-center justify-center w-[20%]">
            <div className="bg-gradient-to-b from-gray-800 to-black w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shadow-lg relative z-10">
                <span className="text-gray-400 text-[10px] font-black italic">VS</span>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent absolute top-1/2 -z-0"></div>
        </div>

        <div className="text-center w-[40%]">
            <div className="text-4xl mb-2 drop-shadow-lg">{flag2}</div>
            <div className="text-2xl font-black text-white mb-0.5 tracking-wider">{abbr2}</div>
            <p className="font-semibold text-[11px] text-gray-400 uppercase tracking-wide truncate">{team2}</p>
        </div>
    </div>

    <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400 bg-white/5 py-2.5 rounded-xl border border-white/5">
        <MapPin size={14} className="text-red-500" />
        <span className="font-medium tracking-wide">{stadium}</span>
    </div>
  </Motion.div>
);

// --- 3. PANTALLA PRINCIPAL ---
const Home = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('es');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* TOP BAR FLOTANTE (SELECTOR DE IDIOMA) */}
      <div className="absolute top-0 w-full z-50 p-6 flex justify-end">
          <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 pl-3 pr-4 py-2 rounded-full hover:bg-white/10 transition-colors shadow-lg"
              >
                  <Globe size={16} className="text-blue-400" />
                  <span className="text-xs font-bold tracking-wider">{lang.toUpperCase()}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                  {isLangOpen && (
                      <Motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-32 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                          {Object.keys(translations).map((l) => (
                              <button
                                  key={l}
                                  onClick={() => { setLang(l); setIsLangOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-blue-600/20 transition-colors ${lang === l ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300'}`}
                              >
                                  {translations[l].lang}
                              </button>
                          ))}
                      </Motion.div>
                  )}
              </AnimatePresence>
          </div>
      </div>

      {/* --- SECCIÓN HERO --- */}
      <div className="relative h-[75vh] w-full flex flex-col justify-end items-center">
        {/* Imagen de fondo */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/img/FIFASCREEN.jpg')" }} 
        ></div>
        
        {/* Gradientes para fundir con el fondo negro */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent"></div>

        {/* Resplandor azul detrás del texto para dar look de estadio nocturno */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Contenedor Z-10 asegurando el centrado absoluto */}
        <div className="relative z-10 w-full px-8 pb-16 flex flex-col items-center justify-center text-center">
            <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center justify-center w-full"
            >
                {/* TÍTULO CORREGIDO: Se agregó pr-2, pb-2 y leading-tight para evitar cortes */}
                <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 drop-shadow-2xl pr-2 pb-2 leading-tight">
                    {t.heroTitle}<br/><span className="text-blue-500">2026</span>
                </h1>
                
                {/* Subtítulo Traducido */}
                <p className="text-gray-300 text-[14px] mb-10 max-w-[300px] mx-auto leading-relaxed font-medium drop-shadow-md">
                    {t.heroSubtitle}
                </p>

                {/* BOTÓN CENTRADO: Se agregó w-fit y mx-auto para asegurar que quede en medio */}
                <button 
                    onClick={() => navigate('/scanner')}
                    className="relative group bg-white text-black pl-5 pr-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all w-fit mx-auto"
                >
                    <div className="bg-black text-white p-2.5 rounded-full group-hover:bg-blue-600 transition-colors">
                        <Scan size={20} />
                    </div>
                    <span className="tracking-wide whitespace-nowrap">{t.scanBtn}</span>
                    <span className="absolute -inset-1 rounded-full border border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></span>
                </button>
            </Motion.div>
        </div>
      </div>

      {/* --- SECCIÓN PARTIDOS EN MÉXICO --- */}
      <div className="px-6 py-6 bg-[#0a0a0c] relative z-20 rounded-t-[40px] -mt-10 border-t border-white/5">
        
        <h2 className="text-lg font-black mb-6 flex items-center gap-3 text-white uppercase tracking-wider">
            <span className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-red-800 rounded-full block shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            {t.matchesTitle}
        </h2>

        <div className="space-y-4 pb-20">
            <MexicoMatch 
                team1="EUR Playoff" 
                abbr1="EUR" flag1="🇪🇺" 
                team2="Túnez" 
                abbr2="TUN" flag2="🇹🇳"
                stadium="Estadio Monterrey, MTY" 
                date="14 Junio - 22:00"
                t={t}
            />
             
             <MexicoMatch 
                team1="Túnez" 
                abbr1="TUN" flag1="🇹🇳"
                team2="Japón" 
                abbr2="JPN" flag2="🇯🇵"
                stadium="Estadio Monterrey, MTY" 
                date="20 Junio - 0:00"
                t={t}
            />
             
             <MexicoMatch 
                team1="Sudáfrica" 
                abbr1="RSA" flag1="🇿🇦"
                team2="Corea del Sur" 
                abbr2="KOR" flag2="🇰🇷"
                stadium="Estadio Monterrey, MTY" 
                date="24 Junio - 21:00"
                t={t}
            />
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BarChart3, BookOpen, HelpCircle, Camera, X, ChevronDown, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { countriesData } from '../../data/countries'; // Asegúrate de tener este archivo creado

const ARScene = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInit = useRef(false);
  
  // --- ESTADOS ---
  const [started, setStarted] = useState(false);
  const [scanned, setScanned] = useState(false);
  // Estado para controlar si el panel inferior está expandido o a media altura
  const [sheetExpanded, setSheetExpanded] = useState(false); 
  const [selectedCountryId, setSelectedCountryId] = useState('mexico'); 
  const [activeTab, setActiveTab] = useState('stats'); 
  const [showTriviaAnswer, setShowTriviaAnswer] = useState(false);

  // Obtener datos del país seleccionado
  const country = countriesData.find(c => c.id === selectedCountryId) || countriesData[0];

  // --- INICIAR CÁMARA ---
  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    let mindarThree = null;
    
    const startAR = async () => {
      if (!containerRef.current) return;
      try {
        console.log("🚀 Iniciando Motor AR...");
        mindarThree = new MindARThree({
          container: containerRef.current,
          // Truco del cache-buster para asegurar la carga
          imageTargetSrc: '/targets/targets.mind?v=' + Math.floor(Math.random() * 1000),
          uiLoading: "no", uiScanning: "no", filterMinCF: 0.0001, filterBeta: 0.001,
        });
        
        const { renderer, scene, camera } = mindarThree;
        
        // Luces
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        
        // Anclaje
        const anchor = mindarThree.addAnchor(0);
        
        // Cubo Placeholder (Solo para debug visual si detecta real)
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x007AFF, transparent: true, opacity: 0.8 }); 
        const cube = new THREE.Mesh(geometry, material);
        anchor.group.add(cube);
        
        // Eventos de detección real
        anchor.onTargetFound = () => { 
            console.log("✅ Objetivo detectado!");
            setScanned(true); 
        };
        
        await mindarThree.start();
        setStarted(true);
        
        // Loop de animación 3D
        renderer.setAnimationLoop(() => {
          cube.rotation.x += 0.01; cube.rotation.y += 0.02;
          renderer.render(scene, camera);
        });
      } catch (err) { console.error("Error AR:", err); }
    };
    
    startAR();
    
    // Limpieza al salir
    return () => {
      const video = document.querySelector('video');
      if (video) { video.srcObject?.getTracks().forEach(t => t.stop()); video.remove(); }
    };
  }, []);

  // --- HANDLERS ---
  const handleSimulateScan = () => {
    setScanned(true);
    setSheetExpanded(false); // Inicia a media altura
  };

  const handleCloseCard = () => {
    setScanned(false);
    setActiveTab('stats');
    setShowTriviaAnswer(false);
    setSheetExpanded(false);
  };

  const toggleSheet = () => setSheetExpanded(!sheetExpanded);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none text-white">
      
      {/* 1. CÁMARA FONDO */}
      <div ref={containerRef} className="w-full h-full absolute top-0 left-0 z-0 scale-[1.02]" />

      {/* 2. HEADER APPLE STYLE */}
      <div className="absolute top-0 w-full pt-12 pb-4 px-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent transition-all pointer-events-none">
        <button onClick={() => navigate('/')} className="pointer-events-auto bg-white/10 p-2.5 rounded-full text-white/90 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
            <ArrowLeft size={20} />
        </button>
        
        {/* Selector estilo iOS Picker (Solo visible antes de escanear) */}
        {!scanned && (
            <div className="relative group pointer-events-auto">
                <select 
                    value={selectedCountryId} 
                    onChange={(e) => setSelectedCountryId(e.target.value)}
                    className="appearance-none bg-black/40 text-white pl-4 pr-10 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 outline-none focus:border-blue-500/50 text-center shadow-lg"
                >
                    {countriesData.map(c => (
                        <option key={c.id} value={c.id} className="text-black">{c.flag} {c.name}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
        )}
      </div>

      {/* 3. MODO ESCANEO (HUD) */}
      {started && !scanned && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
              {/* Mira minimalista */}
              <div className="relative w-64 h-64 border-[1.5px] border-white/40 rounded-[40px] animate-pulse">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full"></div>
              </div>
              <p className="mt-6 text-white/70 text-sm font-medium backdrop-blur-md bg-black/30 px-4 py-1 rounded-full border border-white/10">
                Apunta a la estampa
              </p>
              
              {/* Botón Simular */}
              <div className="absolute bottom-24 pointer-events-auto w-full px-10 animate-[fade-in-up_0.5s_ease-out]">
                  <button 
                    onClick={handleSimulateScan}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-4 rounded-[25px] font-semibold border border-white/20 active:scale-[0.98] transition-all shadow-xl"
                  >
                      <Camera size={22} className="text-blue-400" />
                      <span className="text-[15px]">Simular Escaneo</span>
                  </button>
              </div>
          </div>
      )}

      {/* 4. RESULTADOS: APPLE BOTTOM SHEET */}
      {scanned && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
              
              {/* Área transparente superior (Clic para cerrar/contraer) */}
              <div className="flex-1" onClick={handleCloseCard}>
                 {/* Marcador flotante en el mundo real */}
                 <div className="w-full h-full flex items-center justify-center pb-40 animate-[bounce-in_0.5s]">
                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl pl-3 pr-5 py-2 rounded-full border border-white/10 shadow-2xl">
                        <span className="text-3xl filter drop-shadow-md">{country.flag}</span>
                        <div>
                            <p className="text-blue-400 text-[9px] font-bold uppercase leading-none mb-0.5 tracking-wider">Detectado</p>
                            <p className="text-white font-bold text-sm leading-none">{country.name}</p>
                        </div>
                    </div>
                 </div>
              </div>

              {/* === EL SHEET ESTILO IOS === */}
              <div 
                className={`
                    bg-black/70 backdrop-blur-[50px] saturate-150 
                    border-t border-white/15 rounded-t-[35px] 
                    p-6 shadow-[0_-10px_60px_rgba(0,0,0,0.8)] 
                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${sheetExpanded ? 'h-[85vh]' : 'h-[50vh]'}
                `}
              >
                  {/* Drag Handle */}
                  <div className="flex justify-center mb-2 cursor-pointer p-2 -mt-4 w-full" onClick={toggleSheet}>
                      <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Header del Sheet */}
                  <div className="flex justify-between items-center mb-6 animate-[fade-in_0.3s]">
                      <div>
                          <h2 className="text-3xl font-black text-white tracking-tight italic">{country.name}</h2>
                          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">KickScan Data</p>
                      </div>
                      <button onClick={handleCloseCard} className="bg-white/5 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-white/5 p-1 rounded-full mb-6 relative z-10">
                      <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="Stats" />
                      <TabButton active={activeTab === 'facts'} onClick={() => setActiveTab('facts')} label="Datos" />
                      <TabButton active={activeTab === 'trivia'} onClick={() => setActiveTab('trivia')} label="Trivia" />
                  </div>

                  {/* BOTÓN MULTIMEDIA (NUEVO) */}
                  <div className="mb-6 animate-[fade-in_0.4s]">
                    <button 
                        onClick={() => navigate('/video-editor', { state: { country } })}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-[#007AFF] to-[#0055ff] p-4 rounded-[22px] flex items-center justify-between shadow-[0_8px_20px_rgba(0,122,255,0.3)] active:scale-[0.98] transition-all group"
                    >
                        {/* Brillo decorativo */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Play size={20} fill="currentColor" className="text-white ml-0.5" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest opacity-80">Multimedia</p>
                                <p className="font-bold text-white text-[15px]">Ver Highlights</p>
                            </div>
                        </div>
                        
                        <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm">
                             <ChevronDown className="text-white rotate-[-90deg]" size={16} />
                        </div>
                    </button>
                  </div>

                  {/* Contenido Scrollable */}
                  <div className="h-full overflow-y-auto pb-32 scrollbar-hide fade-mask">
                      {activeTab === 'stats' && (
                          <div className="space-y-4 animate-[fade-in_0.3s]">
                              <div className="grid grid-cols-3 gap-3">
                                  <StatCard label="Ataque" value={country.stats.ataque} color="bg-red-500/20 text-red-300 border-red-500/30" />
                                  <StatCard label="Defensa" value={country.stats.defensa} color="bg-blue-500/20 text-blue-300 border-blue-500/30" />
                                  <StatCard label="Velocidad" value={country.stats.velocidad} color="bg-green-500/20 text-green-300 border-green-500/30" />
                              </div>
                              <div className="bg-white/5 rounded-[20px] overflow-hidden border border-white/10 divide-y divide-white/5">
                                  <InfoRow label="Habitantes" value={country.stats.habitantes} />
                                  <InfoRow label="Capital" value={country.stats.capital} isHighlight />
                              </div>
                          </div>
                      )}

                      {activeTab === 'facts' && (
                          <ul className="space-y-3 animate-[fade-in_0.3s]">
                              {country.facts.map((fact, i) => (
                                  <li key={i} className="flex gap-4 text-[14px] text-white/80 bg-white/5 p-4 rounded-[20px] border border-white/10 items-start">
                                      <span className="font-bold text-blue-400 bg-blue-500/10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0">{i+1}</span>
                                      <span className="leading-snug">{fact}</span>
                                  </li>
                              ))}
                          </ul>
                      )}

                      {activeTab === 'trivia' && (
                          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-[25px] text-center border border-white/10 animate-[fade-in_0.3s]">
                              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <HelpCircle className="text-yellow-400" size={24} />
                              </div>
                              <p className="font-semibold text-white mb-6 text-lg leading-tight">{country.trivia.pregunta}</p>
                              
                              {!showTriviaAnswer ? (
                                  <button onClick={() => setShowTriviaAnswer(true)} className="w-full bg-white text-black py-3.5 rounded-[18px] text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                                      Revelar Respuesta
                                  </button>
                              ) : (
                                  <div className="animate-[fade-in-up_0.3s]">
                                      <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-1">Correcto</p>
                                      <p className="text-2xl font-black text-white">{country.trivia.respuesta}</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Estilos CSS Globales */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .fade-mask { mask-image: linear-gradient(to bottom, black 85%, transparent 100%); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        /* FORZAR VISIBILIDAD DE VIDEO AR */
        video {
            position: absolute !important; top: 0; left: 0; width: 100% !important; height: 100% !important; object-fit: cover !important; z-index: 0 !important; opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

// --- COMPONENTES UI AUXILIARES ---

const TabButton = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`flex-1 py-2.5 rounded-full text-[12px] font-bold transition-all duration-300 ${active ? 'bg-gray-700/80 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}>
        {label}
    </button>
);

const StatCard = ({ label, value, color }) => (
    <div className={`p-3 rounded-[20px] text-center border ${color} backdrop-blur-md bg-opacity-10`}>
        <p className="text-[9px] opacity-80 font-black uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
);

const InfoRow = ({ label, value, isHighlight }) => (
    <div className="flex justify-between items-center p-4">
        <span className="text-white/60 text-sm font-medium">{label}</span>
        <span className={`text-base font-bold ${isHighlight ? 'text-blue-400' : 'text-white'}`}>{value}</span>
    </div>
);

export default ARScene;
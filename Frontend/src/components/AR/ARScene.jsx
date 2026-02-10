import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BarChart3, BookOpen, HelpCircle, Camera, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { countriesData } from '../../data/countries'; 

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

  const country = countriesData.find(c => c.id === selectedCountryId) || countriesData[0];

  // --- INICIAR CÁMARA (Igual que antes) ---
  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    let mindarThree = null;
    const startAR = async () => {
      if (!containerRef.current) return;
      try {
        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: '/targets/targets.mind?v=' + Math.floor(Math.random() * 1000),
          uiLoading: "no", uiScanning: "no", filterMinCF: 0.0001, filterBeta: 0.001,
        });
        const { renderer, scene, camera } = mindarThree;
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        const anchor = mindarThree.addAnchor(0);
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x007AFF, transparent: true, opacity: 0.8 }); // Azul Apple
        const cube = new THREE.Mesh(geometry, material);
        anchor.group.add(cube);
        
        anchor.onTargetFound = () => { setScanned(true); };
        
        await mindarThree.start();
        setStarted(true);
        renderer.setAnimationLoop(() => {
          cube.rotation.x += 0.01; cube.rotation.y += 0.02;
          renderer.render(scene, camera);
        });
      } catch (err) { console.error(err); }
    };
    startAR();
    return () => {
      const video = document.querySelector('video');
      if (video) { video.srcObject?.getTracks().forEach(t => t.stop()); video.remove(); }
    };
  }, []);

  const handleSimulateScan = () => {
    setScanned(true);
    // Al escanear, mostramos el sheet a media altura inicialmente
    setSheetExpanded(false);
  };

  const handleCloseCard = () => {
    setScanned(false);
    setActiveTab('stats');
    setShowTriviaAnswer(false);
    setSheetExpanded(false);
  };

  // Alternar entre media altura y pantalla completa del panel
  const toggleSheet = () => setSheetExpanded(!sheetExpanded);

  return (
    // Usamos font-sans para que tome la fuente del sistema (San Francisco en Apple)
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none text-white">
      
      {/* 1. CÁMARA FONDO */}
      <div ref={containerRef} className="w-full h-full absolute top-0 left-0 z-0 scale-[1.02]" /> {/* Pequeño zoom para evitar bordes */}

      {/* 2. HEADER APPLE STYLE (Vidrio Esmerilado Superior) */}
      <div className="absolute top-0 w-full pt-12 pb-4 px-6 flex justify-between items-center z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 transition-all">
        <button onClick={() => navigate('/')} className="bg-white/10 p-2.5 rounded-full text-white/90 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
            <ArrowLeft size={20} />
        </button>
        
        {/* Selector estilo iOS Picker */}
        {!scanned && (
            <div className="relative group">
                <select 
                    value={selectedCountryId} 
                    onChange={(e) => setSelectedCountryId(e.target.value)}
                    className="appearance-none bg-white/10 text-white pl-4 pr-10 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10 outline-none focus:border-blue-500/50 text-center"
                >
                    {countriesData.map(c => (
                        <option key={c.id} value={c.id} className="text-black">{c.flag} {c.name}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none group-hover:text-white transition-colors" />
            </div>
        )}
      </div>

      {/* 3. MODO ESCANEO (HUD Minimalista) */}
      {started && !scanned && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
              {/* Mira minimalista blanca */}
              <div className="relative w-64 h-64 border-[1.5px] border-white/40 rounded-[40px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/20"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-white/20"></div>
              </div>
              <p className="mt-6 text-white/70 text-sm font-medium backdrop-blur-sm bg-black/20 px-4 py-1 rounded-full">Busca la estampa</p>
              
              {/* Botón Simular estilo iOS */}
              <div className="absolute bottom-24 pointer-events-auto w-full px-10 animate-[fade-in-up_0.5s_ease-out]">
                  <button 
                    onClick={handleSimulateScan}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-4 rounded-[25px] font-semibold border border-white/20 active:scale-[0.98] transition-all"
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
                 {/* Marcador flotante simple */}
                 <div className="w-full h-full flex items-center justify-center pb-40 animate-[bounce-in_0.5s]">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl pl-3 pr-5 py-2 rounded-full border border-white/10 shadow-lg">
                        <span className="text-3xl">{country.flag}</span>
                        <div>
                            <p className="text-white/60 text-[10px] font-semibold uppercase leading-none mb-0.5">Detectado</p>
                            <p className="text-white font-bold text-sm leading-none">{country.name}</p>
                        </div>
                    </div>
                 </div>
              </div>

              {/* === EL SHEET ESTILO IOS === */}
              <div 
                className={`
                    bg-black/60 backdrop-blur-[50px] saturate-150 
                    border-t border-white/15 rounded-t-[40px] 
                    p-6 shadow-[0_-10px_60px_rgba(0,0,0,0.9)] 
                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${sheetExpanded ? 'h-[85vh]' : 'h-[45vh]'}
                `}
              >
                  {/* Drag Handle (La barrita gris para arrastrar) */}
                  <div className="flex justify-center mb-4 cursor-pointer p-2 -mt-4" onClick={toggleSheet}>
                      <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Header del Sheet */}
                  <div className="flex justify-between items-center mb-6 animate-[fade-in_0.3s]">
                      <div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">{country.name}</h2>
                          <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-wider">Información del País</p>
                      </div>
                      <button onClick={handleCloseCard} className="bg-white/5 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Tabs estilo iOS Segmented Control */}
                  <div className="flex bg-white/5 p-1 rounded-full mb-6 relative z-10">
                      <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="Estadísticas" />
                      <TabButton active={activeTab === 'facts'} onClick={() => setActiveTab('facts')} label="Datos" />
                      <TabButton active={activeTab === 'trivia'} onClick={() => setActiveTab('trivia')} label="Trivia" />
                  </div>

                  {/* Contenido Scrollable */}
                  <div className="h-full overflow-y-auto pb-20 scrollbar-hide fade-mask">
                      {activeTab === 'stats' && (
                          <div className="space-y-4 animate-[fade-in_0.3s]">
                              <div className="grid grid-cols-3 gap-3">
                                  {/* Tarjetas de stats estilo Apple */}
                                  <StatCard label="Ataque" value={country.stats.ataque} color="bg-red-500/20 text-red-300 border-red-500/30" />
                                  <StatCard label="Defensa" value={country.stats.defensa} color="bg-blue-500/20 text-blue-300 border-blue-500/30" />
                                  <StatCard label="Velocidad" value={country.stats.velocidad} color="bg-green-500/20 text-green-300 border-green-500/30" />
                              </div>
                              {/* Celda de info estilo lista de ajustes de iOS */}
                              <div className="bg-white/5 rounded-[20px] overflow-hidden border border-white/10 divide-y divide-white/5">
                                  <InfoRow label="Habitantes" value={country.stats.habitantes} />
                                  <InfoRow label="Capital" value={country.stats.capital} isHighlight />
                              </div>
                          </div>
                      )}

                      {activeTab === 'facts' && (
                          <ul className="space-y-3 animate-[fade-in_0.3s]">
                              {country.facts.map((fact, i) => (
                                  <li key={i} className="flex gap-4 text-[15px] text-white/80 bg-white/5 p-4 rounded-[20px] border border-white/10 items-start">
                                      <span className="font-bold text-blue-400 bg-blue-500/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">{i+1}</span>
                                      <span className="leading-snug">{fact}</span>
                                  </li>
                              ))}
                          </ul>
                      )}

                      {activeTab === 'trivia' && (
                          <div className="bg-white/5 p-6 rounded-[25px] text-center border border-white/10 animate-[fade-in_0.3s]">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="text-blue-400" size={24} />
                              </div>
                              <p className="font-semibold text-white mb-6 text-lg leading-tight">{country.trivia.pregunta}</p>
                              
                              {!showTriviaAnswer ? (
                                  <button onClick={() => setShowTriviaAnswer(true)} className="w-full bg-[#007AFF] hover:bg-[#006EE6] text-white py-3.5 rounded-[18px] text-sm font-semibold transition-all active:scale-[0.98]">
                                      Revelar Respuesta
                                  </button>
                              ) : (
                                  <div className="animate-[fade-in-up_0.3s]">
                                      <p className="text-[#32D74B] font-medium text-sm uppercase tracking-wider mb-1">Respuesta Correcta</p>
                                      <p className="text-2xl font-bold text-white">{country.trivia.respuesta}</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Estilos globales y animaciones */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .fade-mask { mask-image: linear-gradient(to bottom, black 80%, transparent 100%); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }

        /* FORZAR VIDEO AL FONDO */
        video {
            position: absolute !important; top: 0; left: 0; width: 100% !important; height: 100% !important; object-fit: cover !important; z-index: 0 !important; opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

// --- COMPONENTES UI ESTILO APPLE ---

// Botón de pestaña (Segmented Control)
const TabButton = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`flex-1 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${active ? 'bg-gray-800/80 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}>
        {label}
    </button>
);

// Tarjeta de estadística cuadrada
const StatCard = ({ label, value, color }) => (
    <div className={`p-3 rounded-[20px] text-center border ${color} backdrop-blur-md bg-opacity-10`}>
        <p className="text-[10px] opacity-70 font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
);

// Fila de información (tipo lista de ajustes iOS)
const InfoRow = ({ label, value, isHighlight }) => (
    <div className="flex justify-between items-center p-4">
        <span className="text-white/60 text-sm font-medium">{label}</span>
        <span className={`text-base font-semibold ${isHighlight ? 'text-blue-400' : 'text-white'}`}>{value}</span>
    </div>
);

export default ARScene;
// ============================================
// IMPORTACIONES - Librerías y dependencias
// ============================================

// React hooks: useEffect (efectos secundarios), useRef (referencias), useState (estado)
import React, { useEffect, useRef, useState } from 'react';

// Iconos de lucide-react para la interfaz
import { ArrowLeft, BarChart3, BookOpen, HelpCircle, Camera, X, ChevronDown, Play } from 'lucide-react';

// Hook de React Router para navegación entre páginas
import { useNavigate } from 'react-router-dom';

// Three.js: librería 3D para gráficos
import * as THREE from 'three';

// MindAR: librería de realidad aumentada basada en reconocimiento de imágenes
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

// Datos de países con estadísticas, datos curiosos y trivia
import { countriesData } from '../../data/countries';

// ============================================
// COMPONENTE PRINCIPAL: ARScene
// ============================================
// Este componente gestiona la experiencia completa de escaneo AR
// Incluye: cámara en vivo, HUD de escaneo, panel de resultados estilo iOS

const ARScene = () => {
  // ---- REFERENCIAS Y HOOKS ----
  // Hook para navegar a otras páginas
  const navigate = useNavigate();
  
  // Referencia al contenedor donde se renderizará la cámara AR
  const containerRef = useRef(null);
  
  // Bandera para evitar inicializar AR dos veces (útil para React StrictMode)
  const isInit = useRef(false);
  
  // ---- ESTADOS DEL COMPONENTE ----
  // Si el motor AR ha iniciado correctamente
  const [started, setStarted] = useState(false);
  
  // Si un objetivo fue detectado/escaneado
  const [scanned, setScanned] = useState(false);
  
  // Si el panel inferior (sheet) está expandido a altura máxima o a media altura
  const [sheetExpanded, setSheetExpanded] = useState(false); 
  
  // ID del país actualmente seleccionado/detectado
  const [selectedCountryId, setSelectedCountryId] = useState('mexico'); 
  
  // Pestaña activa en el panel: 'stats' (estadísticas), 'facts' (datos), 'trivia' (preguntas)
  const [activeTab, setActiveTab] = useState('stats'); 
  
  // Si la respuesta de trivia está visible o oculta
  const [showTriviaAnswer, setShowTriviaAnswer] = useState(false);

  // ---- BÚSQUEDA DE DATOS ----
  // Obtener los datos completos del país seleccionado del archivo de datos
  // Si no existe, usa el primer país como fallback
  const country = countriesData.find(c => c.id === selectedCountryId) || countriesData[0];

  // ============================================
  // EFECTO: Inicializar motor AR y cámara
  // ============================================
  // Se ejecuta UNA SOLA VEZ al montar el componente
  // Inicializa MindAR, configura la escena 3D y comienza el streaming de cámara
  useEffect(() => {
    // Evitar reinicialización (importante para React StrictMode)
    if (isInit.current) return;
    isInit.current = true;
    let mindarThree = null;
    
    const startAR = async () => {
      if (!containerRef.current) return;
      try {
        console.log("🚀 Iniciando Motor AR...");
        
        // Crear instancia de MindAR con configuración
        mindarThree = new MindARThree({
          container: containerRef.current,  // Contenedor donde se renderiza
          // Cargar archivo de targets (estampas a detectar) desde la carpeta public/targets
          // Agregar parámetro aleatorio para evitar cacheo inadecuado
          imageTargetSrc: '/targets/targets.mind?v=' + Math.floor(Math.random() * 1000),
          // No mostrar UI predeterminada de MindAR
          uiLoading: "no", uiScanning: "no", 
          // Parámetros de sensibilidad del detector (muy bajos = muy sensible)
          filterMinCF: 0.0001, filterBeta: 0.001,
        });
        
        // Obtener los componentes 3D principales
        const { renderer, scene, camera } = mindarThree;
        
        // ---- CONFIGURAR ILUMINACIÓN ----
        // Luz hemisférica: blanca arriba, azulada abajo, para efecto natural
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        
        // ---- CREAR ANCLAJE ----
        // Un anclaje es el punto 3D donde aparecerá el objeto al detectar una etiqueta
        // El parámetro 0 se refiere al primer target (primera estampa) en el archivo .mind
        const anchor = mindarThree.addAnchor(0);
        
        // ---- CREAR OBJETO 3D (CUBO DECORATIVO) ----
        // Geometría: caja de 0.5x0.5x0.5 unidades
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        
        // Material: azul (#007AFF) con transparencia
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x007AFF,      // Azul iOS
          transparent: true,    // Permitir transparencia
          opacity: 0.8          // 80% opaco
        }); 
        
        // Crear la malla 3D (geometría + material)
        const cube = new THREE.Mesh(geometry, material);
        
        // Agregar el cubo al anclaje (se moverá con el target detectado)
        anchor.group.add(cube);
        
        // ---- EVENTO: CUANDO SE DETECTA UN OBJETIVO ----
        // Se dispara cuando MindAR detecta exitosamente una estampa
        anchor.onTargetFound = () => { 
          console.log("✅ Objetivo detectado!");
          // Cambiar estado para mostrar el panel de resultados
          setScanned(true); 
        };
        
        // Iniciar el streaming de la cámara
        await mindarThree.start();
        // Marcar que AR está listo
        setStarted(true);
        
        // ---- LOOP DE ANIMACIÓN ----
        // Se ejecuta 60 veces por segundo (60 FPS)
        // Anima el cubo y renderiza la escena
        renderer.setAnimationLoop(() => {
          // Rotar el cubo continuamente para efecto visual
          cube.rotation.x += 0.01;  // Rotación en eje X
          cube.rotation.y += 0.02;  // Rotación en eje Y
          
          // Renderizar la escena 3D
          renderer.render(scene, camera);
        });
      } catch (err) { 
        // Mostrar error si algo falla
        console.error("Error AR:", err); 
      }
    };
    
    // Ejecutar la función de inicio
    startAR();
    
    // ---- LIMPIEZA AL DESMONTAR ----
    // Se ejecuta cuando el componente se desmonta (usuario navega a otra página)
    // Detiene la cámara y libera recursos para evitar fugas de memoria
    return () => {
      // Buscar el elemento <video> creado por MindAR
      const video = document.querySelector('video');
      if (video) { 
        // Detener todos los tracks de la cámara
        video.srcObject?.getTracks().forEach(t => t.stop()); 
        // Remover el elemento de video del DOM
        video.remove(); 
      }
    };
  }, []);  // Array vacío = ejecutar solo al montar

  // ============================================
  // FUNCIONES MANEJADORAS DE EVENTOS
  // ============================================
  
  // Simula un escaneo exitoso (útil para pruebas sin usar AR real)
  // Activa el panel de resultados
  const handleSimulateScan = () => {
    setScanned(true);
    setSheetExpanded(false);  // Panel inicia a media altura (no expandido)
  };

  // Cierra el panel de resultados y resetea todos los estados
  // Vuelve a la pantalla de escaneo
  const handleCloseCard = () => {
    setScanned(false);              // Ocultar panel
    setActiveTab('stats');           // Volver a pestaña por defecto
    setShowTriviaAnswer(false);      // Ocultar respuesta de trivia
    setSheetExpanded(false);         // Contraer panel
  };

  // Alterna entre panel contraído (50vh) y expandido (85vh)
  // El usuario puede arrastrar el "handle" para cambiar tamaño
  const toggleSheet = () => setSheetExpanded(!sheetExpanded);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none text-white">
      
      {/* 1. CÁMARA FONDO */}
      <div ref={containerRef} className="w-full h-full absolute top-0 left-0 z-0 scale-[1.02]" />

      {/* 2. HEADER APPLE STYLE */}
      <div className="absolute top-0 w-full pt-12 pb-4 px-6 flex justify-between items-center z-50 bg-linear-to-b from-black/80 to-transparent transition-all pointer-events-none">
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
                        className="w-full relative overflow-hidden bg-linear-to-r from-[#007AFF] to-[#0055ff] p-4 rounded-[22px] flex items-center justify-between shadow-[0_8px_20px_rgba(0,122,255,0.3)] active:scale-[0.98] transition-all group"
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
                             <ChevronDown className="text-white -rotate-90" size={16} />
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
                          <div className="bg-linear-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-[25px] text-center border border-white/10 animate-[fade-in_0.3s]">
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

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTES UI AUXILIARES - Componentes pequeños reutilizables
// ════════════════════════════════════════════════════════════════════════════

/**
 * TabButton - Botón para cambiar entre pestañas
 * @param {boolean} active - Si esta pestaña está activa
 * @param {function} onClick - Función a ejecutar al clickear
 * @param {string} label - Texto a mostrar en el botón
 */
const TabButton = ({ active, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`
      flex-1 py-2.5 rounded-full text-[12px] font-bold transition-all duration-300 
      ${active 
        ? 'bg-gray-700/80 text-white shadow-sm'               // Pestaña activa: fondo gris
        : 'text-white/50 hover:text-white'                   // Pestaña inactiva: texto gris
      }
    `}
  >
    {label}
  </button>
);

/**
 * StatCard - Tarjeta para mostrar una estadística
 * @param {string} label - Nombre de la estadística
 * @param {string|number} value - Valor a mostrar
 * @param {string} color - Clases de Tailwind para color y fondo
 */
const StatCard = ({ label, value, color }) => (
  <div className={`p-3 rounded-[20px] text-center border ${color} backdrop-blur-md bg-opacity-10`}>
    {/* Etiqueta pequeña */}
    <p className="text-[9px] opacity-80 font-black uppercase tracking-wider mb-1">
      {label}
    </p>
    {/* Valor grande */}
    <p className="text-3xl font-black tracking-tight">{value}</p>
  </div>
);

/**
 * InfoRow - Fila de información con etiqueta y valor
 * @param {string} label - Nombre de la información
 * @param {string|number} value - Valor a mostrar
 * @param {boolean} isHighlight - Si el valor debe estar en color azul (destacado)
 */
const InfoRow = ({ label, value, isHighlight }) => (
  <div className="flex justify-between items-center p-4">
    {/* Etiqueta a la izquierda */}
    <span className="text-white/60 text-sm font-medium">{label}</span>
    {/* Valor a la derecha, con color opcional */}
    <span className={`text-base font-bold ${isHighlight ? 'text-blue-400' : 'text-white'}`}>
      {value}
    </span>
  </div>
);

// Exportar el componente principal para usarlo en otras partes de la aplicación
export default ARScene;
// Importar React y hooks necesarios: useState para estado local, useRef para referencia al <video>
import React, { useState, useRef } from 'react';
// Importar hooks de enrutamiento: obtener estado de la ruta y navegación programática
import { useLocation, useNavigate } from 'react-router-dom';
// Iconos usados en la UI (lucide-react)
import { ArrowLeft, Download, Sliders, Play, Share2 } from 'lucide-react';

// Componente funcional principal: Editor/visor de video con filtros
const VideoFilter = () => {
  // Hook para navegar entre pantallas (ej: volver atrás)
  const navigate = useNavigate();
  // Hook para leer el estado pasado por la navegación (p. ej. country)
  const location = useLocation();
  // Referencia al elemento <video> para control play/pause y acceso DOM
  const videoRef = useRef(null);
  
  // Obtener país pasado en state o usar valor por defecto si no existe
  const country = location.state?.country || { name: 'México', flag: '🇲🇽' };

  // Estado: filtro actualmente seleccionado (id del filtro)
  const [selectedFilter, setSelectedFilter] = useState('normal');
  // Estado: si el video está reproduciéndose o en pausa
  const [isPlaying, setIsPlaying] = useState(true);

  // Definición de filtros disponibles (id, nombre, valor CSS y color miniatura)
  // Nota: se ajustaron filtros permitidos por la rúbrica del proyecto
  const filters = [
    { id: 'normal', name: 'Original', css: 'none', thumbColor: 'bg-gray-500' },
    { id: 'blur', name: 'Focus', css: 'blur(4px)', thumbColor: 'bg-gray-400' },
    { id: 'vivid', name: 'Vívido', css: 'saturate(250%) contrast(1.1)', thumbColor: 'bg-red-500' },
    { id: 'pastel', name: 'Pastel', css: 'brightness(1.1) saturate(0.8) contrast(0.9)', thumbColor: 'bg-pink-300' },
    { id: 'alien', name: 'Alien', css: 'hue-rotate(90deg)', thumbColor: 'bg-green-500' },
    { id: 'warm', name: 'Cálido', css: 'hue-rotate(-30deg) saturate(1.2)', thumbColor: 'bg-orange-400' },
  ];

  // Función para alternar reproducción/pausa del video usando la referencia
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause(); // Si está reproduciendo -> pausar
      else videoRef.current.play(); // Si está en pausa -> reproducir
      setIsPlaying(!isPlaying); // Actualizar bandera de reproducción
    }
  };

  // Renderizado del componente: capa completa con fondo negro y UI encima
  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      
      {/* Header superior: botón atrás, título con país y botón de descargar */}
      <div className="absolute top-0 w-full z-30 pt-12 pb-6 px-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        {/* Botón atrás: usa navigate(-1) para volver */}
        <button onClick={() => navigate(-1)} className="pointer-events-auto bg-white/10 p-3 rounded-full backdrop-blur-xl border border-white/10 active:scale-90 transition-all">
            <ArrowLeft size={22} />
        </button>
        {/* Título central: bandera y nombre del país */}
        <div className="text-center drop-shadow-md">
            <h2 className="font-bold text-lg tracking-tight flex items-center gap-2 justify-center">
                <span className="text-xl">{country.flag}</span> {country.name}
            </h2>
            <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">Editor Permitido</p>
        </div>
        {/* Botón descargar (decorativo) */}
        <button className="pointer-events-auto bg-[#007AFF] p-3 rounded-full shadow-[0_0_20px_rgba(0,122,255,0.4)] active:scale-90 transition-all">
            <Download size={20} />
        </button>
      </div>

      {/* Contenedor del video: hace toggle play al clickear en el área */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-900" onClick={togglePlay}>
        {/* Elemento video real; style.filter aplica el filtro CSS seleccionado */}
        <video 
            ref={videoRef}
            autoPlay loop playsInline
            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            style={{ filter: filters.find(f => f.id === selectedFilter).css }}
            src="https://assets.mixkit.co/videos/preview/mixkit-soccer-player-juggling-a-ball-in-the-field-41662-large.mp4"
        />
        
        {/* Si el video está en pausa mostramos un overlay con icono play */}
        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-md border border-white/20 animate-pulse">
                    <Play size={40} fill="white" />
                </div>
            </div>
        )}

        {/* Texto grande indicando el nombre del filtro actualmente activo */}
        <div key={selectedFilter} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
             <h1 className="text-5xl font-black text-white/20 uppercase tracking-tighter animate-[ping_0.8s_ease-out_1] whitespace-nowrap">
                {filters.find(f => f.id === selectedFilter).name}
             </h1>
        </div>
      </div>

      {/* Controles inferiores: selector de filtros y acciones */}
      <div className="absolute bottom-0 w-full z-30 bg-black/40 backdrop-blur-[40px] border-t border-white/10 pb-10 pt-6 rounded-t-[35px]">
          {/* Encabezado de los controles: icono y titulo */}
          <div className="flex justify-between items-center px-8 mb-4">
              <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#007AFF]" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wide">Filtros</span>
              </div>
              {/* Icono compartir (decorativo) */}
              <Share2 size={18} className="text-white/50" />
          </div>

          {/* Lista horizontal de filtros (scrollable) */}
          <div className="flex overflow-x-auto px-6 gap-5 scrollbar-hide pb-2">
              {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedFilter(filter.id); }}
                    className={`flex flex-col items-center gap-3 min-w-[65px] transition-all duration-300 group ${selectedFilter === filter.id ? 'scale-110 opacity-100' : 'opacity-60 scale-95 hover:opacity-80'}`}
                  >
                      {/* Miniatura circular que aplica el mismo filtro en pequeño */}
                      <div className={`w-16 h-16 rounded-full p-[2px] ${selectedFilter === filter.id ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : 'bg-transparent'}`}>
                          <div className={`w-full h-full rounded-full border-2 border-black overflow-hidden relative`}>
                                <div className={`w-full h-full ${filter.thumbColor}`} style={{ filter: filter.css }}></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                          </div>
                      </div>
                      {/* Nombre del filtro */}
                      <span className={`text-[10px] font-medium tracking-wide ${selectedFilter === filter.id ? 'text-[#007AFF]' : 'text-white'}`}>
                          {filter.name}
                      </span>
                  </button>
              ))}
          </div>
      </div>

      {/* Estilos pequeños en línea para ocultar scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default VideoFilter;
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ScanLine, AlertCircle, RefreshCw } from 'lucide-react';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

const ARScene = () => {
  const containerRef = useRef(null);
  const isInit = useRef(false); // 🔒 EL CANDADO (Para que no se reinicie solo)
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🛑 SI YA INICIAMOS, NO HAGAS NADA
    if (isInit.current) return;
    isInit.current = true;

    let mindarThree = null;

    const startAR = async () => {
      if (!containerRef.current) return;

      console.log("🚀 Iniciando sistema de visión...");

      try {
        mindarThree = new MindARThree({
          container: containerRef.current,
          // 👇 TRUCO: Agregamos un número al azar para obligar a descargar el archivo real y no el caché de 0.1kb
          imageTargetSrc: '/targets/targets.mind?v=' + Math.floor(Math.random() * 1000),
          uiLoading: "no", 
          uiScanning: "no",
          filterMinCF: 0.0001, 
          filterBeta: 0.001,
          facingMode: "user", // Mantenemos "user" para tu Laptop
        });

        const { renderer, scene, camera } = mindarThree;

        // --- LUCES Y OBJETOS ---
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(0, 1, 0);
        scene.add(dirLight);

        const anchor = mindarThree.addAnchor(0);
        
        // Cubo (Wireframe)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6, 
            transparent: true, opacity: 0.5, 
            side: THREE.DoubleSide 
        });
        const cube = new THREE.Mesh(geometry, material);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        cube.add(wireframe);
        anchor.group.add(cube);
        // -----------------------

        await mindarThree.start();
        setStarted(true); // ¡Aquí encendemos la interfaz!
        
        renderer.setAnimationLoop(() => {
          cube.rotation.x += 0.015;
          cube.rotation.y += 0.02;
          renderer.render(scene, camera);
        });
        
      } catch (err) {
        console.error("❌ Error fatal:", err);
        isInit.current = false; // Permitir reintento si falló
        
        if (err.name === 'OverconstrainedError') {
             setError("No se encontró la cámara. (Intenta en el celular)");
        } else if (err.name === 'NotAllowedError') {
             setError("Permiso denegado. Revisa el candado en la URL.");
        } else {
             setError("Error: " + err.message);
        }
      }
    };

    startAR();

    // LIMPIEZA
    return () => {
      const video = document.querySelector('video');
      if (video && !document.contains(containerRef.current)) {
          console.log("🧹 Limpieza final");
          try {
             const stream = video.srcObject;
             if (stream) stream.getTracks().forEach(track => track.stop());
             video.remove();
          } catch (err) {
             console.log("Cleanup error:", err);
          }
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button 
            onClick={() => { window.location.href = '/'; }} 
            className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 group"
        >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-gray-200 tracking-wider">EN VIVO</span>
        </div>
      </div>

      {/* --- CÁMARA (OJO: Sin bg-black aquí) --- */}
      <div ref={containerRef} className="w-full h-full absolute top-0 left-0 z-0" />
      
      {/* HUD INTERFAZ */}
      {started && !error && (
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
              <div className="relative w-72 h-72 rounded-[32px]">
                  {/* Esquinas */}
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute w-full h-[2px] bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2.5s_ease-in-out_infinite] top-1/2"></div>
              </div>
          </div>
      )}

      {/* ERROR / CARGA */}
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-white p-8 text-center pointer-events-none">
            {error ? (
                <div className="bg-red-950/80 border border-red-500/30 p-8 rounded-3xl max-w-sm backdrop-blur-md pointer-events-auto">
                    <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Error</h3>
                    <p className="text-sm text-gray-400 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm"><RefreshCw size={18} /> Reiniciar</button>
                </div>
            ) : (
                <div className="flex flex-col items-center bg-black/40 p-6 rounded-2xl backdrop-blur-sm">
                    <ScanLine className="w-16 h-16 text-blue-500 animate-pulse mb-4" />
                    <h2 className="text-2xl font-bold">INICIANDO</h2>
                    <p className="text-sm text-gray-300">Calibrando sensores...</p>
                </div>
            )}
        </div>
      )}
      
      {/* 👇 CSS NUCLEAR: ESTO OBLIGA AL VIDEO A VERSE 👇 */}
      <style>{`
        @keyframes scan {
            0% { top: 10%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 90%; opacity: 0; }
        }
        
        /* Forzamos al video de MindAR a ser visible */
        video {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            z-index: -1 !important; /* Detrás de todo pero visible */
            opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ARScene;
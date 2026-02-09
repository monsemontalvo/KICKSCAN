import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, MapPin, Calendar } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const MexicoMatch = ({ team1, team2, stadium, date }) => (
  <Motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-panel p-4 rounded-2xl mb-4 border border-white/10 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    
    <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full bg-green-500/10">Sede México</span>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar size={12} /> {date}
        </div>
    </div>

    <div className="flex items-center justify-between px-2">
        <div className="text-center w-1/3">
            <div className="text-2xl mb-1">🇲🇽</div>
            <p className="font-bold text-sm">{team1}</p>
        </div>
        <div className="text-gray-500 text-xs font-bold">VS</div>
        <div className="text-center w-1/3">
            <div className="text-2xl mb-1">🇧🇷</div>
            <p className="font-bold text-sm">{team2}</p>
        </div>
    </div>

    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-white/5 pt-3">
        <MapPin size={12} className="text-red-500" />
        {stadium}
    </div>
  </Motion.div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* SECCIÓN HERO (La parte impresionante de arriba) */}
      <div className="relative h-[65vh] w-full">
        {/* Imagen de fondo de estadio */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605348400-43ded6012023?q=80&w=2670&auto=format&fit=crop')" }} // Foto de estadio oscuro
        ></div>
        {/* Degradado para que se lea el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center z-10">
            <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    MUNDIAL<br/>2026
                </h1>
                <p className="text-gray-300 text-sm mb-8 max-w-[250px] mx-auto leading-relaxed">
                    Vive la experiencia de realidad aumentada en los estadios de México.
                </p>

                {/* BOTÓN PRINCIPAL DE ESCANEO */}
                <button 
                    onClick={() => navigate('/scanner')}
                    className="relative group bg-white text-black pl-6 pr-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                >
                    <div className="bg-black text-white p-2 rounded-full">
                        <Scan size={20} />
                    </div>
                    <span>Iniciar Escaneo AR</span>
                    {/* Anillo de pulso animado */}
                    <span className="absolute -inset-1 rounded-full border border-white/30 animate-ping opacity-75"></span>
                </button>
            </Motion.div>
        </div>
      </div>

      {/* SECCIÓN PARTIDOS EN MÉXICO */}
      <div className="px-6 py-8 bg-black">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded-full block"></span>
            Partidos en México
        </h2>

        <div className="space-y-4 pb-20">
            <MexicoMatch 
                team1="México" 
                team2="Brasil" 
                stadium="Estadio Azteca, CDMX" 
                date="11 Junio - 12:00 PM"
            />
             <MexicoMatch 
                team1="Francia" 
                team2="Alemania" 
                stadium="Estadio Akron, GDL" 
                date="14 Junio - 6:00 PM"
            />
             <MexicoMatch 
                team1="Argentina" 
                team2="Portugal" 
                stadium="Estadio BBVA, MTY" 
                date="18 Junio - 8:00 PM"
            />
        </div>
      </div>
    </div>
  );
};

export default Home;
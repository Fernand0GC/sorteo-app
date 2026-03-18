import React, { useState, useEffect } from 'react';
import { Settings, Play, X, Trophy, AlertTriangle, Upload, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const CircuitBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950">
      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 500; }
          100% { stroke-dashoffset: 0; }
        }
        .circuit-path {
          fill: none;
          stroke-width: 1;
          opacity: 0.2;
        }
        .circuit-flow {
          fill: none;
          stroke-width: 2;
          stroke-dasharray: 15 500;
          animation: flow linear infinite;
        }
      `}</style>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      
      <svg className="absolute w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            {/* Base paths */}
            <path className="circuit-path stroke-blue-500" d="M 50 50 L 150 50 L 200 100 L 200 200 L 150 250 L 50 250" />
            <path className="circuit-path stroke-cyan-500" d="M 350 150 L 250 150 L 200 200 L 250 250 L 350 250" />
            <path className="circuit-path stroke-indigo-500" d="M 100 0 L 100 100 L 150 150 L 250 150 L 300 100 L 300 0" />
            <path className="circuit-path stroke-blue-400" d="M 0 300 L 100 300 L 150 350 L 250 350 L 300 300 L 400 300" />
            
            {/* Nodes */}
            <circle cx="50" cy="50" r="4" className="fill-blue-500/50" />
            <circle cx="150" cy="50" r="3" className="fill-blue-400/50" />
            <circle cx="200" cy="100" r="5" className="fill-cyan-400/50" />
            <circle cx="200" cy="200" r="5" className="fill-indigo-400/50" />
            <circle cx="150" cy="250" r="3" className="fill-blue-500/50" />
            <circle cx="50" cy="250" r="4" className="fill-blue-400/50" />
            <circle cx="350" cy="150" r="4" className="fill-cyan-500/50" />
            <circle cx="250" cy="150" r="3" className="fill-indigo-400/50" />
            <circle cx="250" cy="250" r="3" className="fill-cyan-400/50" />
            <circle cx="350" cy="250" r="4" className="fill-cyan-500/50" />
            <circle cx="100" cy="100" r="4" className="fill-indigo-500/50" />
            <circle cx="150" cy="150" r="3" className="fill-blue-400/50" />
            <circle cx="300" cy="100" r="4" className="fill-indigo-500/50" />
            <circle cx="100" cy="300" r="4" className="fill-blue-500/50" />
            <circle cx="150" cy="350" r="3" className="fill-cyan-400/50" />
            <circle cx="250" cy="350" r="3" className="fill-indigo-400/50" />
            <circle cx="300" cy="300" r="4" className="fill-blue-500/50" />

            {/* Animated flows */}
            <path className="circuit-flow stroke-blue-400" style={{ animationDuration: '4s' }} d="M 50 50 L 150 50 L 200 100 L 200 200 L 150 250 L 50 250" />
            <path className="circuit-flow stroke-cyan-300" style={{ animationDuration: '5s', animationDirection: 'reverse' }} d="M 350 150 L 250 150 L 200 200 L 250 250 L 350 250" />
            <path className="circuit-flow stroke-indigo-400" style={{ animationDuration: '3.5s' }} d="M 100 0 L 100 100 L 150 150 L 250 150 L 300 100 L 300 0" />
            <path className="circuit-flow stroke-blue-300" style={{ animationDuration: '6s', animationDirection: 'reverse' }} d="M 0 300 L 100 300 L 150 350 L 250 350 L 300 300 L 400 300" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
};

const Reel = ({ targetDigit, isSpinning, spinTime, delay, fontFamily }: { key?: React.Key, targetDigit: string, isSpinning: boolean, spinTime: number, delay: number, fontFamily: string }) => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Create a long strip of digits for the spinning effect
  const strip = [...digits, ...digits, ...digits, ...digits, ...digits, ...digits];
  
  // Calculate final position
  // We want to land on the target digit in the middle of the strip
  const targetIndex = strip.length - 10 + parseInt(targetDigit);
  const itemHeight = 240; // Height of each digit container
  
  return (
    <div className="relative w-32 md:w-56 h-[240px] bg-slate-900/80 rounded-2xl border-4 border-blue-500/50 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-sm">
      {/* Inner shadow for depth and curvature */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* Highlight line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400/30 -translate-y-1/2 z-10" />
      
      <motion.div
        className="absolute top-0 left-0 w-full flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{
          y: isSpinning ? -(targetIndex * itemHeight) : -(parseInt(targetDigit) * itemHeight) // Reset to single digit when not spinning
        }}
        transition={{
          y: isSpinning ? {
            duration: spinTime / 1000,
            ease: [0.15, 0.85, 0.2, 1], // Custom ease-out for slot machine feel
            delay: delay / 1000
          } : { duration: 0 }
        }}
      >
        {(isSpinning ? strip : digits).map((digit, i) => (
          <div 
            key={i} 
            className="h-[240px] w-full flex items-center justify-center text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-200 via-white to-blue-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ fontFamily: fontFamily, letterSpacing: '-0.05em' }}
          >
            {digit}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Modal = ({ isOpen, result, resultName, isWinner, onClose, fontFamily }: { key?: React.Key, isOpen: boolean, result: string, resultName: string, isWinner: boolean, onClose: () => void, fontFamily: string }) => {
  useEffect(() => {
    if (isOpen && isWinner) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#06b6d4', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#06b6d4', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen, isWinner]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-3xl border-2 p-8 text-center shadow-2xl",
              isWinner 
                ? "bg-slate-900 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.5)]" 
                : "bg-slate-900 border-slate-600 shadow-[0_0_30px_rgba(100,116,139,0.3)]"
            )}
          >
            {/* Circuit Board Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%233b82f6' stroke-width='1'/%3E%3Cpath d='M30 30h40v40h-40z' fill='none' stroke='%233b82f6' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%233b82f6'/%3E%3Cpath d='M10 50h20M70 50h20M50 10v20M50 70v20' stroke='%233b82f6' stroke-width='1'/%3E%3C/svg%3E")`,
                   backgroundSize: '50px 50px'
                 }} 
            />

            <div className="relative z-10 flex flex-col items-center">
              {isWinner ? (
                <div className="mb-6 rounded-full bg-blue-500/20 p-4 ring-2 ring-blue-400 ring-offset-4 ring-offset-slate-900">
                  <Trophy className="w-16 h-16 text-blue-400" />
                </div>
              ) : (
                <div className="mb-6 rounded-full bg-slate-700/50 p-4 ring-2 ring-slate-500 ring-offset-4 ring-offset-slate-900">
                  <AlertTriangle className="w-16 h-16 text-slate-400" />
                </div>
              )}

              <h2 className={cn(
                "text-4xl md:text-5xl font-black uppercase tracking-wider mb-2 mt-4",
                isWinner ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300" : "text-slate-300"
              )}>
                {isWinner ? "¡Tenemos Ganador!" : "¡Al Agua!"}
              </h2>
              
              <p className="text-slate-400 mb-4 text-lg">
                {isWinner ? "Felicidades a:" : "Sigue intentando:"}
              </p>

              {resultName && (
                <div className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide leading-tight px-4 break-words">
                  {resultName}
                </div>
              )}

              <p className="text-slate-500 mb-2 text-sm uppercase tracking-[0.2em]">
                Ticket Número
              </p>

              <div className={cn(
                "text-7xl md:text-8xl font-black tracking-widest mb-8 py-4 px-8 rounded-2xl border-2 inline-block",
                isWinner 
                  ? "text-white border-blue-500/50 bg-blue-900/30 shadow-[inset_0_0_30px_rgba(59,130,246,0.5)]" 
                  : "text-slate-400 border-slate-700 bg-slate-800/50"
              )} style={{ fontFamily: fontFamily }}>
                {result}
              </div>

              <button
                onClick={onClose}
                className={cn(
                  "px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95",
                  isWinner 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]" 
                    : "bg-slate-700 text-white hover:bg-slate-600"
                )}
              >
                {isWinner ? "Aceptar" : "Siguiente Sorteo"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [showConfig, setShowConfig] = useState(false);
  
  const [participants, setParticipants] = useState<{ nombre: string, numero: string }[]>(() => {
    try {
      const saved = localStorage.getItem('sorteo_participants');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sorteo_participants', JSON.stringify(participants));
  }, [participants]);

  const [config, setConfig] = useState<{spinTime: number, waterDraws: number, fontFamily: string}>(() => {
    try {
      const saved = localStorage.getItem('sorteo_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      spinTime: 4000,
      waterDraws: 3, // Number of losers before winner
      fontFamily: "'Orbitron', sans-serif"
    };
  });

  useEffect(() => {
    localStorage.setItem('sorteo_config', JSON.stringify(config));
  }, [config]);

  const [currentDrawCount, setCurrentDrawCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultNumber, setResultNumber] = useState("000");
  const [resultName, setResultName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [drawnTickets, setDrawnTickets] = useState<{number: string, name: string, type: 'agua' | 'winner'}[]>([]);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Audio effect for spinning
  useEffect(() => {
    if (!isSpinning || !audioCtx) return;
    
    let timeoutId: NodeJS.Timeout;
    let delay = 30; 
    const endTime = Date.now() + config.spinTime + 1000; // Match the reel stop time

    const playTick = () => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        // Ignore audio errors
      }

      const now = Date.now();
      const remaining = endTime - now;
      
      if (remaining > 0) {
        const progress = 1 - (remaining / (config.spinTime + 1000));
        delay = 30 + (progress * progress * 300); // Slow down as it reaches the end
        timeoutId = setTimeout(playTick, delay);
      }
    };

    timeoutId = setTimeout(playTick, delay);

    return () => clearTimeout(timeoutId);
  }, [isSpinning, audioCtx, config.spinTime]);

  // Logo provided by user
  const logoUrl = "https://storage.googleapis.com/generativeai-downloads/images/tecserlan_logo.png"; // Placeholder, will replace with actual if provided, wait user provided an image in the prompt? No, they just said "el logo arriba en el centro", I'll use a placeholder or the one from their prompt if it was an attachment. Ah, I see an attachment in the prompt! Let's use the attachment URL. Wait, I don't have the attachment URL directly in text, but I can see it in the prompt images. I will use a generic placeholder or try to extract it. Actually, I will just use an `img` tag and assume they can replace it, or I'll use a nice text logo if I can't get the URL. Wait, the prompt has an image attached. I can't read the URL of the image directly from the text prompt. I will use a placeholder for the logo.
  // Wait, I can see the image in the prompt. It says "Tecserlan SOLUCIONES TECNOLOGICAS". I'll use a text-based logo that looks like it, or a placeholder image.
  
  const initAudio = () => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return ctx;
    }
    return audioCtx;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      const parsedParticipants: {nombre: string, numero: string}[] = [];

      data.forEach((row) => {
        const keys = Object.keys(row);
        let nombreKey = keys.find(k => k.toLowerCase().includes('nombre') || k.toLowerCase().includes('participante'));
        let numeroKey = keys.find(k => k.toLowerCase().includes('numero') || k.toLowerCase().includes('número') || k.toLowerCase().includes('ticket') || k.toLowerCase().includes('boleto'));

        if (!nombreKey && keys.length >= 1) nombreKey = keys[0];
        if (!numeroKey && keys.length >= 2) numeroKey = keys[1];

        // Advanced heuristic if columns are just something like [0] and [1] with no headers
        if (keys.length >= 2 && nombreKey && numeroKey) {
            const val1 = String(row[nombreKey]).trim();
            const val2 = String(row[numeroKey]).trim();
            
            // If the supposed 'nombre' is pure digits containing no letters, 
            // and the 'numero' has letters, they are likely swapped.
            if (/^\d+$/.test(val1) && /[a-zA-Z]/.test(val2)) {
                let temp = nombreKey;
                nombreKey = numeroKey;
                numeroKey = temp;
            }
        }

        if (nombreKey && numeroKey && row[nombreKey] && row[numeroKey]) {
          parsedParticipants.push({
            nombre: String(row[nombreKey]).trim(),
            numero: String(row[numeroKey]).trim()
          });
        }
      });

      if (parsedParticipants.length > 0) {
        setParticipants(parsedParticipants);
        setDrawnTickets([]);
        setCurrentDrawCount(0);
        alert(`¡Se han cargado ${parsedParticipants.length} participantes exitosamente!`);
      } else {
        alert("No se purieron encontrar columnas de Nombre y Número en el Excel. Usa un Excel simple con encabezados 'Nombre' y 'Numero'.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleStart = () => {
    if (isSpinning) return;
    
    if (participants.length === 0) {
      alert("¡Por favor, carga un archivo Excel con los participantes primero en la configuración!");
      setShowConfig(true);
      return;
    }

    const availableParticipants = participants.filter(p => !drawnTickets.some(t => t.number === p.numero));

    if (availableParticipants.length === 0) {
      alert("¡Ya se sortearon todos los participantes de la lista!");
      return;
    }

    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    
    setIsSpinning(true);
    setShowModal(false);

    // Pick random participant
    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    const chosenParticipant = availableParticipants[randomIndex];
    
    // Default pad to 3 length, or more if participants have larger numbers
    const maxLength = Math.max(3, ...participants.map(p => p.numero.length));
    const paddedNum = chosenParticipant.numero.padStart(maxLength, '0');
    
    setResultNumber(paddedNum);
    setResultName(chosenParticipant.nombre);

    // Determine if winner
    const willBeWinner = currentDrawCount >= config.waterDraws;

    // Wait for spin to finish
    setTimeout(() => {
      setIsSpinning(false);
      setIsWinner(willBeWinner);
      
      setDrawnTickets(prev => [...prev, { number: paddedNum, name: chosenParticipant.nombre, type: willBeWinner ? 'winner' : 'agua' }]);
      
      if (willBeWinner) {
        setShowModal(true);
        setCurrentDrawCount(0);
      } else {
        setCurrentDrawCount(prev => prev + 1);
      }
    }, config.spinTime + 1000); 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-blue-500/30">
      <CircuitBackground />

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-6">
        <div className="w-12" /> {/* Spacer */}
        
        {/* Logo Area */}
        <div className="flex flex-col items-center">
           <div className="text-5xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]" style={{ transform: 'skewX(-10deg)' }}>
             Tecserlan
           </div>
           <div className="text-xs md:text-sm font-bold tracking-[0.4em] text-white uppercase mt-1" style={{ transform: 'skewX(-10deg)' }}>
             Soluciones Tecnológicas
           </div>
        </div>

        <button 
          onClick={() => setShowConfig(true)}
          className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors backdrop-blur-sm"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content - Kiosk Style */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] pb-20">
        
        {/* Drawn Tickets Section - Side Panel */}
        <div className="hidden lg:flex flex-col absolute left-8 top-12 bottom-12 w-72 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl z-20">
          <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-700/50 pb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Números al Agua
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {drawnTickets.filter(t => t.type === 'agua').length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-10">Ningún número al agua todavía.</p>
            ) : (
              drawnTickets.filter(t => t.type === 'agua').map((ticket, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600 shadow-inner"
                >
                  <div className="text-3xl font-black text-slate-500 line-through decoration-red-500/70 decoration-4" style={{ fontFamily: config.fontFamily }}>
                    {ticket.number}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase truncate w-full text-center mt-1" title={ticket.name}>
                    {ticket.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-12 text-center">
          <p className="text-3xl md:text-5xl text-blue-200/90 font-black tracking-widest uppercase drop-shadow-lg">
            {currentDrawCount < config.waterDraws 
              ? `Sorteo al agua ${currentDrawCount + 1} de ${config.waterDraws}`
              : "¡Sorteo por el Premio Mayor!"}
          </p>
        </div>

        {/* Slot Machine Container */}
        <div className="flex gap-4 md:gap-8 mb-16 p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-blue-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {resultNumber.split('').map((digit, i) => (
             <Reel key={i} targetDigit={digit} isSpinning={isSpinning} spinTime={config.spinTime} delay={i * 400} fontFamily={config.fontFamily} />
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isSpinning}
          className={cn(
            "group relative flex items-center gap-4 px-12 py-6 rounded-full font-black text-2xl uppercase tracking-widest transition-all duration-300",
            isSpinning 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_rgba(6,182,212,0.7)]"
          )}
        >
          {isSpinning ? (
            "Sorteando..."
          ) : (
            <>
              <Play className="w-8 h-8 fill-current" />
              Iniciar Sorteo
            </>
          )}
          
          {/* Button Glow Effect */}
          {!isSpinning && (
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

      </main>

      {/* Config Panel Overlay */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-400" />
                Configuración
              </h2>
              <button 
                onClick={() => setShowConfig(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              <div className="space-y-4">
                
                {/* Excel Upload Area */}
                <div className="p-5 rounded-xl bg-slate-800/80 border border-blue-500/30 mb-6">
                  <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participantes: {participants.length}
                  </h3>
                  <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-blue-500/40 hover:border-blue-400/80 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800 transition-all group p-4">
                    <Upload className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-slate-200">Subir listado en Excel</span>
                    <span className="text-xs text-slate-500 mt-1 text-center">Formato: Archivo .xlsx o .xls<br />Columnas recomendadas: Nombre, Numero</span>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                  </label>
                  
                  {participants.length > 0 && (
                     <button onClick={() => {
                        if(window.confirm('¿Estás seguro de borrar todos los participantes?')) { 
                          setParticipants([]); 
                          setDrawnTickets([]);
                          setCurrentDrawCount(0);
                        }
                       }} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-900/30 text-red-400 border border-red-900/50 text-xs font-bold hover:bg-red-900/50 transition-colors uppercase tracking-wider">
                       <Trash2 className="w-4 h-4" />
                       Limpiar Lista
                     </button>
                  )}
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300 mb-1 block">Tiempo de Giro (ms)</span>
                  <input 
                    type="number" 
                    step="500"
                    value={config.spinTime}
                    onChange={(e) => setConfig({...config, spinTime: parseInt(e.target.value) || 1000})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300 mb-1 block">Sorteos "Al Agua" antes del ganador</span>
                  <input 
                    type="number" 
                    value={config.waterDraws}
                    onChange={(e) => {
                      setConfig({...config, waterDraws: parseInt(e.target.value) || 0});
                      setCurrentDrawCount(0); // Reset count when changed
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-2">Ej: Si pones 3, los primeros 3 giros serán perdedores, el 4to será el ganador.</p>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300 mb-1 block">Fuente de los Números</span>
                  <select 
                    value={config.fontFamily}
                    onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="'Orbitron', sans-serif">Orbitron (Futurista)</option>
                    <option value="'JetBrains Mono', monospace">JetBrains Mono (Código)</option>
                    <option value="'VT323', monospace">VT323 (Retro 8-bit)</option>
                    <option value="'Wallpoet', size-adjust">Wallpoet (Digital)</option>
                    <option value="'Black Ops One', system-ui">Black Ops One (Militar)</option>
                  </select>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/20">
                <h3 className="text-sm font-bold text-blue-400 mb-2">Estado Actual</h3>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>Sorteos realizados:</span>
                  <span className="font-mono">{currentDrawCount}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Próximo sorteo será:</span>
                  <span className={cn("font-bold", currentDrawCount >= config.waterDraws ? "text-green-400" : "text-amber-400")}>
                    {currentDrawCount >= config.waterDraws ? "GANADOR" : "AL AGUA"}
                  </span>
                </div>
                <button 
                  onClick={() => setCurrentDrawCount(0)}
                  className="mt-4 w-full py-2 rounded-lg bg-slate-800 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Reiniciar Contador
                </button>
                <button 
                  onClick={() => {
                    setCurrentDrawCount(0);
                    setDrawnTickets([]);
                  }}
                  className="mt-2 w-full py-2 rounded-lg bg-red-900/30 text-red-400 border border-red-900/50 text-sm font-medium hover:bg-red-900/50 transition-colors"
                >
                  Reiniciar Sorteo Completo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal 
        isOpen={showModal} 
        result={resultNumber} 
        resultName={resultName}
        isWinner={isWinner} 
        onClose={() => setShowModal(false)} 
        fontFamily={config.fontFamily}
      />
    </div>
  );
}

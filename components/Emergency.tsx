import React, { useState, useEffect } from 'react';
import { Wind, PlayCircle, MessageCircle, ArrowLeft, RotateCcw, Music, GlassWater, Heart, Coffee, Sun, CloudSun, Utensils } from 'lucide-react';
import { AppTab } from '../types';

enum Mode {
  Menu,
  Breathe,
  Game,
  Ask
}

interface Question {
    text: string;
    options: {
        label: string;
        action: 'eat' | 'distract' | 'water';
    }[];
}

const QUESTIONS: Question[] = [
    {
        text: "是真的饿了吗？还是因为嘴巴寂寞？",
        options: [
            { label: "肚子咕咕叫，真饿了", action: 'eat' },
            { label: "单纯嘴馋，想嚼东西", action: 'distract' }
        ]
    },
    {
        text: "是不是刚看到美味的食物广告？",
        options: [
            { label: "是的，被诱惑了", action: 'distract' },
            { label: "没有，就是想吃", action: 'eat' }
        ]
    },
    {
        text: "现在是不是感到有点无聊？",
        options: [
            { label: "有点无所事事", action: 'distract' },
            { label: "很忙，但饿了", action: 'eat' }
        ]
    },
    {
        text: "是不是觉得口渴了？",
        options: [
            { label: "好像有点渴", action: 'water' },
            { label: "不渴，就是饿", action: 'eat' }
        ]
    }
];

export const Emergency: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.Menu);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleFinish = () => {
    setShowCelebration(true);
    setTimeout(() => {
        setShowCelebration(false);
        setMode(Mode.Menu);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-cream-50 relative overflow-hidden pb-32">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pastel-yellow/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pastel-pink/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {showCelebration && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm animate-celebrate p-8 text-center">
            <div className="relative">
                {/* Hand drawn style smiley face */}
                <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-lg animate-bounce text-pastel-yellow fill-transparent stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Imperfect Circle */}
                    <path d="M50 5 A 45 45 0 1 0 50 95 A 45 45 0 1 0 50 5 Z" />
                    {/* Eyes */}
                    <circle cx="35" cy="40" r="2" fill="currentColor" stroke="none" />
                    <circle cx="65" cy="40" r="2" fill="currentColor" stroke="none" />
                    {/* Smile */}
                    <path d="M30 60 Q50 80 70 60" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8 tracking-tight">太棒啦!</h2>
            <p className="text-gray-600 mt-4 font-bold text-lg leading-relaxed">
                爱自己，<br/>从倾听身体的声音开始。
            </p>
        </div>
      )}

      {mode === Mode.Menu && <Menu setMode={setMode} />}
      {mode === Mode.Breathe && <Breathing onBack={() => setMode(Mode.Menu)} onFinish={handleFinish} />}
      {mode === Mode.Game && <BubbleGame onBack={() => setMode(Mode.Menu)} onFinish={handleFinish} />}
      {mode === Mode.Ask && <MindfulAsk onBack={() => setMode(Mode.Menu)} onFinish={handleFinish} />}
    </div>
  );
};

const Menu: React.FC<{ setMode: (m: Mode) => void }> = ({ setMode }) => (
  <div className="p-8 flex flex-col h-full justify-center z-10">
    <header className="mb-12 text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2 flex justify-center items-center gap-2">
         冷静一下 <span className="text-pastel-yellow">⚡️</span>
      </h1>
      <p className="text-gray-400 text-sm">停一停，给冲动按个暂停键</p>
    </header>

    <div className="space-y-6 max-w-sm mx-auto w-full">
      <button 
        onClick={() => setMode(Mode.Breathe)}
        className="w-full bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-lg hover:shadow-pastel-blue/20 transition-all flex items-center gap-5 group border border-cream-200"
      >
        <div className="w-16 h-16 bg-pastel-blue/20 text-pastel-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wind size={32} />
        </div>
        <div className="text-left">
            <h3 className="font-bold text-lg text-gray-800">呼吸练习</h3>
            <p className="text-xs text-gray-400 mt-1">4-7-8 呼吸法</p>
        </div>
      </button>

      <button 
        onClick={() => setMode(Mode.Game)}
        className="w-full bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-lg hover:shadow-pastel-purple/20 transition-all flex items-center gap-5 group border border-cream-200"
      >
        <div className="w-16 h-16 bg-pastel-purple/20 text-pastel-purple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlayCircle size={32} />
        </div>
        <div className="text-left">
            <h3 className="font-bold text-lg text-gray-800">戳泡泡</h3>
            <p className="text-xs text-gray-400 mt-1">戳破焦虑，转移注意</p>
        </div>
      </button>

      <button 
        onClick={() => setMode(Mode.Ask)}
        className="w-full bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-lg hover:shadow-pastel-orange/20 transition-all flex items-center gap-5 group border border-cream-200"
      >
         <div className="w-16 h-16 bg-pastel-orange/20 text-pastel-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle size={32} />
        </div>
        <div className="text-left">
            <h3 className="font-bold text-lg text-gray-800">聊聊天呗</h3>
            <p className="text-xs text-gray-400 mt-1">听听内心的声音</p>
        </div>
      </button>
    </div>
  </div>
);

const Breathing: React.FC<{ onBack: () => void, onFinish: () => void }> = ({ onBack, onFinish }) => {
  const [phase, setPhase] = useState<'Start' | 'In' | 'Hold' | 'Out'>('Start');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [text, setText] = useState('准备');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const startTimer = (seconds: number) => {
        setSecondsLeft(seconds);
        interval = setInterval(() => {
            setSecondsLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
    };

    const runSequence = () => {
        // Inhale (4s)
        setPhase('In');
        setText('吸气');
        startTimer(4);

        timer = setTimeout(() => {
            clearInterval(interval);
            // Hold (7s)
            setPhase('Hold');
            setText('屏气');
            startTimer(7);

            timer = setTimeout(() => {
                clearInterval(interval);
                // Out (8s)
                setPhase('Out');
                setText('呼气');
                startTimer(8);

                timer = setTimeout(() => {
                   clearInterval(interval);
                   onFinish();
                }, 8000);
            }, 7000);
        }, 4000);
    };

    timer = setTimeout(runSequence, 500);

    return () => {
        clearTimeout(timer);
        clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center relative z-10">
        <button onClick={onBack} className="absolute top-6 left-6 p-3 text-gray-400 hover:text-gray-800 bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} />
        </button>
        
        <div className="relative flex items-center justify-center w-80 h-80">
             {/* Animation Rings with Blob effect */}
             <div className={`absolute inset-0 bg-pastel-blue rounded-full opacity-30 animate-blob mix-blend-multiply transition-transform duration-[4000ms]
                ${phase === 'In' ? 'scale-125' : ''}
                ${phase === 'Hold' ? 'scale-125' : ''}
                ${phase === 'Out' ? 'scale-100' : ''}
             `}></div>
             
             <div className={`absolute inset-4 bg-pastel-green rounded-full opacity-30 animate-blob mix-blend-multiply transition-transform duration-[4000ms] delay-100
                ${phase === 'In' ? 'scale-110' : ''}
                ${phase === 'Hold' ? 'scale-110' : ''}
                ${phase === 'Out' ? 'scale-100' : ''}
             `}></div>

             {/* Core Circle */}
             <div className="w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(77,163,255,0.4)] z-10 text-gray-700 animate-float">
                <span className="text-6xl font-black text-pastel-blue mb-2 font-mono">{secondsLeft > 0 ? secondsLeft : ''}</span>
                <span className="text-xl font-bold text-gray-400 tracking-widest">{text}</span>
             </div>
        </div>
    </div>
  );
};

const BubbleGame: React.FC<{ onBack: () => void, onFinish: () => void }> = ({ onBack, onFinish }) => {
    // Generate irregular positions on mount
    const [bubbles, setBubbles] = useState(() => Array.from({length: 12}, (_, i) => ({
        id: i, 
        popped: false,
        top: 10 + Math.random() * 60, // 10% to 70%
        left: 10 + Math.random() * 70, // 10% to 80%
        size: 50 + Math.random() * 40, // 50px to 90px
        color: ['bg-pastel-blue', 'bg-pastel-pink', 'bg-pastel-yellow', 'bg-pastel-green'][i % 4],
        delay: Math.random() * 2,
    })));
    
    const pop = (id: number) => {
        setBubbles(prev => {
            const newBubbles = prev.map(b => b.id === id ? {...b, popped: true} : b);
            if (newBubbles.every(b => b.popped)) {
                setTimeout(onFinish, 500);
            }
            return newBubbles;
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="flex flex-col h-full w-full relative z-10 bg-cream-50">
            <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20">
                <button onClick={onBack} className="p-3 text-gray-400 hover:text-gray-800 bg-white rounded-full shadow-sm">
                    <ArrowLeft size={20} />
                </button>
            </div>
            
            <div className="text-center mt-20 mb-4 z-20 pointer-events-none">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">戳破压力！</h2>
                <p className="text-sm text-gray-400">把漂浮的烦恼都抓起来</p>
            </div>
            
            <div className="absolute inset-0 top-24 overflow-hidden">
                {bubbles.map(b => (
                    <button
                        key={b.id}
                        onClick={() => pop(b.id)}
                        disabled={b.popped}
                        style={{
                            top: `${b.top}%`,
                            left: `${b.left}%`,
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            animationDelay: `${b.delay}s`
                        }}
                        className={`absolute rounded-full transition-all duration-300 transform shadow-lg animate-float
                            ${b.popped ? 'scale-125 opacity-0' : 'scale-100 hover:scale-105 active:scale-95'}
                            ${b.color}
                        `}
                    >
                         <div className="absolute top-[20%] right-[20%] w-[25%] h-[25%] bg-white opacity-40 rounded-full"></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const MindfulAsk: React.FC<{ onBack: () => void, onFinish: () => void }> = ({ onBack, onFinish }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [view, setView] = useState<'Question' | 'Distract' | 'Eat'>('Question');

    const refreshQuestion = () => {
        setView('Question');
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * QUESTIONS.length);
        } while (newIndex === currentQIndex);
        setCurrentQIndex(newIndex);
    };

    const handleAnswer = (action: 'eat' | 'distract' | 'water') => {
        if (action === 'distract' || action === 'water') {
            setView('Distract');
        } else {
            setView('Eat');
        }
    };

    const currentQ = QUESTIONS[currentQIndex];

    return (
        <div className="flex flex-col h-full items-center justify-center p-8 relative z-10">
            <button onClick={onBack} className="absolute top-6 left-6 p-3 text-gray-400 hover:text-gray-800 bg-white rounded-full shadow-sm">
                <ArrowLeft size={20} />
            </button>
            <button onClick={refreshQuestion} className="absolute top-6 right-6 p-3 text-gray-400 hover:text-gray-800 bg-white rounded-full shadow-sm">
                <RotateCcw size={20} />
            </button>

            {view === 'Question' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full flex flex-col justify-center text-center relative border border-cream-200 animate-fade-in">
                    <div className="w-20 h-20 bg-pastel-orange/20 rounded-full mx-auto mb-6 flex items-center justify-center text-pastel-orange animate-bounce">
                        <Heart size={40} className="fill-pastel-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{currentQ.text}</h3>
                    <div className="space-y-3">
                         {currentQ.options.map((opt, idx) => (
                             <button 
                                key={idx}
                                onClick={() => handleAnswer(opt.action)}
                                className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95
                                    ${idx === 0 
                                        ? 'bg-cream-50 text-gray-600 hover:bg-cream-100' 
                                        : 'bg-pastel-orange text-white shadow-lg shadow-pastel-orange/30 hover:brightness-105'
                                    }`}
                             >
                                {opt.label}
                             </button>
                         ))}
                    </div>
                </div>
            )}

            {view === 'Distract' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full flex flex-col justify-center text-center relative border border-cream-200 animate-fade-in">
                    <div className="w-20 h-20 bg-pastel-blue/20 rounded-full mx-auto mb-6 flex items-center justify-center text-pastel-blue animate-pulse">
                        <CloudSun size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">转移一下注意力</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        给胃放个假。试着去做点别的事情，<br/>5分钟后再回来看看感觉？
                    </p>
                    <div className="space-y-3">
                         <button 
                            onClick={onFinish}
                            className="w-full py-4 rounded-2xl bg-pastel-blue text-white font-bold shadow-lg shadow-pastel-blue/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                         >
                            <Music size={18}/> 听首喜欢的歌
                         </button>
                         <button 
                            onClick={onFinish}
                            className="w-full py-4 rounded-2xl bg-pastel-green text-white font-bold shadow-lg shadow-pastel-green/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                         >
                             <GlassWater size={18} /> 喝杯温水
                         </button>
                         <button 
                            onClick={onFinish}
                            className="w-full py-4 rounded-2xl bg-pastel-yellow text-white font-bold shadow-lg shadow-pastel-yellow/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                         >
                             <Sun size={18} /> 出去晒晒太阳
                         </button>
                    </div>
                </div>
            )}
             
            {view === 'Eat' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full flex flex-col justify-center text-center relative border border-cream-200 animate-fade-in">
                     <div className="w-20 h-20 bg-pastel-pink/20 rounded-full mx-auto mb-6 flex items-center justify-center text-pastel-pink animate-bounce">
                        <Utensils size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">那就好好吃一顿</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        去【规划】里记录一下，<br/>我们只吃身体需要的量，好吗？
                    </p>
                    <button 
                        onClick={onFinish}
                        className="w-full py-4 rounded-2xl bg-pastel-pink text-white font-bold shadow-lg shadow-pastel-pink/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                     >
                        <Utensils size={18} />
                        好的，我去规划
                     </button>
                </div>
            )}

        </div>
    );
};
import React, { useState } from 'react';
import { analyzeFoodInput } from '../services/geminiService';
import { MealAnalysis, AppTab } from '../types';
import { Loader2, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';

interface PlannerProps {
  onNavigate: (tab: AppTab) => void;
  onRecordFood: (food: string) => void;
}

export const Planner: React.FC<PlannerProps> = ({ onNavigate, onRecordFood }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [view, setView] = useState<'input' | 'result'>('input');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeFoodInput(input);
      setResult(data);
      setView('result');
    } catch (e) {
      alert("抱歉，分析出了点小问题，请重试一下。");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
    setInput('');
    setResult(null);
  };

  const handleRecordFeeling = () => {
    if (result) {
        // Create a summary of the food to pass to the journal
        const foodSummary = result.items.map(item => item.name).join(' + ');
        onRecordFood(foodSummary);
    }
    onNavigate(AppTab.Journal);
  };

  // Calculate stomach fill visual
  const fillLevel = result ? Math.min(result.stomachLoadPercentage, 100) : 0;
  const isOverload = result && result.stomachLoadPercentage > 85;
  
  // Animation Scale based on load - emphasized for solid shape
  const scale = 0.9 + (fillLevel / 100) * 0.5; 

  // Determine Color State
  const getColorState = (level: number) => {
      if (level > 85) return { fill: 'fill-pastel-pink', stroke: 'stroke-pastel-pink', text: 'text-pastel-pink', glow: 'shadow-pastel-pink/50' };
      if (level > 60) return { fill: 'fill-pastel-yellow', stroke: 'stroke-pastel-yellow', text: 'text-pastel-yellow', glow: 'shadow-pastel-yellow/50' };
      return { fill: 'fill-pastel-green', stroke: 'stroke-pastel-green', text: 'text-pastel-green', glow: 'shadow-pastel-green/50' };
  };

  const colors = getColorState(fillLevel);

  if (view === 'input') {
    return (
      <div className="flex flex-col h-full p-8 bg-cream-50 no-scrollbar relative overflow-hidden justify-center pb-32">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pastel-yellow/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-pastel-pink/30 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

        <div className="z-10 w-full max-w-md mx-auto space-y-10">
          <header className="text-center space-y-4">
             <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center justify-center border-4 border-cream-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-pastel-pink/10 rounded-full animate-pulse"></div>
               <span className="text-5xl animate-float">🥕</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                  今天吃点什么？
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                输入你想吃的食物，<br/>让我帮你规划最舒服的份量
              </p>
            </div>
          </header>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-pastel-pink/10 border border-cream-200">
            <textarea
              className="w-full bg-cream-50 rounded-2xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 resize-none transition-all border border-transparent focus:border-pastel-pink/30 text-lg"
              rows={4}
              placeholder="例如：西红柿炒蛋..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !input}
                className="w-full flex items-center justify-center space-x-2 bg-pastel-pink hover:bg-pastel-orange text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-pastel-pink/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <span className="flex items-center text-lg">开吃开吃 <ArrowRight size={20} className="ml-2"/></span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto pb-32 bg-cream-50 no-scrollbar animate-fade-in">
       <header className="flex items-center justify-between mt-2">
         <button onClick={handleBack} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-800 shadow-sm border border-cream-200">
            <ArrowLeft size={20}/>
         </button>
         <h1 className="text-xl font-bold text-gray-800">推荐方案</h1>
         <div className="w-10"></div>
       </header>

      {/* Visualization Section */}
      <div className="flex-1 flex flex-col items-center">
        {result && (
          <div className="w-full max-w-sm space-y-6">
            
            {/* Advice Bubble */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-pastel-orange/20 relative animate-float">
                <div className="absolute -top-3 -left-2 bg-pastel-orange text-white p-2 rounded-full shadow-sm">
                    <Sparkles size={16} />
                </div>
                <p className="text-gray-700 font-medium leading-relaxed pl-2">
                    {result.advice}
                </p>
            </div>

            {/* Animated Stomach Container */}
            <div className="relative w-full h-64 mx-auto flex items-center justify-center">
                {/* Unified Organ Shape */}
               <div 
                 className={`relative w-48 h-56 transition-all duration-1000 ease-in-out`}
                 style={{ 
                     transform: `scale(${scale})`
                 }}
               >
                 {/* Glow Behind */}
                 <div className={`w-full h-full rounded-full opacity-40 absolute inset-0 animate-blob mix-blend-multiply blur-2xl transition-colors duration-1000 ${colors.fill.replace('fill-', 'bg-')}`}></div>
                 
                 <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl z-10 relative animate-stomach-churn">
                    <g className="transition-colors duration-1000">
                        {/* Main Stomach Body - Unified Fill */}
                        <path 
                            d="M60,30 C30,30 20,70 20,110 C20,180 50,220 100,220 C150,220 180,180 180,130 C180,100 170,40 130,40 C110,40 100,80 80,80 C60,80 70,30 60,30 Z" 
                            className={`${colors.fill} transition-colors duration-1000 opacity-90`}
                        />
                        {/* Highlight / Shine for 3D effect */}
                        <path 
                            d="M70,50 C60,50 50,80 50,110 C50,160 80,180 100,180" 
                            className="fill-none stroke-white opacity-40 stroke-[4] stroke-linecap-round"
                        />
                    </g>
                    
                    {/* Cute Kawaii Face */}
                   <g className="opacity-90" transform="translate(0, 10)">
                      {/* Eyes - Large Ovals */}
                      <ellipse cx="65" cy="120" rx="8" ry="12" fill="#374151" className="animate-pulse" /> 
                      <circle cx="68" cy="116" r="3" fill="white" /> {/* Eye Shine */}
                      
                      <ellipse cx="115" cy="120" rx="8" ry="12" fill="#374151" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                      <circle cx="118" cy="116" r="3" fill="white" /> {/* Eye Shine */}

                      {/* Cheeks */}
                      <circle cx="55" cy="132" r="6" fill="#fbcfe8" opacity="0.8" />
                      <circle cx="125" cy="132" r="6" fill="#fbcfe8" opacity="0.8" />

                      {/* Mouth - Cute small curve */}
                      {isOverload ? (
                        <path d="M82,130 Q90,125 98,130" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                      ) : (
                        <path d="M82,130 Q90,138 98,130" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                      )}
                   </g>
                 </svg>
               </div>

               {/* Load Percentage Bubble */}
               <div className="absolute top-10 right-10 bg-white px-3 py-1.5 rounded-2xl shadow-lg border border-gray-100 animate-float">
                 <span className={`text-xl font-black ${colors.text} transition-colors duration-1000`}>{result.stomachLoadPercentage}%</span>
               </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3 pb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-2 flex items-center gap-2">
                    <span>🥗</span> 推荐份量
                </h3>
                <div className="grid gap-3">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col p-4 bg-white border border-white shadow-sm rounded-3xl">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner ${
                                idx % 3 === 0 ? 'bg-pastel-green/20' : idx % 3 === 1 ? 'bg-pastel-yellow/20' : 'bg-pastel-pink/20'
                            }`}>
                            {['🥬', '🥩', '🍚', '🥚', '🍅'][item.name.length % 5]}
                            </div>
                            <span className="font-bold text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-bold text-pastel-blue bg-pastel-blue/10 px-4 py-1.5 rounded-2xl text-sm">
                            {item.weight_grams}g
                        </span>
                      </div>
                      
                      {/* Ingredient Breakdown Detail */}
                      {item.ingredients_breakdown && (
                          <div className="ml-14 text-xs text-gray-500 bg-cream-50 p-2 rounded-xl">
                              {item.ingredients_breakdown}
                          </div>
                      )}
                    </div>
                  ))}
                </div>
            </div>

            <button onClick={handleRecordFeeling} className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
                记录一下感受吧 <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
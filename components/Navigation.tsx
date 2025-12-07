import React from 'react';
import { Utensils, BookOpen, Zap } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-6 left-6 right-6 h-20 bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] z-50 flex items-center justify-between px-2">
      
      {/* Planner - Pastel Pink (Now Coral) */}
      <button
        onClick={() => onTabChange(AppTab.Planner)}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${
          currentTab === AppTab.Planner ? '-translate-y-2' : 'hover:-translate-y-1'
        }`}
      >
        <div className={`p-3 rounded-2xl transition-all duration-300 ${
            currentTab === AppTab.Planner ? 'bg-pastel-pink shadow-lg shadow-pastel-pink/40 scale-110' : 'bg-transparent text-gray-400'
        }`}>
            <Utensils size={24} className={currentTab === AppTab.Planner ? 'text-white' : 'text-gray-300'} strokeWidth={2.5} />
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-colors ${currentTab === AppTab.Planner ? 'text-gray-600' : 'text-transparent'}`}>
            规划
        </span>
      </button>

      {/* Emergency - Pastel Yellow */}
      <button
        onClick={() => onTabChange(AppTab.Emergency)}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${
          currentTab === AppTab.Emergency ? '-translate-y-2' : 'hover:-translate-y-1'
        }`}
      >
        <div className={`p-3 rounded-2xl transition-all duration-300 ${
             currentTab === AppTab.Emergency ? 'bg-pastel-yellow shadow-lg shadow-pastel-yellow/50 scale-110' : 'bg-transparent text-gray-400'
        }`}>
             <Zap size={24} className={currentTab === AppTab.Emergency ? 'text-white fill-white' : 'text-gray-300'} strokeWidth={2.5} />
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-colors ${currentTab === AppTab.Emergency ? 'text-gray-600' : 'text-transparent'}`}>
            冷静一下
        </span>
      </button>

      {/* Journal - Pastel Blue */}
      <button
        onClick={() => onTabChange(AppTab.Journal)}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${
          currentTab === AppTab.Journal ? '-translate-y-2' : 'hover:-translate-y-1'
        }`}
      >
        <div className={`p-3 rounded-2xl transition-all duration-300 ${
            currentTab === AppTab.Journal ? 'bg-pastel-blue shadow-lg shadow-pastel-blue/40 scale-110' : 'bg-transparent text-gray-400'
        }`}>
          <BookOpen size={24} className={currentTab === AppTab.Journal ? 'text-white' : 'text-gray-300'} strokeWidth={2.5} />
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-colors ${currentTab === AppTab.Journal ? 'text-gray-600' : 'text-transparent'}`}>
            日记
        </span>
      </button>
    </div>
  );
};
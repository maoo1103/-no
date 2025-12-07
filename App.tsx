import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Planner } from './components/Planner';
import { Journal } from './components/Journal';
import { Emergency } from './components/Emergency';
import { AppTab } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.Planner);
  const [pendingFood, setPendingFood] = useState<string | undefined>(undefined);

  const handleRecordFood = (food: string) => {
    setPendingFood(food);
  };

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.Planner:
        return <Planner onNavigate={(tab) => setCurrentTab(tab)} onRecordFood={handleRecordFood} />;
      case AppTab.Journal:
        return <Journal pendingFood={pendingFood} onClearPendingFood={() => setPendingFood(undefined)} />;
      case AppTab.Emergency:
        return <Emergency />;
      default:
        return <Planner onNavigate={(tab) => setCurrentTab(tab)} onRecordFood={handleRecordFood} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-sans text-gray-900">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
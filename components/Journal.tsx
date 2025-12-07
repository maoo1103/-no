import React, { useState, useEffect } from 'react';
import { StomachFeeling, JournalEntry } from '../types';
import { generateWeeklyReport } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Smile, Meh, Frown, Calendar, Sparkles, X, FileText, Loader2 } from 'lucide-react';

interface JournalProps {
  pendingFood?: string;
  onClearPendingFood?: () => void;
}

export const Journal: React.FC<JournalProps> = ({ pendingFood, onClearPendingFood }) => {
  const [logs, setLogs] = useState<JournalEntry[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Report State
  const [showReport, setShowReport] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('weiwei_logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
        // Updated mock data with food notes to support the summary logic
        const mockData: JournalEntry[] = [
            { id: '1', date: '2023-10-24', timestamp: Date.now() - 86400000 * 3, feeling: StomachFeeling.Great, foodNote: "蔬菜沙拉+鸡胸肉" },
            { id: '2', date: '2023-10-25', timestamp: Date.now() - 86400000 * 2, feeling: StomachFeeling.Full, foodNote: "牛肉面（大碗）" },
            { id: '3', date: '2023-10-25', timestamp: Date.now() - 86400000 * 2 + 1000, feeling: StomachFeeling.Great, foodNote: "苹果一个" },
            { id: '4', date: '2023-10-26', timestamp: Date.now() - 86400000, feeling: StomachFeeling.Stuffed, foodNote: "红烧肉+两碗米饭" },
            { id: '5', date: '2023-10-26', timestamp: Date.now() - 43200000, feeling: StomachFeeling.Stuffed, foodNote: "火锅+米饭 150g" },
            { id: '6', date: '2023-10-27', timestamp: Date.now(), feeling: StomachFeeling.Full, foodNote: "三明治" },
        ];
        setLogs(mockData);
        localStorage.setItem('weiwei_logs', JSON.stringify(mockData));
    }
  }, []);

  const handleLog = (feeling: StomachFeeling) => {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      feeling,
      foodNote: pendingFood || "未记录食物"
    };
    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('weiwei_logs', JSON.stringify(updatedLogs));
    
    // Clear the pending food if it was used
    if (pendingFood && onClearPendingFood) {
        onClearPendingFood();
    }

    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleGenerateReport = async () => {
    setShowReport(true);
    setReportLoading(true);
    setReportContent('');
    try {
        const report = await generateWeeklyReport(logs);
        setReportContent(report);
    } catch (e) {
        setReportContent("生成报告失败，请稍后再试。");
    } finally {
        setReportLoading(false);
    }
  };

  const chartData = [
    { name: '刚好', value: logs.filter(l => l.feeling === StomachFeeling.Great).length, color: '#AEC6CF' }, // Pastel Blue
    { name: '有点撑', value: logs.filter(l => l.feeling === StomachFeeling.Full).length, color: '#FDFD96' }, // Pastel Yellow
    { name: '撑到了', value: logs.filter(l => l.feeling === StomachFeeling.Stuffed).length, color: '#FFD1DC' }, // Pastel Pink
  ];

  return (
    <div className="flex flex-col h-full p-6 space-y-8 overflow-y-auto pb-32 bg-cream-50 no-scrollbar relative">
      <header className="mt-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                胃感日记 <span className="text-2xl">📝</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">记录每一次感受，更懂身体的声音</p>
        </div>
      </header>

      {/* Pending Food Indicator */}
      {pendingFood && (
          <div className="bg-pastel-pink/10 border border-pastel-pink/20 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">🍲</span>
              <div className="flex-1">
                  <p className="text-xs text-pastel-pink font-bold uppercase">待记录</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{pendingFood}</p>
              </div>
          </div>
      )}

      {/* Quick Log Action */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-cream-200">
        <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
           <span className="bg-pastel-blue/20 p-2 rounded-lg text-pastel-blue"><Calendar size={20}/></span>
           现在感觉怎么样？
        </h2>
        
        {showConfirmation ? (
            <div className="flex flex-col items-center justify-center h-28 text-pastel-green font-bold animate-pulse space-y-3">
                <div className="bg-green-100 p-4 rounded-full"><Smile size={36}/></div>
                <span>记录成功！✨</span>
            </div>
        ) : (
            <div className="flex justify-between items-center gap-3">
            <button 
                onClick={() => handleLog(StomachFeeling.Great)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-cream-50 transition-all w-1/3 group"
            >
                <div className="w-14 h-14 bg-pastel-blue/20 rounded-full flex items-center justify-center text-pastel-blue group-hover:scale-110 transition-transform">
                    <Smile size={30} />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">刚好</span>
            </button>

            <button 
                onClick={() => handleLog(StomachFeeling.Full)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-cream-50 transition-all w-1/3 group"
            >
                <div className="w-14 h-14 bg-pastel-yellow/30 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                    <Meh size={30} />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">有点撑</span>
            </button>

            <button 
                onClick={() => handleLog(StomachFeeling.Stuffed)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-cream-50 transition-all w-1/3 group"
            >
                <div className="w-14 h-14 bg-pastel-pink/20 rounded-full flex items-center justify-center text-pastel-pink group-hover:scale-110 transition-transform">
                    <Frown size={30} />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">撑到了</span>
            </button>
            </div>
        )}
      </div>

      {/* Stats & Report */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-cream-200 flex-1 min-h-[300px] relative">
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-gray-700">感受分布</h2>
                <p className="text-xs text-gray-400 mt-1">这周你的“胃”过得开心吗？</p>
            </div>
            <button 
                onClick={handleGenerateReport}
                className="bg-pastel-purple/20 text-pastel-purple hover:bg-pastel-purple/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
                <FileText size={14}/> 生成周报
            </button>
        </div>
        
        <div className="h-56 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Report Overlay Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md max-h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative">
                <button 
                    onClick={() => setShowReport(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-gray-500" />
                </button>
                
                <div className="bg-pastel-purple/10 p-6 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles size={20} className="text-pastel-purple"/> 本周胃感周报
                    </h2>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {reportLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 size={40} className="text-pastel-purple animate-spin" />
                            <p className="text-gray-400 text-sm">正在分析你的饮食规律...</p>
                        </div>
                    ) : (
                        <div className="prose prose-sm prose-gray whitespace-pre-line leading-relaxed text-gray-600 font-medium">
                            {reportContent}
                        </div>
                    )}
                </div>

                 {!reportLoading && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button 
                            onClick={() => setShowReport(false)}
                            className="w-full py-3 bg-pastel-purple text-white rounded-xl font-bold shadow-lg shadow-pastel-purple/30"
                        >
                            收到啦，我会注意的 ✨
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
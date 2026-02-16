import React from 'react';
import { GlassCard } from '../UI/GlassCard';

export const WeeklyActivity: React.FC = () => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  // Mock data: 0 = low activity, 3 = high activity
  const activityLevels = [1, 3, 2, 0, 3, 1, 0];

  const getColor = (level: number) => {
    switch(level) {
        case 0: return 'bg-gray-100';
        case 1: return 'bg-cyan-200';
        case 2: return 'bg-cyan-400';
        case 3: return 'bg-cyan-600';
        default: return 'bg-gray-100';
    }
  };

  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">주간 스펙 준비 활동</h3>
        <p className="text-sm text-gray-500">이번 주 총 12시간 학습하셨습니다.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-end gap-2 h-32 mb-2">
            {activityLevels.map((level, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full">
                     <div className={`w-full rounded-t-md transition-all duration-500 ${getColor(level)}`} 
                          style={{ height: `${level === 0 ? 10 : level * 30}%` }}>
                     </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between gap-2 border-t border-gray-100 pt-3">
             {days.map((d, i) => (
                <div key={i} className="w-full text-center text-xs text-gray-400 font-medium">
                    {d}
                </div>
            ))}
        </div>
      </div>
      
      <div className="mt-6 flex gap-3 text-xs text-gray-500 justify-end items-center">
        <span>Less</span>
        <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
            <div className="w-3 h-3 rounded-sm bg-cyan-200"></div>
            <div className="w-3 h-3 rounded-sm bg-cyan-400"></div>
            <div className="w-3 h-3 rounded-sm bg-cyan-600"></div>
        </div>
        <span>More</span>
      </div>
    </GlassCard>
  );
};
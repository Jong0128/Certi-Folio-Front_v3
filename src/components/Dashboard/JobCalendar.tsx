import React from 'react';
import { GlassCard } from '../UI/GlassCard';

export const JobCalendar: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Job Data with Start and End Dates
  const jobPostings = [
    { 
        id: 1, 
        company: '네이버 (Naver)', 
        role: 'FE 개발자 신입 공채', 
        startDate: '2025.02.05', 
        endDate: '2025.02.18',
        startDay: 5,
        endDay: 18,
        dDay: 3,
        color: 'bg-green-100 text-green-700 border-green-200' 
    },
    { 
        id: 2, 
        company: '토스 (Toss)', 
        role: 'Frontend Developer', 
        startDate: '2025.02.10', 
        endDate: '2025.02.24',
        startDay: 10,
        endDay: 24,
        dDay: 7,
        color: 'bg-blue-100 text-blue-700 border-blue-200' 
    },
    { 
        id: 3, 
        company: '당근마켓', 
        role: '플랫폼 개발자', 
        startDate: '2025.02.01', 
        endDate: '2025.02.15',
        startDay: 1,
        endDay: 15,
        dDay: 1,
        color: 'bg-orange-100 text-orange-700 border-orange-200' 
    },
    { 
        id: 4, 
        company: '카카오 (Kakao)', 
        role: '채용 연계형 인턴', 
        startDate: '2025.02.20', 
        endDate: '2025.03.05',
        startDay: 20,
        endDay: 35, // Next month logic simplified for visual
        dDay: 15,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    },
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <GlassCard className="p-8 h-full flex flex-col md:flex-row gap-8 min-h-[500px]">
      
      {/* Left: Large Calendar Grid */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               📅 채용 일정 캘린더
               <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{currentMonth}월</span>
            </h3>
            <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div>시작</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div>마감</span>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-1">
            {weeks.map(w => (
                <div key={w} className="bg-gray-50 text-center py-2 text-xs font-bold text-gray-500">{w}</div>
            ))}
            
            {/* Empty cells */}
            {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white min-h-[80px]" />
            ))}

            {/* Date cells */}
            {days.map(day => {
                const startingJobs = jobPostings.filter(j => j.startDay === day);
                const endingJobs = jobPostings.filter(j => j.endDay === day);
                
                return (
                    <div key={day} className="bg-white min-h-[80px] p-1 flex flex-col gap-1 hover:bg-gray-50 transition-colors">
                        <span className={`text-sm font-medium ml-1 ${day === new Date().getDate() ? 'text-cyan-600 font-bold' : 'text-gray-700'}`}>
                            {day}
                        </span>
                        
                        {startingJobs.map(job => (
                            <div key={`s-${job.id}`} className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium truncate border border-green-200">
                                {job.company.split(' ')[0]}
                            </div>
                        ))}
                         {endingJobs.map(job => (
                            <div key={`e-${job.id}`} className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium truncate border border-red-100">
                                {job.company.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Right: Detailed Job List with Start/End Dates */}
      <div className="w-full md:w-80 border-l border-gray-100 md:pl-8 flex flex-col">
        <h4 className="text-lg font-bold text-gray-900 mb-6">마감 임박 공고</h4>
        
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {jobPostings.map(job => (
                <div key={job.id} className="group p-4 rounded-xl border border-gray-100 bg-white hover:border-cyan-200 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${job.dDay <= 3 ? 'bg-red-500' : 'bg-gray-400'}`}>
                            D-{job.dDay}
                        </span>
                        <button className="text-gray-300 hover:text-yellow-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </button>
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm mb-1">{job.company}</h5>
                    <p className="text-xs text-gray-500 mb-3">{job.role}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-2 text-xs space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">시작일</span>
                            <span className="font-medium text-gray-700">{job.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">종료일</span>
                            <span className="font-medium text-red-500">{job.endDate}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <button className="mt-4 w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            전체 일정 보기
        </button>
      </div>

    </GlassCard>
  );
};
import React, { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';

export const JobDashboard: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Job Data (Mock)
  const [jobPostings, setJobPostings] = useState([
    { 
        id: 1, 
        company: '네이버 (Naver)', 
        role: 'FE 개발자 신입 공채', 
        startDate: '2025.02.05', 
        endDate: '2025.02.18',
        startDay: 5,
        endDay: 18,
        dDay: 3,
        link: '',
        color: 'bg-green-100 text-green-700 border-green-200',
        starred: true 
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
        link: '',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        starred: false
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
        link: '',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        starred: true
    },
    { 
        id: 4, 
        company: '카카오 (Kakao)', 
        role: '채용 연계형 인턴', 
        startDate: '2025.02.20', 
        endDate: '2025.03.05',
        startDay: 20,
        endDay: 35, // simplified
        dDay: 15,
        link: '',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        starred: false
    },
  ]);

  const toggleStar = (id: number) => {
      setJobPostings(prev => prev.map(job => job.id === id ? { ...job, starred: !job.starred } : job));
  };

  // Mock Top 10 Jobs
  const topJobs = Array.from({ length: 10 }).map((_, i) => ({
      id: 100 + i,
      rank: i + 1,
      company: ['쿠팡', '라인', '배달의민족', '두나무', '몰로코', '버킷플레이스', '야놀자', '직방', '쏘카', '무신사'][i],
      role: ['Backend', 'Frontend', 'Data', 'PM', 'Design', 'Mobile', 'Security', 'DevOps', 'AI', 'Blockchain'][i] + ' Engineer',
      views: Math.floor(Math.random() * 5000) + 1000
  }));

  // Form State
  const [newJob, setNewJob] = useState({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      link: ''
  });

  const handleAddJob = () => {
      if(newJob.company && newJob.endDate) {
          // Parse days for calendar (simplified)
          const startDay = newJob.startDate ? parseInt(newJob.startDate.split('.')[2]) : new Date().getDate();
          const endDay = parseInt(newJob.endDate.split('.')[2]);
          
          setJobPostings([...jobPostings, {
              id: Date.now(),
              ...newJob,
              startDay: isNaN(startDay) ? new Date().getDate() : startDay,
              endDay: isNaN(endDay) ? new Date().getDate() : endDay,
              dDay: isNaN(endDay) ? 0 : endDay - new Date().getDate(), 
              color: 'bg-purple-100 text-purple-700 border-purple-200',
              starred: true
          }]);
          setShowAddModal(false);
          setNewJob({ company: '', role: '', startDate: '', endDate: '', link: '' });
      }
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="w-full pb-20 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">채용 정보 대시보드</h2>
                <p className="text-gray-500 mt-1">관심 있는 기업의 채용 일정을 한눈에 관리하세요.</p>
            </div>
            {/* 'Add Interested Job' button removed as requested */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Calendar (Span 2) */}
            <div className="lg:col-span-2">
                <GlassCard className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            📅 {currentMonth}월 채용 캘린더
                        </h3>
                        <div className="flex gap-3 text-xs font-medium">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div>시작</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div>마감</span>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-1">
                        {weeks.map(w => (
                            <div key={w} className="bg-gray-50 text-center py-3 text-xs font-bold text-gray-500">{w}</div>
                        ))}
                        
                        {/* Empty cells */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
                        ))}

                        {/* Date cells */}
                        {days.map(day => {
                            const startingJobs = jobPostings.filter(j => j.startDay === day);
                            const endingJobs = jobPostings.filter(j => j.endDay === day);
                            
                            return (
                                <div key={day} className="bg-white min-h-[100px] p-1.5 flex flex-col gap-1 hover:bg-gray-50 transition-colors group relative">
                                    <span className={`text-sm font-medium ml-1 ${day === new Date().getDate() ? 'w-6 h-6 flex items-center justify-center bg-cyan-600 text-white rounded-full' : 'text-gray-700'}`}>
                                        {day}
                                    </span>
                                    
                                    <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                                        {startingJobs.map(job => (
                                            <div key={`s-${job.id}`} className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold truncate border border-green-200">
                                                [시작] {job.company.split(' ')[0]}
                                            </div>
                                        ))}
                                        {endingJobs.map(job => (
                                            <div key={`e-${job.id}`} className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold truncate border border-red-200">
                                                [마감] {job.company.split(' ')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>

            {/* Right Column: List & D-Day */}
            <div className="flex flex-col gap-6">
                <GlassCard className="p-6 flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                        📌 마감 임박 공고
                        <span className="text-xs text-gray-400 font-normal">D-Day 순</span>
                    </h4>
                    
                    <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[600px] pr-2">
                        {jobPostings.sort((a,b) => a.dDay - b.dDay).map(job => (
                            <div key={job.id} className="group p-4 rounded-xl border border-gray-100 bg-white hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${job.dDay <= 3 ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                                
                                {/* Star Button (Top Right) */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleStar(job.id); }}
                                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                                >
                                    <svg className={`w-5 h-5 ${job.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>

                                <div className="pl-3 pr-6">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${job.dDay <= 3 ? 'bg-red-500' : 'bg-gray-400'}`}>
                                            D-{job.dDay > 0 ? job.dDay : 'Day'}
                                        </span>
                                        <span className="text-[10px] text-gray-400 mr-2">{job.endDate.slice(5)} 마감</span>
                                    </div>
                                    <h5 className="font-bold text-gray-800 text-sm mb-0.5">{job.company}</h5>
                                    <p className="text-xs text-gray-500 line-clamp-1">{job.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>

        {/* Top 10 Section (New) */}
        <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🔥 실시간 인기 공고 TOP 10
                <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg">조회수 기준</span>
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x">
                {topJobs.map((job) => (
                    <div key={job.id} className="snap-start min-w-[200px] w-[200px] bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-lg font-black italic ${job.rank <= 3 ? 'text-cyan-600' : 'text-gray-300'}`}>
                                {job.rank}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                👁️ {job.views}
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">{job.company}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 h-8">{job.role}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Add Job Modal (Inline Overlay) */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">관심 공고 직접 등록</h3>
                    <div className="space-y-4">
                        <Input label="기업명" placeholder="예: 구글 코리아" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} />
                        <Input label="직무 / 공고명" placeholder="예: Backend Engineer" value={newJob.role} onChange={(e) => setNewJob({...newJob, role: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <DatePicker label="시작일" value={newJob.startDate} onChange={(val) => setNewJob({...newJob, startDate: val})} placeholder="YYYY.MM.DD" />
                            <DatePicker label="마감일" value={newJob.endDate} onChange={(val) => setNewJob({...newJob, endDate: val})} placeholder="YYYY.MM.DD" />
                        </div>
                        <Input label="공고 링크 (선택)" placeholder="https://..." value={newJob.link} onChange={(e) => setNewJob({...newJob, link: e.target.value})} />
                    </div>
                    <div className="flex gap-3 mt-8">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">취소</Button>
                        <Button variant="primary" onClick={handleAddJob} disabled={!newJob.company || !newJob.endDate} className="flex-1">등록하기</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
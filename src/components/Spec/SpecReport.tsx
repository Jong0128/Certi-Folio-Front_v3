import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface SpecReportProps {
  userData: any;
  onGoToDashboard: () => void;
  onDiagnose?: () => void;
}

export const SpecReport: React.FC<SpecReportProps> = ({ userData, onGoToDashboard, onDiagnose }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // If no user data is provided, show empty state immediately
  if (!userData) {
      return (
        <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center animate-fade-in-up">
            <GlassCard className="p-12 text-center max-w-lg mx-auto shadow-2xl">
                <div className="text-6xl mb-6">📝</div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">분석할 데이터가 없습니다</h2>
                <p className="text-gray-500 mb-8 text-lg">
                    정확한 커리어 리포트를 생성하기 위해<br/>
                    먼저 기본 정보와 스펙을 입력해주세요.
                </p>
                <Button variant="neon" onClick={onDiagnose} className="px-10 py-4 text-lg font-bold shadow-cyan-500/30">
                    정보 입력하러 가기
                </Button>
                <button onClick={onGoToDashboard} className="block mt-6 text-gray-400 hover:text-gray-600 underline text-sm mx-auto">
                    대시보드로 돌아가기
                </button>
            </GlassCard>
        </div>
      );
  }

  // Loading Sequence Messages
  const loadingMessages = [
    "데이터 분석 중...",
    `${userData.targetJobRole || '직무'} 공고 스캔...`,
    "합격자 데이터 비교...",
    "로드맵 생성 중...",
    "완료!"
  ];

  useEffect(() => {
    if (loadingStep < loadingMessages.length) {
      const timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 250); // Faster speed: 0.25s per step
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowResult(true), 100);
    }
  }, [loadingStep]);

  // Mock Analysis Data
  const stats = {
    gpa: userData.gpa ? (parseFloat(userData.gpa) / 4.5) * 100 : 80,
    language: userData.certificates?.some((c:any) => c.type === 'language') ? 90 : 45,
    certificate: (userData.certificates?.filter((c:any) => c.type === 'general').length || 0) * 25 + 20,
    project: (userData.projects?.length || 0) * 20 + 20,
    activity: (userData.activities?.length || 0) * 20 + 20,
    career: (userData.careers?.length || 0) * 30 + 10 
  };

  // Normalize stats to max 100
  Object.keys(stats).forEach(key => {
    // @ts-ignore
    if (stats[key] > 100) stats[key] = 100;
    // @ts-ignore
    if (stats[key] < 20) stats[key] = 20;
  });

  // Helper for Radar Chart
  const getRadarPath = (s: any) => {
    // 6 points: Top, TopRight, BottomRight, Bottom, BottomLeft, TopLeft
    const scale = 0.8;
    const center = 100;
    
    // Order: 학점, 어학, 프로젝트, 경력(Bottom), 대외활동, 자격증
    const v = [
        s.gpa, s.language, s.project, 
        s.career, s.activity, s.certificate
    ];

    // Angles for hexagon (starts from -90 deg aka Top)
    const angles = [-90, -30, 30, 90, 150, 210].map(a => a * (Math.PI / 180));
    
    const points = v.map((val, i) => {
        const r = val * scale;
        const x = center + r * Math.cos(angles[i]);
        const y = center + r * Math.sin(angles[i]);
        return `${x},${y}`;
    });

    return points.join(' ');
  };

  if (!showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto">
        <div className="relative w-20 h-20 mb-6">
           <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 transition-all duration-300">
            {loadingMessages[Math.min(loadingStep, loadingMessages.length - 1)]}
        </h2>
        <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div 
                className="h-full bg-cyan-500 transition-all duration-200 ease-linear"
                style={{ width: `${(loadingStep / loadingMessages.length) * 100}%` }}
            ></div>
        </div>
      </div>
    );
  }

  // Calculate Total Grade
  const totalScore = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 6);
  let grade = 'B';
  if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B+';
  
  // Circular Chart Configuration
  const radius = 80;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - totalScore / 100);

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-fade-in-up px-4">
        
        {/* Header Section */}
        <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold mb-4 border border-cyan-200">
                AI DIAGNOSIS COMPLETE
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{userData.name}</span>님의 커리어 분석 리포트
            </h1>
            <p className="text-gray-500 text-lg">
                목표하신 <span className="font-bold text-gray-800">{userData.targetCompanyType} - {userData.targetJobRole}</span> 직무 적합도를 분석했습니다.
            </p>
        </div>

        {/* Top Grid: Score & Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Score (Cleaned up - no decoration) */}
            <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-cyan-300 transition-all">
                <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">Total Competency</h3>
                
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        {/* Background Circle */}
                        <circle cx="100" cy="100" r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="none" />
                        {/* Progress Circle */}
                        <circle 
                            cx="100" cy="100" r={radius} 
                            stroke="url(#scoreGradient)" 
                            strokeWidth={strokeWidth} 
                            fill="none" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round" 
                            className="drop-shadow-md transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-gray-900 tracking-tighter">{grade}</span>
                        <span className="text-base font-bold text-cyan-600 mt-2">상위 {100 - Math.round((totalScore/100)*85)}%</span>
                    </div>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600 leading-relaxed px-2">
                    지원자 평균 대비 <span className="font-bold text-cyan-600">직무 경험</span>이 우수하며,<br/>특히 프로젝트 수행 능력이 돋보입니다.
                </p>
            </GlassCard>

            {/* Card 2: Radar Chart & All 6 Stats */}
            <GlassCard className="lg:col-span-2 p-8 flex flex-col md:flex-row items-center gap-8 bg-white/60">
                <div className="flex-1 w-full max-w-[320px] aspect-square relative p-4">
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        {/* Grid Lines (Hexagons) */}
                        {[20, 40, 60, 80].map(r => (
                            <polygon key={r} points={getRadarPath({gpa:r/0.8, language:r/0.8, project:r/0.8, career:r/0.8, activity:r/0.8, certificate:r/0.8})} fill="none" stroke="#e5e7eb" strokeWidth="1" />
                        ))}
                        {/* Axis Lines */}
                        <line x1="100" y1="100" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="100" y1="100" x2="169" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="100" y1="100" x2="169" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="100" y1="100" x2="100" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="100" y1="100" x2="31" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="100" y1="100" x2="31" y2="60" stroke="#e5e7eb" strokeWidth="1" />

                        {/* Data Area */}
                        <polygon 
                            points={getRadarPath(stats)} 
                            fill="rgba(6, 182, 212, 0.2)" 
                            stroke="#06b6d4" 
                            strokeWidth="2"
                            className="animate-pulse"
                        />
                        {/* Labels */}
                        <text x="100" y="10" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">학점/전공</text>
                        <text x="190" y="55" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">어학</text>
                        <text x="190" y="150" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">프로젝트</text>
                        <text x="100" y="195" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">실무경력</text>
                        <text x="10" y="150" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">대외활동</text>
                        <text x="10" y="55" textAnchor="middle" className="text-[11px] fill-gray-500 font-bold">자격증</text>
                    </svg>
                </div>
                
                <div className="flex-1 space-y-4 w-full h-full flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-2 flex justify-between items-center">
                        항목별 상세 점수
                        <span className="text-xs font-normal text-gray-400">100점 만점 기준</span>
                    </h4>
                    <div className="space-y-4">
                        {[
                            { label: '실무 경력', score: stats.career, color: 'bg-cyan-500' },
                            { label: '프로젝트 경험', score: stats.project, color: 'bg-indigo-500' },
                            { label: '자격증/어학', score: (stats.certificate + stats.language)/2, color: 'bg-purple-500' },
                            { label: '학점/전공', score: stats.gpa, color: 'bg-blue-500' },
                            { label: '대외활동', score: stats.activity, color: 'bg-green-500' },
                            { label: '어학 역량', score: stats.language, color: 'bg-orange-400' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs mb-1.5 font-bold text-gray-700">
                                    <span>{item.label}</span>
                                    <span className="text-gray-900">{Math.round(item.score)}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${item.color} transition-all duration-1000`} 
                                        style={{ width: `${item.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* AI Insight Box */}
        <div className="mb-12 animate-fade-in-up animation-delay-500">
            <GlassCard className="p-8 border-l-4 border-l-cyan-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-xl shadow-sm">🤖</div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">AI 정밀 분석 요약</h3>
                        <p className="text-sm text-gray-500">지원자님의 데이터를 기반으로 강점과 보완점을 분석했습니다.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 p-1 rounded-md text-xs">👍 강점 (Strength)</span>
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                                <span className="text-blue-500 font-bold">✓</span>
                                <span>지원 직무인 <strong>{userData.targetJobRole}</strong>와 관련된 프로젝트 경험이 풍부하여 실무 적응력이 높게 평가됩니다.</span>
                            </li>
                            <li className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                                <span className="text-blue-500 font-bold">✓</span>
                                <span><strong>{userData.certificates?.length || 0}개</strong>의 자격증을 보유하고 있어 기초 역량이 탄탄합니다.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Weaknesses / Improvements */}
                    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                            <span className="bg-orange-100 p-1 rounded-md text-xs">⚡ 보완점 (Improvement)</span>
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                                <span className="text-orange-500 font-bold">!</span>
                                <span>실무 경력 점수가 상대적으로 낮습니다. 단기 인턴십이나 현장 실습 기회를 찾아보는 것을 추천합니다.</span>
                            </li>
                            <li className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                                <span className="text-orange-500 font-bold">!</span>
                                <span>알고리즘 역량(코딩 테스트) 증빙 자료가 부족합니다. Solved.ac 연동이나 깃허브 커밋 로그 관리가 필요합니다.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* Roadmap Section */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🚀 AI 추천 커리어 로드맵
            <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg">Next 6 Months</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {[
                { title: '코딩 테스트 대비', desc: '백준 골드 3단계 목표', status: 'urgent', icon: '🔥' },
                { title: 'CS 지식 보완', desc: '네트워크/OS 핵심 정리', status: 'normal', icon: '📚' },
                { title: '팀 프로젝트 고도화', desc: '배포 및 성능 최적화 경험', status: 'recommended', icon: '💻' },
                { title: '현직자 멘토링', desc: '이력서/포트폴리오 첨삭', status: 'normal', icon: '🤝' },
            ].map((item, idx) => (
                <GlassCard key={idx} className={`p-5 flex flex-col gap-3 border-l-4 ${item.status === 'urgent' ? 'border-l-red-400' : item.status === 'recommended' ? 'border-l-cyan-400' : 'border-l-gray-300'}`}>
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    {item.status === 'urgent' && <span className="self-start px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">우선순위 높음</span>}
                </GlassCard>
            ))}
        </div>

        {/* Bottom Action */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-12">
            <Button variant="secondary" className="w-full md:w-auto px-8 py-4" onClick={() => window.print()}>
                리포트 PDF 저장
            </Button>
            <Button variant="neon" className="w-full md:w-auto px-12 py-4 text-lg font-bold shadow-cyan-500/30" onClick={onGoToDashboard}>
                대시보드에서 관리 시작하기
            </Button>
        </div>

    </div>
  );
};
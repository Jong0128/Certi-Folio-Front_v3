import React from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface SpecScoreProps {
    score: number;
    percentile: number;
    isInfoInputted?: boolean;
    onShowReport?: () => void;
    onDiagnose?: () => void;
}

export const SpecScore: React.FC<SpecScoreProps> = ({ score, percentile, isInfoInputted = false, onShowReport, onDiagnose }) => {
    if (!isInfoInputted) {
        return (
            <GlassCard className="p-10 w-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-white/90 to-gray-50 text-center relative overflow-hidden shadow-lg border-white/60">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-2 animate-bounce-slow">
                    📊
                </div>
                <h3 className="text-2xl font-bold text-gray-900">아직 분석된 데이터가 없습니다</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    간단한 정보를 입력하고 AI가 분석해주는<br />
                    나만의 커리어 경쟁력을 확인해보세요.
                </p>
                <Button
                    variant="neon"
                    onClick={onDiagnose}
                    className="mt-4 px-8 py-3 text-lg font-bold"
                >
                    정보 입력하고 진단받기
                </Button>
            </GlassCard>
        );
    }

    const size = 220;
    const strokeWidth = 18;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <GlassCard className="p-10 w-full flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-white/80 to-white/40 text-center relative overflow-hidden shadow-lg border-white/60">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative flex-shrink-0 z-10" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                    <circle cx={center} cy={center} r={radius} stroke="#F3F4F6" strokeWidth={strokeWidth} fill="transparent" />
                    <circle
                        cx={center} cy={center} r={radius}
                        stroke="url(#gradient)" strokeWidth={strokeWidth} fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round" className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter">{score}</span>
                    <span className="text-sm text-gray-400 font-bold mt-1">TOTAL SCORE</span>
                </div>
            </div>

            <div className="space-y-4 max-w-md z-10">
                <div className="inline-block bg-cyan-100 text-cyan-700 text-sm font-bold px-4 py-1.5 rounded-full border border-cyan-200 mb-2">
                    상위 {100 - percentile}%
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">
                    전체 지원자 평균보다<br />
                    <span className="text-cyan-600">{score > 60 ? score - 60 : 0}점</span> 높습니다.
                </h3>
                <p className="text-gray-500 text-base leading-relaxed">
                    합격 가능성이 높은 상태입니다.<br />
                    부족한 2%를 채우러 가볼까요?
                </p>
            </div>

            <div className="mt-4 z-10 w-full flex justify-center">
                <Button
                    variant="neon"
                    onClick={onShowReport}
                    className="px-12 py-4 text-lg font-bold shadow-cyan-500/30 flex items-center justify-center gap-2 group rounded-full hover:scale-105 transition-transform"
                >
                    상세 리포트 확인하기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Button>
            </div>
        </GlassCard>
    );
};
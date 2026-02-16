import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface BasicInfoData {
  name: string;
  birthYear: string;
  targetCompanyType: string;
  targetJobRole: string;
}

interface BasicInfoFlowProps {
  initialData: BasicInfoData;
  onComplete: (data: BasicInfoData) => void;
}

export const BasicInfoFlow: React.FC<BasicInfoFlowProps> = ({ initialData, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<BasicInfoData>(initialData);
  
  // Input States
  const [inputValue, setInputValue] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  
  // UI States
  const [isEditingName, setIsEditingName] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const defaultYearRef = useRef<HTMLButtonElement>(null);

  // --- Data & Constants ---
  const companyTypes = [
    {
      id: 'big_corp',
      label: '대기업',
      desc: '삼성, LG, SK, 현대 등 대규모 그룹사',
      icon: '🏢',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      activeBorder: 'border-blue-500'
    },
    {
      id: 'it_service',
      label: 'IT 서비스 기업',
      desc: '네이버, 카카오, 쿠팡, 토스, 배민 등',
      icon: '💻',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      activeBorder: 'border-purple-500'
    },
    {
      id: 'finance',
      label: '금융권',
      desc: '은행, 증권, 보험, 핀테크 등',
      icon: '📈',
      color: 'bg-green-50 text-green-600 border-green-100',
      activeBorder: 'border-green-500'
    },
    {
      id: 'public',
      label: '공기업/공공기관',
      desc: '공사, 공단, 금융공기업 등',
      icon: '🛡️',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      activeBorder: 'border-emerald-500'
    },
    {
      id: 'startup',
      label: '스타트업',
      desc: '성장 중인 스타트업, 유니콘 기업',
      icon: '💡',
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      activeBorder: 'border-orange-500'
    },
    {
      id: 'etc',
      label: '기타/SI/SM',
      desc: 'SI/SM 전문 기업, 솔루션, 에이전시 등',
      icon: '⚙️',
      color: 'bg-gray-50 text-gray-600 border-gray-100',
      activeBorder: 'border-gray-500'
    }
  ];

  // Developer-focused Job Roles
  const jobRoles: { [key: string]: string[] } = {
    big_corp: ['Backend (Java/Spring)', 'Frontend (React/Vue)', 'Mobile App (Android/iOS)', 'Data Engineer', 'AI/ML Researcher', 'System Software (Embedded)', 'Security Engineer', 'DevOps/Infra'],
    it_service: ['Server Developer', 'Web Frontend', 'Android Developer', 'iOS Developer', 'Data Scientist', 'Machine Learning Eng', 'SRE (Site Reliability Eng)', 'QA/Test Engineer'],
    finance: ['Core Banking 개발', '계정계/정보계 개발', '금융 플랫폼 프론트엔드', 'Data Analyst (금융 데이터)', '블록체인/Digital Asset', '보안/정보보호', 'IT 기획/PM'],
    public: ['전산직 (SW 개발/운영)', '정보보안', '네트워크/시스템 관리', 'DBA', 'IT 사업 관리'],
    startup: ['Full Stack Developer', 'Frontend Lead', 'Backend (Node/Python/Go)', 'Growth Engineer', 'Data Analyst', 'CTO/Tech Lead', 'Blockchain Engineer'],
    etc: ['SI 개발자 (Java/JSP)', 'SM (시스템 운영)', '솔루션 엔지니어', '웹 퍼블리셔', 'ERP 개발', '임베디드 SW']
  };

  const steps = [
    {
      id: 'name',
      category: '본인 확인',
      inputType: 'name_confirm',
      question: (d: BasicInfoData) => isEditingName ? "정확한 이름을 알려주세요." : `회원님의 성함이\n'${d.name}'님이 맞으신가요?`,
      subtext: isEditingName ? "입력해주신 정보로 리포트가 생성됩니다." : "기존 회원 정보와 일치하는지 확인해주세요."
    },
    {
      id: 'birthYear',
      category: '기본 정보',
      inputType: 'year_list',
      question: () => "출생 연도를 알려주세요.",
      subtext: "연령대별 경쟁자 데이터 비교를 위해 필요합니다."
    },
    {
      id: 'targetCompanyType',
      category: '목표 설정',
      inputType: 'company_select',
      question: () => "목표하는 회사의 유형을\n선택해주세요.",
      subtext: "선택하신 유형에 맞춰 맞춤형 분석이 진행됩니다."
    },
    {
      id: 'targetJobRole',
      category: '목표 설정',
      inputType: 'role_select',
      question: () => `${data.targetCompanyType}에서\n어떤 직무를 희망하시나요?`,
      subtext: "가장 주력으로 준비 중인 직무를 선택해주세요."
    }
  ];

  // --- Effects ---
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditingName]);

  // Scroll to 2000 when year step opens
  useEffect(() => {
    if (steps[currentStep].inputType === 'year_list' && defaultYearRef.current) {
      setTimeout(() => {
        defaultYearRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [currentStep]);

  // --- Handlers ---
  const handleNext = (val: string, extraData?: any) => {
    const currentStepObj = steps[currentStep];
    let newData = { ...data, [currentStepObj.id]: val };
    
    // Special handling for Company Select to store ID for next step's role list
    if (currentStepObj.inputType === 'company_select' && extraData) {
        setSelectedCompanyId(extraData);
    }

    setData(newData);
    setInputValue('');
    setIsEditingName(false);

    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      } else {
        onComplete(newData);
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isEditingName) {
      handleNext(inputValue || data.name);
    }
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-gray-500 font-bold bg-white/50 px-3 py-1 rounded-lg border border-white/60 shadow-sm">{currentStepData.category}</span>
        </div>
        <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <GlassCard className="w-full p-8 md:p-12 relative min-h-[600px] flex flex-col items-center justify-center shadow-2xl border-white/80">
        <div className={`w-full flex flex-col items-center transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          
          <div className="text-center mb-10 w-full max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 whitespace-pre-line leading-tight tracking-tight">
              {currentStepData.question(data)}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              {currentStepData.subtext}
            </p>
          </div>

          <div className="w-full max-w-4xl flex flex-col items-center">
            
            {/* 1. Name Confirm */}
            {currentStepData.inputType === 'name_confirm' && (
              <div className="w-full animate-fade-in-up">
                {!isEditingName ? (
                   <div className="flex gap-4 justify-center">
                      <button onClick={() => handleNext(data.name)} className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all w-48">네, 맞아요</button>
                      <button onClick={() => { setIsEditingName(true); setInputValue(''); }} className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xl font-bold shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all w-48">아니요</button>
                   </div>
                ) : (
                  <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="이름을 입력해주세요"
                      className="w-full text-center text-2xl md:text-3xl py-6 border-b-2 border-gray-200 focus:border-cyan-500 outline-none bg-transparent transition-colors placeholder:text-gray-300 font-bold text-gray-800"
                    />
                    <Button variant="primary" onClick={() => handleNext(inputValue)} disabled={!inputValue.trim()} className="w-full mt-6 py-5 text-xl rounded-2xl shadow-lg">확인</Button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Birth Year List */}
            {currentStepData.inputType === 'year_list' && (
               <div className="w-full animate-fade-in-up relative max-w-xs mx-auto flex flex-col items-center">
                  <div ref={yearListRef} className="h-[400px] w-full overflow-y-auto no-scrollbar py-24 scroll-smooth" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}>
                    <div className="flex flex-col gap-2 text-center">
                        {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 10 - i).map(year => (
                             <button
                               key={year}
                               ref={year === 2000 ? defaultYearRef : null}
                               onClick={() => handleNext(year.toString())}
                               className={`w-full py-2 transition-all duration-300 leading-none ${
                                 year.toString() === data.birthYear 
                                 ? 'text-5xl font-black text-cyan-600 scale-110' 
                                 : 'text-3xl font-bold text-gray-300 hover:text-cyan-700 hover:scale-105 hover:opacity-100'
                               }`}
                             >
                               {year}
                             </button>
                        ))}
                    </div>
                  </div>
                  <button onClick={() => handleNext('skip')} className="mt-4 text-gray-400 hover:text-gray-600 font-medium underline text-sm transition-colors">
                      건너뛰기
                  </button>
               </div>
            )}

            {/* 3. Company Type Select */}
            {currentStepData.inputType === 'company_select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-fade-in-up">
                  {companyTypes.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleNext(company.label, company.id)}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 hover:border-gray-300 transition-all duration-200 group relative overflow-hidden bg-white hover:shadow-lg active:scale-95"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-110 ${company.color}`}>
                        {company.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{company.label}</h3>
                      <p className="text-xs text-gray-500 text-center word-keep-all">{company.desc}</p>
                    </button>
                  ))}
                </div>
            )}

            {/* 4. Job Role Select */}
            {currentStepData.inputType === 'role_select' && (
                <div className="w-full max-w-4xl animate-fade-in-up">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {jobRoles[selectedCompanyId]?.map((role) => (
                            <button
                                key={role}
                                onClick={() => handleNext(role)}
                                className="px-4 py-4 rounded-xl font-bold text-sm transition-all border-2 bg-white border-gray-100 text-gray-600 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md active:scale-95 word-keep-all"
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <button onClick={() => setCurrentStep(prev => prev - 1)} className="text-gray-400 hover:text-gray-600 underline text-sm">
                            회사 유형 다시 선택하기
                        </button>
                    </div>
                </div>
            )}

          </div>
        </div>
      </GlassCard>

      {currentStep > 0 && (
          <button onClick={() => setCurrentStep(prev => prev - 1)} className="mt-8 text-base text-gray-400 hover:text-gray-800 flex items-center gap-2 transition-colors font-medium px-4 py-2 hover:bg-white/50 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            이전 단계로
          </button>
      )}
    </>
  );
};
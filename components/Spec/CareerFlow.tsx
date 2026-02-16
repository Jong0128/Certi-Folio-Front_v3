import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { MonthYearPicker } from '../UI/MonthYearPicker';

export interface CareerData {
  id: string;
  type: 'intern' | 'career';
  companyName: string;
  department: string;
  position?: string; // Only for career
  startDate: string;
  endDate: string;
  description: string;
}

interface CareerFlowProps {
  onComplete: (data: CareerData) => void;
  onBack: () => void;
}

export const CareerFlow: React.FC<CareerFlowProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CareerData>({
    id: '',
    type: 'intern',
    companyName: '',
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const getSteps = () => {
    interface Step {
      id: string;
      category: string;
      inputType: string;
      question: string;
      subtext: string;
      placeholder?: string;
      options?: { label: string; value: string; icon: string; }[];
    }

    const baseSteps: Step[] = [
      {
        id: 'type',
        category: '경력/인턴',
        inputType: 'selection',
        question: "어떤 형태의 경력인가요?",
        subtext: "경력 유형을 선택해주세요.",
        options: [
          { label: '인턴십', value: 'intern', icon: '🌱' },
          { label: '정규직/계약직 경력', value: 'career', icon: '💼' }
        ]
      },
      {
        id: 'companyName',
        category: '경력/인턴',
        inputType: 'text',
        question: "회사명을 입력해주세요.",
        subtext: "근무하셨던 회사 또는 기관의 이름입니다.",
        placeholder: "예: 네온테크, 삼성전자"
      },
      {
        id: 'department',
        category: '경력/인턴',
        inputType: 'text',
        question: "근무 부서 및 직무를\n알려주세요.",
        subtext: "예: 마케팅팀 콘텐츠 마케터, 개발팀 백엔드 개발자",
        placeholder: "부서/직무 입력"
      }
    ];

    if (data.type === 'career') {
      baseSteps.push({
        id: 'position',
        category: '경력/인턴',
        inputType: 'text',
        question: "직급 또는 직책을 입력해주세요.",
        subtext: "예: 사원, 대리, 팀장, 시니어 연구원",
        placeholder: "직급/직책 입력"
      });
    }

    baseSteps.push(
      {
        id: 'dates',
        category: '경력/인턴',
        inputType: 'date_range',
        question: "근무 기간을 알려주세요.",
        subtext: "입사 및 퇴사(현재 재직중) 시기를 입력해주세요."
      },
      {
        id: 'description',
        category: '경력/인턴',
        inputType: 'textarea',
        question: "주요 업무 내용을\n입력해주세요.",
        subtext: "담당했던 핵심 프로젝트나 성과 위주로 작성하면 좋습니다.",
        placeholder: "예: 사내 관리자 페이지 리뉴얼, SNS 마케팅 기획 등"
      }
    );

    return baseSteps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  // Helper to convert "YYYY.MM" to integer 202305 for comparison
  const getDateValue = (dateStr: string) => {
    return parseInt(dateStr.replace('.', ''), 10);
  };

  // Validation Effect for Dates
  useEffect(() => {
    if (currentStepData.inputType === 'date_range') {
        if (inputValue && secondaryInput) {
            const startVal = getDateValue(inputValue);
            const endVal = getDateValue(secondaryInput);
            
            if (startVal > endVal) {
                setDateError("입사일이 퇴사일보다 늦을 수 없습니다.");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }
  }, [inputValue, secondaryInput, currentStep, currentStepData.inputType]);

  const handleNext = (value: any) => {
    // Date validation check (double check on click)
    if (currentStepData.inputType === 'date_range') {
        if (!value.start) return; 
        
        if (value.start && value.end) {
            const startVal = getDateValue(value.start);
            const endVal = getDateValue(value.end);
            if (startVal > endVal) {
                 setDateError("입사일이 퇴사일보다 늦을 수 없습니다.");
                 return;
            }
        }
    }

    let newData = { ...data };
    
    if (currentStepData.id === 'type') {
       newData.type = value;
    } else if (currentStepData.inputType === 'date_range') {
        newData.startDate = value.start;
        newData.endDate = value.end;
    } else {
       // @ts-ignore
       newData[currentStepData.id] = value;
    }

    setData(newData);
    setInputValue('');
    setSecondaryInput('');
    setTextInput('');
    setDateError(null);

    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      } else {
        onComplete({ ...newData, id: Date.now().toString() });
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
       const step = steps[currentStep];
       if (step.inputType === 'text' && inputValue.trim()) {
         handleNext(inputValue);
       }
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-gray-500 font-bold bg-white/50 px-3 py-1 rounded-lg border border-white/60 shadow-sm">{currentStepData.category}</span>
        </div>
        <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <GlassCard className="w-full p-8 md:p-12 relative min-h-[600px] flex flex-col items-center justify-center shadow-2xl border-white/80">
        <div className={`w-full flex flex-col items-center transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          
          <div className="text-center mb-10 w-full max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 whitespace-pre-line leading-tight tracking-tight">{currentStepData.question}</h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">{currentStepData.subtext}</p>
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center">
            
            {/* Selection Type */}
            {currentStepData.inputType === 'selection' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in-up">
                {currentStepData.options?.map((option) => (
                  <button key={option.value} onClick={() => handleNext(option.value)} className="flex flex-col items-center justify-center p-8 border rounded-3xl transition-all duration-300 group active:scale-95 bg-white border-gray-100 hover:border-cyan-500 hover:shadow-xl hover:bg-cyan-50/50">
                    <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{option.icon}</span>
                    <span className="font-bold text-xl md:text-2xl text-gray-600 group-hover:text-cyan-700 transition-colors">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Text Input */}
            {currentStepData.inputType === 'text' && (
                <div className="w-full max-w-md animate-fade-in-up flex flex-col gap-6">
                    <input 
                      type="text" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} 
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepData.placeholder} 
                      className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-xl bg-white shadow-sm transition-all" 
                    />
                    <Button 
                      variant="primary" 
                      onClick={() => handleNext(inputValue)} 
                      disabled={!inputValue.trim()}
                      className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4"
                    >
                        다음
                    </Button>
                </div>
            )}

             {/* TYPE: Date Range */}
             {currentStepData.inputType === 'date_range' && (
                <div className="w-full max-w-2xl animate-fade-in-up flex flex-col gap-8">
                     <div className="flex gap-6 justify-center w-full">
                        <div className="flex-1 max-w-[240px]"><MonthYearPicker label="입사 년월" value={inputValue} onChange={(val) => setInputValue(val)} placeholder="YYYY.MM" error={!!dateError} /></div>
                        <div className="flex-1 max-w-[240px]"><MonthYearPicker label="퇴사 년월(예정)" value={secondaryInput} onChange={(val) => setSecondaryInput(val)} placeholder="YYYY.MM" error={!!dateError} /></div>
                     </div>
                     {dateError && <div className="text-red-500 font-bold text-center bg-red-50 py-3 rounded-lg animate-pulse border border-red-100">⚠️ {dateError}</div>}
                    <Button variant="primary" onClick={() => handleNext({ start: inputValue, end: secondaryInput })} disabled={!inputValue || !secondaryInput || !!dateError} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4 max-w-md mx-auto">다음</Button>
                </div>
            )}

            {/* Textarea */}
            {currentStepData.inputType === 'textarea' && (
                <div className="w-full max-w-lg animate-fade-in-up flex flex-col gap-6">
                    <textarea
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)} 
                      placeholder={currentStepData.placeholder} 
                      className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-lg bg-white shadow-sm transition-all h-40 resize-none" 
                    />
                    <Button variant="primary" onClick={() => handleNext(textInput)} disabled={!textInput.trim()} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg">다음</Button>
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
       {currentStep === 0 && (
           <button onClick={onBack} className="mt-8 text-base text-gray-400 hover:text-gray-800 flex items-center gap-2 transition-colors font-medium px-4 py-2 hover:bg-white/50 rounded-lg">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             이전 목록으로
           </button>
      )}
    </>
  );
};
import React, { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { DatePicker } from '../UI/DatePicker';

export interface CertificateData {
  id: string;
  type: 'language' | 'general';
  name: string;
  issuer?: string; // Only for general
  date: string;
  score: string;
  certId?: string;
}

interface CertificateFlowProps {
  onComplete: (data: CertificateData) => void;
  onBack: () => void;
}

export const CertificateFlow: React.FC<CertificateFlowProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CertificateData>({
    id: '',
    type: 'language',
    name: '',
    issuer: '',
    date: '',
    score: '',
    certId: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Dynamic steps generation based on selection
  const getSteps = () => {
    const baseSteps = [
      {
        id: 'type',
        category: '자격증/어학',
        inputType: 'selection',
        question: "어떤 종류의 자격증인가요?",
        subtext: "유형에 따라 입력 항목이 달라집니다.",
        options: [
          { label: '어학 자격증', value: 'language', icon: '🗣️' },
          { label: '일반 자격증', value: 'general', icon: '📜' }
        ]
      },
      {
        id: 'name',
        category: '자격증/어학',
        inputType: 'text',
        question: data.type === 'language' ? "어학 시험명을 입력해주세요." : "자격증 명칭을 입력해주세요.",
        subtext: data.type === 'language' ? "예: TOEIC, OPIc, JLPT" : "예: 정보처리기사, ADsP, 한국사능력검정",
        placeholder: "명칭 입력"
      }
    ];

    if (data.type === 'general') {
      baseSteps.push({
        id: 'issuer',
        category: '자격증/어학',
        inputType: 'text',
        question: "발급 기관을 입력해주세요.",
        subtext: "예: 한국산업인력공단, 국사편찬위원회",
        placeholder: "발급 기관 입력"
      });
    }

    baseSteps.push(
      {
        id: 'date',
        category: '자격증/어학',
        inputType: 'date_picker',
        question: "취득일(시험일)을 알려주세요.",
        subtext: "자격증에 기재된 날짜를 정확히 입력해주세요.",
        placeholder: "YYYY.MM.DD"
      },
      {
        id: 'score',
        category: '자격증/어학',
        inputType: 'text',
        question: "점수 또는 등급을 입력해주세요.",
        subtext: "예: 900점, IH, 1급, 합격",
        placeholder: "점수/등급 입력"
      },
      {
        id: 'certId',
        category: '자격증/어학',
        inputType: 'text',
        question: "자격증 번호가 있다면 입력해주세요.",
        subtext: "선택 사항입니다. (추후 증빙 시 활용)",
        placeholder: "자격증 번호 (선택)"
      }
    );

    return baseSteps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const handleNext = (value: any) => {
    let newData = { ...data };
    
    if (currentStepData.id === 'type') {
       newData.type = value;
    } else {
       // @ts-ignore
       newData[currentStepData.id] = value;
    }

    setData(newData);
    setInputValue('');

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
                      disabled={currentStepData.id !== 'certId' && !inputValue.trim()} // Cert ID is optional
                      className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4"
                    >
                        {currentStepData.id === 'certId' && !inputValue.trim() ? '건너뛰기' : '다음'}
                    </Button>
                </div>
            )}

            {/* Date Picker Input */}
            {currentStepData.inputType === 'date_picker' && (
                 <div className="w-full max-w-md animate-fade-in-up flex flex-col gap-6">
                    <DatePicker 
                      label="취득일"
                      value={inputValue}
                      onChange={(val) => setInputValue(val)}
                      placeholder={currentStepData.placeholder}
                    />
                    <Button variant="primary" onClick={() => handleNext(inputValue)} disabled={!inputValue} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4">다음</Button>
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
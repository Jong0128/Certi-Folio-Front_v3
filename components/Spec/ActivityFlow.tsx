import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { MonthYearPicker } from '../UI/MonthYearPicker';

export interface ActivityData {
  id: string;
  activityName: string;
  activityType: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  achievement: string;
}

interface ActivityFlowProps {
  onComplete: (data: ActivityData) => void;
  onBack: () => void;
}

export const ActivityFlow: React.FC<ActivityFlowProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ActivityData>({
    id: '',
    activityName: '',
    activityType: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    achievement: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const steps = [
    {
      id: 'activityName',
      category: '대외활동',
      inputType: 'text',
      question: "활동명을 입력해주세요.",
      subtext: "공모전, 해커톤, 동아리 등 활동의 공식 명칭을 적어주세요.",
      placeholder: "예: 멋쟁이사자처럼 11기, 삼성전자 대학생 봉사단"
    },
    {
      id: 'activityType',
      category: '대외활동',
      inputType: 'selection',
      question: "어떤 유형의 활동인가요?",
      subtext: "활동 성격에 가장 가까운 항목을 선택해주세요.",
      options: [
        { label: '동아리/학회', value: 'club', icon: '🤝' },
        { label: '해커톤/공모전', value: 'contest', icon: '🏆' },
        { label: '교육/부트캠프', value: 'education', icon: '📚' },
        { label: '서포터즈/봉사', value: 'volunteer', icon: '❤️' },
        { label: '기타', value: 'other', icon: '✨' }
      ]
    },
    {
      id: 'role',
      category: '대외활동',
      inputType: 'text',
      question: "맡으신 역할은 무엇이었나요?",
      subtext: "예: 기획 팀장, 총무, 디자인 리드 등",
      placeholder: "역할을 입력해주세요"
    },
    {
      id: 'dates',
      category: '대외활동',
      inputType: 'date_range',
      question: "활동 기간을 알려주세요.",
      subtext: "정확한 기간 산정을 위해 필요합니다."
    },
    {
      id: 'description',
      category: '대외활동',
      inputType: 'textarea',
      question: "주요 활동 내용을\n간략히 설명해주세요.",
      subtext: "어떤 활동을 했고, 무엇을 배웠나요?",
      placeholder: "활동의 목적과 본인이 수행한 주요 과업을 중심으로 작성해주세요."
    },
    {
      id: 'achievement',
      category: '대외활동',
      inputType: 'textarea',
      question: "수상 내역이나 성과가 있나요?",
      subtext: "선택 사항입니다. 없으시면 건너뛰셔도 됩니다.",
      placeholder: "예: 대상 수상, 우수 활동자 선정 등 (없음 입력 가능)"
    }
  ];

  // Validation Effect for Dates
  useEffect(() => {
    const currentStepObj = steps[currentStep];
    if (currentStepObj.inputType === 'date_range') {
        if (inputValue && secondaryInput) {
            if (parseFloat(inputValue) > parseFloat(secondaryInput)) {
                setDateError("종료일이 시작일보다 빠를 수 없습니다.");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }
  }, [inputValue, secondaryInput, currentStep]);

  const handleNext = (value: any) => {
    // Date Validation check for handleNext
    const step = steps[currentStep];
    if (step.inputType === 'date_range') {
        if (!value.start || !value.end) return;
        if (parseFloat(value.start) > parseFloat(value.end)) {
            setDateError("종료일이 시작일보다 빠를 수 없습니다.");
            return;
        }
    }

    let newData = { ...data };

    if (step.inputType === 'text') newData = { ...newData, [step.id]: value };
    else if (step.inputType === 'selection') newData = { ...newData, [step.id]: value };
    else if (step.inputType === 'date_range') newData = { ...newData, startDate: value.start, endDate: value.end };
    else if (step.inputType === 'textarea') newData = { ...newData, [step.id]: value };

    setData(newData);

    // Reset Inputs
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
        // Add ID before completing
        onComplete({ ...newData, id: Date.now().toString() });
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const step = steps[currentStep];
      if (step.inputType === 'text') {
          e.preventDefault();
          if(inputValue.trim()) handleNext(inputValue);
      }
      if (step.inputType === 'textarea' && !e.shiftKey) {
          // Allow enter in textarea usually, but here preventing default next for convenience unless Shift+Enter
          // keeping consistent with previous flow
      }
    }
  };

  const currentStepData = steps[currentStep];
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
            
            {/* TYPE: Text Input */}
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
                    <Button variant="primary" onClick={() => handleNext(inputValue)} disabled={!inputValue.trim()} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4">다음</Button>
                </div>
            )}

            {/* TYPE: Selection */}
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

            {/* TYPE: Date Range */}
            {currentStepData.inputType === 'date_range' && (
                <div className="w-full max-w-2xl animate-fade-in-up flex flex-col gap-8">
                     <div className="flex gap-6 justify-center w-full">
                        <div className="flex-1 max-w-[240px]"><MonthYearPicker label="시작일" value={inputValue} onChange={(val) => setInputValue(val)} placeholder="시작 년월" error={!!dateError} /></div>
                        <div className="flex-1 max-w-[240px]"><MonthYearPicker label="종료(예정)일" value={secondaryInput} onChange={(val) => setSecondaryInput(val)} placeholder="종료 년월" error={!!dateError} /></div>
                     </div>
                     {dateError && <div className="text-red-500 font-bold text-center">⚠️ {dateError}</div>}
                    <Button variant="primary" onClick={() => handleNext({ start: inputValue, end: secondaryInput })} disabled={!inputValue || !secondaryInput || !!dateError} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4 max-w-md mx-auto">다음</Button>
                </div>
            )}

            {/* TYPE: Textarea */}
            {currentStepData.inputType === 'textarea' && (
                <div className="w-full max-w-lg animate-fade-in-up flex flex-col gap-6">
                    <textarea
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)} 
                      placeholder={currentStepData.placeholder} 
                      className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-lg bg-white shadow-sm transition-all h-40 resize-none" 
                    />
                    <Button variant="primary" onClick={() => handleNext(textInput)} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg">
                        {currentStepData.id === 'achievement' && !textInput.trim() ? '건너뛰기' : '다음'}
                    </Button>
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
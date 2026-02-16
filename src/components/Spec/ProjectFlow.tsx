import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { MonthYearPicker } from '../UI/MonthYearPicker';

export interface ProjectData {
  projectName: string;
  isTeam: string; // 'individual' | 'team'
  startDate: string;
  endDate: string;
  role: string;
  techStack: string[];
  description: string;
  links: { github: string; demo: string };
  outcome: string;
}

interface ProjectFlowProps {
  initialData?: ProjectData;
  onComplete: (data: ProjectData) => void;
  onBack: () => void;
}

export const ProjectFlow: React.FC<ProjectFlowProps> = ({ initialData, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ProjectData>(initialData || {
    projectName: '',
    isTeam: '',
    startDate: '',
    endDate: '',
    role: '',
    techStack: [],
    description: '',
    links: { github: '', demo: '' },
    outcome: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [textInput, setTextInput] = useState(''); // For TextArea
  const [techStackInput, setTechStackInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const steps = [
    {
      id: 'projectName',
      category: '프로젝트 정보',
      inputType: 'text',
      question: "진행하신 프로젝트 명을\n알려주세요.",
      subtext: "가장 대표적인 프로젝트 하나만 먼저 입력합니다.",
      placeholder: "예: Certi-Folio 커리어 플랫폼"
    },
    {
      id: 'isTeam',
      category: '프로젝트 정보',
      inputType: 'selection',
      question: "개인 프로젝트인가요,\n팀 프로젝트인가요?",
      subtext: "협업 경험 유무를 파악하기 위함입니다.",
      options: [
        { label: '개인 프로젝트', value: 'individual', icon: '👤' },
        { label: '팀 프로젝트', value: 'team', icon: '👥' }
      ]
    },
    {
      id: 'dates',
      category: '프로젝트 정보',
      inputType: 'date_range',
      question: "프로젝트 진행 기간을\n선택해주세요.",
      subtext: "정확한 기간 산정을 위해 필요합니다."
    },
    {
      id: 'role',
      category: '프로젝트 정보',
      inputType: 'text',
      question: "어떤 역할을 맡으셨나요?",
      subtext: "예: 프론트엔드 리드, 백엔드 개발, UI 디자인 등",
      placeholder: "맡은 역할을 구체적으로 입력해주세요"
    },
    {
      id: 'techStack',
      category: '프로젝트 정보',
      inputType: 'tags',
      question: "사용하신 주요 기술 스택을\n입력해주세요.",
      subtext: "Enter 키를 눌러 태그를 추가할 수 있습니다.",
      placeholder: "예: React, TypeScript, Node.js (Enter)"
    },
    {
      id: 'description',
      category: '프로젝트 정보',
      inputType: 'textarea',
      question: "프로젝트에 대해\n간략히 소개해주세요.",
      subtext: "어떤 문제를 해결하고자 했나요?",
      placeholder: "프로젝트의 기획 의도와 주요 기능을 설명해주세요."
    },
    {
      id: 'links',
      category: '프로젝트 정보',
      inputType: 'dual_links',
      question: "결과물을 확인할 수 있는\n링크가 있나요?",
      subtext: "선택 사항입니다. 건너뛰셔도 됩니다.",
      placeholders: ['GitHub 저장소 URL (선택)', '배포/데모 URL (선택)']
    },
    {
      id: 'outcome',
      category: '프로젝트 성과',
      inputType: 'textarea',
      question: "이 프로젝트를 통해\n어떤 성과를 얻으셨나요?",
      subtext: "정량적 수치나 배운 점을 중심으로 작성해주세요.",
      placeholder: "예: 사용자 1000명 유치, 로딩 속도 50% 개선 등"
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
    // Validate Date before proceeding
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
    else if (step.inputType === 'tags') newData = { ...newData, techStack: value };
    else if (step.inputType === 'textarea') newData = { ...newData, [step.id]: value };
    else if (step.inputType === 'dual_links') newData = { ...newData, links: { github: value.first, demo: value.second } };

    setData(newData);

    // Reset Inputs
    setInputValue('');
    setSecondaryInput('');
    setTextInput('');
    setTechStackInput('');
    setDateError(null);

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

  // Helper for Enter Key in Text Inputs
  const handleKeyDown = (e: React.KeyboardEvent, type: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'text' && inputValue.trim()) handleNext(inputValue);
      if (type === 'textarea' && !e.shiftKey) return; // Allow newlines in textarea
    }
  };

  // Tag Handling
  const addTag = () => {
    if (techStackInput.trim() && !data.techStack.includes(techStackInput.trim())) {
      const newStack = [...data.techStack, techStackInput.trim()];
      setData({ ...data, techStack: newStack });
      setTechStackInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newStack = data.techStack.filter(t => t !== tag);
    setData({ ...data, techStack: newStack });
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
                      onKeyDown={(e) => handleKeyDown(e, 'text')}
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
                     {dateError && <div className="text-red-500 font-bold text-center bg-red-50 py-3 rounded-lg animate-pulse border border-red-100">⚠️ {dateError}</div>}
                    <Button variant="primary" onClick={() => handleNext({ start: inputValue, end: secondaryInput })} disabled={!inputValue || !secondaryInput || !!dateError} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4 max-w-md mx-auto">다음</Button>
                </div>
            )}

            {/* TYPE: Tags (Tech Stack) */}
            {currentStepData.inputType === 'tags' && (
                <div className="w-full max-w-md animate-fade-in-up flex flex-col gap-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={techStackInput} 
                        onChange={(e) => setTechStackInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder={currentStepData.placeholder} 
                        className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-xl bg-white shadow-sm transition-all pr-16" 
                      />
                      <button onClick={addTag} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 font-bold p-2 hover:bg-cyan-50 rounded-lg">추가</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[60px]">
                      {data.techStack.map(tag => (
                        <span key={tag} className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full font-bold text-sm flex items-center gap-2 border border-cyan-100">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>

                    <Button variant="primary" onClick={() => handleNext(data.techStack)} disabled={data.techStack.length === 0} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4">완료</Button>
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
                    <Button variant="primary" onClick={() => handleNext(textInput)} disabled={!textInput.trim()} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg">다음</Button>
                </div>
            )}

            {/* TYPE: Dual Links */}
            {currentStepData.inputType === 'dual_links' && (
                <div className="w-full max-w-md animate-fade-in-up flex flex-col gap-6">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={currentStepData.placeholders?.[0]} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-lg bg-white shadow-sm transition-all" />
                    <input type="text" value={secondaryInput} onChange={(e) => setSecondaryInput(e.target.value)} placeholder={currentStepData.placeholders?.[1]} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-cyan-500 outline-none text-lg bg-white shadow-sm transition-all" />
                    <Button variant="primary" onClick={() => handleNext({ first: inputValue, second: secondaryInput })} className="w-full py-5 text-xl font-bold rounded-2xl shadow-lg mt-4">다음 (건너뛰기 가능)</Button>
                </div>
            )}

          </div>
        </div>
      </GlassCard>

      {/* Navigation Hint */}
      {currentStep > 0 && (
          <button onClick={() => { setCurrentStep(prev => prev - 1); }} className="mt-8 text-base text-gray-400 hover:text-gray-800 flex items-center gap-2 transition-colors font-medium px-4 py-2 hover:bg-white/50 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            이전 단계로
          </button>
      )}
       {currentStep === 0 && (
           <button onClick={onBack} className="mt-8 text-base text-gray-400 hover:text-gray-800 flex items-center gap-2 transition-colors font-medium px-4 py-2 hover:bg-white/50 rounded-lg">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             학력 정보 수정하기
           </button>
      )}
    </>
  );
};
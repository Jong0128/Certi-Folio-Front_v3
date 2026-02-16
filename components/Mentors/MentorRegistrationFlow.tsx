import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

interface MentorRegistrationData {
  name: string;
  company: string;
  role: string;
  years: string;
  bio: string;
  skills: string[];
  certificates: string;
  availableDays: string[];
  availableTimes: { [key: string]: string[] };
  mentoringType: string[]; // 'online', 'offline', 'chat'
}

interface MentorRegistrationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const MentorRegistrationFlow: React.FC<MentorRegistrationFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  
  const [data, setData] = useState<MentorRegistrationData>({
    name: '김네온', // Default assumption, editable
    company: '',
    role: '',
    years: '',
    bio: '',
    skills: [],
    certificates: '',
    availableDays: [],
    availableTimes: {},
    mentoringType: []
  });

  const handleChange = (field: keyof MentorRegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsAnimating(false);
    }, 400);
  };

  const handleBack = () => {
    if (step === 0) onCancel();
    else setStep(prev => prev - 1);
  };

  // Tag Handling for Skills
  const addTag = () => {
    if (tagInput.trim() && !data.skills.includes(tagInput.trim())) {
      handleChange('skills', [...data.skills, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    handleChange('skills', data.skills.filter(t => t !== tag));
  };

  // Toggle Mentoring Type
  const toggleType = (value: string) => {
    const current = data.mentoringType;
    if (current.includes(value)) {
      handleChange('mentoringType', current.filter(i => i !== value));
    } else {
      handleChange('mentoringType', [...current, value]);
    }
  };

  // Toggle Days & Manage Editing Day
  const toggleDay = (day: string) => {
    const current = data.availableDays;
    let newDays;
    if (current.includes(day)) {
      newDays = current.filter(i => i !== day);
      if (editingDay === day) {
          setEditingDay(newDays.length > 0 ? newDays[0] : null);
          setSelectionStart(null); // Reset selection if day removed
      }
    } else {
      newDays = [...current, day];
      setEditingDay(day);
      setSelectionStart(null); // Reset selection for new day
    }
    handleChange('availableDays', newDays);
  };

  // Generate Time Slots (09:00 ~ 24:00) - 30 slots
  const timeSlots = [];
  for (let i = 9; i < 24; i++) {
      timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
      timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const timeToMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
  };

  // Handle Time Selection (Range Logic)
  const handleTimeClick = (day: string, time: string) => {
      if (!selectionStart) {
          // Start selection
          setSelectionStart(time);
      } else {
          // End selection
          const startMin = timeToMin(selectionStart);
          const endMin = timeToMin(time);
          
          const actualStart = Math.min(startMin, endMin);
          const actualEnd = Math.max(startMin, endMin);

          const currentTimes = new Set(data.availableTimes[day] || []);
          
          // Add all slots in range
          timeSlots.forEach(slot => {
              const slotMin = timeToMin(slot);
              if (slotMin >= actualStart && slotMin <= actualEnd) {
                  currentTimes.add(slot);
              }
          });

          handleChange('availableTimes', { ...data.availableTimes, [day]: Array.from(currentTimes).sort() });
          setSelectionStart(null);
      }
  };

  // Remove a specific range (or slot) logic would be complex with just chips, 
  // so we'll implement removing by clearing specific slots involved in a range chip.
  const removeTimeRange = (day: string, rangeStart: string, rangeEnd: string) => { // rangeEnd is exclusive for display, inclusive for calculation?
      // Display ranges are formatted "09:00 ~ 10:30". 10:30 is the END time of the 10:00 slot.
      // So we need to remove slots from start up to (end - 30min).
      
      const startMin = timeToMin(rangeStart);
      const endMin = timeToMin(rangeEnd); // This comes from formatted string, e.g., 10:30

      const newTimes = (data.availableTimes[day] || []).filter(t => {
          const tMin = timeToMin(t);
          // If t is within [start, end), remove it. Note: endMin is the end time of the slot, so slot start < endMin.
          return !(tMin >= startMin && tMin < endMin);
      });
      
      handleChange('availableTimes', { ...data.availableTimes, [day]: newTimes });
  };

  // Group continuous slots into ranges
  const getRanges = (times: string[]) => {
      if (!times || times.length === 0) return [];
      
      const sorted = [...times].sort();
      const ranges: {start: string, end: string}[] = [];
      let start = sorted[0];
      let prev = sorted[0];

      for (let i = 1; i < sorted.length; i++) {
          const curr = sorted[i];
          const prevMin = timeToMin(prev);
          const currMin = timeToMin(curr);

          if (currMin - prevMin === 30) {
              prev = curr;
          } else {
              // End of a range.
              // The range ends 30 mins after the last slot
              const endMin = timeToMin(prev) + 30;
              const h = Math.floor(endMin / 60);
              const m = endMin % 60;
              const endTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
              ranges.push({ start, end: endTime });
              
              start = curr;
              prev = curr;
          }
      }
      
      // Push last range
      const endMin = timeToMin(prev) + 30;
      const h = Math.floor(endMin / 60);
      const m = endMin % 60;
      const endTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      ranges.push({ start, end: endTime });

      return ranges;
  };

  // Helper to determine slot status
  const getSlotStatus = (time: string) => {
      if (!editingDay) return 'default';
      
      const isSelected = data.availableTimes[editingDay]?.includes(time);
      
      if (selectionStart && hoverTime) {
          const s = timeToMin(selectionStart);
          const h = timeToMin(hoverTime);
          const t = timeToMin(time);
          const start = Math.min(s, h);
          const end = Math.max(s, h);
          
          if (t >= start && t <= end) {
              return 'preview';
          }
      }
      
      if (selectionStart === time) return 'start';
      if (isSelected) return 'selected';
      
      return 'default';
  };

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  // Render Step Content
  const renderStep = () => {
    switch (step) {
      // Step 0: Name Confirm
      case 0:
        return (
          <div className="flex flex-col items-center w-full max-w-md gap-6 animate-fade-in-up">
             <h2 className="text-3xl font-extrabold text-gray-900 text-center leading-tight">
               멘토 등록을 시작합니다.<br/>
               성함이 <span className="text-cyan-600">{data.name}</span>님이 맞으신가요?
             </h2>
             <Input 
                value={data.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                className="text-center text-xl font-bold"
             />
             <Button variant="primary" onClick={handleNext} className="w-full py-4 text-lg">네, 맞습니다</Button>
          </div>
        );

      // Step 1: Career Info
      case 1:
        return (
          <div className="flex flex-col w-full max-w-md gap-6 animate-fade-in-up">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">현재 재직 정보를 알려주세요.</h2>
                <p className="text-gray-500">멘티들에게 신뢰를 줄 수 있는 중요한 정보입니다.</p>
             </div>
             <Input label="재직 중인 회사" placeholder="예: Google Korea" value={data.company} onChange={(e) => handleChange('company', e.target.value)} />
             <div className="grid grid-cols-2 gap-4">
                <Input label="직무 / 직책" placeholder="예: Senior Engineer" value={data.role} onChange={(e) => handleChange('role', e.target.value)} />
                <Input label="총 경력 (연차)" placeholder="예: 5년차" value={data.years} onChange={(e) => handleChange('years', e.target.value)} />
             </div>
             <Button variant="primary" onClick={handleNext} disabled={!data.company || !data.role} className="w-full py-4 text-lg mt-4">다음</Button>
          </div>
        );

      // Step 2: Bio
      case 2:
        return (
          <div className="flex flex-col w-full max-w-md gap-6 animate-fade-in-up">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">멘토님을 소개해주세요.</h2>
                <p className="text-gray-500">어떤 경험을 나누고 싶으신가요?</p>
             </div>
             <textarea 
                className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-cyan-500 outline-none text-gray-800 resize-none bg-white/80 shadow-inner text-lg"
                placeholder="안녕하세요, 주니어 개발자들의 성장통을 해결해드리고 싶은..."
                value={data.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
             />
             <Button variant="primary" onClick={handleNext} disabled={data.bio.length < 10} className="w-full py-4 text-lg mt-4">다음</Button>
          </div>
        );

      // Step 3: Skills
      case 3:
        return (
          <div className="flex flex-col w-full max-w-md gap-6 animate-fade-in-up">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">전문 분야를 입력해주세요.</h2>
                <p className="text-gray-500">자신있는 기술 스택이나 상담 주제를 태그로 추가하세요.</p>
             </div>
             
             <div className="relative">
                <input 
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="예: React, 이력서첨삭, 커리어상담 (Enter)"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-cyan-500 outline-none text-lg bg-white shadow-sm"
                />
                <button onClick={addTag} className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-cyan-100 hover:text-cyan-700">추가</button>
             </div>

             <div className="flex flex-wrap gap-2 min-h-[100px] content-start bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                {data.skills.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white text-cyan-700 rounded-full font-bold text-sm flex items-center gap-2 border border-cyan-100 shadow-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 text-gray-400">×</button>
                  </span>
                ))}
                {data.skills.length === 0 && <span className="text-gray-400 text-sm">태그가 없습니다.</span>}
             </div>

             <Button variant="primary" onClick={handleNext} disabled={data.skills.length === 0} className="w-full py-4 text-lg mt-4">다음</Button>
          </div>
        );

      // Step 4: Certificates (Optional)
      case 4:
        return (
          <div className="flex flex-col w-full max-w-md gap-6 animate-fade-in-up">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">보유 자격증이 있으신가요?</h2>
                <p className="text-gray-500">선택 사항입니다. 없으시면 건너뛰세요.</p>
             </div>
             
             <Input 
               placeholder="자격증 명을 입력해주세요 (콤마로 구분)" 
               value={data.certificates}
               onChange={(e) => handleChange('certificates', e.target.value)}
             />
             
             <div className="flex gap-3 mt-4">
                <Button variant="secondary" onClick={handleNext} className="flex-1 py-4 text-lg">건너뛰기</Button>
                <Button variant="primary" onClick={handleNext} disabled={!data.certificates} className="flex-1 py-4 text-lg">입력 완료</Button>
             </div>
          </div>
        );

      // Step 5: Preferences (Updated)
      case 5:
        return (
          <div className="flex flex-col w-full max-w-lg gap-6 animate-fade-in-up">
             <div className="text-center mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">멘토링 선호 방식</h2>
                <p className="text-gray-500">가능한 시간대와 방식을 선택해주세요.</p>
             </div>

             {/* Type Selection */}
             <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase ml-1">진행 방식 (복수 선택 가능)</label>
                <div className="flex gap-3">
                   {['online', 'offline', 'chat'].map(type => (
                      <button 
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                          data.mentoringType.includes(type) 
                          ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {type === 'online' ? '💻 화상' : type === 'offline' ? '☕ 대면' : '💬 채팅'}
                      </button>
                   ))}
                </div>
             </div>

             {/* Day Selection */}
             <div className="space-y-2">
                <label className="text-gray-500 text-xs font-bold uppercase ml-1">가능 요일 (복수 선택 가능)</label>
                <div className="flex justify-between gap-2">
                   {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                      <button 
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full border font-bold text-sm flex items-center justify-center transition-all ${
                          data.availableDays.includes(day) 
                          ? day === editingDay ? 'bg-purple-600 border-purple-600 text-white shadow-md ring-2 ring-purple-300' : 'bg-purple-100 border-purple-200 text-purple-700'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                   ))}
                </div>
             </div>

             {/* Time Selection (New Feature) */}
             {data.availableDays.length > 0 && editingDay && (
                 <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-fade-in-up">
                     <div className="flex justify-between items-center mb-1">
                         <label className="text-gray-500 text-xs font-bold uppercase ml-1">가능 시간대 설정 (30분 단위)</label>
                         <div className="flex items-center gap-2">
                             <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">{editingDay}</span>
                             {selectionStart && (
                                 <span className="text-[10px] text-gray-400 animate-pulse">종료 시간 선택 중...</span>
                             )}
                         </div>
                     </div>
                     
                     <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm overflow-hidden">
                         <p className="text-[11px] text-gray-400 mb-3 font-medium flex justify-between">
                             <span>
                                 {selectionStart 
                                    ? <span className="text-purple-600 font-bold">끝나는 시간을 선택해주세요.</span> 
                                    : "시작 시간을 클릭하고, 종료 시간을 클릭하세요."
                                 }
                             </span>
                             <span>09:00 ~ 24:00</span>
                         </p>
                         
                         {/* Horizontal Bar Graph */}
                         <div className="relative pt-6 pb-2 select-none">
                             {/* Time Labels */}
                             <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] text-gray-300 font-medium px-1">
                                 <span>09</span>
                                 <span>12</span>
                                 <span>15</span>
                                 <span>18</span>
                                 <span>21</span>
                                 <span>24</span>
                             </div>
                             
                             {/* Bars Container */}
                             <div className="flex h-12 w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer touch-none" onMouseLeave={() => setHoverTime(null)}>
                                 {timeSlots.map((time, idx) => {
                                     const status = getSlotStatus(time);
                                     
                                     let bgClass = 'bg-gray-100'; // Default
                                     if (status === 'selected') bgClass = 'bg-cyan-500';
                                     if (status === 'start') bgClass = 'bg-purple-500';
                                     if (status === 'preview') bgClass = 'bg-purple-200';

                                     return (
                                         <div 
                                            key={time}
                                            onClick={() => handleTimeClick(editingDay, time)}
                                            onMouseEnter={() => setHoverTime(time)}
                                            className={`flex-1 transition-colors border-r border-white/30 last:border-r-0 relative group ${bgClass}`}
                                            title={time}
                                         >
                                             {/* Tooltip on Hover */}
                                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                                 {time}
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                         </div>
                     </div>

                     {/* Selected Ranges List */}
                     <div className="flex flex-wrap gap-2 mt-2">
                         {getRanges(data.availableTimes[editingDay]).map((range, idx) => (
                             <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-lg text-xs font-bold text-cyan-700 animate-fade-in-up">
                                 <span>{range.start} ~ {range.end}</span>
                                 <button 
                                    onClick={() => removeTimeRange(editingDay, range.start, range.end)}
                                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-cyan-200 text-cyan-600 transition-colors"
                                 >
                                     ×
                                 </button>
                             </div>
                         ))}
                         {getRanges(data.availableTimes[editingDay]).length === 0 && (
                             <p className="text-xs text-gray-400 py-1 pl-1">선택된 시간대가 없습니다.</p>
                         )}
                     </div>
                 </div>
             )}

             <Button variant="neon" onClick={() => { alert('멘토 등록 신청이 완료되었습니다! 심사 후 연락드리겠습니다.'); onComplete(); }} disabled={data.mentoringType.length === 0} className="w-full py-4 text-lg mt-6 shadow-cyan-500/30">
                등록 신청 완료 🚀
             </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full py-10 px-4">
       {/* Progress Bar */}
       <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider px-1">
             <span>Step {step + 1}</span>
             <span>{step === 5 ? 'Final' : 'Mentor Registration'}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
       </div>

       {/* Main Content Card */}
       <GlassCard className="w-full max-w-3xl mx-auto p-8 md:p-16 min-h-[550px] flex flex-col items-center justify-center shadow-2xl border-white/70 relative">
          
          <button onClick={handleBack} className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-2 font-medium">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             {step === 0 ? '취소' : '이전'}
          </button>

          <div className={`transition-all duration-500 w-full flex justify-center ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
             {renderStep()}
          </div>

       </GlassCard>
    </div>
  );
};
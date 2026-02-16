import React, { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  label: string;
  value: string; // Format: YYYY.MM.DD
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'day' | 'month' | 'year'>('day');
  
  // Internal state for navigation
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const parts = value.split('.');
      if (parts.length === 3) {
        setYear(parseInt(parts[0]));
        setMonth(parseInt(parts[1]));
      }
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setView('day'); // Reset view on close
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, value]);

  const handleYearSelect = (y: number) => {
    setYear(y);
    setView('month');
  };

  const handleMonthSelect = (m: number) => {
    setMonth(m);
    setView('day');
  };

  const handleDaySelect = (d: number) => {
    const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${d.toString().padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={pickerRef}>
      <label className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <input 
          readOnly 
          value={value} 
          placeholder={placeholder} 
          className={`w-full bg-white border rounded-xl px-4 py-4 text-center font-bold text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm cursor-pointer ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10 bg-red-50/50' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/10'}`} 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-50 w-full min-w-[300px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 p-4 animate-fade-in-up">
           
           {/* Header / Navigation */}
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              {view === 'day' && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setMonth(prev => prev === 1 ? 12 : prev - 1); if(month===1) setYear(prev=>prev-1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setView('year'); }} className="font-bold text-gray-800 hover:text-cyan-600 transition-colors">{year}년</button>
                        <button onClick={(e) => { e.stopPropagation(); setView('month'); }} className="font-bold text-gray-800 hover:text-cyan-600 transition-colors">{month}월</button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setMonth(prev => prev === 12 ? 1 : prev + 1); if(month===12) setYear(prev=>prev+1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                  </>
              )}
              {(view === 'month' || view === 'year') && (
                  <button onClick={(e) => {e.stopPropagation(); setView('day');}} className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      돌아가기
                  </button>
              )}
           </div>

           {/* View: Days */}
           {view === 'day' && (
               <div className="grid grid-cols-7 gap-1">
                   {['일','월','화','수','목','금','토'].map(d => (
                       <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                   ))}
                   {/* Blank spaces for start of month (Simplified for demo) */}
                   {/* In a real app, calculate new Date(year, month-1, 1).getDay() */}
                   
                   {days.map(d => (
                       <button 
                        key={d} 
                        onClick={(e) => { e.stopPropagation(); handleDaySelect(d); }} 
                        className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                            value === `${year}.${month.toString().padStart(2, '0')}.${d.toString().padStart(2, '0')}` 
                            ? 'bg-cyan-500 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-600'
                        }`}
                       >
                           {d}
                       </button>
                   ))}
               </div>
           )}

           {/* View: Months */}
           {view === 'month' && (
               <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <button key={m} onClick={(e) => { e.stopPropagation(); handleMonthSelect(m); }} className={`py-3 rounded-xl text-sm font-bold transition-colors ${month === m ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'}`}>{m}월</button>
                  ))}
               </div>
           )}

           {/* View: Years */}
           {view === 'year' && (
               <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto custom-scrollbar">
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + 1 - i).concat(Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 19 - i)).map((y) => (
                    <button key={y} onClick={(e) => { e.stopPropagation(); handleYearSelect(y); }} className={`py-2 rounded-lg text-sm font-bold transition-colors ${year === y ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'}`}>{y}</button>
                  ))}
               </div>
           )}

        </div>
      )}
    </div>
  );
};
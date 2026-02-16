import React, { useState, useEffect, useRef } from 'react';

interface MonthYearPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ label, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [y] = value.split('.');
      if (y) setYear(parseInt(y));
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, value]);

  const handleMonthSelect = (month: number) => {
    onChange(`${year}.${month.toString().padStart(2, '0')}`);
    setIsOpen(false);
  };

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
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-full min-w-[280px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 p-4 animate-fade-in-up">
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <button onClick={(e) => { e.stopPropagation(); setYear(prev => prev - 1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <span className="font-bold text-gray-800 text-lg">{year}년</span>
              <button onClick={(e) => { e.stopPropagation(); setYear(prev => prev + 1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
           </div>
           <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button key={m} onClick={(e) => { e.stopPropagation(); handleMonthSelect(m); }} className={`py-2 rounded-lg text-sm font-medium transition-colors ${value === `${year}.${m.toString().padStart(2, '0')}` ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'}`}>{m}월</button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../UI/Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    name: string;
    role: string;
    avatar: string;
    company?: string;
  };
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, target }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ sender: 'me' | 'mentor'; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick Replies
  const quickReplies = [
    "안녕하세요! 👋",
    "멘토링 일정 문의드립니다.", 
    "포트폴리오 첨삭 가능할까요?", 
    "감사합니다!", 
    "일정 변경 가능할까요?"
  ];

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen) {
      setHistory([{ sender: 'mentor', text: `안녕하세요! ${target.name}입니다. 무엇을 도와드릴까요?` }]);
    }
  }, [isOpen, target]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setHistory((prev) => [...prev, { sender: 'me', text: text }]);
    setMessage('');
    
    // Mock Reply
    setTimeout(() => {
      setHistory((prev) => [...prev, { sender: 'mentor', text: '메시지 확인했습니다. 잠시만 기다려주세요!' }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      {/* Increased width to max-w-2xl for better view */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl h-[700px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col border border-white/50">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={target.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt="profile" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">{target.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{target.company || 'Mentor'}</span>
              </div>
              <span className="text-xs text-gray-500 block mt-0.5">{target.role} · 온라인 활동중</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 custom-scrollbar" ref={scrollRef}>
          <div className="text-center text-xs text-gray-400 my-4 bg-gray-100/50 py-1 px-3 rounded-full mx-auto w-fit">오늘</div>
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                 <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-gray-100">
          {/* Quick Replies */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-bold hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-gray-200 transition-all shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(message);
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
                <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-all pr-12"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-cyan-600 text-white p-4 rounded-2xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center aspect-square"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
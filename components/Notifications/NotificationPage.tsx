import React, { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

export const NotificationPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'job', title: '📢 네이버 채용 마감 임박', desc: "관심 등록한 'FE 개발자 신입 공채'가 3일 뒤 마감됩니다.", time: '1시간 전', read: false },
    { id: 2, type: 'mentoring', title: '✅ 멘토링 승인 완료', desc: "김서연 멘토님과의 멘토링이 확정되었습니다. 일정을 확인해주세요.", time: '3시간 전', read: false },
    { id: 3, type: 'system', title: '🎉 회원가입을 축하합니다', desc: "Certi-Folio에 오신 것을 환영합니다! 스펙 입력을 시작해보세요.", time: '1일 전', read: true },
    { id: 4, type: 'job', title: '🔥 토스 채용 시작', desc: "관심 직무인 'Frontend Developer' 채용이 시작되었습니다.", time: '2일 전', read: true },
    { id: 5, type: 'mentoring', title: '💬 새로운 메시지 도착', desc: "이준호 멘토님이 메시지를 보냈습니다.", time: '3일 전', read: true },
    { id: 6, type: 'system', title: '🔒 보안 업데이트 안내', desc: "개인정보 처리방침이 변경되었습니다. 확인해주세요.", time: '4일 전', read: true },
  ]);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    switch(type) {
        case 'job': return '💼';
        case 'mentoring': return '🤝';
        case 'system': return '🔔';
        default: return '📢';
    }
  };

  // Handlers
  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
      if(window.confirm('모든 알림을 삭제하시겠습니까?')) {
          setNotifications([]);
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 px-4 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">알림 센터</h2>
                <p className="text-gray-500 mt-1">모든 알림 내역을 확인하고 관리하세요.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" className="text-xs h-9 py-0 px-3 bg-white hover:text-cyan-600" onClick={handleMarkAllRead}>
                    모두 읽음
                </Button>
                <Button variant="secondary" className="text-xs h-9 py-0 px-3 bg-white text-gray-400 hover:text-red-500 hover:border-red-200" onClick={handleClearAll}>
                    전체 삭제
                </Button>
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {['all', 'job', 'mentoring', 'system'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        filter === cat
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {cat === 'all' ? '전체' : cat === 'job' ? '채용 정보' : cat === 'mentoring' ? '멘토링' : '시스템'}
                </button>
            ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
            {filtered.map(notif => (
                <GlassCard key={notif.id} className={`p-5 flex gap-4 hover:border-cyan-300 transition-all cursor-pointer group relative overflow-hidden ${notif.read ? 'bg-white/40' : 'bg-white border-cyan-100'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${notif.read ? 'bg-gray-50 text-gray-400' : 'bg-gradient-to-br from-white to-cyan-50 border border-cyan-100 shadow-sm'}`}>
                        {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 pr-8">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-base font-bold ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h4>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2 bg-gray-50 px-2 py-1 rounded-full">{notif.time}</span>
                        </div>
                        <p className={`text-sm mt-1 leading-relaxed ${notif.read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.desc}</p>
                    </div>
                    {!notif.read && (
                        <div className="absolute top-5 right-5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                        </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </GlassCard>
            ))}
            
            {filtered.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <div className="text-4xl mb-3 opacity-30">🔕</div>
                    <p className="text-gray-400 font-medium">새로운 알림이 없습니다.</p>
                </div>
            )}
        </div>
    </div>
  );
};
import React, { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

export const AdminDashboard: React.FC = () => {
  // Mock Applicants Data (Enhanced with full details)
  const [applicants, setApplicants] = useState([
    { 
        id: 1, 
        name: '박민수', 
        company: 'Naver', 
        role: 'Backend Developer', 
        year: '5년차', 
        date: '2025.02.20', 
        status: 'pending', 
        bio: '대규모 트래픽 처리 경험을 공유하고 싶습니다. 주니어 개발자들의 성장을 돕고 싶어요.',
        skills: ['Java', 'Spring Boot', 'Kafka', 'System Design'],
        mentoringType: ['online', 'chat'],
        availableDays: ['월', '수'],
        certificates: '정보처리기사, SQLD'
    },
    { 
        id: 2, 
        name: '이지은', 
        company: 'Woowa Bros', 
        role: 'Product Designer', 
        year: '3년차', 
        date: '2025.02.19', 
        status: 'pending', 
        bio: '주니어 디자이너를 위한 포트폴리오 멘토링. 실무 중심의 피드백을 드립니다.',
        skills: ['Figma', 'UX Research', 'Prototyping'],
        mentoringType: ['online', 'offline'],
        availableDays: ['토', '일'],
        certificates: ''
    },
    { 
        id: 3, 
        name: '최동훈', 
        company: 'Samsung Electronics', 
        role: 'Embedded SW', 
        year: '8년차', 
        date: '2025.02.18', 
        status: 'approved', 
        bio: '임베디드 시스템 기초부터 실무까지.',
        skills: ['C/C++', 'RTOS', 'Linux Kernel'],
        mentoringType: ['online'],
        availableDays: ['화', '목'],
        certificates: '임베디드기사'
    },
    { 
        id: 4, 
        name: '김하늘', 
        company: 'Toss', 
        role: 'Frontend Developer', 
        year: '2년차', 
        date: '2025.02.15', 
        status: 'rejected', 
        bio: '리액트 생태계에 대해 이야기해요.',
        skills: ['React', 'TypeScript'],
        mentoringType: ['chat'],
        availableDays: ['금'],
        certificates: ''
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'processed'>('all');
  
  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<{ id: number, type: 'approved' | 'rejected', name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleStatusClick = (id: number, type: 'approved' | 'rejected', name: string) => {
      setConfirmAction({ id, type, name });
      setRejectReason(''); // Reset reason
  };

  const processStatusChange = () => {
    if (confirmAction) {
      setApplicants(prev => prev.map(app => app.id === confirmAction.id ? { ...app, status: confirmAction.type } : app));
      if (confirmAction.type === 'rejected') {
          console.log(`Rejected ${confirmAction.name} with reason: ${rejectReason}`);
      }
      setConfirmAction(null);
      setRejectReason('');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return app.status === 'pending';
    if (filter === 'processed') return app.status !== 'pending';
    return true;
  });

  const getMentoringTypeLabel = (type: string) => {
      switch(type) {
          case 'online': return '💻 화상';
          case 'offline': return '☕ 대면';
          case 'chat': return '💬 채팅';
          default: return type;
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 px-4 pt-36 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">관리자 대시보드</h2>
          <p className="text-gray-500 mt-1">멘토 신청 현황을 상세 검토하고 승인 여부를 결정합니다.</p>
        </div>
        <div className="flex bg-white/50 p-1 rounded-xl border border-gray-200">
            {['all', 'pending', 'processed'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {f === 'all' ? '전체' : f === 'pending' ? '대기중' : '처리완료'}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredApplicants.map(app => (
            <GlassCard key={app.id} className="p-6 flex flex-col gap-6 border-l-4 border-l-gray-200 hover:border-l-cyan-500 transition-all">
                {/* Header & Basic Info */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{app.company}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{app.role} ({app.year})</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg leading-relaxed">"{app.bio}"</p>
                        
                        {/* Detailed Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                            <div>
                                <strong className="text-gray-400 text-xs uppercase block mb-1">전문 분야 (Skills)</strong>
                                <div className="flex flex-wrap gap-1">
                                    {app.skills.map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs font-bold border border-cyan-100">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <strong className="text-gray-400 text-xs uppercase block mb-1">진행 방식</strong>
                                    <div className="flex flex-wrap gap-1">
                                        {app.mentoringType.map((t, i) => (
                                            <span key={i} className="text-xs text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{getMentoringTypeLabel(t)}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <strong className="text-gray-400 text-xs uppercase block mb-1">가능 요일</strong>
                                    <span className="text-xs text-gray-700 font-medium">{app.availableDays.join(', ')}</span>
                                </div>
                            </div>
                            {app.certificates && (
                                <div className="md:col-span-2">
                                    <strong className="text-gray-400 text-xs uppercase block mb-1">자격증</strong>
                                    <span className="text-xs text-gray-600">{app.certificates}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        <span className="text-xs text-gray-400 mb-2">신청일: {app.date}</span>
                        {app.status === 'pending' ? (
                            <div className="flex flex-col gap-2 w-full">
                                <button 
                                    onClick={() => handleStatusClick(app.id, 'approved', app.name)}
                                    className="px-4 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-sm shadow-md shadow-cyan-500/20 transition-colors w-full"
                                >
                                    승인하기
                                </button>
                                <button 
                                    onClick={() => handleStatusClick(app.id, 'rejected', app.name)}
                                    className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm transition-colors w-full"
                                >
                                    거절하기
                                </button>
                            </div>
                        ) : (
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold border w-full text-center ${
                                app.status === 'approved' 
                                ? 'bg-green-50 text-green-600 border-green-200' 
                                : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                                {app.status === 'approved' ? '승인됨' : '거절됨'}
                            </span>
                        )}
                    </div>
                </div>
            </GlassCard>
        ))}

        {filteredApplicants.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
                <div className="text-4xl mb-3 opacity-30">📭</div>
                <p className="text-gray-400 font-medium">해당하는 신청 내역이 없습니다.</p>
            </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmAction(null)}></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-fade-in-up border border-white/50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl ${confirmAction.type === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {confirmAction.type === 'approved' ? '✅' : '🚫'}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                    '{confirmAction.name}' 님을<br/>
                    <span className={confirmAction.type === 'approved' ? 'text-green-600' : 'text-red-600'}>
                        {confirmAction.type === 'approved' ? '승인' : '거절'}
                    </span> 하시겠습니까?
                </h3>
                <p className="text-gray-500 text-xs mb-4 text-center leading-relaxed">
                    {confirmAction.type === 'approved' 
                        ? '승인 시 해당 멘토는 멘티 목록에 노출되며 활동이 가능해집니다.' 
                        : '거절 시 신청이 반려되며, 해당 멘토에게 알림이 전송됩니다.'}
                </p>

                {/* Rejection Reason Input */}
                {confirmAction.type === 'rejected' && (
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-500 block mb-1 ml-1">거절 사유 (필수)</label>
                        <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-3 bg-red-50 border border-red-100 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none placeholder-red-300 text-gray-700"
                            placeholder="예: 경력 증빙 자료가 부족합니다."
                            rows={3}
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1 py-3" onClick={() => setConfirmAction(null)}>취소</Button>
                    <Button 
                        variant="primary" 
                        className={`flex-1 py-3 border-none ${confirmAction.type === 'approved' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'}`}
                        onClick={processStatusChange}
                        disabled={confirmAction.type === 'rejected' && !rejectReason.trim()}
                    >
                        확인
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
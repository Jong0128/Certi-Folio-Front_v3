import React, { useState, useEffect } from 'react';
import { MentorGrid } from './MentorGrid';
import { MentorRegistrationFlow } from './MentorRegistrationFlow';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { ChatModal } from './ChatModal';
import { mentoringApplicationApi } from '../../api/mentoringApi';
import { useAuth } from '../../contexts/AuthContext';

interface MentoringPageProps {
    isRegistrationEnabled?: boolean;
}

// Mock Sessions (폴백)
const MOCK_SESSIONS = [
    {
        id: 1,
        mentorName: '김서연',
        role: 'Staff Engineer',
        company: 'Google',
        imageUrl: 'https://picsum.photos/100/100?random=1',
        date: '2025.02.20 (목) 19:00',
        status: 'confirmed',
        topic: '커리어 전환 및 리더십 상담'
    },
    {
        id: 2,
        mentorName: '이준호',
        role: 'Product Designer',
        company: 'Airbnb',
        imageUrl: 'https://picsum.photos/100/100?random=2',
        date: '2025.02.25 (화) 20:00',
        status: 'pending',
        topic: '포트폴리오 리뷰'
    }
];

export const MentoringPage: React.FC<MentoringPageProps> = ({ isRegistrationEnabled = true }) => {
    const { isLoggedIn, token } = useAuth();
    const [viewMode, setViewMode] = useState<'dashboard' | 'all-mentors'>('dashboard');
    const [isRegistering, setIsRegistering] = useState(false);

    // Mock Mentor Application Status: 'none', 'pending', 'approved', 'rejected'
    const [appStatus, setAppStatus] = useState<'none' | 'pending' | 'approved'>('none');

    // Reset status when registration is enabled via Admin to allow re-testing
    useEffect(() => {
        if (isRegistrationEnabled) {
            setAppStatus('none');
        }
    }, [isRegistrationEnabled]);

    // Modal States for this page
    const [activeModal, setActiveModal] = useState<'none' | 'app-detail'>('none');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChatTarget, setSelectedChatTarget] = useState<{ name: string, role: string, avatar: string, company?: string } | null>(null);

    // Confirmation Modal State
    const [cancelSessionId, setCancelSessionId] = useState<number | null>(null);

    const [selectedCategory, setSelectedCategory] = useState('전체');

    const categories = ['전체', 'Frontend', 'Backend', 'AI/ML', 'DevOps', 'Product', 'Design', 'Career'];

    // Manage sessions in state
    const [sessions, setSessions] = useState(MOCK_SESSIONS);

    // 백엔드에서 보낸 신청 목록 로드
    useEffect(() => {
        if (!isLoggedIn || !token) return;
        const fetchSentApplications = async () => {
            try {
                const res = await mentoringApplicationApi.getSentApplications();
                const items = res.applications || res;
                if (Array.isArray(items) && items.length > 0) {
                    setSessions(items.map((a: any) => ({
                        id: a.id,
                        mentorName: a.mentorName || a.mentor?.name || '멘토',
                        role: a.mentorRole || a.mentor?.expertise || '',
                        company: a.mentorCompany || a.mentor?.company || '',
                        imageUrl: a.mentorImageUrl || a.mentor?.profileImageUrl || `https://picsum.photos/100/100?random=${a.id}`,
                        date: a.scheduledDate || a.createdAt || '',
                        status: a.status === 'APPROVED' ? 'confirmed' : 'pending',
                        topic: a.topic || a.message || '',
                    })));
                }
            } catch (err) {
                console.warn('멘토링 신청 목록 로드 실패, Mock 데이터 사용:', err);
            }
        };
        fetchSentApplications();
    }, [isLoggedIn, token]);

    // Handle Cancel Session (Open Modal)
    const handleCancelClick = (id: number) => {
        setCancelSessionId(id);
    };

    // Confirm Cancel (Execute Deletion)
    const processCancelSession = () => {
        if (cancelSessionId) {
            setSessions(prev => prev.filter(session => session.id !== cancelSessionId));
            setCancelSessionId(null);
        }
    };

    // Chat Handlers
    const handleOpenChat = (name: string, role: string, avatar: string, company: string) => {
        setSelectedChatTarget({ name, role, avatar, company });
        setIsChatOpen(true);
    };

    // If registering, show flow
    if (isRegistering) {
        return (
            <MentorRegistrationFlow
                onComplete={() => { setIsRegistering(false); setAppStatus('pending'); }}
                onCancel={() => setIsRegistering(false)}
            />
        );
    }

    // --- VIEW: ALL MENTORS (FIND MENTOR) ---
    if (viewMode === 'all-mentors') {
        return (
            <div className="w-full pb-20 space-y-8 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setViewMode('dashboard')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-3xl font-extrabold text-gray-900">전체 멘토 찾기</h2>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid (Pass filter) */}
                <MentorGrid showAll={true} filterCategory={selectedCategory} />
            </div>
        );
    }

    // --- VIEW: DASHBOARD (DEFAULT) ---
    return (
        <div className="w-full pb-20 space-y-12 animate-fade-in-up relative">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">멘토링 대시보드</h2>
                <p className="text-gray-500 mt-1">현직자 멘토들과 1:1로 만나 커리어 고민을 해결하세요.</p>
            </div>

            {/* Application Status Banner (If Pending) */}
            {appStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 shadow-sm animate-pulse-slow">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">⏳</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-yellow-800 text-lg">멘토 등록 심사 중입니다</h4>
                        <p className="text-yellow-700 text-sm mt-1">제출해주신 신청서를 검토하고 있습니다. 영업일 기준 3~5일 소요될 수 있습니다.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="secondary" className="bg-white border-yellow-200 text-yellow-800 text-sm py-2" onClick={() => setActiveModal('app-detail')}>상세 보기</Button>
                    </div>
                </div>
            )}
            {/* Application Status Banner (If Approved) */}
            {appStatus === 'approved' && (
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-lg shadow-purple-500/20 text-white gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">🎉</div>
                        <div>
                            <h4 className="font-bold text-xl">멘토 등록이 승인되었습니다!</h4>
                            <p className="text-purple-100 text-sm mt-1">이제 멘토 활동을 시작하고 멘티들을 만나보세요.</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50 border-none whitespace-nowrap">활동 관리</Button>
                </div>
            )}

            {/* Section 1: My Mentoring */}
            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    🙋 내가 신청한 멘토링
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map(session => (
                        <GlassCard key={session.id} className="p-5 flex flex-col gap-3 hover:border-cyan-300 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{session.mentorName} 멘토님</h4>
                                    <p className="text-xs text-gray-500">{session.role} @ {session.company}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${session.status === 'confirmed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {session.status === 'confirmed' ? '확정됨' : '승인 대기'}
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                                <div className="flex gap-2">
                                    <span className="text-gray-400 w-10">일시</span>
                                    <span className="text-gray-700 font-medium">{session.date}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-400 w-10">주제</span>
                                    <span className="text-gray-700">{session.topic}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <Button
                                    variant="secondary"
                                    className="flex-1 py-2 text-xs flex items-center justify-center gap-1 hover:text-cyan-600 hover:border-cyan-200"
                                    onClick={() => handleOpenChat(session.mentorName, session.role, session.imageUrl, session.company)}
                                >
                                    💬 채팅
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex-1 py-2 text-xs text-gray-400 hover:text-red-500 hover:border-red-200"
                                    onClick={() => handleCancelClick(session.id)}
                                >
                                    취소하기
                                </Button>
                            </div>
                        </GlassCard>
                    ))}
                    {sessions.length === 0 && (
                        <div className="col-span-1 md:col-span-2 py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                            신청한 멘토링이 없습니다. 아래 추천 멘토를 확인해보세요!
                        </div>
                    )}
                </div>
            </section>

            {/* Section 2: Recommended Mentors (Existing) */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            🔥 추천 멘토
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">회원님의 관심 직무에 딱 맞는 멘토입니다.</p>
                    </div>
                    <button onClick={() => setViewMode('all-mentors')} className="text-sm text-cyan-600 font-bold hover:underline flex items-center gap-1">
                        전체 보기 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="bg-white/30 p-1 rounded-3xl">
                    <MentorGrid limit={4} />
                </div>
            </section>

            {/* Section 3: Apply as Mentor - Conditionally Rendered */}
            {isRegistrationEnabled && (
                <section className="mt-12">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">당신의 경험을 나눠주세요</h3>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                누군가에게는 당신의 조언이 인생을 바꾸는 터닝포인트가 될 수 있습니다.<br className="hidden md:block" />
                                Certi-Folio의 멘토가 되어 미래의 인재들을 이끌어주세요.
                            </p>
                        </div>
                        <div className="relative z-10 flex-shrink-0">
                            <Button
                                variant="neon"
                                className="px-8 py-4 text-lg font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                onClick={() => setIsRegistering(true)}
                                disabled={appStatus !== 'none'}
                            >
                                {appStatus === 'none' ? '멘토로 등록하기 🚀' : (appStatus === 'pending' ? '심사 진행 중 🕒' : '멘토 활동 중 😎')}
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* --- MODALS --- */}

            {/* 1. Application Detail Modal */}
            {activeModal === 'app-detail' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-fade-in-up border border-white/50 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-extrabold text-gray-900">멘토 신청 상세</h3>
                            <div className="flex gap-2">
                                <button className="text-sm text-cyan-600 font-bold hover:underline" onClick={() => { setIsRegistering(true); setActiveModal('none'); }}>수정하기</button>
                                <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">👨‍💻</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">김네온</p>
                                        <p className="text-xs text-gray-500">Google Korea / Senior Engineer</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded font-medium text-gray-600">5년차</span>
                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded font-medium text-gray-600">React</span>
                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded font-medium text-gray-600">TypeScript</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">소개글</label>
                                <p className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200 leading-relaxed">
                                    안녕하세요, 주니어 개발자들의 성장통을 해결해드리고 싶은 김네온입니다. 실무에서 겪는 다양한 문제들을 함께 고민하고 해결책을 찾아가고 싶습니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">선호 멘토링 방식</label>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-lg font-bold border border-cyan-100">💻 화상</span>
                                        <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-lg font-bold border border-cyan-100">💬 채팅</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">가능 시간대</label>
                                    <div className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            <span className="font-bold">월, 수, 금</span>
                                        </div>
                                        <p className="text-xs text-gray-500 ml-3.5">19:00 ~ 22:00 (KST)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Button variant="secondary" className="flex-1 text-red-500 border-red-100 hover:bg-red-50" onClick={() => {
                                if (window.confirm('정말 신청을 취소하시겠습니까?')) {
                                    setAppStatus('none');
                                    setActiveModal('none');
                                }
                            }}>신청 취소</Button>
                            <Button variant="primary" className="flex-1" onClick={() => setActiveModal('none')}>닫기</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Unified Chat Modal */}
            {selectedChatTarget && (
                <ChatModal
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    target={selectedChatTarget}
                />
            )}

            {/* 3. Confirmation Modal for Cancellation */}
            {cancelSessionId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelSessionId(null)}></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-fade-in-up border border-white/50">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-2xl">
                            🗑️
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">정말 취소하시겠습니까?</h3>
                        <p className="text-gray-500 text-sm mb-6 text-center leading-relaxed">
                            신청한 멘토링 내역이 영구적으로 삭제됩니다.<br />
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="secondary" className="flex-1 py-3" onClick={() => setCancelSessionId(null)}>아니요</Button>
                            <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-none shadow-red-500/30 py-3" onClick={processCancelSession}>네, 취소합니다</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
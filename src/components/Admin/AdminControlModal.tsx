import React from 'react';

interface AdminControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    toggleLogin: () => void;
    hasData: boolean;
    toggleData: () => void;
    isMentorRegEnabled: boolean;
    toggleMentorReg: () => void;
    onNavigateToAdmin: () => void;
}

export const AdminControlModal = ({
    isOpen,
    onClose,
    isLoggedIn,
    toggleLogin,
    hasData,
    toggleData,
    isMentorRegEnabled,
    toggleMentorReg,
    onNavigateToAdmin
}: AdminControlModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-6 w-full max-w-sm animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">⚙️ 관리자 모드</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">로그인 상태</p>
                            <p className="text-xs text-gray-500">{isLoggedIn ? '로그인 됨' : '로그아웃 됨'}</p>
                        </div>
                        <button
                            onClick={toggleLogin}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isLoggedIn ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isLoggedIn ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">정보 입력 상태 (데이터)</p>
                            <p className="text-xs text-gray-500">{hasData ? '데이터 있음' : '데이터 없음'}</p>
                        </div>
                        <button
                            onClick={toggleData}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${hasData ? 'bg-cyan-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hasData ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">멘토 등록 기능</p>
                            <p className="text-xs text-gray-500">{isMentorRegEnabled ? '켜짐 (신청 가능)' : '꺼짐 (신청 불가)'}</p>
                        </div>
                        <button
                            onClick={toggleMentorReg}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isMentorRegEnabled ? 'bg-purple-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isMentorRegEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => { onNavigateToAdmin(); onClose(); }}
                    className="w-full mt-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                    🔐 관리자 페이지 이동
                </button>

                <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-400">개발 및 테스트용 패널입니다.</p>
                </div>
            </div>
        </div>
    );
};

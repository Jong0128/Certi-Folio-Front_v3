import React from 'react';

interface AdminControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToAdmin: () => void;
}

export const AdminControlModal = ({
    isOpen,
    onClose,
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

                <button
                    onClick={() => { onNavigateToAdmin(); onClose(); }}
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                    🔐 관리자 페이지 이동
                </button>
            </div>
        </div>
    );
};

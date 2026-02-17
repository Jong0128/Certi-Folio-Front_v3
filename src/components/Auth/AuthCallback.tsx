import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

/**
 * OAuth 콜백 처리 컴포넌트
 * 백엔드가 /auth/callback?token=xxx 로 리다이렉트하면
 * 토큰을 저장하고 유저 프로필을 불러옵니다.
 */
export const AuthCallback: React.FC = () => {
    const { handleOAuthCallback } = useAuth();
    const { navigate } = useApp();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            handleOAuthCallback(token).then(() => {
                // 로그인 성공 → 대시보드로 이동
                navigate('dashboard');
            }).catch((err) => {
                console.error('OAuth callback failed:', err);
                navigate('login');
            });
        } else {
            // 토큰 없으면 로그인 페이지로
            navigate('login');
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] animate-fade-in-up">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">로그인 처리 중...</p>
            </div>
        </div>
    );
};

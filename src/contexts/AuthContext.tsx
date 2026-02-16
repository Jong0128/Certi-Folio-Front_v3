import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, ApiError } from '../api/client';

interface UserProfile {
    id: string;
    name: string | null;
    nickname: string | null;
    email: string | null;
    profileImage: string | null;
    provider: string;
    phone: string | null;
    location: string | null;
    university: string | null;
    major: string | null;
    year: string | null;
    company: string | null;
    bio: string | null;
}

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    userData: any;
    setUserData: (data: any) => void;
    userProfile: UserProfile | null;
    mockDataEnabled: boolean;
    setMockDataEnabled: (value: boolean) => void;
    handleLogin: () => void;
    handleLogout: () => void;
    handleOAuthCallback: (token: string) => Promise<void>;
    handleToggleData: () => void;
    hasData: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const getStoredUserData = () => {
    try {
        const saved = localStorage.getItem('neon_spec_flow_data');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Error loading data", e);
    }
    return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [mockDataEnabled, setMockDataEnabled] = useState(true);
    const [userData, setUserData] = useState<any>(getStoredUserData());

    // 앱 시작 시: 저장된 토큰이 있으면 유저 프로필 가져오기
    useEffect(() => {
        const data = getStoredUserData();
        setUserData(data);
        setMockDataEnabled(!!data);

        if (token) {
            fetchUserProfile().catch(() => {
                // 토큰 만료 등 → 로그아웃
                handleLogout();
            });
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await apiClient.get('/api/user/me');
            // 백엔드 응답: { success: true, data: { id, name, email, provider, ... } }
            const profile: UserProfile = response.data || response;
            setUserProfile(profile);
            setIsLoggedIn(true);
            console.log('[Auth] 유저 프로필 로드:', profile);
            return profile;
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                handleLogout();
            }
            throw err;
        }
    };

    // OAuth 콜백에서 호출: 토큰 저장 → 프로필 로드
    const handleOAuthCallback = async (newToken: string) => {
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
        await fetchUserProfile();
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUserProfile(null);
        setIsLoggedIn(false);
    };

    const handleToggleData = () => {
        if (mockDataEnabled) {
            localStorage.removeItem('neon_spec_flow_data');
            setUserData(null);
            setMockDataEnabled(false);
        } else {
            const mock = {
                name: '김네온',
                birthYear: '1999',
                targetCompanyType: 'IT 서비스 기업',
                targetJobRole: 'Frontend Developer',
                schoolName: '한국대학교',
                major: '소프트웨어학과',
                degree: 'bachelor',
                startDate: '2018.03',
                endDate: '2024.02',
                gpa: '4.1',
                maxGpa: '4.5',
                projects: [{ projectName: 'Certi-Folio', role: 'Frontend', techStack: ['React'] }],
                certificates: [{ name: '정보처리기사', type: 'general' }]
            };
            localStorage.setItem('neon_spec_flow_data', JSON.stringify(mock));
            setUserData(mock);
            setMockDataEnabled(true);
        }
    };

    const hasData = mockDataEnabled && !!userData;

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            userData,
            setUserData,
            userProfile,
            mockDataEnabled,
            setMockDataEnabled,
            handleLogin,
            handleLogout,
            handleOAuthCallback,
            handleToggleData,
            hasData,
            token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

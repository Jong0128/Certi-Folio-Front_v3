import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    userData: any;
    setUserData: (data: any) => void;
    mockDataEnabled: boolean;
    setMockDataEnabled: (value: boolean) => void;
    handleLogin: () => void;
    handleLogout: () => void;
    handleToggleData: () => void;
    hasData: boolean;
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
    const [mockDataEnabled, setMockDataEnabled] = useState(true);
    const [userData, setUserData] = useState<any>(getStoredUserData());

    useEffect(() => {
        const data = getStoredUserData();
        setUserData(data);
        setMockDataEnabled(!!data);
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
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
            mockDataEnabled,
            setMockDataEnabled,
            handleLogin,
            handleLogout,
            handleToggleData,
            hasData,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

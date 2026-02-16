import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ViewType } from '../components/Layout/Navbar';

interface AppContextType {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    navigate: (view: ViewType) => void;
    showAdmin: boolean;
    setShowAdmin: (value: boolean) => void;
    isMentorRegEnabled: boolean;
    setIsMentorRegEnabled: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // URL 기반 초기 뷰 결정 (OAuth 콜백 처리)
    const getInitialView = (): ViewType => {
        if (window.location.pathname === '/auth/callback') {
            return 'auth-callback';
        }
        return 'home';
    };

    const [currentView, setCurrentView] = useState<ViewType>(getInitialView());
    const [showAdmin, setShowAdmin] = useState(false);
    const [isMentorRegEnabled, setIsMentorRegEnabled] = useState(true);

    const navigate = (view: ViewType) => {
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppContext.Provider value={{
            currentView,
            setCurrentView,
            navigate,
            showAdmin,
            setShowAdmin,
            isMentorRegEnabled,
            setIsMentorRegEnabled,
        }}>
            {children}
        </AppContext.Provider>
    );
};

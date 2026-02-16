import React, { useState, useEffect, useRef } from 'react';
import { MentorGrid } from './components/Mentors/MentorGrid';
import { MentoringPage } from './components/Mentors/MentoringPage';
import { Button } from './components/UI/Button';
import { SpecScore } from './components/Dashboard/SpecScore';
// JobCalendar import removed from usage but import can stay or go. Removing from usage.
import { SpecFlowTest } from './components/Spec/SpecFlowTest';
import { InfoManagement } from './components/Spec/InfoManagement';
import { LoginPage } from './components/Auth/LoginPage';
import { SpecReport } from './components/Spec/SpecReport';
import { JobDashboard } from './components/Jobs/JobDashboard';
import { NotificationPage } from './components/Notifications/NotificationPage'; // Import NotificationPage
import { AdminDashboard } from './components/Admin/AdminDashboard'; // Import AdminDashboard

// Typing Effect Component (Improved for Multi-line & Gradient Text)
const TypingEffect = ({ 
    text, 
    delay = 0, 
    speed = 100, 
    className = '',
    showCursor = true,
    cursorClassName = 'bg-gray-900', // Allow custom cursor color
    onComplete
}: { 
    text: string, 
    delay?: number, 
    speed?: number, 
    className?: string,
    showCursor?: boolean,
    cursorClassName?: string,
    onComplete?: () => void
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    // Reset initially
    setDisplayedText(''); 

    timeoutId = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className={`ml-1 inline-block w-[3px] h-[1em] align-middle mb-1 ${cursorClassName} ${showCursor ? 'animate-pulse' : 'opacity-0'}`}></span>
    </span>
  );
};

// Common Lock Overlay Component (Fixed/Sticky)
const FullPageLockOverlay = ({ onLogin }: { onLogin: () => void }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
    <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 text-center max-w-md transform transition-transform duration-300 pointer-events-auto shadow-cyan-500/10">
      <div className="w-14 h-14 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 text-white">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">로그인이 필요한 서비스입니다</h3>
      <p className="text-gray-500 mb-8 leading-relaxed">
        개인 맞춤형 커리어 분석 리포트와<br/>
        로드맵 서비스를 이용하시려면 로그인해주세요.
      </p>
      <Button variant="neon" onClick={onLogin} className="w-full py-4 text-base font-bold shadow-cyan-500/25">
        로그인하고 시작하기
      </Button>
      <p className="mt-4 text-xs text-gray-400">
        3초 만에 간편 로그인
      </p>
    </div>
  </div>
);

// Admin Control Modal
const AdminControlModal = ({ 
    isOpen, 
    onClose, 
    isLoggedIn, 
    toggleLogin, 
    hasData, 
    toggleData,
    isMentorRegEnabled,
    toggleMentorReg,
    onNavigateToAdmin
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    isLoggedIn: boolean; 
    toggleLogin: () => void; 
    hasData: boolean; 
    toggleData: () => void;
    isMentorRegEnabled: boolean;
    toggleMentorReg: () => void;
    onNavigateToAdmin: () => void;
}) => {
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

// Navbar Component
interface NavbarProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
  onNavigate: (view: 'home' | 'dashboard' | 'jobs' | 'login' | 'report' | 'flow-test' | 'info-management' | 'mentoring' | 'notifications' | 'admin-dashboard') => void;
  currentView: 'home' | 'dashboard' | 'jobs' | 'login' | 'report' | 'flow-test' | 'info-management' | 'mentoring' | 'notifications' | 'admin-dashboard';
  onOpenAdmin: () => void;
}

const Navbar = ({ isLoggedIn, onLoginToggle, onNavigate, currentView, onOpenAdmin }: NavbarProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'AI 진단', view: 'dashboard' as const },
    { label: '정보 입력', view: 'flow-test' as const },
    { label: '멘토링', view: 'mentoring' as const },
    { label: '채용 정보', view: 'jobs' as const }, 
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/50 transition-all duration-300 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            Certi-Folio
          </span>
          <div className="hidden md:flex gap-1">
            {navItems.map((item, idx) => (
              <button 
                key={`${item.label}-${idx}`}
                onClick={() => onNavigate(item.view)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  (currentView === item.view || (currentView === 'report' && item.view === 'dashboard'))
                    ? 'text-cyan-600 bg-cyan-50' 
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          
          {/* Admin Button */}
          <button 
            onClick={onOpenAdmin}
            className="text-xs font-bold text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            ⚙️ 관리자
          </button>

          {isLoggedIn ? (
            <>
              {/* Notification */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotif(!showNotif)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                {showNotif && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right z-50 flex flex-col max-h-96">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-700">알림 센터</span>
                      <span className="text-xs text-cyan-600 cursor-pointer hover:underline">모두 읽음</span>
                    </div>
                    <div className="overflow-y-auto flex-1">
                       <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors group">
                          <p className="text-xs text-gray-800 font-bold mb-1 group-hover:text-cyan-700">📢 네이버 채용 마감 임박</p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">관심 등록한 'FE 개발자 신입 공채'가 3일 뒤 마감됩니다.</p>
                       </div>
                       <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors group">
                          <p className="text-xs text-gray-800 font-bold mb-1 group-hover:text-cyan-700">✅ 멘토링 승인 완료</p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">김서연 멘토님과의 멘토링이 확정되었습니다.</p>
                       </div>
                    </div>
                    <div className="p-2 border-t border-gray-100 bg-white flex-shrink-0 text-center">
                        <button 
                            onClick={() => { setShowNotif(false); onNavigate('notifications'); }}
                            className="text-xs font-bold text-gray-600 hover:text-cyan-600 py-1.5 w-full rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                        >
                            알림 전체 보기 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                  <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md"
                  >
                     <img src="https://picsum.photos/50/50?random=99" className="rounded-full w-full h-full object-cover border-2 border-white" alt="Profile" />
                  </div>
                  {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right z-50">
                          <div className="p-4 border-b border-gray-50 flex items-center gap-3">
                              <img src="https://picsum.photos/50/50?random=99" className="w-8 h-8 rounded-full object-cover" alt="Profile" />
                              <div>
                                  <p className="text-xs font-bold text-gray-900">김네온</p>
                                  <p className="text-[10px] text-gray-500">neon@example.com</p>
                              </div>
                          </div>
                          <div className="py-1">
                              <button onClick={() => { onNavigate('info-management'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-600 transition-colors flex items-center gap-2">
                                  <span className="text-lg">👤</span> 내 정보 관리
                              </button>
                          </div>
                          <div className="border-t border-gray-50 py-1">
                              <button onClick={() => { onLoginToggle(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                                  <span className="text-lg">🚪</span> 로그아웃
                              </button>
                          </div>
                      </div>
                  )}
              </div>
            </>
          ) : (
            <Button variant="primary" onClick={() => onNavigate('login')} className="py-2 px-4 text-xs h-9">
              로그인
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'jobs' | 'login' | 'report' | 'flow-test' | 'info-management' | 'mentoring' | 'notifications' | 'admin-dashboard'>('home');
  const [line1Done, setLine1Done] = useState(false);
  
  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [mockDataEnabled, setMockDataEnabled] = useState(true); // Toggle for "Information Input"
  const [isMentorRegEnabled, setIsMentorRegEnabled] = useState(true); // Toggle for "Mentor Registration"

  // Helper to retrieve saved user data for the report
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

  const [userData, setUserData] = useState<any>(getStoredUserData());

  useEffect(() => {
      // Sync state with storage initially
      const data = getStoredUserData();
      setUserData(data);
      setMockDataEnabled(!!data);
  }, []);

  // Handler for Admin Toggle Data
  const handleToggleData = () => {
      if (mockDataEnabled) {
          // Clear Data
          localStorage.removeItem('neon_spec_flow_data');
          setUserData(null);
          setMockDataEnabled(false);
      } else {
          // Inject Mock Data
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

  // Mock Certificates Data with detailed info
  const certificates = [
    { name: '정보처리기사', date: '2023.06.15', expiry: '영구', type: 'cert', score: '합격' },
    { name: 'SQLD', date: '2023.09.20', expiry: '2025.09.20', type: 'cert', score: '우수' },
    { name: 'TOEIC', date: '2024.01.10', expiry: '2026.01.10', type: 'lang', score: '920점' },
    { name: 'AWS SA Associate', date: '2024.05.05', expiry: '2027.05.05', type: 'cert', score: 'Pass' },
  ];

  // Enhanced Skills Data
  const skills = [
      { name: 'React', icon: '⚛️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Node.js', icon: '🟢' },
      { name: 'Figma', icon: '🎨' },
      { name: 'Next.js', icon: '▲' },
      { name: 'TailwindCSS', icon: '🌬️' },
      { name: 'Git', icon: '🐱' },
      { name: 'Vercel', icon: '▲' },
  ];

  const handleNavigate = (view: 'home' | 'dashboard' | 'jobs' | 'login' | 'report' | 'flow-test' | 'info-management' | 'mentoring' | 'notifications' | 'admin-dashboard') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
      setIsLoggedIn(true);
      setCurrentView('home');
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentView('home');
  };

  const hasData = mockDataEnabled && !!userData;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 text-gray-900 font-inter selection:bg-cyan-100 selection:text-cyan-900 relative">
      
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[20%] w-[600px] h-[600px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLoginToggle={handleLogout} 
        onNavigate={handleNavigate}
        currentView={currentView}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      <AdminControlModal 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)}
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
        hasData={hasData}
        toggleData={handleToggleData}
        isMentorRegEnabled={isMentorRegEnabled}
        toggleMentorReg={() => setIsMentorRegEnabled(!isMentorRegEnabled)}
        onNavigateToAdmin={() => handleNavigate('admin-dashboard')}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
            <section className="relative w-full pt-32 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm mb-8 shadow-sm animate-fade-in-down">
                        <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">AI-Powered Career Roadmap</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-gray-900 drop-shadow-sm min-h-[160px] md:min-h-[180px]">
                        <TypingEffect 
                            text="커리어의 미래를" 
                            speed={150} 
                            showCursor={!line1Done} 
                            onComplete={() => setLine1Done(true)}
                        />
                        <br />
                        <TypingEffect 
                            text="AI와 함께 설계하세요" 
                            delay={1800} 
                            speed={150} 
                            showCursor={line1Done} // Only show cursor when line 1 is done
                            cursorClassName="bg-gray-800" // Visible cursor for gradient text
                            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient-x"
                        />
                    </h1>
                    
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-2000">
                        내 스펙의 현재 위치를 데이터로 확인하고,<br />
                        업계 최고의 멘토들에게 직접 조언을 구해보세요.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-4000">
                        <Button variant="primary" onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'login')} className="px-8 py-4 text-lg rounded-full shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-1">
                            시작하기
                        </Button>
                    </div>
                </div>
            </section>
        )}

        {/* VIEW 2: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="relative w-full min-h-screen">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             
             {/* Wrapper to blur everything including greeting and main content */}
             <div className={`w-full pt-36 pb-12 transition-all duration-500 ${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                 
                 {/* Greeting */}
                 <section className="w-full text-center mb-12">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                         반가워요, <span className="text-cyan-600">{isLoggedIn ? (userData?.name || '김네온') : '게스트'}</span>님 👋
                     </h1>
                     <p className="text-gray-500 mt-2">오늘도 목표 달성을 위해 한 걸음 더 나아가 볼까요?</p>
                 </section>

                 <main className="max-w-7xl mx-auto w-full px-6 space-y-12">
                     <section id="personal-dashboard" className="relative rounded-3xl">
                         <div className="flex items-center justify-between mb-8">
                             <div>
                                 <h2 className="text-2xl font-bold text-gray-900">나의 커리어 분석</h2>
                                 <p className="text-gray-500 text-sm mt-1">AI가 분석한 내 경쟁력과 활동 내역입니다.</p>
                             </div>
                         </div>
                         <div className="flex flex-col gap-8">
                             <div className="w-full">
                                 {/* Pass navigation handler to SpecScore */}
                                 <SpecScore 
                                    score={hasData ? 78 : 0} 
                                    percentile={hasData ? 85 : 0} 
                                    hasData={hasData}
                                    onDiagnose={() => setCurrentView('flow-test')}
                                    onShowReport={() => handleNavigate('report')} 
                                 />
                             </div>
                             {hasData && (
                                <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-6 md:p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">역량 포트폴리오</h3>
                                        <button className="text-xs text-cyan-600 font-bold hover:underline" onClick={() => setCurrentView('info-management')}>관리하기</button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200/50">
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">자격증 및 어학</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {certificates.map((cert, i) => (
                                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/50 border border-white hover:border-cyan-200 transition-colors">
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${cert.type === 'lang' ? 'bg-indigo-400' : 'bg-green-400'}`}></div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-sm font-bold text-gray-800">{cert.name}</p>
                                                                    <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">{cert.score}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <span className="text-[10px] text-gray-400">{cert.date} 취득</span>
                                                                    <span className={`text-[10px] ${cert.expiry === '영구' ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                                                        {cert.expiry === '영구' ? '영구 유효' : `${cert.expiry} 만료`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200/50">
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">보유 스킬</h4>
                                            </div>
                                            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex-1">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {skills.map((skill, i) => (
                                                        <div key={i} className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                                                            <span className="text-2xl mb-1">{skill.icon}</span>
                                                            <span className="text-xs font-bold text-gray-700">{skill.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             )}
                             {/* Job Calendar Removed from Dashboard as requested */}
                         </div>
                     </section>
                     
                     {hasData && (
                        <>
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
                            <section id="mentors">
                                <MentorGrid />
                            </section>
                        </>
                     )}
                 </main>
             </div>
          </div>
        )}

        {/* VIEW 3: JOBS DASHBOARD */}
        {currentView === 'jobs' && (
          <div className="relative w-full">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             <div className={`w-full max-w-7xl mx-auto px-6 pt-36 pb-20 transition-all duration-500 ${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                <JobDashboard />
             </div>
          </div>
        )}

        {/* VIEW 4: AI FLOW TEST (Restored & Locked) */}
        {currentView === 'flow-test' && (
          <div className="relative w-full pt-36 pb-20">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             <div className={`${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                <SpecFlowTest />
             </div>
          </div>
        )}

        {/* VIEW 5: INFO MANAGEMENT (Restored) */}
        {currentView === 'info-management' && (
          <div className="relative w-full pt-36 pb-20">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             <div className={`${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                <InfoManagement />
             </div>
          </div>
        )}

        {/* VIEW 6: MENTORING PAGE */}
        {currentView === 'mentoring' && (
          <div className="relative w-full max-w-7xl mx-auto px-6 pt-36 pb-20">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             <div className={`${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                <MentoringPage isRegistrationEnabled={isMentorRegEnabled} />
             </div>
          </div>
        )}

        {/* VIEW 7: LOGIN PAGE */}
        {currentView === 'login' && (
          <div className="pt-20 flex-grow flex items-center justify-center">
             <LoginPage onLogin={handleLogin} />
          </div>
        )}

        {/* VIEW 8: SPEC REPORT */}
        {currentView === 'report' && (
          <div className="relative w-full flex-grow">
             {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
             <div className={`pt-36 pb-12 transition-all duration-500 ${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                 <SpecReport 
                    userData={userData} 
                    onGoToDashboard={() => setCurrentView('dashboard')} 
                    onDiagnose={() => setCurrentView('flow-test')}
                 />
             </div>
          </div>
        )}

        {/* VIEW 9: NOTIFICATIONS */}
        {currentView === 'notifications' && (
          <div className="relative w-full pt-36 pb-20">
              {!isLoggedIn && <FullPageLockOverlay onLogin={() => setCurrentView('login')} />}
              <div className={`${!isLoggedIn ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
                <NotificationPage />
              </div>
          </div>
        )}

        {/* VIEW 10: ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && (
          <div className="relative w-full">
              <AdminDashboard />
          </div>
        )}
        
        <footer className="py-12 text-center text-gray-500 text-sm border-t border-gray-200/30 bg-transparent">
            <p>© 2025 Certi-Folio Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
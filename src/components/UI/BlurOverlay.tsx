import React from 'react';
import { Button } from './Button';

interface BlurOverlayProps {
  isLocked: boolean;
  children: React.ReactNode;
  message?: string;
}

export const BlurOverlay: React.FC<BlurOverlayProps> = ({ isLocked, children, message = "로그인 후 확인 가능합니다" }) => {
  return (
    <div className="relative w-full h-full">
      <div className={`${isLocked ? 'blur-md select-none pointer-events-none' : ''} transition-all duration-500 h-full`}>
        {children}
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/30 rounded-2xl">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl text-center border border-white/50">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-900 font-bold mb-1">{message}</p>
            <p className="text-xs text-gray-500 mb-4">개인 맞춤형 정보를 보호하고 있습니다.</p>
            <Button variant="primary" className="w-full text-xs py-2 h-9">
              로그인하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
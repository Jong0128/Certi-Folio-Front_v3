import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`backdrop-blur-xl bg-white/70 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

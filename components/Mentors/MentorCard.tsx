import React from 'react';
import { Mentor } from '../../types';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface MentorCardProps {
  mentor: Mentor;
  onViewDetail?: (mentor: Mentor) => void;
  onApply?: (mentor: Mentor) => void;
  onChat?: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onViewDetail, onApply, onChat }) => {
  return (
    <GlassCard className="flex flex-col h-full hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 group bg-white cursor-pointer relative overflow-hidden">
      
      {/* Clickable Area for Detail View */}
      <div className="p-5 flex-1 flex flex-col gap-4" onClick={() => onViewDetail && onViewDetail(mentor)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
             <div className="relative">
                <img 
                  src={mentor.imageUrl} 
                  alt={mentor.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-cyan-500 transition-all"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${mentor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">{mentor.name}</h3>
               <p className="text-xs text-gray-500">{mentor.role} @ {mentor.company}</p>
             </div>
          </div>
          {/* Company Logo Placeholder */}
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">
            {mentor.company.substring(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {mentor.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded bg-gray-50 border border-gray-100 text-gray-600 font-medium">
              {skill}
            </span>
          ))}
          {mentor.skills.length > 3 && (
            <span className="text-[10px] px-2 py-1 rounded text-gray-400 bg-gray-50">
              +{mentor.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex gap-2">
        <Button
            variant="secondary"
            className="flex-1 text-xs py-2 h-10 hover:border-cyan-200 hover:text-cyan-600 hover:bg-white flex items-center justify-center gap-1 shadow-sm"
            onClick={(e) => {
                e.stopPropagation();
                if (onChat) onChat(mentor);
            }}
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            채팅
        </Button>
        <Button 
            variant="secondary" 
            className="flex-1 text-xs py-2 h-10 hover:border-cyan-500 hover:text-cyan-600 bg-white hover:bg-cyan-50 shadow-sm"
            onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                if (onApply) onApply(mentor);
            }}
        >
          1:1 멘토링 신청
        </Button>
      </div>
    </GlassCard>
  );
};
import React, { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { suggestSkillsForRole, enhanceBio } from '../../services/geminiService';
import { Skill } from '../../types';

interface ProfileBuilderProps {
  onUpdate: (data: any) => void;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onUpdate }) => {
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState('');
  const [major, setMajor] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCert, setNewCert] = useState('');

  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingBio, setLoadingBio] = useState(false);

  // Skill Handlers
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { id: Date.now().toString(), name: newSkill, category: 'tech' }]);
      setNewSkill('');
    }
  };
  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };
  const handleAiSuggest = async () => {
    if (!role) return;
    setLoadingSkills(true);
    const suggestions = await suggestSkillsForRole(role);
    const newSkills = suggestions.map(s => ({
      id: Date.now().toString() + Math.random(),
      name: s,
      category: 'tech' as const
    }));
    setSkills(prev => [...prev, ...newSkills]);
    setLoadingSkills(false);
  };

  // Certificate Handlers
  const handleAddCert = () => {
    if (newCert.trim()) {
      setCertificates([...certificates, newCert]);
      setNewCert('');
    }
  };
  const handleRemoveCert = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // Bio Handler
  const handleAiBio = async () => {
    if (!bio || !role) return;
    setLoadingBio(true);
    const improved = await enhanceBio(bio, role);
    setBio(improved);
    setLoadingBio(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900">
          마이 스펙 관리
        </h2>
        <p className="text-gray-500 text-sm">성공적인 커리어를 위한 스펙과 경험을 기록하세요.</p>
      </div>

      <GlassCard className="p-6 md:p-8 space-y-8">
        
        {/* Section: Basic Info */}
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">기본 정보</h3>
            <Input 
            label="희망 직무 (Target Role)" 
            placeholder="예: 프론트엔드 개발자, PM"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            />

            <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">자기소개</label>
                <button 
                    onClick={handleAiBio}
                    disabled={!bio || !role || loadingBio}
                    className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1 disabled:opacity-50 font-medium"
                >
                {loadingBio ? '생성 중...' : '✨ AI 자동 교정'}
                </button>
            </div>
            <textarea
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-300 min-h-[100px] resize-none shadow-sm"
                placeholder="자신의 강점과 커리어 목표를 간단히 작성하세요."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            </div>
        </section>

        {/* Section: Education */}
        <section className="space-y-6">
             <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">학력 정보</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input 
                    label="학교명" 
                    placeholder="대학교 입력" 
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                 />
                 <Input 
                    label="전공" 
                    placeholder="전공 입력" 
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                 />
             </div>
        </section>

        {/* Section: Certificates */}
        <section className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">자격증 및 어학</h3>
             <div className="flex gap-3">
                <Input 
                    placeholder="자격증 명 입력 (예: 정보처리기사)" 
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCert()}
                />
                <Button variant="secondary" onClick={handleAddCert} className="whitespace-nowrap">추가</Button>
             </div>
             <div className="flex flex-col gap-2">
                 {certificates.map((cert, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <span className="text-sm font-medium text-gray-700">{cert}</span>
                         <button onClick={() => handleRemoveCert(idx)} className="text-gray-400 hover:text-red-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                     </div>
                 ))}
                 {certificates.length === 0 && <p className="text-xs text-gray-400 p-1">등록된 자격증이 없습니다.</p>}
             </div>
        </section>

        {/* Section: Skills */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-gray-100 pb-2">
             <h3 className="text-lg font-semibold text-gray-800">기술 스택</h3>
          </div>
          
          <div className="flex gap-3">
            <Input 
              placeholder="스킬 추가 (Enter)" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className="w-full"
            />
            <Button 
              variant="secondary" 
              className="whitespace-nowrap flex items-center gap-2"
              onClick={handleAiSuggest}
              loading={loadingSkills}
              disabled={!role}
            >
              <span className="text-cyan-600">✨</span> AI 추천
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {skills.map(skill => (
              <div key={skill.id} className="group relative flex items-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full pl-4 pr-10 py-1.5 transition-all text-gray-800">
                <span className="text-sm font-medium">{skill.name}</span>
                <button 
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="absolute right-1 p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 italic py-2">스킬이 없습니다. AI 추천을 사용해보세요!</p>
            )}
          </div>
        </section>
        
        <div className="pt-4 border-t border-gray-100">
             <Button variant="neon" className="w-full font-bold shadow-cyan-500/20">
                 저장하기
             </Button>
        </div>

      </GlassCard>
    </div>
  );
};
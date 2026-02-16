export interface Skill {
  id: string;
  name: string;
  category: 'tech' | 'soft' | 'tool';
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  skills: string[];
  bio: string;
  available: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  skills: Skill[];
  certificates: string[];
}
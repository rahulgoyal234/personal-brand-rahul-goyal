export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: 'Research Papers' | 'Articles' | 'IP Press Blogs';
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
  stats?: { label: string; value: string }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  details?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

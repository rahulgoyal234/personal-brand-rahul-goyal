import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolio';
import { Project } from '../types';

export interface PersonalInfoType {
  name: string;
  title: string;
  bio: string;
  shortBio: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  introVideo?: string;
  introVideoType?: 'file' | 'url' | 'youtube' | 'vimeo' | 'loom';
  isAvatarLocked?: boolean;
}

interface PortfolioContextProps {
  personalInfo: PersonalInfoType;
  updatePersonalInfo: (updates: Partial<PersonalInfoType>) => void;
  resetPersonalInfo: () => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  resetProjects: () => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(() => {
    try {
      const saved = localStorage.getItem('rahul_goyal_personal_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.linkedin === 'https://linkedin.com/in/rahulgoyal' || parsed.linkedin === 'https://linkedin.com/in/rahulgoyal/') {
          parsed.linkedin = PERSONAL_INFO.linkedin;
        }
        if (parsed.title === 'Corporate Lawyer & Tech Policy Specialist' || parsed.title === 'Lawyer' || parsed.title === 'Law Graduate & Legal Researcher' || parsed.title === 'Lawyer & Legal Commentator') {
          parsed.title = PERSONAL_INFO.title;
        }
        // If the saved bio is the old default bio, automatically upgrade it to the new default bio
        const oldBio = 'A legal professional specializing in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection. Experienced in analyzing complex regulatory policies, drafting transactional contracts, and advising on emerging technology frameworks including Artificial Intelligence governance and cyber law.';
        const oldBio2 = 'A law graduate from KIIT School of Law, Bhubaneswar, and a legal professional specializing in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection. Experienced in analyzing complex regulatory policies, drafting transactional contracts, and advising on emerging technology frameworks including Artificial Intelligence governance and cyber law.';
        const oldBio3 = 'A law graduate from KIIT School of Law, Bhubaneswar, specializing in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection. Currently pursuing an LL.M. in Corporate & Commercial Law alongside the Company Secretary (CS) Executive program, I am passionate about navigating complex regulatory policies, drafting transactional contracts, and research-driven advocacy in emerging technology frameworks, cyber law, and artificial intelligence governance.';
        const oldBio4 = 'A law graduate from KIIT School of Law, Bhubaneswar, specializing in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection. I am deeply passionate about navigating complex regulatory policies, drafting transactional contracts, and research-driven advocacy in emerging technology frameworks, cyber law, and artificial intelligence governance.';
        const oldBio5 = 'A dedicated legal professional specializing in Corporate and Commercial Law, Regulatory Compliance, and Transactional Advisory. I am passionate about navigating complex legal landscapes, drafting robust commercial contracts, and providing strategic counsel to help businesses and individuals achieve their goals with clarity and precision.';
        const oldBio6 = 'A dedicated professional specializing in corporate advisory, regulatory compliance, and transactional management. Experienced in navigating complex operational landscapes, drafting robust agreements, and providing clear counsel to help businesses and individuals achieve their goals with clarity and precision.';
        const oldBio7 = 'A motivated and analytical law graduate specializing in Corporate & Commercial Law, Regulatory Compliance, and Dispute Resolution. Passionate about rigorous legal research, contract drafting, and strategic advisory, I leverage research-driven insights to navigate complex legal frameworks and deliver clear, practical solutions.';
        const oldBio8 = 'An analytical lawyer and legal commentator who decodes complex regulatory policies, corporate governance trends, and intellectual property disputes through research-driven writing. Best known for sharing insightful commentaries and investigative op-eds on leading legal portals, I am passionate about making modern law and tech-governance concepts accessible, engaging, and highly informative.';
        const oldBio9 = 'A dedicated and analytical legal professional specializing in Corporate & Commercial Law, Regulatory Compliance, and Dispute Resolution. Passionate about navigating complex legal frameworks, drafting robust commercial contracts, and providing research-driven advisory, I help clients and businesses achieve their objectives with confidence and integrity.';
        const oldBio10 = 'A dedicated and analytical legal professional specializing in Corporate & Commercial Law, Regulatory Compliance, and Dispute Resolution. Passionate about navigating complex legal frameworks, drafting robust commercial contracts, and providing clear, research-driven advisory, I help clients and businesses achieve their objectives with confidence and integrity.';
        if (!parsed.bio || parsed.bio.trim() === oldBio.trim() || parsed.bio.trim() === oldBio2.trim() || parsed.bio.trim() === oldBio3.trim() || parsed.bio.trim() === oldBio4.trim() || parsed.bio.trim() === oldBio5.trim() || parsed.bio.trim() === oldBio6.trim() || parsed.bio.trim() === oldBio7.trim() || parsed.bio.trim() === oldBio8.trim() || parsed.bio.trim() === oldBio9.trim() || parsed.bio.trim() === oldBio10.trim()) {
          parsed.bio = PERSONAL_INFO.bio;
        }

        // Upgrade saved shortBio if it matches old tech-policy taglines to show the new general tagline
        const oldShortBio1 = 'I specialize in corporate transactions, data privacy compliance, and emerging tech policy governance.';
        const oldShortBio2 = 'I specialize in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection.';
        const oldShortBio3 = 'Delivering strategic legal solutions with clarity and precision.';
        const oldShortBio4 = 'Delivering strategic solutions with clarity and precision.';
        const oldShortBio5 = 'Delivering strategic legal solutions with clarity and precision.';
        const oldShortBio6 = 'Providing insightful commentaries on modern corporate law, tech policy, and IP governance.';
        const oldShortBio7 = 'Delivering strategic legal solutions with clarity and precision.';
        if (!parsed.shortBio || parsed.shortBio.trim() === oldShortBio1.trim() || parsed.shortBio.trim() === oldShortBio2.trim() || parsed.shortBio.trim() === oldShortBio3.trim() || parsed.shortBio.trim() === oldShortBio4.trim() || parsed.shortBio.trim() === oldShortBio5.trim() || parsed.shortBio.trim() === oldShortBio6.trim() || parsed.shortBio.trim() === oldShortBio7.trim()) {
          parsed.shortBio = PERSONAL_INFO.shortBio;
        }
        const merged = { ...PERSONAL_INFO, ...parsed };
        if (PERSONAL_INFO.isAvatarLocked) {
          merged.isAvatarLocked = true;
        }
        return merged;
      }
    } catch (e) {
      console.error('Error loading custom personal info:', e);
    }
    return PERSONAL_INFO;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('rahul_goyal_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => {
          const defaultProj = PROJECTS.find((dp) => dp.id === p.id);
          if (defaultProj) {
            // Force the official default images for default projects unless it's a custom base64 uploaded image (starts with data:)
            if (!p.image || p.image.includes('images.unsplash.com') || (!p.image.startsWith('data:') && p.image !== defaultProj.image)) {
              return { ...p, image: defaultProj.image };
            }
          }
          return p;
        });
      }
    } catch (e) {
      console.error('Error loading custom projects:', e);
    }
    return PROJECTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_personal_info', JSON.stringify(personalInfo));
    } catch (e) {
      console.error('Error saving custom personal info:', e);
    }
  }, [personalInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving custom projects:', e);
    }
  }, [projects]);

  const updatePersonalInfo = (updates: Partial<PersonalInfoType>) => {
    setPersonalInfo((prev) => {
      const merged = { ...prev, ...updates };
      if (PERSONAL_INFO.isAvatarLocked) {
        merged.isAvatarLocked = true;
      }
      return merged;
    });
  };

  const resetPersonalInfo = () => {
    localStorage.removeItem('rahul_goyal_personal_info');
    setPersonalInfo(PERSONAL_INFO);
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const resetProjects = () => {
    localStorage.removeItem('rahul_goyal_projects');
    setProjects(PROJECTS);
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        updatePersonalInfo,
        resetPersonalInfo,
        projects,
        addProject,
        updateProject,
        deleteProject,
        resetProjects,
        isEditorOpen,
        setIsEditorOpen,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

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
        return { ...PERSONAL_INFO, ...parsed };
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
            // Upgrade old unsplash placeholder image or any mismatch with the fresh local assets
            if (p.image.includes('images.unsplash.com') || p.image !== defaultProj.image) {
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
    setPersonalInfo((prev) => ({ ...prev, ...updates }));
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

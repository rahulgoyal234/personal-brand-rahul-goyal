import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolio';

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
}

interface PortfolioContextProps {
  personalInfo: PersonalInfoType;
  updatePersonalInfo: (updates: Partial<PersonalInfoType>) => void;
  resetPersonalInfo: () => void;
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
        return { ...PERSONAL_INFO, ...parsed };
      }
    } catch (e) {
      console.error('Error loading custom personal info:', e);
    }
    return PERSONAL_INFO;
  });

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_personal_info', JSON.stringify(personalInfo));
    } catch (e) {
      console.error('Error saving custom personal info:', e);
    }
  }, [personalInfo]);

  const updatePersonalInfo = (updates: Partial<PersonalInfoType>) => {
    setPersonalInfo((prev) => ({ ...prev, ...updates }));
  };

  const resetPersonalInfo = () => {
    localStorage.removeItem('rahul_goyal_personal_info');
    setPersonalInfo(PERSONAL_INFO);
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        updatePersonalInfo,
        resetPersonalInfo,
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

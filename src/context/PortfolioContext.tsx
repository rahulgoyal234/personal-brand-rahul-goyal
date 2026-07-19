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
  importPortfolio: (personalInfo: PersonalInfoType, projects: Project[]) => void;
  isSyncing: boolean;
  hasLoadedRemote: boolean;
  syncStateWithServer: (info: PersonalInfoType, projs: Project[]) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [hasLoadedRemote, setHasLoadedRemote] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(() => {
    try {
      const saved = localStorage.getItem('rahul_goyal_personal_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.avatar || (typeof parsed.avatar === 'string' && parsed.avatar.includes('unsplash.com'))) {
            parsed.avatar = PERSONAL_INFO.avatar;
          }
          if (parsed.linkedin === 'https://linkedin.com/in/rahulgoyal' || parsed.linkedin === 'https://linkedin.com/in/rahulgoyal/') {
            parsed.linkedin = PERSONAL_INFO.linkedin;
          }
          if (parsed.title === 'Corporate Lawyer & Tech Policy Specialist' || parsed.title === 'Lawyer' || parsed.title === 'Law Graduate & Legal Researcher' || parsed.title === 'Lawyer & Legal Commentator' || parsed.title === 'KIIT School of Law Graduate' || !parsed.title || (typeof parsed.title === 'string' && (parsed.title.toLowerCase().includes('full stack') || parsed.title.toLowerCase().includes('engineer')))) {
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
          const oldBio11 = 'A law graduate from KIIT School of Law, Bhubaneswar, specializing in Corporate & Commercial Law, Intellectual Property (IP), and Data Protection. I am passionate about navigating complex regulatory policies, drafting transactional contracts, and research-driven advocacy in emerging technology frameworks, cyber law, and artificial intelligence governance.';
          const oldBio12 = 'Bridging the gap between groundbreaking innovation and rigid regulation. I specialize in corporate commercial frameworks, sensory intellectual property, and high-stakes tech policy. From drafting watertight transactional contracts to advising on cutting-edge AI governance, I make complex legal landscapes safe, navigable, and strategically advantageous for visionaries.';
          
          const currentBio = typeof parsed.bio === 'string' ? parsed.bio.trim() : '';
          if (!parsed.bio || currentBio === oldBio.trim() || currentBio === oldBio2.trim() || currentBio === oldBio3.trim() || currentBio === oldBio4.trim() || currentBio === oldBio5.trim() || currentBio === oldBio6.trim() || currentBio === oldBio7.trim() || currentBio === oldBio8.trim() || currentBio === oldBio9.trim() || currentBio === oldBio10.trim() || currentBio === oldBio11.trim() || currentBio === oldBio12.trim()) {
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
          
          const currentShortBio = typeof parsed.shortBio === 'string' ? parsed.shortBio.trim() : '';
          if (!parsed.shortBio || currentShortBio === oldShortBio1.trim() || currentShortBio === oldShortBio2.trim() || currentShortBio === oldShortBio3.trim() || currentShortBio === oldShortBio4.trim() || currentShortBio === oldShortBio5.trim() || currentShortBio === oldShortBio6.trim() || currentShortBio === oldShortBio7.trim()) {
            parsed.shortBio = PERSONAL_INFO.shortBio;
          }
          if (parsed.avatar && (parsed.avatar.includes('avatar_sabbrn.png') || parsed.avatar.includes('avatar_u0ajsb') || parsed.avatar.includes('avatar_sabbrn') || parsed.avatar.includes('photo_srai3m') || parsed.avatar.includes('photo_czmebs') || parsed.avatar.includes('photo-split-bg-clearer') || parsed.avatar.includes('photo_glow') || parsed.avatar.includes('final_vertical_split') || parsed.avatar.includes('b4wo') || parsed.avatar.includes('8ufd') || parsed.avatar.includes('6fnq') || parsed.avatar.includes('bes7'))) {
            parsed.avatar = PERSONAL_INFO.avatar;
          }
          const merged = { ...PERSONAL_INFO, ...parsed };
          if (!merged.avatar || merged.avatar === '/avatar.jpg' || merged.avatar === '/avatar.png' || merged.avatar.includes('avatar_sabbrn.png') || merged.avatar.includes('avatar_sabbrn') || merged.avatar.includes('photo_srai3m') || merged.avatar.includes('photo_czmebs') || merged.avatar.includes('photo-split-bg-clearer') || merged.avatar.includes('photo_glow') || merged.avatar.includes('final_vertical_split') || merged.avatar.includes('b4wo') || merged.avatar.includes('8ufd') || merged.avatar.includes('6fnq') || merged.avatar.includes('bes7')) {
            merged.avatar = PERSONAL_INFO.avatar;
          }
          merged.isAvatarLocked = true;
          return merged;
        }
      }
    } catch (e) {
      console.error('Error loading custom personal info:', e);
    }
    return PERSONAL_INFO;
  });

  const sanitizeProjectsList = (projs: any[]): Project[] => {
    if (!Array.isArray(projs)) return PROJECTS;
    let list = [...projs];
    
    // Ensure all default projects are present
    PROJECTS.forEach((dp) => {
      const index = list.findIndex((p) => p && typeof p === 'object' && p.id === dp.id);
      if (index === -1) {
        list.push(dp);
      }
    });

    return list
      .filter((p) => p && typeof p === 'object' && p.id)
      .map((p: any) => {
        const defaultProj = PROJECTS.find((dp) => dp.id === p.id);
        if (defaultProj) {
          let updated = { ...p };
          // Always force the official default images for all default projects to ensure high-quality, up-to-date thumbnails are displayed
          updated.image = defaultProj.image;
          // If the saved demoUrl is the old default top-level link, upgrade it
          if (p.id === 'private-law-colleges' && (!p.demoUrl || p.demoUrl === 'https://www.barandbench.com' || p.demoUrl === 'https://www.barandbench.com/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          if (p.id === 'judicial-independence' && (!p.demoUrl || p.demoUrl === 'https://www.ijllr.com' || p.demoUrl === 'https://www.ijllr.com/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          if (p.id === 'writ-jurisdiction' && (!p.demoUrl || p.demoUrl === 'https://www.manupatra.com' || p.demoUrl === 'https://www.manupatra.com/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          if (p.id === 'patent-claim-modification' && (!p.demoUrl || p.demoUrl === 'https://theippress.com' || p.demoUrl === 'https://theippress.com/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          if (p.id === 'unconventional-trademarks' && (!p.demoUrl || p.demoUrl === 'https://theippress.com' || p.demoUrl === 'https://theippress.com/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          if (p.id === 'ai-governance' && (!p.demoUrl || p.demoUrl === 'https://www.pj.gob.pe' || p.demoUrl === 'https://www.pj.gob.pe/')) {
            updated.demoUrl = defaultProj.demoUrl;
          }
          return updated;
        }
        
        // For any custom/user-added articles, ensure they also have a high-quality fallback thumbnail if missing
        if (!p.image || typeof p.image !== 'string' || p.image.trim() === '') {
          return {
            ...p,
            image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
          };
        }
        return p;
      });
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('rahul_goyal_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sanitizeProjectsList(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading custom projects:', e);
    }
    return PROJECTS;
  });

  // Sync with Server helper function
  const syncStateWithServer = async (info: PersonalInfoType, projs: Project[]) => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalInfo: info, projects: projs }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.personalInfo && result.personalInfo.avatar !== info.avatar) {
          setPersonalInfo(result.personalInfo);
          try {
            localStorage.setItem('rahul_goyal_personal_info', JSON.stringify(result.personalInfo));
          } catch (e) {
            console.error('Error saving updated avatar path:', e);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync state with backend server:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial remote fetch on load
  useEffect(() => {
    async function loadRemoteData() {
      try {
        const response = await fetch('/api/portfolio-data');
        if (response.ok) {
          const remoteData = await response.json();
          if (remoteData) {
            if (remoteData.personalInfo) {
              const mergedInfo = { ...PERSONAL_INFO, ...remoteData.personalInfo };
              if (!mergedInfo.avatar || mergedInfo.avatar === '/avatar.jpg' || mergedInfo.avatar === '/avatar.png' || mergedInfo.avatar.includes('avatar_sabbrn.png') || mergedInfo.avatar.includes('avatar_sabbrn') || mergedInfo.avatar.includes('photo_srai3m') || mergedInfo.avatar.includes('photo_czmebs') || mergedInfo.avatar.includes('photo-split-bg-clearer') || mergedInfo.avatar.includes('photo_glow') || mergedInfo.avatar.includes('final_vertical_split') || mergedInfo.avatar.includes('b4wo') || mergedInfo.avatar.includes('8ufd') || mergedInfo.avatar.includes('6fnq') || mergedInfo.avatar.includes('bes7')) {
                mergedInfo.avatar = PERSONAL_INFO.avatar;
              }
              mergedInfo.isAvatarLocked = true;
              setPersonalInfo(mergedInfo);
              try {
                localStorage.setItem('rahul_goyal_personal_info', JSON.stringify(mergedInfo));
              } catch (e) {
                console.error('LocalStorage save failed:', e);
              }
            }
            if (remoteData.projects) {
              const sanitizedProjects = sanitizeProjectsList(remoteData.projects);
              setProjects(sanitizedProjects);
              try {
                localStorage.setItem('rahul_goyal_projects', JSON.stringify(sanitizedProjects));
              } catch (e) {
                console.error('LocalStorage save failed:', e);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch remote synced portfolio data:', e);
      } finally {
        setHasLoadedRemote(true);
      }
    }
    loadRemoteData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_personal_info', JSON.stringify(personalInfo));
      if (hasLoadedRemote) {
        syncStateWithServer(personalInfo, projects);
      }
    } catch (e) {
      console.error('Error saving custom personal info:', e);
    }
  }, [personalInfo]);

  useEffect(() => {
    const title = personalInfo?.title || '';
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engineer') || lowerTitle.includes('full stack') || lowerTitle.includes('full-stack') || lowerTitle.includes('developer')) {
      setPersonalInfo((prev) => ({ ...prev, title: 'Lawyer' }));
    }
  }, [personalInfo?.title]);

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_projects', JSON.stringify(projects));
      if (hasLoadedRemote) {
        syncStateWithServer(personalInfo, projects);
      }
    } catch (e) {
      console.error('Error saving custom projects:', e);
    }
  }, [projects]);

  const updatePersonalInfo = (updates: Partial<PersonalInfoType>) => {
    setPersonalInfo((prev) => {
      const merged = { ...prev, ...updates };
      // Keep the updated avatar if provided, otherwise default to the official dynamic endpoint
      if (!merged.avatar) {
        merged.avatar = PERSONAL_INFO.avatar;
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

  const importPortfolio = (newPersonalInfo: PersonalInfoType, newProjects: Project[]) => {
    if (!newPersonalInfo.avatar || newPersonalInfo.avatar.includes('unsplash.com')) {
      newPersonalInfo.avatar = PERSONAL_INFO.avatar;
    }
    setPersonalInfo(newPersonalInfo);
    setProjects(sanitizeProjectsList(newProjects));
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
        importPortfolio,
        isSyncing,
        hasLoadedRemote,
        syncStateWithServer,
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

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import { usePortfolio } from './context/PortfolioContext';
import { ContactSubmission } from './types';
import { Github, Linkedin, Mail, Twitter, ChevronUp, Clock, Sliders } from 'lucide-react';

export default function App() {
  const { personalInfo, setIsEditorOpen } = usePortfolio();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showInbox, setShowInbox] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>('');

  // Manage submissions persistently in localStorage
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('rahul_goyal_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error reading localStorage contact submissions:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rahul_goyal_contacts', JSON.stringify(submissions));
    } catch (e) {
      console.error('Error writing localStorage contact submissions:', e);
    }
  }, [submissions]);

  // Handle live UTC Clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up Scroll Spy to highlight Navigation links based on scrolled sections
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['about', 'portfolio', 'resume', 'contact'];
      const scrollPosition = window.scrollY + 120; // Offset for navbar

      // Scroll to top visibility check
      setShowScrollTop(window.scrollY > 400);

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleAddSubmission = (msg: Omit<ContactSubmission, 'id' | 'timestamp' | 'read'>) => {
    const newSubmission: ContactSubmission = {
      ...msg,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const handleMarkRead = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, read: true } : sub))
    );
  };

  const handleDeleteMessage = (id: string) => {
    setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const unreadCount = submissions.filter((sub) => !sub.read).length;

  return (
    <div id="root-layout" className="min-h-screen flex flex-col selection:bg-brand-900 selection:text-white">
      {/* Premium Floating Navigation Menu */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenInbox={() => setShowInbox(true)}
        unreadCount={unreadCount}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Intro Section */}
        <Hero
          onContactClick={() => {
            setActiveSection('contact');
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          onPortfolioClick={() => {
            setActiveSection('portfolio');
            document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Selected Projects Showcase */}
        <Portfolio />

        {/* Modular Resume Profile */}
        <Resume />

        {/* Fully Interactive Contact Form & submissions Inbox */}
        <Contact
          submissions={submissions}
          onSubmitMessage={handleAddSubmission}
          onMarkRead={handleMarkRead}
          onDeleteMessage={handleDeleteMessage}
          showInbox={showInbox}
          setShowInbox={setShowInbox}
        />
      </main>

      {/* Footer Design */}
      <footer id="main-footer" className="bg-[#fcfcfc] text-neutral-500 py-16 px-6 border-t border-neutral-200 print:hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 font-sans text-sm font-bold tracking-widest text-neutral-900 uppercase">
                <span className="w-1.5 h-1.5 bg-black"></span>
                <span>rahul.goyal</span>
              </div>
              <p className="text-neutral-400 text-xs font-light max-w-sm">
                Built with precision, React, Vite and Tailwind CSS.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Portfolio
              </button>
              <button
                onClick={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Resume
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Social icons, UTC clock and copyright statement */}
          <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            <div className="flex items-center space-x-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a href={`mailto:${personalInfo.email}`} className="hover:text-black transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* UTC clock */}
            {utcTime && (
              <div className="flex items-center space-x-1 text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{utcTime}</span>
              </div>
            )}

            <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Profile Editor Trigger */}
      <button
        id="open-customizer-btn"
        onClick={() => setIsEditorOpen(true)}
        className="fixed bottom-6 left-6 p-3 bg-black text-white rounded-none border border-black hover:bg-neutral-800 shadow-none transition-all duration-300 cursor-pointer z-40 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest font-bold"
        title="Customize Portfolio"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Customize Site</span>
      </button>

      {/* Floating Scroll to Top trigger */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-white text-black rounded-none border border-neutral-200 hover:border-black shadow-none transition-all duration-300 cursor-pointer z-40"
          title="Scroll to Top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* Slide-over Profile Settings Panel */}
      <Customizer />
    </div>
  );
}

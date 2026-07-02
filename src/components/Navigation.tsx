import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenInbox: () => void;
  unreadCount: number;
}

export default function Navigation({ activeSection, setActiveSection, onOpenInbox, unreadCount }: NavigationProps) {
  const { personalInfo } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#fcfcfc]/90 backdrop-blur-md border-b border-brand-200 py-4 shadow-none' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => handleNavClick('about')}
          className="group flex flex-col items-start cursor-pointer text-left"
        >
          <span className="font-display text-lg font-bold tracking-tight text-brand-900 leading-none">
            {personalInfo.name}
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 mt-1 font-medium">
            Product & Engineering
          </span>
        </button>

        {/* Desktop Nav */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-semibold">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative pb-1 transition-colors cursor-pointer ${
                activeSection === item.id ? 'text-black border-b border-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Button & Socials */}
        <div className="hidden md:flex items-center space-x-4">
          {unreadCount > 0 && (
            <button
              id="nav-inbox-badge"
              onClick={onOpenInbox}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-none border border-black bg-black text-white text-[10px] font-mono font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="uppercase tracking-wider">Inbox ({unreadCount})</span>
            </button>
          )}
          <a
            id="nav-resume-download"
            href={personalInfo.resumeUrl}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('resume');
            }}
            className="flex items-center space-x-1 px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold border border-brand-300 hover:border-black transition-colors cursor-pointer rounded-none"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-3 md:hidden">
          {unreadCount > 0 && (
            <button
              id="mobile-inbox-badge"
              onClick={onOpenInbox}
              className="px-2 py-1 border border-black bg-black text-white text-[10px] font-mono font-medium cursor-pointer"
            >
              Inbox ({unreadCount})
            </button>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-brand-200 hover:border-brand-900 text-brand-700 hover:text-brand-900 transition-colors cursor-pointer rounded-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-brand-200 bg-[#fcfcfc]"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <button
                  id={`mobile-nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 font-display text-sm font-semibold uppercase tracking-widest cursor-pointer ${
                    activeSection === item.id ? 'text-brand-900 border-l-2 border-brand-900 pl-3' : 'text-brand-500 pl-0'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-brand-200 flex flex-col space-y-3">
                <a
                  id="mobile-nav-resume-link"
                  href={personalInfo.resumeUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('resume');
                  }}
                  className="flex items-center justify-between px-4 py-2.5 border border-brand-300 text-brand-700 text-xs font-mono font-medium text-center rounded-none uppercase tracking-wider"
                >
                  <span>Interactive Resume</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {/* Social icons in mobile view */}
                <div className="flex items-center justify-center space-x-6 py-2">
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-900 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-900 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${personalInfo.email}`} className="text-brand-500 hover:text-brand-900 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

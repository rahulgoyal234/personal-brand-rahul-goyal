import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const { personalInfo } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Reading Room' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isOpen 
          ? 'bg-paper/95 backdrop-blur-md py-3 sm:py-3.5 border-b border-rule shadow-xs' 
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-4 xs:px-6 sm:px-8 flex items-center justify-between gap-3 sm:gap-4 w-full">
        
        {/* Left Side: Photo / Name */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
          onClick={() => handleNavClick('about')}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-ink/30 bg-paper-deep overflow-hidden flex items-center justify-center font-serif text-xs font-bold text-ink group-hover:border-brass transition-colors shadow-xs flex-shrink-0">
            {personalInfo.avatar ? (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <span>RG</span>
            )}
          </div>
          <span className="font-serif text-[16px] sm:text-[18px] font-bold tracking-tight text-ink group-hover:text-brass transition-colors truncate">
            {personalInfo.name}
          </span>
        </div>

        {/* Right Side: Floating Pill Navigation Dock (Moving Pattern) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Desktop Floating Pill Dock */}
          <motion.nav 
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden md:flex items-center p-1 bg-paper/90 backdrop-blur-md border border-rule hover:border-ink/40 rounded-full shadow-sm transition-all"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-sans font-medium tracking-wide transition-colors cursor-pointer rounded-full select-none ${
                    isActive ? 'text-paper font-semibold' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {/* Moving Sliding Highlight Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-capsule"
                      className="absolute inset-0 bg-ink rounded-full shadow-xs -z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            {/* Separator */}
            <div className="w-[1px] h-4 bg-rule mx-1" />

            {/* LinkedIn Button in Pill */}
            {personalInfo.linkedin && (
              <a
                id="nav-linkedin-btn"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium text-ink-soft hover:text-ink hover:bg-paper-deep transition-all cursor-pointer select-none"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-brass group-hover:scale-110 transition-transform" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-ink-soft/70 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </motion.nav>

          {/* Mobile Menu Button with Touch-Friendly Size */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center border border-rule hover:border-ink text-ink-soft hover:text-ink transition-colors cursor-pointer rounded-full bg-paper shadow-2xs active:scale-95 hover:bg-paper-deep/60"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4 text-brass" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-b border-rule bg-paper/98 backdrop-blur-md transition-all duration-200 shadow-xl"
        >
          <div className="px-5 py-4 space-y-2 flex flex-col text-left">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left w-full py-2.5 px-4 font-sans text-sm font-medium tracking-normal cursor-pointer rounded-full transition-all min-h-[44px] flex items-center ${
                  activeSection === item.id 
                    ? 'text-paper bg-ink font-semibold shadow-xs' 
                    : 'text-ink-soft hover:text-ink hover:bg-paper-deep/60'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile LinkedIn Link */}
            {personalInfo.linkedin && (
              <a
                id="mobile-nav-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-2.5 px-4 border border-rule bg-paper hover:bg-paper-deep/60 rounded-full text-sm font-sans font-medium text-ink mt-2 transition-colors min-h-[44px] shadow-xs active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-brass" />
                  <span>Connect on LinkedIn</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-ink-soft" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

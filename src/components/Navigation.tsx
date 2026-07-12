import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Writings' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen 
          ? 'bg-paper/95 backdrop-blur-md py-4' 
          : 'bg-paper/86 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 flex items-center justify-between gap-[34px] w-full">
        {/* Left Side: Brand Link (Hidden per request) */}
        <div />

        <div className="flex items-center gap-[34px]">
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-[34px]">
            {navItems.map((item) => (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-wide relative pb-0.5 transition-all cursor-pointer font-sans ${
                  activeSection === item.id 
                    ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-brass' 
                    : 'text-ink-soft hover:text-ink after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] hover:after:w-full after:bg-brass after:transition-all after:duration-250'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Button CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick('contact')}
              className="nav-cta text-[13.5px] font-mono border border-ink text-ink px-4 py-2 rounded-[2px] tracking-wide hover:bg-ink hover:text-paper transition-all duration-200 cursor-pointer"
            >
              Get in touch
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-rule/50 hover:border-ink text-ink-soft hover:text-ink transition-colors cursor-pointer rounded-[2px]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-b border-rule bg-paper transition-all duration-200"
        >
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left w-full py-2.5 font-sans text-sm font-semibold tracking-wide cursor-pointer ${
                  activeSection === item.id 
                    ? 'text-ink border-l-2 border-ink pl-3 bg-paper-deep/50' 
                    : 'text-ink-soft pl-3 hover:text-ink hover:bg-paper-deep/30 transition-all'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-rule flex flex-col">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full text-center text-xs font-mono border border-ink text-ink py-3 rounded-[2px] uppercase tracking-widest hover:bg-ink hover:text-paper transition-all"
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


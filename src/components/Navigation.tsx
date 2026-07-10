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
          ? 'bg-[#F7F4EC]/95 backdrop-blur-md border-b border-rule py-4' 
          : 'bg-[#F7F4EC]/86 backdrop-blur-md border-b border-rule/50 py-5'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Branding with Custom Circular Seal */}
        <button
          onClick={() => handleNavClick('about')}
          className="mark flex items-center gap-3 font-mono font-medium text-sm tracking-wide text-ink cursor-pointer bg-transparent border-none p-0"
        >
          <span className="seal w-8 h-8 rounded-full border border-brass flex items-center justify-center font-serif text-[13px] text-brass font-semibold overflow-hidden">
            {personalInfo.avatar ? (
              <img 
                src={personalInfo.avatar} 
                alt="" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              'RG'
            )}
          </span>
          <span className="hover:text-brass transition-colors font-semibold">{personalInfo.name}</span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-[34px]">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm tracking-wide relative pb-0.5 transition-all cursor-pointer font-sans ${
                activeSection === item.id 
                  ? 'text-brass font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:height-[1px] after:bg-brass' 
                  : 'text-ink-soft hover:text-ink after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[1px] hover:after:w-full after:bg-brass after:transition-all after:duration-200'
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

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-b border-rule bg-[#F7F4EC] transition-all duration-200"
        >
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left w-full py-2.5 font-sans text-sm font-semibold tracking-wide cursor-pointer ${
                  activeSection === item.id 
                    ? 'text-brass border-l-2 border-brass pl-3' 
                    : 'text-ink-soft pl-3'
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


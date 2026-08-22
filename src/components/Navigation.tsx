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
      setScrolled(window.scrollY > 40);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Reading Room' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen 
          ? 'bg-paper/95 backdrop-blur-md py-4 border-b border-rule shadow-xs' 
          : 'bg-paper/80 backdrop-blur-md py-6'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 flex items-center justify-between gap-6 w-full">
        
        {/* Left Side: Brand Link */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => handleNavClick('about')}
        >
          <div className="w-8 h-8 rounded-full border border-ink/40 bg-paper flex items-center justify-center font-serif text-xs font-bold text-ink group-hover:border-brass group-hover:text-brass transition-colors shadow-xs">
            RG
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[18px] sm:text-[20px] font-bold tracking-tight text-ink leading-tight group-hover:text-brass transition-colors">
              Rahul Goyal
            </span>
          </div>
        </div>

        {/* Right Side: Nav Links & CTA */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[13.5px] tracking-wide relative pb-1 transition-all cursor-pointer font-sans ${
                  activeSection === item.id 
                    ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-brass' 
                    : 'text-ink-soft hover:text-ink after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] hover:after:w-full after:bg-brass after:transition-all after:duration-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Get in touch CTA */}
          <div className="hidden md:block">
            <button
              id="get-in-touch-btn"
              onClick={() => handleNavClick('contact')}
              className="text-xs font-mono border border-ink bg-ink text-paper px-4 py-2 hover:bg-paper hover:text-ink transition-all duration-200 cursor-pointer rounded-[2px] tracking-wider uppercase font-semibold"
            >
              Get in Touch
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-rule hover:border-ink text-ink-soft hover:text-ink transition-colors cursor-pointer rounded-[2px] bg-paper"
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
          <div className="px-6 py-4 space-y-3 flex flex-col">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left w-full py-2 font-sans text-sm font-semibold tracking-wide cursor-pointer rounded-[2px] transition-all ${
                  activeSection === item.id 
                    ? 'text-ink border-l-2 border-brass pl-2 bg-paper-deep/50' 
                    : 'text-ink-soft pl-2 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              id="mobile-get-in-touch-btn"
              onClick={() => handleNavClick('contact')}
              className="w-full text-center font-mono text-xs border border-ink bg-ink text-paper py-2.5 hover:bg-paper hover:text-ink transition-all duration-200 cursor-pointer rounded-[2px] tracking-wider uppercase font-semibold mt-2"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

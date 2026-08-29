import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import { usePortfolio } from './context/PortfolioContext';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const { personalInfo } = usePortfolio();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Set up Scroll Spy to highlight Navigation links based on scrolled sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 160; // Offset for navbar

      setShowScrollTop(window.scrollY > 400);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="root-layout" className="min-h-screen flex flex-col bg-paper selection:bg-brass selection:text-paper text-ink relative overflow-x-hidden">
      {/* Floating Navigation Menu */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Page Layout */}
      <main id="main-content" className="flex-1">
        {/* Editorial Hero & Bio Section */}
        <Hero
          onContactClick={() => scrollToSection('contact')}
          onPortfolioClick={() => scrollToSection('portfolio')}
        />

        {/* Reading Room / Publications & Research Section */}
        <Portfolio />

        {/* Minimalist Contact Section */}
        <Contact />
      </main>

      {/* Minimalist Footer */}
      <footer id="main-footer" className="bg-paper-deep text-ink-soft py-12 sm:py-16 px-4 xs:px-6 sm:px-8 border-t border-rule print:hidden relative z-10">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
          
          {/* Brand section */}
          <div className="flex flex-col items-start space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-ink/30 bg-paper-deep overflow-hidden flex items-center justify-center font-serif text-[10px] font-bold text-ink flex-shrink-0">
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
              <span className="font-serif text-base font-bold text-ink">
                {personalInfo.name}
              </span>
            </div>
            <p className="font-mono text-xs text-brass max-w-sm">
              {personalInfo.title} • {personalInfo.location}
            </p>
            <p className="font-sans text-xs text-ink-soft">
              "Making the complex, comprehensible."
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs text-ink-soft">
            <button onClick={() => scrollToSection('about')} className="hover:text-ink cursor-pointer transition-colors py-1">About</button>
            <button onClick={() => scrollToSection('portfolio')} className="hover:text-ink cursor-pointer transition-colors py-1">Reading Room</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-ink cursor-pointer transition-colors py-1">Contact</button>
          </div>

          {/* Copyright notice */}
          <div className="font-mono text-xs text-ink-soft/80 flex flex-col md:items-end">
            <span>© {new Date().getFullYear()} Rahul Goyal. All rights reserved.</span>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center bg-paper border border-ink/30 hover:border-ink text-ink shadow-md hover:shadow-lg rounded-[2px] transition-all duration-200 cursor-pointer group active:scale-95"
          title="Return to top of page"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Customizer / Editor Drawer */}
      <Customizer />
    </div>
  );
}

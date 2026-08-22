import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import ThreeDBackground from './components/ThreeDBackground';
import EntranceCurtain from './components/EntranceCurtain';
import { usePortfolio } from './context/PortfolioContext';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const { personalInfo } = usePortfolio();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Set up Scroll Spy to highlight Navigation links based on scrolled sections
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 140; // Offset for navbar

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

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
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
      {/* Entrance curtain animation */}
      <EntranceCurtain />

      {/* Interactive colorful animated lines background */}
      <ThreeDBackground />

      {/* Floating Navigation Menu */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Intro Section */}
        <Hero
          onContactClick={() => scrollToSection('contact')}
          onPortfolioClick={() => scrollToSection('portfolio')}
        />

        {/* Reading Room / Writing Section */}
        <Portfolio />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Minimalist Footer */}
      <footer id="main-footer" className="bg-paper-deep/80 text-ink-soft py-16 px-6 sm:px-8 border-t border-rule print:hidden relative z-10">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          
          {/* Brand section */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full border border-ink/40 flex items-center justify-center font-serif text-[13px] text-ink font-semibold overflow-hidden bg-paper shadow-xs">
              {personalInfo.avatar ? (
                <img 
                  src={personalInfo.avatar && !personalInfo.avatar.startsWith('data:') ? `${personalInfo.avatar}${personalInfo.avatar.includes('?') ? '&' : '?'}v=${Date.now()}` : personalInfo.avatar} 
                  alt={personalInfo.name} 
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/api/avatar.jpg')) {
                      img.src = '/api/avatar.jpg';
                    }
                  }}
                />
              ) : (
                'RG'
              )}
            </span>
            <div>
              <span className="font-serif text-base font-bold text-ink block">{personalInfo.name}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-ink-soft">
            <button onClick={() => scrollToSection('about')} className="hover:text-ink cursor-pointer">About</button>
            <button onClick={() => scrollToSection('portfolio')} className="hover:text-ink cursor-pointer">Reading Room</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-ink cursor-pointer">Contact</button>
          </div>

          {/* Copyright */}
          <div className="font-mono text-xs text-ink-soft tracking-wider md:text-right">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>
          
        </div>
      </footer>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-paper text-ink rounded-[2px] border border-rule hover:border-ink hover:text-ink shadow-sm transition-all duration-300 cursor-pointer z-40"
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

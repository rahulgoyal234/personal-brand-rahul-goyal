import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import ThreeDBackground from './components/ThreeDBackground';
import CursorRing from './components/CursorRing';
import { usePortfolio } from './context/PortfolioContext';
import { Linkedin, Mail, ChevronUp } from 'lucide-react';

export default function App() {
  const { personalInfo, setIsEditorOpen } = usePortfolio();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Set up Scroll Spy to highlight Navigation links based on scrolled sections
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['about', 'portfolio', 'contact'];
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div id="root-layout" className="min-h-screen flex flex-col bg-paper selection:bg-brass selection:text-paper text-ink relative overflow-x-hidden">
      {/* 3D Constellation Lattice Background */}
      <ThreeDBackground />

      {/* Custom interactive cursor ring */}
      <CursorRing />

      {/* Premium Floating Navigation Menu */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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

        {/* Fully Interactive Contact Details */}
        <Contact />
      </main>

      {/* Footer Design Matching Your HTML Template */}
      <footer id="main-footer" className="bg-paper-deep text-ink-soft py-16 px-6 sm:px-8 border-t border-rule print:hidden">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          
          {/* Brand section */}
          <div>
            <div className="mark flex items-center gap-3 font-mono font-medium text-sm tracking-wide text-ink">
              <span className="seal w-8 h-8 rounded-full border border-ink flex items-center justify-center font-serif text-[13px] text-ink font-semibold overflow-hidden bg-paper">
                {personalInfo.avatar ? (
                  <img 
                    src={personalInfo.avatar} 
                    alt="" 
                    className="w-full h-full object-cover object-[54%_center]"
                    style={{ objectPosition: '54% center' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  'RG'
                )}
              </span>
              <span className="font-semibold">{personalInfo.name}</span>
            </div>
            <p className="mt-3 text-ink-soft text-[13.5px] max-w-[280px] font-sans leading-relaxed">
              Corporate, IP & Tech Policy Lawyer. Turning complex regulation into clear moves.
            </p>
          </div>

          {/* Copyright section */}
          <div className="font-mono text-xs text-ink-soft tracking-wider md:text-right">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>
          
        </div>
      </footer>

      {/* Floating Scroll to Top trigger */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-paper text-ink rounded-[2px] border border-rule hover:border-ink hover:text-ink shadow-none transition-all duration-300 cursor-pointer z-40"
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

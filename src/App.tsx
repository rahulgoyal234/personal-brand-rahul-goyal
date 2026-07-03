import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import CursorRing from './components/CursorRing';
import { usePortfolio } from './context/PortfolioContext';
import { Linkedin, Mail, ChevronUp, Sliders } from 'lucide-react';

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
    <div id="root-layout" className="min-h-screen flex flex-col selection:bg-brand-900 selection:text-white">
      {/* Custom Cursor Ring follower */}
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

      {/* Footer Design */}
      <footer id="main-footer" className="bg-[#fcfcfc] text-neutral-500 py-16 px-6 md:px-12 border-t border-neutral-200/60 print:hidden">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
            
            {/* Brand column */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="font-display text-base font-bold tracking-tight text-neutral-900 block">
                  {personalInfo.name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block">
                  {personalInfo.title}
                </span>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-neutral-200 text-neutral-400 hover:text-black hover:border-black transition-all duration-300 rounded-none bg-white hover:scale-105"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="p-2 border border-neutral-200 text-neutral-400 hover:text-black hover:border-black transition-all duration-300 rounded-none bg-white hover:scale-105"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-2"></div>

            {/* Quick Links Column */}
            <div className="md:col-span-4 space-y-4 md:text-right">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold block">
                Navigation
              </span>
              <div className="flex flex-col md:items-end gap-2.5 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-black transition-colors cursor-pointer text-left md:text-right w-fit"
                >
                  About
                </button>
                <button
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-black transition-colors cursor-pointer text-left md:text-right w-fit"
                >
                  Writings
                </button>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-black transition-colors cursor-pointer text-left md:text-right w-fit"
                >
                  Get In Touch
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Row: Copyright */}
          <div className="border-t border-neutral-200/60 pt-8 text-[9px] font-mono text-neutral-400 uppercase tracking-widest text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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

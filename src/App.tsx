import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Customizer from './components/Customizer';
import ArticleView from './components/ArticleView';
import { usePortfolio } from './context/PortfolioContext';
import { Project } from './types';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const { personalInfo, projects } = usePortfolio();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Helper to extract article ID from current URL (query params or hash)
  const getArticleIdFromUrl = (): string | null => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryArticle = searchParams.get('article') || searchParams.get('blog') || searchParams.get('post') || searchParams.get('id');
      if (queryArticle) return queryArticle;

      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('article/')) {
        return hash.replace('article/', '');
      }
      if (hash.startsWith('read/')) {
        return hash.replace('read/', '');
      }
      // Check if hash exactly matches a project id
      const matchesProject = projects.some((p) => p.id === hash);
      if (matchesProject) return hash;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Sync URL on initial mount and on popstate/hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      const articleId = getArticleIdFromUrl();
      setActiveArticleId(articleId);
    };

    // Run on initial mount
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [projects]);

  // Set up Scroll Spy when in homepage mode
  useEffect(() => {
    if (activeArticleId) return;

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
  }, [activeArticleId]);

  const handleSelectArticle = (article: Project) => {
    setActiveArticleId(article.id);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('article', article.id);
    window.history.pushState({ articleId: article.id }, '', newUrl.toString());
  };

  const handleBackToHome = () => {
    setActiveArticleId(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('article');
    newUrl.searchParams.delete('blog');
    newUrl.searchParams.delete('post');
    newUrl.searchParams.delete('id');
    window.history.pushState({}, '', newUrl.pathname + newUrl.search);
    
    // Scroll smoothly to portfolio section
    setTimeout(() => {
      const el = document.getElementById('portfolio');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id: string) => {
    if (activeArticleId) {
      handleBackToHome();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Find currently active article if any
  const currentArticle = activeArticleId
    ? projects.find((p) => p.id === activeArticleId)
    : null;

  return (
    <div id="root-layout" className="min-h-screen flex flex-col bg-paper selection:bg-brass selection:text-paper text-ink relative overflow-x-hidden">
      
      {/* If an article is open via URL or selection, render the dedicated Article View */}
      {currentArticle ? (
        <ArticleView
          article={currentArticle}
          onBack={handleBackToHome}
          onSelectArticle={handleSelectArticle}
        />
      ) : (
        <>
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
            <Portfolio onSelectArticle={handleSelectArticle} />

            {/* Minimalist Contact Section */}
            <Contact />
          </main>
        </>
      )}

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
      {showScrollTop && !currentArticle && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-paper border border-rule hover:border-ink text-ink shadow-md hover:shadow-lg rounded-full transition-all duration-200 cursor-pointer group active:scale-95 hover:bg-paper-deep/60"
          title="Return to top of page"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 text-brass group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Customizer / Editor Drawer */}
      <Customizer />
    </div>
  );
}


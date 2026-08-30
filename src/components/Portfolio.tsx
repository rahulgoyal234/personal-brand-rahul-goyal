import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, X, ExternalLink, BookOpen, Clock, Calendar, Check, Share2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import Card3D from './Card3D';

export default function Portfolio() {
  const { projects, personalInfo } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeArticle, setActiveArticle] = useState<Project | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when search bar opens & listen for '/' shortcut
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && !activeArticle && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        if (activeArticle) setActiveArticle(null);
        else if (isSearchOpen) setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, activeArticle]);

  // Lock body scroll when reading modal is open
  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeArticle]);

  // Compute unique categories dynamically from active projects
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map((p) => p.category)))];

  // Reset selected category if it no longer exists
  const currentCategory = categories.includes(selectedCategory) ? selectedCategory : 'All';

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = currentCategory === 'All' || project.category === currentCategory;
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.content && project.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (!activeArticle) return;
    if (navigator.share) {
      navigator.share({
        title: activeArticle.title,
        text: activeArticle.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-28 bg-transparent relative scroll-mt-20 border-t border-rule/50">
      <div className="max-w-[1120px] mx-auto px-4 xs:px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 text-left">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-[42px] font-semibold text-ink leading-tight">
              Reading Room
            </h2>
            <p className="text-ink-soft text-xs xs:text-sm sm:text-base font-sans max-w-xl">
              Research publications, commentary, and legal analyses.
            </p>
          </div>

          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            
            {/* Search Trigger Button */}
            {!isSearchOpen ? (
              <button
                id="open-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="font-sans text-xs sm:text-[13px] font-medium text-ink-soft hover:text-ink border border-rule hover:border-ink bg-paper px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-200 flex items-center justify-between sm:justify-start gap-2 cursor-pointer shadow-xs hover:bg-paper-deep/50 active:scale-95 select-none"
                title="Press / to search"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-brass" />
                  <span>Search</span>
                </div>
                <kbd className="hidden sm:inline-block font-sans text-[11px] font-semibold bg-paper-deep px-1.5 py-0.5 rounded-full border border-rule/80 text-ink-soft">
                  /
                </kbd>
              </button>
            ) : (
              <div className="relative flex items-center w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-brass absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, topics, keywords..."
                  className="w-full pl-8.5 pr-7 py-1.5 sm:py-2 font-sans text-xs sm:text-[13px] bg-paper border border-ink rounded-full focus:outline-none focus:ring-1 focus:ring-brass text-ink shadow-xs"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 text-ink-soft hover:text-ink p-1 cursor-pointer rounded-full hover:bg-paper-deep"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-sans text-xs sm:text-[12.5px] font-medium px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                    currentCategory === category
                      ? 'border border-ink bg-ink text-paper shadow-xs font-semibold'
                      : 'border border-rule text-ink-soft bg-paper hover:border-ink hover:text-ink hover:bg-paper-deep/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between font-mono text-xs text-ink-soft pb-2 border-b border-rule">
            <span>
              Found {filteredProjects.length} results matching "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-brass hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Publications List */}
        {filteredProjects.length === 0 ? (
          <div className="py-12 sm:py-16 text-center border border-dashed border-rule rounded-[2px] bg-paper-deep/30 space-y-2 px-4">
            <p className="font-serif text-base sm:text-lg text-ink">No publications found.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="font-mono text-xs uppercase tracking-wider text-brass font-bold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {filteredProjects.map((project, index) => (
              <Card3D
                key={project.id}
                intensity={4}
                depth={8}
                glareOpacity={0.06}
                className="bg-paper border border-rule hover:border-ink/40 transition-all duration-300 rounded-[2px] p-5 xs:p-6 sm:p-7 shadow-xs text-left group/card"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-6">
                  
                  {/* Left Column: Index, Category & Date */}
                  <div className="flex items-center md:flex-col md:items-start justify-between w-full md:w-auto md:min-w-[130px] gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-brass font-bold">
                      0{index + 1}
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-paper-deep border border-rule/80 text-ink font-semibold rounded-[2px]">
                        {project.category}
                      </span>
                      {project.date && (
                        <span className="font-mono text-[10px] text-ink-soft hidden md:inline-block">
                          {project.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Column: Title, Description, Tags */}
                  <div className="flex-1 space-y-2.5 sm:space-y-3 w-full">
                    <button
                      id={`project-title-btn-${project.id}`}
                      onClick={() => {
                        if (project.content || !project.demoUrl) {
                          setActiveArticle(project);
                        } else {
                          window.open(project.demoUrl, '_blank');
                        }
                      }}
                      className="group/title inline-block text-left cursor-pointer"
                    >
                      <h3 className="font-serif text-[17px] xs:text-lg sm:text-[21px] font-semibold leading-snug text-ink group-hover/title:text-brass transition-colors">
                        {project.title}
                      </h3>
                    </button>

                    <p className="text-ink-soft text-[13.5px] sm:text-sm leading-relaxed font-sans max-w-[740px]">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] sm:text-[10.5px] px-2 py-0.5 bg-paper-deep text-ink-soft border border-rule/60 rounded-[2px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions (Read Piece / External Access) */}
                  <div className="flex items-center gap-2 self-start sm:self-end md:self-center pt-2 sm:pt-0">
                    {/* Read On-Site / Full Analysis Button */}
                    <button
                      id={`project-read-btn-${project.id}`}
                      onClick={() => setActiveArticle(project)}
                      className="font-sans text-xs sm:text-[12.5px] text-ink bg-paper hover:bg-paper-deep/80 border border-ink/40 hover:border-ink px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 font-medium cursor-pointer shadow-xs active:scale-95 select-none"
                      title="Read complete commentary and analysis"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-brass" />
                      <span>Read</span>
                    </button>

                    {/* External Link if present */}
                    {project.demoUrl && (
                      <a
                        id={`project-link-${project.id}`}
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-sans text-xs sm:text-[12.5px] text-ink-soft hover:text-ink bg-paper-deep/40 hover:bg-paper-deep border border-rule hover:border-ink/50 px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 font-medium cursor-pointer shadow-2xs active:scale-95 select-none"
                        title="Access external publication"
                      >
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3 text-brass" />
                      </a>
                    )}
                  </div>

                </div>
              </Card3D>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* Editorial Reading Modal (Full Essay / Commentary Viewer) */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div
          id="article-reading-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-ink/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-paper border border-rule rounded-[3px] shadow-2xl overflow-y-auto flex flex-col text-left my-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md border-b border-rule/80 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brass font-bold">
                <span>{activeArticle.category}</span>
                {activeArticle.date && (
                  <>
                    <span className="text-ink-soft">•</span>
                    <span className="text-ink-soft font-normal">{activeArticle.date}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 text-ink-soft hover:text-ink rounded-full hover:bg-paper-deep transition-colors cursor-pointer"
                  title="Share or copy link"
                  aria-label="Share article"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-brass" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 text-ink-soft hover:text-ink rounded-full hover:bg-paper-deep transition-colors cursor-pointer"
                  aria-label="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Article Content */}
            <div className="px-5 sm:px-10 py-6 sm:py-8 space-y-6">
              
              {/* Headline & Byline */}
              <div className="space-y-4 border-b border-rule/60 pb-6">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-bold text-ink leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-ink-soft pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-paper-deep border border-rule overflow-hidden flex items-center justify-center font-serif text-[9px] font-bold">
                      {personalInfo.avatar ? (
                        <img
                          src={personalInfo.avatar}
                          alt={personalInfo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        'RG'
                      )}
                    </div>
                    <span className="font-medium text-ink">{personalInfo.name}</span>
                    <span>•</span>
                    <span>{personalInfo.title}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brass" />
                      3 min read
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Essay Text */}
              <div className="prose prose-neutral max-w-none text-ink text-[15px] sm:text-base leading-relaxed space-y-4 font-sans">
                {activeArticle.content ? (
                  activeArticle.content.split('\n\n').map((paragraph, pIdx) => {
                    const cleanP = paragraph.trim();
                    if (!cleanP) return null;

                    // Section headings
                    if (cleanP.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="font-serif text-lg sm:text-xl font-bold text-ink pt-3 pb-1 border-b border-rule/40">
                          {cleanP.replace('### ', '')}
                        </h3>
                      );
                    }

                    // Bold callout quote if it's the core thesis statement
                    if (cleanP.startsWith('I don\'t think one year fixes this') || cleanP.startsWith('Entry-level judiciary should be open')) {
                      return (
                        <div key={pIdx} className="my-5 p-4 sm:p-5 bg-paper-deep/60 border-l-2 border-brass rounded-r-[2px] font-serif text-[16.5px] sm:text-[17.5px] text-ink leading-relaxed italic">
                          "{cleanP}"
                        </div>
                      );
                    }

                    return (
                      <p key={pIdx} className="text-ink/90 leading-[1.75]">
                        {cleanP}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-ink/90 leading-[1.75]">
                    {activeArticle.longDescription || activeArticle.description}
                  </p>
                )}
              </div>

              {/* Key Takeaways & Highlights */}
              {activeArticle.highlights && activeArticle.highlights.length > 0 && (
                <div className="mt-8 p-5 sm:p-6 bg-paper-deep/50 border border-rule rounded-[2px] space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-brass font-bold flex items-center gap-1.5">
                    <span>Key Legal Takeaways</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-[13px] text-ink-soft">
                    {activeArticle.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-brass mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags & Footer Action */}
              <div className="pt-6 border-t border-rule/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags?.map((tag) => (
                    <span key={tag} className="font-mono text-[10.5px] px-2 py-0.5 bg-paper-deep text-ink-soft border border-rule/60 rounded-[2px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                {activeArticle.demoUrl && (
                  <a
                    href={activeArticle.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs font-semibold px-4 py-2 bg-ink text-paper hover:bg-brass rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Read on External Publisher</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}


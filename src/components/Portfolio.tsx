import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, X, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Card3D from './Card3D';

export default function Portfolio() {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when search bar opens & listen for '/' shortcut
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

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
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-transparent relative scroll-mt-20 border-t border-rule/50">
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-semibold text-ink leading-tight">
              Reading Room
            </h2>
            <p className="text-ink-soft text-sm sm:text-base font-sans max-w-xl">
              Research publications, commentary, and legal analyses.
            </p>
          </div>

          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            
            {/* Search Trigger Button */}
            {!isSearchOpen ? (
              <button
                id="open-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="font-mono text-xs text-ink-soft hover:text-ink border border-rule hover:border-ink bg-paper px-3 py-1.5 rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer"
                title="Press / to search"
              >
                <Search className="w-3.5 h-3.5 text-brass" />
                <span>Search</span>
                <kbd className="hidden sm:inline-block font-mono text-[10px] bg-paper-deep px-1.5 py-0.5 rounded-[2px] border border-rule/80 text-ink-soft">
                  /
                </kbd>
              </button>
            ) : (
              <div className="relative flex items-center w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-brass absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, tags..."
                  className="w-full pl-8 pr-7 py-1.5 font-mono text-xs bg-paper border border-ink rounded-[2px] focus:outline-none focus:ring-1 focus:ring-brass text-ink"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 text-ink-soft hover:text-ink p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                    currentCategory === category
                      ? 'border-ink bg-ink text-paper shadow-xs'
                      : 'border-rule text-ink-soft bg-paper hover:border-ink hover:text-ink'
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
          <div className="py-16 text-center border border-dashed border-rule rounded-[2px] bg-paper-deep/30 space-y-2">
            <p className="font-serif text-lg text-ink">No publications found.</p>
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
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <Card3D
                key={project.id}
                intensity={4}
                depth={8}
                glareOpacity={0.06}
                className="bg-paper border border-rule hover:border-ink/40 transition-all duration-300 rounded-[2px] p-6 sm:p-7 shadow-xs text-left"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  
                  {/* Left Column: Index & Category */}
                  <div className="flex items-center md:flex-col md:items-start justify-between w-full md:w-auto md:min-w-[120px] gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-brass font-bold">
                      0{index + 1}
                    </span>
                    
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-paper-deep border border-rule/80 text-ink font-semibold rounded-[2px]">
                      {project.category}
                    </span>
                  </div>

                  {/* Center Column: Title, Description, Tags */}
                  <div className="flex-1 space-y-3">
                    <a
                      id={`project-title-link-${project.id}`}
                      href={project.demoUrl || '#'}
                      target={project.demoUrl ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="group/title inline-block"
                    >
                      <h3 className="font-serif text-lg sm:text-[21px] font-semibold leading-snug text-ink group-hover/title:text-brass transition-colors">
                        {project.title}
                      </h3>
                    </a>

                    <p className="text-ink-soft text-sm leading-relaxed font-sans max-w-[720px]">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10.5px] px-2 py-0.5 bg-paper-deep text-ink-soft border border-rule/60 rounded-[2px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Direct Link Action */}
                  {project.demoUrl && (
                    <div className="flex items-center self-end md:self-center">
                      <a
                        id={`project-link-${project.id}`}
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] text-ink-soft hover:text-ink bg-paper hover:bg-paper-deep border border-rule px-3 py-1.5 rounded-[2px] transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5 font-semibold cursor-pointer"
                      >
                        <span>Access</span>
                        <ExternalLink className="w-3 h-3 text-brass" />
                      </a>
                    </div>
                  )}

                </div>
              </Card3D>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

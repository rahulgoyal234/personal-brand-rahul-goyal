import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, X, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Card3D from './Card3D';

export default function Portfolio() {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when search bar opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Compute unique categories dynamically from active projects
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map((p) => p.category)))];

  // Reset selected category if it no longer exists
  const currentCategory = categories.includes(selectedCategory) ? selectedCategory : 'All';

  // Categorize & Search filter items
  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  const filteredProjects = projects.filter((project) => {
    const categoryMatches = currentCategory === 'All' || project.category === currentCategory;
    if (!categoryMatches) return false;

    if (!normalizedQuery) return true;

    const inTitle = project.title.toLowerCase().includes(normalizedQuery);
    const inDesc = project.description.toLowerCase().includes(normalizedQuery);
    const inCategory = project.category.toLowerCase().includes(normalizedQuery);
    const inTags = project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    const inLongDesc = (project.longDescription || '').toLowerCase().includes(normalizedQuery);

    return inTitle || inDesc || inCategory || inTags || inLongDesc;
  });

  const toggleAbstract = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-paper-deep/40 backdrop-blur-[6px] border-t border-b border-rule scroll-mt-20 relative">
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-semibold text-ink leading-tight">
              Reading Room
            </h2>
            <p className="text-ink-soft text-sm sm:text-[15.5px] leading-relaxed max-w-[520px] font-sans">
              Peer-reviewed comparative research papers, trademark analyses, constitutional studies, and national legal commentary.
            </p>
          </div>

          {/* Controls: Search Button & Category Filters */}
          <div className="flex flex-col items-start lg:items-end gap-3.5 w-full lg:w-auto">
            
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Search Toggle / Input Button */}
              {!isSearchOpen ? (
                <button
                  id="blogs-search-toggle-btn"
                  onClick={() => setIsSearchOpen(true)}
                  className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 border border-rule hover:border-ink text-ink-soft hover:text-ink bg-paper rounded-full transition-all duration-200 font-semibold cursor-pointer flex items-center gap-2 group shadow-xs"
                  title="Search reading room"
                >
                  <Search className="w-3.5 h-3.5 text-brass group-hover:text-ink transition-colors" />
                  <span>Search</span>
                </button>
              ) : (
                <div className="relative flex items-center w-full sm:w-[280px]">
                  <Search className="w-4 h-4 text-brass absolute left-3 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    id="blogs-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, topics, keywords..."
                    className="w-full font-sans text-xs sm:text-sm pl-9 pr-8 py-1.5 bg-paper border border-ink text-ink placeholder:text-ink-soft/60 rounded-full focus:outline-none focus:ring-1 focus:ring-brass shadow-xs transition-all"
                  />
                  {searchQuery ? (
                    <button
                      id="blogs-search-clear-btn"
                      onClick={clearSearch}
                      className="absolute right-2.5 text-ink-soft hover:text-ink p-1 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      id="blogs-search-close-btn"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-2.5 text-ink-soft hover:text-ink p-1 cursor-pointer"
                      title="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    id={`portfolio-tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 border rounded-full transition-all duration-200 font-semibold cursor-pointer ${
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
        </div>

        {/* Active Search Filter Badge */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between bg-paper border border-rule/80 px-4 py-2 rounded-[2px]">
            <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
              <Search className="w-3.5 h-3.5 text-brass" />
              <span>
                Showing {filteredProjects.length} results for &ldquo;<span className="text-ink font-semibold">{searchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              id="clear-active-search-badge"
              onClick={clearSearch}
              className="font-mono text-[11px] uppercase tracking-wider text-brass hover:text-ink underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Empty Search Results State */}
        {filteredProjects.length === 0 && (
          <div className="py-16 text-center bg-paper border border-dashed border-rule/80 rounded-[2px] my-6 px-6">
            <h3 className="font-serif text-lg font-semibold text-ink mb-1">
              No entries found
            </h3>
            <p className="text-ink-soft text-sm font-sans max-w-md mx-auto mb-4">
              We couldn&apos;t find any publications matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              id="empty-clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="font-mono text-xs text-paper bg-ink hover:bg-paper hover:text-ink border border-ink px-4 py-2 rounded-[2px] transition-all font-semibold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Writings List */}
        {filteredProjects.length > 0 && (
          <div
            id="projects-list"
            className="flex flex-col divide-y divide-rule/70 border-t border-b border-rule/70"
          >
            {filteredProjects.map((project) => {
              const isExpanded = !!expandedAbstracts[project.id];
              
              return (
                <Card3D
                  id={`project-list-row-${project.id}`}
                  key={project.id}
                  intensity={6}
                  depth={12}
                  glareOpacity={0.12}
                  className="group py-6 sm:py-7 px-4 sm:px-6 my-2 rounded-[2px] transition-colors duration-200 hover:bg-paper/80 border border-transparent hover:border-rule/80 hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-10">
                    
                    {/* Left Category Column */}
                    <div className="flex items-center md:flex-col md:items-start gap-2 min-w-[140px]">
                      <span className="font-mono text-[10.5px] text-ink uppercase tracking-wider font-bold bg-paper px-2.5 py-0.5 border border-rule rounded-[2px]">
                        {project.category}
                      </span>
                    </div>

                    {/* Center Content Column */}
                    <div className="flex-1 space-y-3.5">
                      {project.demoUrl ? (
                        <a
                          id={`project-title-link-${project.id}`}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/title inline-block text-left"
                        >
                          <h3 className="font-serif text-lg sm:text-[22px] font-semibold leading-snug text-ink group-hover/title:text-brass transition-colors flex items-start gap-2">
                            <span>{project.title}</span>
                            <ExternalLink className="w-4 h-4 text-ink-soft/40 group-hover/title:text-brass flex-shrink-0 mt-1 transition-colors" />
                          </h3>
                        </a>
                      ) : (
                        <h3 className="font-serif text-lg sm:text-[22px] font-semibold leading-snug text-ink">
                          {project.title}
                        </h3>
                      )}

                      <p className="text-ink-soft text-sm sm:text-[14.5px] leading-relaxed font-sans max-w-[740px]">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-paper text-ink-soft border border-rule/70 text-[9px] font-mono px-2.5 py-0.5 uppercase rounded-[2px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Collapsible Abstract Section */}
                      {isExpanded && (
                        <div 
                          className="mt-6 p-5 bg-paper border border-rule rounded-[2px] text-sm text-ink-soft leading-relaxed font-sans space-y-4 shadow-sm"
                        >
                          <div>
                            <strong className="text-[11px] font-mono uppercase tracking-wider text-ink font-bold block mb-1.5">
                              Abstract & Details
                            </strong>
                            <p className="text-[14px] leading-relaxed whitespace-pre-line text-ink-soft">
                              {project.longDescription || project.description}
                            </p>
                          </div>

                          {project.highlights && project.highlights.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-rule/30">
                              <strong className="block text-[11px] font-mono uppercase tracking-wider text-ink font-bold">
                                Key Highlights
                              </strong>
                              <ul className="space-y-1.5">
                                {project.highlights.map((highlight, index) => (
                                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-ink-soft">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brass flex-shrink-0 mt-1.5" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Actions Column */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto md:min-w-[130px]">
                      {project.demoUrl && (
                        <a
                          id={`project-direct-link-${project.id}`}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-paper bg-ink hover:bg-paper hover:text-ink border border-ink px-4 py-2 rounded-[2px] transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold cursor-pointer w-fit md:w-full"
                        >
                          <span>Read Full</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        id={`project-toggle-abstract-${project.id}`}
                        onClick={(e) => toggleAbstract(project.id, e)}
                        className="font-mono text-[11px] text-ink-soft hover:text-ink flex items-center gap-1 cursor-pointer bg-transparent border-none p-1 font-semibold transition-colors uppercase tracking-wider"
                      >
                        <span>{isExpanded ? 'Hide Abstract' : 'View Abstract'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-ink' : ''}`} />
                      </button>
                    </div>

                  </div>
                </Card3D>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

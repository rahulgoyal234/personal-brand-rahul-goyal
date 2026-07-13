import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Portfolio() {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

  // Compute unique categories dynamically from active projects
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map((p) => p.category)))];

  // Reset selected category if it no longer exists
  const currentCategory = categories.includes(selectedCategory) ? selectedCategory : 'All';

  // Categorize or filter items
  const filteredProjects = projects.filter((project) => {
    if (currentCategory === 'All') return true;
    return project.category === currentCategory;
  });

  const toggleAbstract = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="portfolio" className="py-28 bg-paper-deep/50 backdrop-blur-[6px] border-t border-rule border-b border-rule scroll-mt-20 relative">
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8">
        
        {/* Writings Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-3">
            <h2 className="font-serif text-[38px] font-semibold text-ink leading-tight">
              Writings
            </h2>
            <p className="text-ink-soft text-sm sm:text-[15px] leading-relaxed max-w-[480px]">
              A carefully curated selection of peer-reviewed research papers, active policy articles, and academic columns.
            </p>
          </div>

          {/* IBM Plex Mono Style Category Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
            {categories.map((category) => (
              <button
                id={`portfolio-tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 border rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                  currentCategory === category
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-ink-soft bg-transparent hover:border-ink hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Writings List (Academic & Typography-focused format) */}
        <div
          id="projects-list"
          className="flex flex-col divide-y divide-rule/60 border-t border-b border-rule/60"
        >
          {filteredProjects.map((project) => {
            const year = project.stats?.find(s => s.label && s.label.toLowerCase().includes('year'))?.value || '2023';
            const isExpanded = !!expandedAbstracts[project.id];
            
            return (
              <div
                id={`project-list-row-${project.id}`}
                key={project.id}
                className="group py-8 transition-colors duration-200 hover:bg-paper/20"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-10">
                  
                  {/* Left Metadata Column (Category & Year) */}
                  <div className="flex items-center md:flex-col md:items-start gap-2 md:gap-1 min-w-[150px]">
                    <span className="font-mono text-[11px] text-ink uppercase tracking-wider font-bold">
                      {project.category}
                    </span>
                    <span className="hidden md:inline-block font-mono text-[10.5px] text-ink-soft font-medium">
                      — Year: {year}
                    </span>
                    <span className="md:hidden font-mono text-[11px] text-ink-soft font-medium">
                      • {year}
                    </span>
                  </div>

                  {/* Center Content Column (Title, Description, Collapsible Abstract, Tags) */}
                  <div className="flex-1 space-y-4">
                    {project.demoUrl ? (
                      <a
                        id={`project-title-link-${project.id}`}
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group/title inline-block text-left"
                      >
                        <h3 className="font-serif text-lg sm:text-[21px] font-semibold leading-snug text-ink group-hover/title:text-ink group-hover/title:underline transition-all flex items-start gap-1.5">
                          <span>{project.title}</span>
                        </h3>
                      </a>
                    ) : (
                      <h3 className="font-serif text-lg sm:text-[21px] font-semibold leading-snug text-ink">
                        {project.title}
                      </h3>
                    )}

                    <p className="text-ink-soft text-sm sm:text-[14.5px] leading-relaxed font-sans max-w-[720px]">
                      {project.description}
                    </p>

                    {/* Subject Matter Tags */}
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

                    {/* Collapsible Full Abstract Section */}
                    {isExpanded && (
                      <div 
                        className="mt-6 p-5 sm:p-6 bg-paper border border-rule/70 rounded-[2px] text-sm text-ink-soft leading-relaxed font-sans space-y-4 overflow-hidden"
                      >
                        <div className="space-y-1.5">
                          <strong className="block text-[11px] font-mono uppercase tracking-wider text-ink font-bold border-b border-rule/30 pb-1.5">
                            Abstract & Overview
                          </strong>
                          <p className="text-[14px] leading-relaxed whitespace-pre-line text-ink-soft pt-1">
                            {project.longDescription || project.description}
                          </p>
                        </div>

                        {project.highlights && project.highlights.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <strong className="block text-[11px] font-mono uppercase tracking-wider text-ink font-bold border-b border-rule/30 pb-1.5">
                              Key Research Highlights
                            </strong>
                            <ul className="space-y-2 pt-1">
                              {project.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3 text-xs sm:text-[13px] text-ink-soft">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-ink/40 flex items-center justify-center text-[9px] font-mono text-ink font-bold mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span className="leading-relaxed font-sans">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.stats && project.stats.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                            {project.stats.map((stat, sIdx) => (
                              <div key={stat?.label || sIdx} className="bg-paper-deep border border-rule/60 p-3 rounded-[2px]">
                                <span className="block text-ink font-sans text-xs sm:text-sm font-semibold">
                                  {stat?.value || ''}
                                </span>
                                <span className="block text-ink-soft text-[9px] font-mono uppercase tracking-wider mt-0.5">
                                  {stat?.label || ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Actions Column (Direct Link CTA + Inline Toggle) */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 w-full md:w-auto md:min-w-[150px]">
                    {project.demoUrl && (
                      <a
                        id={`project-direct-link-${project.id}`}
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] text-paper bg-ink hover:bg-paper hover:text-ink border border-ink px-4 py-2.5 rounded-[2px] transition-all duration-200 uppercase tracking-wider flex items-center justify-center font-bold cursor-pointer w-fit md:w-full hover:-translate-y-[1px] hover:shadow-md"
                      >
                        <span>Full Text</span>
                      </a>
                    )}

                    <button
                      id={`project-toggle-abstract-${project.id}`}
                      onClick={(e) => toggleAbstract(project.id, e)}
                      className="font-mono text-[11px] text-ink-soft hover:text-ink hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-1 font-semibold transition-colors uppercase tracking-wider"
                    >
                      <span>{isExpanded ? 'Hide' : 'Abstract'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-ink' : ''}`} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


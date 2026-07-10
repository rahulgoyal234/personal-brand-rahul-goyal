import React, { useState } from 'react';
import { ExternalLink, ChevronRight, X, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

export default function Portfolio() {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Compute unique categories dynamically from active projects
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map((p) => p.category)))];

  // Reset selected category if it no longer exists
  const currentCategory = categories.includes(selectedCategory) ? selectedCategory : 'All';

  // Categorize or filter items
  const filteredProjects = projects.filter((project) => {
    if (currentCategory === 'All') return true;
    return project.category === currentCategory;
  });

  return (
    <section id="portfolio" className="py-28 bg-paper-deep border-t border-rule border-b border-rule scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8">
        
        {/* Writings Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-3">
            <div className="eyebrow font-mono text-[12.5px] tracking-[0.14em] uppercase text-brass flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-brass font-bold">
              Publications — Research
            </div>
            <h2 className="font-serif text-[38px] font-semibold text-ink leading-tight">
              Selected Writings
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
                    ? 'border-brass bg-brass text-paper'
                    : 'border-rule text-ink-soft bg-transparent hover:border-brass hover:text-brass'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Writings Cards Grid (Typography-first literary layout) */}
        <div
          id="projects-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project) => (
            <article
              id={`project-card-${project.id}`}
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group flex flex-col justify-between h-full bg-paper border border-rule/70 p-8 rounded-[2px] transition-all duration-300 hover:border-brass hover:-translate-y-0.5 shadow-none cursor-pointer"
            >
              <div>
                {/* Meta details with Year & Category */}
                <div className="writing-meta flex justify-between items-center font-mono text-[11px] text-brass font-bold">
                  <span className="writing-tag uppercase tracking-wider">{project.category}</span>
                  {/* Pull year from metadata, fallback to 2023 */}
                  <span>{project.stats?.find(s => s.label.toLowerCase().includes('year'))?.value || '2023'}</span>
                </div>

                {/* Title */}
                <h3 className="writing-title font-serif text-[21px] font-semibold leading-[1.35] text-ink mt-[18px] group-hover:text-brass transition-colors">
                  {project.title}
                </h3>

                {/* Short Description */}
                <p className="writing-desc text-[14.5px] text-ink-soft leading-relaxed mt-3.5 font-sans">
                  {project.description}
                </p>
              </div>

              {/* Card Footer with inline CTA */}
              <div className="writing-footer mt-6 pt-4 border-t border-rule/10 flex items-center justify-between">
                <button
                  id={`project-details-btn-${project.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className="font-mono text-[12px] text-ink font-semibold flex items-center gap-1.5 group-hover:text-brass transition-colors uppercase tracking-wider cursor-pointer bg-transparent border-none p-0"
                >
                  <span>Read abstract</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {project.demoUrl && (
                  <a
                    id={`project-demo-link-${project.id}`}
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[11px] text-brass hover:text-ink transition-colors uppercase tracking-widest flex items-center gap-1 font-semibold"
                    title="Read full publication"
                  >
                    <span>Full Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* TYPOGRAPHICAL CASE STUDY DETAIL MODAL */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            id="modal-overlay"
            onClick={() => setActiveProject(null)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-xs"
          />

          <div
            id="project-detail-modal"
            className="relative bg-paper border border-brass/30 w-full max-w-2xl max-h-[85vh] rounded-[2px] overflow-y-auto shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-paper/95 backdrop-blur-md px-6 py-4.5 border-b border-rule flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-brass border border-brass px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                  {activeProject.category}
                </span>
                <span className="text-[10px] font-mono text-ink-soft uppercase tracking-widest">/ abstract</span>
              </div>
              
              <button
                id="close-modal-btn"
                onClick={() => setActiveProject(null)}
                className="p-1.5 border border-rule hover:border-ink text-ink-soft hover:text-ink transition-all cursor-pointer rounded-[2px]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-ink">
                  {activeProject.title}
                </h3>
                <p className="text-xs font-mono text-brass font-semibold">
                  Published: {activeProject.stats?.find(s => s.label.toLowerCase().includes('publisher'))?.value || 'Official Legal Portal'}
                </p>
              </div>

              {/* Abstract */}
              <div className="space-y-3">
                <h4 className="text-[11.5px] font-mono uppercase tracking-[0.2em] font-bold text-ink border-b border-rule/40 pb-2">
                  Abstract & Overview
                </h4>
                <p className="text-ink-soft text-sm sm:text-[14.5px] leading-relaxed font-sans whitespace-pre-line">
                  {activeProject.longDescription || activeProject.description}
                </p>
              </div>

              {/* Key Research Highlights */}
              <div className="space-y-3">
                <h4 className="text-[11.5px] font-mono uppercase tracking-[0.2em] font-bold text-ink border-b border-rule/40 pb-2">
                  Key Research Contributions
                </h4>
                <ul className="grid grid-cols-1 gap-3.5">
                  {activeProject.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs sm:text-[13px] text-ink-soft">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full border border-brass/40 flex items-center justify-center text-[9px] font-mono text-brass font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed font-sans">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata details block */}
              {activeProject.stats && activeProject.stats.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11.5px] font-mono uppercase tracking-[0.2em] font-bold text-ink border-b border-rule/40 pb-2">
                    Citation & Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeProject.stats.map((stat) => (
                      <div key={stat.label} className="bg-paper-deep border border-rule/60 p-3 rounded-[2px]">
                        <span className="block text-ink font-sans text-sm font-semibold">
                          {stat.value}
                        </span>
                        <span className="block text-brass-soft text-[9px] font-mono uppercase tracking-wider mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Domains */}
              <div className="space-y-2">
                <span className="block text-[9.5px] font-mono text-ink-soft uppercase tracking-wider">Subject Matter Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-paper-deep text-ink-soft border border-rule/60 text-[9px] font-mono px-2.5 py-0.5 uppercase rounded-[2px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {activeProject.demoUrl && (
                <div className="pt-4 border-t border-rule/30">
                  <a
                    id="modal-action-demo"
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-ink hover:bg-brass text-paper hover:text-white rounded-[2px] font-mono text-[12.5px] uppercase tracking-wider transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Read Full Publication Online</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


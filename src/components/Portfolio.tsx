import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, ArrowRight, X, ChevronRight, BarChart2, Star, Zap } from 'lucide-react';
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
    <section id="portfolio" className="py-20 md:py-28 border-t border-brand-200 bg-[#fcfcfc] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0 pb-8 border-b border-neutral-100">
          <div className="space-y-3">
            <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-neutral-900">
              <span className="italic font-serif font-light">Writings</span>
            </h2>
            <p className="text-neutral-500 max-w-sm font-light text-xs sm:text-sm leading-relaxed">
              A carefully curated selection of peer-reviewed research papers, active policy articles, and academic columns.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 md:pt-0">
            {categories.map((category) => (
              <button
                id={`portfolio-tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`pb-1 text-[11px] uppercase tracking-[0.2em] font-bold border-b-2 transition-all cursor-pointer ${
                  currentCategory === category
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-400 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          id="projects-grid"
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                id={`project-card-${project.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="group flex flex-col h-full bg-[#fcfcfc] border border-neutral-200/60 rounded-none overflow-hidden hover:border-black transition-all duration-300"
              >
                {/* Visual Thumbnail */}
                <div className="relative overflow-hidden aspect-video bg-neutral-100 cursor-pointer" onClick={() => setActiveProject(project)}>
                  <img
                    id={`project-img-${project.id}`}
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-102 transition-all duration-500"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-white/95 px-2 py-0.5 border border-black text-[9px] font-mono font-semibold tracking-wider text-black uppercase">
                    {project.category}
                  </span>
                </div>

                {/* Info block */}
                <div className="flex flex-col flex-1 p-6 sm:p-8 space-y-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-sans text-lg font-normal tracking-tight text-brand-900 flex items-center justify-between">
                      <span>{project.title}</span>
                      <button
                        onClick={() => setActiveProject(project)}
                        className="text-neutral-400 hover:text-black transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </h3>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tag List */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral-100 text-neutral-600 border border-neutral-200 text-[9px] font-mono font-medium px-2 py-0.5 rounded-none uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[9px] font-mono font-medium text-neutral-400 px-1 py-0.5">
                        +{project.tags.length - 4} MORE
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <button
                      id={`project-details-btn-${project.id}`}
                      onClick={() => setActiveProject(project)}
                      className="text-[10px] font-mono font-bold text-neutral-800 hover:text-black hover:underline flex items-center space-x-1 uppercase tracking-wider cursor-pointer"
                    >
                      <span>Read Writing Abstract</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center space-x-3 text-neutral-400">
                      {project.githubUrl && (
                        <a
                          id={`project-github-link-${project.id}`}
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-black transition-colors cursor-pointer"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          id={`project-demo-link-${project.id}`}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-black transition-colors cursor-pointer"
                          title="Launch Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CASE STUDY DETAIL MODAL */}
      <AnimatePresence>
          {activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay background */}
              <motion.div
                id="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveProject(null)}
                className="absolute inset-0 bg-black"
              />

              {/* Modal window */}
              <motion.div
                id="project-detail-modal"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative bg-[#fcfcfc] border border-neutral-300 w-full max-w-3xl max-h-[85vh] rounded-none overflow-y-auto shadow-none z-10 flex flex-col"
              >
                {/* Header controls */}
                <div className="sticky top-0 bg-[#fcfcfc]/95 backdrop-blur-md px-6 py-4 border-b border-neutral-200 flex items-center justify-between z-20">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-black border border-black px-2 py-0.5 rounded-none uppercase">
                      {activeProject.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">/ case study</span>
                  </div>
                  <button
                    id="close-modal-btn"
                    onClick={() => setActiveProject(null)}
                    className="p-1 border border-neutral-200 text-neutral-500 hover:text-black hover:border-black transition-all cursor-pointer rounded-none"
                    aria-label="Close Case Study"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Hero aspect of Modal */}
                <div className="relative aspect-video w-full bg-neutral-200 border-b border-neutral-200">
                  <img
                    id="modal-project-img"
                    src={activeProject.image}
                    alt={activeProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-sans text-2xl sm:text-3xl font-extralight tracking-tight mb-1">
                      {activeProject.title}
                    </h3>
                    <p className="text-xs text-neutral-200 max-w-xl font-light">
                      {activeProject.description}
                    </p>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Detailed Description */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                      Abstract & Overview
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed font-light">
                      {activeProject.longDescription}
                    </p>
                  </div>

                  {/* Highlights section */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                      Key Research Findings & Contributions
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {activeProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-3 text-xs text-neutral-600">
                          <span className="flex-shrink-0 w-5 h-5 border border-neutral-300 flex items-center justify-center text-[9px] font-mono text-neutral-800 font-bold mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed font-light">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Metrics/Stats */}
                  {activeProject.stats && activeProject.stats.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                        Writing Details
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {activeProject.stats.map((stat) => (
                          <div key={stat.label} className="bg-[#f5f5f5] border border-neutral-200 p-4 text-center rounded-none">
                            <span className="block text-neutral-900 font-sans text-lg font-light">
                              {stat.value}
                            </span>
                            <span className="block text-neutral-400 text-[8px] font-mono uppercase tracking-widest mt-0.5">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies utilized list */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-900">
                      Subject Matter Domains
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[9px] font-mono px-2.5 py-1 uppercase rounded-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions line inside Modal */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                    {activeProject.demoUrl && (
                      <a
                        id="modal-action-demo"
                        href={activeProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-black hover:bg-neutral-800 text-white rounded-none font-bold text-[11px] uppercase tracking-wider transition-colors text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Read Online</span>
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a
                        id="modal-action-github"
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black rounded-none font-bold text-[11px] uppercase tracking-wider transition-colors text-center"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Inspect Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    );
  }

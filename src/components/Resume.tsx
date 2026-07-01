import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Calendar, MapPin, Briefcase, Award, Plus, Minus, Printer, ExternalLink, GraduationCap, CheckCircle, ShieldCheck } from 'lucide-react';
import { EXPERIENCES, EDUCATION, SKILL_GROUPS, PERSONAL_INFO, ACHIEVEMENTS, CERTIFICATIONS } from '../data/portfolio';

export default function Resume() {
  const [expandedWork, setExpandedWork] = useState<string[]>([EXPERIENCES[0].id]); // First experience expanded by default
  const [viewType, setViewType] = useState<'interactive' | 'ats'>('interactive');
  const [downloading, setDownloading] = useState(false);

  const toggleExpand = (id: string) => {
    if (expandedWork.includes(id)) {
      setExpandedWork(expandedWork.filter((x) => x !== id));
    } else {
      setExpandedWork([...expandedWork, id]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const simulateDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Create a simulated PDF download of the resume
      const element = document.createElement('a');
      const file = new Blob([
        `RESUME - ${PERSONAL_INFO.name.toUpperCase()}\n` +
        `${PERSONAL_INFO.title}\n` +
        `Email: ${PERSONAL_INFO.email} | Location: ${PERSONAL_INFO.location}\n` +
        `GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}\n\n` +
        `=========================================\n` +
        `WORK EXPERIENCE\n` +
        `=========================================\n` +
        EXPERIENCES.map(exp => 
          `${exp.role} at ${exp.company} (${exp.period}) | ${exp.location}\n` +
          `${exp.description}\n` +
          exp.bullets.map(b => `  - ${b}`).join('\n') + `\n` +
          `Technologies: ${exp.tags.join(', ')}\n`
        ).join('\n') +
        `\n=========================================\n` +
        `EDUCATION\n` +
        `=========================================\n` +
        EDUCATION.map(edu =>
          `${edu.degree} - ${edu.school} (${edu.period})\n` +
          `${edu.details || ''}\n`
        ).join('\n') +
        `\n=========================================\n` +
        `SKILLS\n` +
        `=========================================\n` +
        SKILL_GROUPS.map(g => `${g.category}: ${g.skills.join(', ')}`).join('\n') +
        `\n=========================================\n` +
        `CERTIFICATIONS\n` +
        `=========================================\n` +
        CERTIFICATIONS.map(c => `  - ${c}`).join('\n') + `\n` +
        `\n=========================================\n` +
        `ACHIEVEMENTS\n` +
        `=========================================\n` +
        ACHIEVEMENTS.map(a => `  - ${a}`).join('\n')
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${PERSONAL_INFO.name.toLowerCase().replace(/\s+/g, '_')}_resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <section id="resume" className="py-20 md:py-28 border-t border-brand-200 bg-[#fcfcfc] print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto px-6 print:px-0">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0 print:hidden pb-8 border-b border-neutral-100">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold block">
              Qualifications & background
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-neutral-900">
              Interactive <span className="italic font-serif font-light">resume</span>
            </h2>
            <p className="text-neutral-500 max-w-md font-light text-xs sm:text-sm leading-relaxed">
              Explore my structured professional experience, academic background, and specialized technical skill sets.
            </p>
          </div>

          {/* Control Toggles */}
          <div className="flex items-center space-x-3">
            <div className="bg-neutral-100 border border-neutral-200 p-1 rounded-none flex">
              <button
                id="resume-toggle-interactive"
                onClick={() => setViewType('interactive')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer rounded-none ${
                  viewType === 'interactive' ? 'bg-white text-black shadow-none border border-neutral-200' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Interactive
              </button>
              <button
                id="resume-toggle-ats"
                onClick={() => setViewType('ats')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer rounded-none ${
                  viewType === 'ats' ? 'bg-white text-black shadow-none border border-neutral-200' : 'text-neutral-500 hover:text-black'
                }`}
              >
                ATS Friendly
              </button>
            </div>

            <button
              id="resume-btn-print"
              onClick={handlePrint}
              className="p-2 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors cursor-pointer rounded-none bg-white"
              title="Print Resume"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              id="resume-btn-download"
              onClick={simulateDownload}
              disabled={downloading}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-black text-white rounded-none font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ATS WRAPPER VIEW (STANDARD MINIMAL PAPER SHEET STYLE) */}
        {viewType === 'ats' ? (
          <div id="resume-sheet-ats" className="bg-white border border-neutral-200 rounded-none p-8 sm:p-12 shadow-none font-sans text-brand-800 space-y-8 select-text">
            {/* Header info */}
            <div className="text-center space-y-2 border-b border-neutral-100 pb-6">
              <h3 className="font-sans text-2xl font-light tracking-tight text-neutral-900 uppercase">{PERSONAL_INFO.name}</h3>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">{PERSONAL_INFO.title}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                <span>{PERSONAL_INFO.location}</span>
                <span>•</span>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">{PERSONAL_INFO.email}</a>
                <span>•</span>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                <span>•</span>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              </div>
            </div>

            {/* Profile Brief */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Professional Summary</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">{PERSONAL_INFO.bio}</p>
            </div>

            {/* Work History */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Professional Experience</h4>
              <div className="space-y-6">
                {EXPERIENCES.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex items-start justify-between text-xs">
                      <div>
                        <strong className="text-neutral-900 font-semibold">{exp.role}</strong>
                        <span className="text-neutral-400 font-light"> | {exp.company}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{exp.period}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 italic">{exp.description}</p>
                    <ul className="list-disc list-inside text-xs text-neutral-600 space-y-1 pl-2">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="font-light leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                    <div className="pt-1">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Core Tech: </span>
                      <span className="text-xs font-mono text-neutral-600">{exp.tags.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education ATS */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Education</h4>
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div>
                    <strong className="text-neutral-900 font-semibold">{edu.school}</strong>
                    <div className="text-[11px] text-neutral-500 font-light">{edu.degree}</div>
                    {edu.details && <p className="text-[11px] text-neutral-400 mt-0.5">{edu.details}</p>}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{edu.period}</span>
                </div>
              ))}
            </div>

            {/* Skills ATS */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Skills Inventory</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {SKILL_GROUPS.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <strong className="text-neutral-900 font-semibold block">{group.category}</strong>
                    <span className="text-neutral-600 font-light block leading-relaxed">{group.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications ATS */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Certifications & Training</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 font-light">
                {CERTIFICATIONS.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>

            {/* Achievements ATS */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-200 pb-1">Key Achievements & Engagements</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 font-light">
                {ACHIEVEMENTS.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* INTERACTIVE RICH GRAPHIC TIMELINE VIEW */
          <div id="resume-interactive-view" className="space-y-12">
            
            {/* Timeline Experience Block */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                <span>Professional Experience</span>
              </h3>

              <div className="relative border-l border-neutral-200 ml-4 pl-6 space-y-8">
                {EXPERIENCES.map((exp, index) => {
                  const isExpanded = expandedWork.includes(exp.id);
                  return (
                    <div key={exp.id} className="relative">
                      {/* Timeline square marker */}
                      <span className={`absolute -left-[31px] top-1.5 w-3 h-3 bg-white border transition-all duration-300 ${
                        isExpanded ? 'border-black bg-black' : 'border-neutral-300'
                      }`}></span>

                      {/* Experience Item Card */}
                      <div className="bg-white border border-neutral-200 rounded-none p-6 hover:border-black transition-colors">
                        <div
                          id={`exp-header-${exp.id}`}
                          onClick={() => toggleExpand(exp.id)}
                          className="flex items-start justify-between cursor-pointer"
                        >
                          <div className="space-y-2">
                            <h4 className="font-sans text-base font-normal tracking-tight text-neutral-900 flex flex-wrap items-center gap-x-2">
                              <span>{exp.role}</span>
                              <span className="text-[9px] font-mono font-bold text-black border border-black px-2 py-0.5 rounded-none uppercase">
                                @ {exp.company}
                              </span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{exp.period}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{exp.location}</span>
                              </span>
                            </div>
                          </div>

                          <button
                            id={`exp-expand-btn-${exp.id}`}
                            className="p-1 text-neutral-400 hover:text-black transition-colors"
                            aria-label={isExpanded ? 'Collapse experience' : 'Expand experience'}
                          >
                            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Expandable Core detail bullets list */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              id={`exp-content-${exp.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 mt-4 border-t border-neutral-100 space-y-4">
                                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                                  {exp.description}
                                </p>
                                <ul className="space-y-2 text-xs text-neutral-600">
                                  {exp.bullets.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                      <span className="flex-shrink-0 w-1 h-1 bg-black mt-2"></span>
                                      <span className="leading-relaxed font-light">{bullet}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Technologies labels list */}
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {exp.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="bg-neutral-100 text-neutral-600 border border-neutral-200 text-[9px] font-mono px-2 py-0.5 rounded-none uppercase"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Education Block */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-neutral-400" />
                <span>Education</span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-none p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="font-sans text-base font-normal tracking-tight text-neutral-900">{edu.school}</h4>
                      <p className="text-xs text-neutral-500 font-light">{edu.degree}</p>
                      {edu.details && (
                        <p className="text-[10px] text-neutral-400 italic mt-1 font-mono uppercase tracking-wider">{edu.details}</p>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end text-[10px] text-neutral-400 font-mono gap-4 sm:gap-1 uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{edu.period}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Skills Grid Block */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-neutral-400" />
                <span>Skills & Toolkits</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.category} className="bg-white border border-neutral-200 rounded-none p-6 flex flex-col space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-800 border-b border-neutral-100 pb-2">
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 text-[10px] font-mono px-2.5 py-1 rounded-none transition-colors cursor-default uppercase"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Certifications Block */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
                <span>Certifications & Specialized Training</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-none p-5 flex items-start space-x-3 hover:border-black transition-colors">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-neutral-700 font-light leading-relaxed">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Achievements Block */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-neutral-400" />
                <span>Honors, Competitions & Engagements</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {ACHIEVEMENTS.map((ach, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-none p-4 flex items-start space-x-3 hover:border-black transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 border border-neutral-200 flex items-center justify-center text-[10px] font-mono text-neutral-500 font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-neutral-700 font-light leading-relaxed pt-0.5">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { Play, X, GraduationCap, ChevronDown, ChevronUp, Linkedin, ArrowUpRight, BookOpen, Mail, User } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import Card3D from './Card3D';

interface HeroProps {
  onContactClick: () => void;
  onPortfolioClick: () => void;
}

export default function Hero({ onContactClick, onPortfolioClick }: HeroProps) {
  const { personalInfo } = usePortfolio();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());
  const [imgSrc, setImgSrc] = useState(personalInfo?.avatar || '');
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setAvatarLoadError(false);
    setAvatarVersion(Date.now());
    setImgSrc(personalInfo?.avatar || '');
  }, [personalInfo?.avatar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderFormattedHeading = (text: string) => {
    const defaultText = "Making the complex, comprehensible.";
    let targetText = text || defaultText;
    
    if (!targetText || targetText.trim().toLowerCase() === 'rahul goyal') {
      targetText = "Making the complex, comprehensible.";
    }
    
    const words = targetText.trim().split(/\s+/);
    
    return (
      <span className="inline-block">
        {words.map((word, idx) => {
          const isLast = idx === words.length - 1;
          return (
            <React.Fragment key={idx}>
              <span
                className={`lex-word ${isRevealed ? 'in' : ''} ${isLast ? 'italic font-serif font-normal text-brass' : ''}`}
                style={{ transitionDelay: `${250 + idx * 70}ms` }}
              >
                {word}
              </span>
              {idx < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  return (
    <section
      id="about"
      className="relative min-h-[70vh] md:min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-24 overflow-hidden bg-transparent scroll-mt-20"
    >
      <div className="max-w-[1120px] mx-auto px-4 xs:px-6 sm:px-8 w-full relative z-10">
        
        {/* Top Row: Info (Left) & Profile Photo (Right) - Stacked on Mobile, Side-by-Side on Tablet/Desktop */}
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 w-full">
          
          {/* Left Column: Heading, Gold Rule, and Bio */}
          <div className="flex-1 min-w-0 flex flex-col items-start text-left relative z-10 w-full">
            
            <h1
              id="hero-heading"
              className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[52px] font-semibold leading-[1.18] sm:leading-[1.14] text-ink tracking-tight break-words"
            >
              {renderFormattedHeading(personalInfo.shortBio)}
            </h1>

            {/* Expanding Gold Gradient Rule Line */}
            <div className={`lex-gold-rule my-4 sm:my-5 md:my-6 ${isRevealed ? 'in' : ''}`} />

            <div
              id="hero-bio"
              className={`lex-sub text-ink-soft text-[14.5px] xs:text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed max-w-[700px] font-sans space-y-3 sm:space-y-3.5 ${isRevealed ? 'in' : ''}`}
            >
              {(personalInfo.bio || '').split('\n').map((para, i) => {
                if (!para.trim()) return null;
                return (
                  <p key={i}>
                    {para}
                  </p>
                );
              })}
            </div>

          </div>

            {/* Right Column: Profile Photo Container */}
          <div
            id="hero-portrait-container"
            className="flex-shrink-0 flex justify-center md:justify-end w-full md:w-auto pt-2 sm:pt-4 relative"
          >
            <div className="portrait-wrap relative flex flex-col items-center">
              
              {/* Open Profile photo container with balanced stage width so badges never overlap the portrait */}
              <div 
                className="relative cursor-default z-10 flex items-end justify-center w-[290px] xs:w-[320px] sm:w-[360px] md:w-[400px] px-2 pb-0 pt-2"
              >
                {/* Soft ambient aura backdrop */}
                <div className="absolute inset-x-8 bottom-0 top-6 bg-gradient-to-t from-paper-deep/60 via-transparent to-transparent -z-10 rounded-[8px] blur-sm opacity-80" />

                {personalInfo.avatar ? (
                  <img
                    id="hero-portrait-img"
                    src={(imgSrc || '').startsWith('data:') ? imgSrc : `${imgSrc}${imgSrc.includes('?') ? '&' : '?'}v=${avatarVersion}`}
                    alt={personalInfo.name}
                    referrerPolicy="no-referrer"
                    onLoad={() => setAvatarLoadError(false)}
                    onError={() => {
                      setAvatarLoadError(true);
                      if (imgSrc !== '/rahul_transparent.png') {
                        setImgSrc('/rahul_transparent.png');
                      }
                    }}
                    className="w-auto h-auto max-w-[160px] xs:max-w-[185px] sm:max-w-[225px] md:max-w-[255px] max-h-[255px] xs:max-h-[295px] sm:max-h-[350px] md:max-h-[390px] object-contain object-bottom drop-shadow-md select-none pointer-events-none relative z-10 mx-auto block"
                  />
                ) : (
                  <div className="w-[180px] h-[240px] flex flex-col items-center justify-center p-3 text-center text-ink-soft bg-paper-deep rounded-[4px]">
                    <span className="font-mono text-[9px] sm:text-xs">Rahul Goyal</span>
                  </div>
                )}

                {/* Floating Pill Capsule Badge on Left Flank (Clear of body silhouette) */}
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-2 xs:bottom-3 sm:bottom-4 md:bottom-6 left-0 xs:left-1 sm:left-2 md:left-3 z-20 flex items-center p-1 bg-paper/95 backdrop-blur-md border border-rule/90 hover:border-ink/50 rounded-full shadow-md hover:shadow-lg transition-all pointer-events-auto"
                >
                  {personalInfo.linkedin && (
                    <a
                      id="floating-portrait-linkedin"
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 bg-ink text-paper hover:bg-brass transition-colors rounded-full flex items-center justify-center cursor-pointer shadow-xs group"
                      title="Connect on LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  <button
                    id="floating-portrait-reading-room"
                    onClick={onPortfolioClick}
                    className="p-1.5 sm:p-2 text-ink-soft hover:text-ink hover:bg-paper-deep rounded-full transition-colors cursor-pointer"
                    title="Go to Reading Room"
                  >
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    id="floating-portrait-contact"
                    onClick={onContactClick}
                    className="p-1.5 sm:p-2 text-ink-soft hover:text-ink hover:bg-paper-deep rounded-full transition-colors cursor-pointer"
                    title="Contact Rahul"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </motion.div>

                {/* Floating Moving Education Badge on Right Flank (Clear of head silhouette) */}
                <motion.div
                  animate={{ 
                    y: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-2 xs:top-3 sm:top-6 md:top-8 right-0 xs:right-1 sm:right-2 md:right-3 z-30 flex flex-col items-end pointer-events-auto"
                >
                  <button
                    id="floating-portrait-education"
                    onClick={() => setIsEducationOpen(!isEducationOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-paper/95 backdrop-blur-md border border-rule/90 hover:border-ink/50 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer font-sans text-xs font-medium text-ink hover:text-brass select-none group"
                    title="Click to view Education"
                  >
                    <span className="p-1 bg-paper-deep border border-rule rounded-full flex items-center justify-center text-brass group-hover:bg-brass group-hover:text-paper transition-colors">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </span>
                    <span>Education</span>
                    {isEducationOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-ink-soft/70" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-ink-soft/70" />
                    )}
                  </button>

                  {/* Expandable Floating Education Card */}
                  <AnimatePresence>
                    {isEducationOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 6 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 w-[260px] max-w-[calc(100vw-2.5rem)] p-3.5 bg-paper/98 backdrop-blur-lg border border-rule/90 rounded-[4px] shadow-xl text-left space-y-3 z-40"
                      >
                        <div className="flex items-center justify-between border-b border-rule/60 pb-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-brass font-bold">Academic Background</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                        </div>

                        {/* Bennett University */}
                        <div className="space-y-0.5">
                          <p className="font-sans text-[11px] font-bold text-ink leading-tight">
                            Bennett University
                          </p>
                          <p className="font-mono text-[9px] text-ink-soft uppercase tracking-wide">
                            Greater Noida, India
                          </p>
                          <p className="font-mono text-[9.5px] text-brass font-semibold mt-0.5">
                            Master of Laws - LL.M.
                          </p>
                          <p className="text-[10px] text-ink-soft/90 font-sans italic">
                            Corporate & Commercial Law
                          </p>
                        </div>

                        <div className="w-full h-[1px] bg-rule/50" />

                        {/* KIIT School of Law */}
                        <div className="space-y-0.5">
                          <p className="font-sans text-[11px] font-bold text-ink leading-tight">
                            KIIT School of Law
                          </p>
                          <p className="font-mono text-[9px] text-ink-soft uppercase tracking-wide">
                            Bhubaneswar, India
                          </p>
                          <p className="font-mono text-[9.5px] text-brass font-semibold mt-0.5">
                            B.A. LL.B. (Hons.)
                          </p>
                          <p className="text-[10px] text-ink-soft/90 font-sans italic">
                            Law & Legal Studies
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Cool Signature Typography Caption */}
              <div 
                id="portrait-signature-caption"
                className="portrait-caption mt-1.5 sm:mt-2 text-center px-2 max-w-full leading-normal z-10 relative flex flex-col items-center select-none"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-paper/95 backdrop-blur-md border border-rule/90 hover:border-ink/40 rounded-full shadow-2xs transition-all duration-300 group">
                  <span className="font-['Cinzel',serif] text-[12.5px] xs:text-[13.5px] sm:text-[14.5px] font-bold tracking-[0.16em] text-ink uppercase group-hover:text-brass transition-colors">
                    Rahul Goyal
                  </span>
                  <span className="text-brass/70 font-serif italic text-sm font-light">,</span>
                  <span className="font-['Cormorant_Garamond',serif] italic font-bold text-[14px] xs:text-[15px] sm:text-[16px] tracking-[0.08em] text-brass">
                    Lawyer
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Action Buttons (Pill & Moving Pattern) */}
        <div id="hero-actions" className={`lex-cta ${isRevealed ? 'in' : ''} flex flex-wrap items-center gap-2 xs:gap-2.5 sm:gap-3 w-full`}>
          
          <button
            id="hero-cta-about"
            onClick={() => {
              const element = document.getElementById('about');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial min-w-[95px] justify-center font-sans text-xs sm:text-[13px] font-medium px-4 py-2 sm:py-2.5 border border-rule bg-paper text-ink-soft hover:text-ink hover:border-ink hover:bg-paper-deep/60 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-95 select-none"
          >
            <User className="w-3.5 h-3.5 text-brass" />
            <span>About</span>
          </button>

          <button
            id="hero-cta-portfolio"
            onClick={onPortfolioClick}
            className="flex-1 sm:flex-initial min-w-[135px] justify-center font-sans text-xs sm:text-[13px] font-medium px-4.5 sm:px-5 py-2 sm:py-2.5 border border-ink bg-ink text-paper hover:bg-ink/90 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-95 select-none"
          >
            <BookOpen className="w-3.5 h-3.5 text-brass-soft" />
            <span>Reading Room</span>
          </button>

          <button
            id="hero-cta-contact"
            onClick={onContactClick}
            className="flex-1 sm:flex-initial min-w-[95px] justify-center font-sans text-xs sm:text-[13px] font-medium px-4 py-2 sm:py-2.5 border border-rule bg-paper hover:border-ink hover:text-ink hover:bg-paper-deep/60 text-ink-soft rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-95 select-none"
          >
            <Mail className="w-3.5 h-3.5 text-brass" />
            <span>Contact</span>
          </button>

          {personalInfo.linkedin && (
            <a
              id="hero-cta-linkedin"
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial min-w-[105px] justify-center font-sans text-xs sm:text-[13px] font-medium px-4 py-2 sm:py-2.5 border border-rule hover:border-brass/60 bg-paper hover:bg-paper-deep/60 text-ink rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 group active:scale-95 select-none"
            >
              <Linkedin className="w-3.5 h-3.5 text-brass" />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-ink-soft/70 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}

          {personalInfo.introVideo && (
            <button
              id="hero-cta-video"
              onClick={() => setIsVideoModalOpen(true)}
              className="flex-1 sm:flex-initial min-w-[115px] justify-center font-sans text-xs sm:text-[13px] font-medium px-4 py-2 sm:py-2.5 border border-rule bg-paper text-ink hover:border-ink hover:bg-paper-deep/60 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-95 select-none"
            >
              <Play className="w-3.5 h-3.5 fill-current text-brass translate-x-0.5" />
              <span>Intro Video</span>
            </button>
          )}
        </div>

      </div>

      {/* Video Modal */}
      {isVideoModalOpen && personalInfo.introVideo && (
        <div id="video-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
          />
          
          <div className="relative w-full max-w-4xl bg-paper border border-rule shadow-2xl overflow-hidden z-10 rounded-[2px]">
            <div className="absolute top-4 right-4 z-20">
              <button
                id="close-video-modal-btn"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 bg-paper/90 hover:bg-ink text-ink hover:text-paper border border-rule transition-colors cursor-pointer rounded-full shadow-xs active:scale-95"
                title="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full flex items-center justify-center bg-black">
              {personalInfo.introVideo.includes('youtube.com') || personalInfo.introVideo.includes('youtu.be') ? (
                <iframe
                  src={personalInfo.introVideo.replace('watch?v=', 'embed/')}
                  title="Intro Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={personalInfo.introVideo}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

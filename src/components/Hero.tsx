import React, { useState, useEffect } from 'react';
import { Play, X, GraduationCap, ChevronDown, ChevronUp, Box } from 'lucide-react';
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
                className={`lex-word ${isRevealed ? 'in' : ''} ${isLast ? 'italic font-serif font-normal' : ''}`}
                style={{ transitionDelay: `${400 + idx * 90}ms` }}
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
      className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-transparent scroll-mt-20"
    >
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 w-full relative z-10">
        
        {/* Top Row: Info (Left) & Profile Photo (Right) */}
        <div className="flex flex-row items-start justify-between gap-4 sm:gap-8 lg:gap-12 mb-8 w-full">
          
          {/* Left Column: Heading, Gold Rule, and Bio */}
          <div className="flex-1 min-w-0 flex flex-col items-start text-left relative z-10">
            
            <h1
              id="hero-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.1] text-ink tracking-tight"
            >
              {renderFormattedHeading(personalInfo.shortBio)}
            </h1>

            {/* Expanding Gold Gradient Rule Line */}
            <div className={`lex-gold-rule my-4 sm:my-6 ${isRevealed ? 'in' : ''}`} />

            <div
              id="hero-bio"
              className={`lex-sub text-ink-soft text-[14.5px] sm:text-[16px] md:text-[17px] leading-relaxed max-w-[720px] font-sans space-y-3.5 sm:space-y-4 ${isRevealed ? 'in' : ''}`}
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
            className="flex-shrink-0 flex justify-end pt-2 sm:pt-4 relative"
          >
            <Card3D intensity={18} depth={24} glareOpacity={0.2} className="portrait-wrap relative flex flex-col items-center">
              
              {/* Profile photo ring */}
              <div 
                className="portrait-ring w-[100px] h-[100px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px] aspect-square rounded-full border border-ink/20 relative transition-all duration-500 cursor-default shadow-md z-10 bg-paper"
              >
                {/* Outer concentric decorative border outline */}
                <div className="absolute inset-[-6px] sm:inset-[-8px] rounded-full border border-brass/30 pointer-events-none" />
                
                {/* Image core */}
                <div className="absolute inset-1 sm:inset-2 rounded-full overflow-hidden bg-paper-deep">
                  {personalInfo.avatar ? (
                    <img
                      id="hero-portrait-img"
                      src={(imgSrc || '').startsWith('data:') ? imgSrc : `${imgSrc}${imgSrc.includes('?') ? '&' : '?'}v=${avatarVersion}`}
                      alt={personalInfo.name}
                      referrerPolicy="no-referrer"
                      onLoad={() => setAvatarLoadError(false)}
                      onError={() => {
                        setAvatarLoadError(true);
                        if (imgSrc !== '/api/avatar.jpg') {
                          setImgSrc('/api/avatar.jpg');
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center block rounded-full"
                      style={{ objectPosition: 'center', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-ink-soft">
                      <span className="font-mono text-[9px] sm:text-xs">Rahul Goyal</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Portrait Label Caption */}
              <div className="portrait-caption mt-4 sm:mt-5 font-mono text-[9px] sm:text-[11px] tracking-[0.12em] uppercase text-brass font-bold text-center px-2.5 max-w-full leading-normal whitespace-nowrap z-10 relative">
                {personalInfo.name} | {personalInfo.title}
              </div>

              {/* Education Button with toggle */}
              <button
                onClick={() => setIsEducationOpen(!isEducationOpen)}
                className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-ink-soft hover:text-brass border border-ink/15 hover:border-brass/35 px-3 py-1 rounded-[2px] transition-all duration-200 flex items-center gap-1.5 cursor-pointer bg-paper hover:bg-paper-deep/60 select-none shadow-xs font-bold"
              >
                <GraduationCap className="w-3.5 h-3.5 text-brass" />
                <span>Education</span>
                {isEducationOpen ? (
                  <ChevronUp className="w-3 h-3 text-ink-soft/70" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-ink-soft/70" />
                )}
              </button>

              {/* Education Snippet under photo (Collapsible) */}
              <AnimatePresence initial={false}>
                {isEducationOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col items-center w-full max-w-[210px] sm:max-w-[240px] text-center"
                  >
                    <div className="w-10 h-[1px] bg-rule mb-3" />
                    
                    <div className="space-y-3 w-full pb-1">
                      {/* Bennett University */}
                      <div className="flex flex-col items-center px-1">
                        <p className="font-sans text-[11px] font-bold text-ink uppercase tracking-wider leading-snug">
                          Bennett University
                        </p>
                        <p className="font-mono text-[9px] text-brass font-semibold tracking-wide mt-0.5 uppercase">
                          LL.M. (Corp & Comm Law)
                        </p>
                      </div>

                      {/* KIIT School of Law */}
                      <div className="flex flex-col items-center px-1">
                        <p className="font-sans text-[11px] font-bold text-ink uppercase tracking-wider leading-snug">
                          KIIT School of Law
                        </p>
                        <p className="font-mono text-[9px] text-brass font-semibold tracking-wide mt-0.5 uppercase">
                          B.A. LL.B. (Hons.)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card3D>
          </div>

        </div>

        {/* Action Buttons */}
        <div id="hero-actions" className={`lex-cta ${isRevealed ? 'in' : ''} flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto mb-10`}>
          <button
            id="hero-cta-portfolio"
            onClick={onPortfolioClick}
            className="w-full sm:w-auto justify-center font-mono text-[11.5px] sm:text-[13px] tracking-wider px-5 py-3 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink hover:border-ink rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-xs"
          >
            <span>Reading Room</span>
          </button>

          {personalInfo.introVideo && (
            <button
              id="hero-cta-video"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto justify-center font-mono text-[11.5px] sm:text-[13px] tracking-wider px-5 py-3 border border-rule bg-paper-deep text-ink hover:bg-ink hover:border-ink hover:text-paper rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              <span>Play Intro Video</span>
            </button>
          )}

          <button
            id="hero-cta-contact"
            onClick={onContactClick}
            className="w-full sm:w-auto justify-center font-mono text-[11.5px] sm:text-[13px] tracking-wider px-5 py-3 border border-ink bg-transparent text-ink hover:text-paper hover:bg-ink rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-xs"
          >
            <span>Get in Touch</span>
          </button>
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
                className="p-1.5 bg-paper/90 hover:bg-ink text-ink hover:text-paper border border-rule transition-colors cursor-pointer rounded-[2px]"
                title="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full flex items-center justify-center bg-black">
              {personalInfo.introVideoType === 'file' || personalInfo.introVideoType === 'url' ? (
                <video 
                  src={personalInfo.introVideo} 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={`${personalInfo.introVideo}${personalInfo.introVideo.includes('?') ? '&' : '?'}autoplay=1`}
                  title="Intro Video Profile Player"
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            <div className="p-4 bg-paper border-t border-rule flex justify-between items-center">
              <div>
                <span className="block text-[8px] font-mono text-ink-soft uppercase tracking-widest">Introduction video</span>
                <h4 className="text-xs font-sans font-bold text-ink uppercase tracking-wide">{personalInfo.name} | Profile Pitch</h4>
              </div>
              <div className="text-[9px] font-mono text-ink-soft uppercase border border-rule px-2.5 py-0.5">
                {personalInfo.introVideoType === 'file' ? 'Local Upload' : 'External Stream'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

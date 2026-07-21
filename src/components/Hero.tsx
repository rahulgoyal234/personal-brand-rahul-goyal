import React, { useState } from 'react';
import { Play, X, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';

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

  React.useEffect(() => {
    setAvatarLoadError(false);
    setAvatarVersion(Date.now());
    setImgSrc(personalInfo?.avatar || '');
  }, [personalInfo?.avatar]);

  const renderFormattedHeading = (text: string) => {
    const defaultText = "Making the complex, comprehensible.";
    let targetText = text || defaultText;
    
    // Fallback if targetText is empty or is literally "Rahul Goyal"
    if (!targetText || targetText.trim().toLowerCase() === 'rahul goyal') {
      targetText = "Making the complex, comprehensible.";
    }
    
    const words = targetText.trim().split(' ');
    if (words.length < 2) return targetText;
    
    const lastWord = words[words.length - 1];
    const mainText = words.slice(0, words.length - 1).join(' ');
    
    return (
      <>
        {mainText}{' '}
        <span className="italic font-serif font-light">{lastWord}</span>
      </>
    );
  };

  return (
    <section
      id="about"
      className="relative min-h-[90vh] flex items-center justify-center pt-36 pb-20 md:py-48 overflow-hidden bg-transparent scroll-mt-20"
    >
      {/* Bespoke circular background wireframes from your design */}
      <div 
        className="absolute top-[-120px] right-[-160px] w-[520px] h-[520px] rounded-full border border-rule/60 pointer-events-none select-none z-0 hidden lg:block" 
      />
      <div 
        className="absolute top-[-60px] right-[-100px] w-[520px] h-[520px] rounded-full border border-rule/40 pointer-events-none select-none z-0 hidden lg:block" 
      />

      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 w-full relative z-10">
        
        {/* Top Row: Info (Left) & Profile Photo (Right) - Side-by-side across all devices */}
        <div className="flex flex-row items-start justify-between gap-5 sm:gap-8 lg:gap-12 mb-6 w-full">
          
          {/* Left Column: Heading and Bio */}
          <div className="flex-1 min-w-0 flex flex-col items-start text-left">
            <h1
              id="hero-heading"
              className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.08] text-ink"
            >
              {renderFormattedHeading(personalInfo.shortBio)}
            </h1>

            <div
              id="hero-bio"
              className="text-ink-soft text-[14px] sm:text-[16px] md:text-[17px] leading-relaxed max-w-[720px] mt-4 sm:mt-6 font-sans space-y-3 sm:space-y-4"
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

          {/* Right Column: Profile Photo */}
          <div
            id="hero-portrait-container"
            className="flex-shrink-0 flex justify-end pt-2 sm:pt-4"
          >
            <div className="portrait-wrap relative flex flex-col items-center">
              {/* Profile photo ring styled beautifully */}
              <div 
                className="portrait-ring w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] aspect-square rounded-full border border-ink/35 relative transition-all duration-500 cursor-default shadow-md"
              >
                {/* Outer concentric decorative border outline */}
                <div className="absolute inset-[-6px] sm:inset-[-10px] rounded-full border border-rule pointer-events-none" />
                
                {/* Image core - absolutely positioned with perfect equal inset margins */}
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
                      className="absolute inset-0 w-full h-full object-cover object-center block rounded-full scale-[1.25] translate-y-[5.5%] transition-transform duration-500"
                      style={{ objectPosition: 'center', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-6 text-center text-ink-soft">
                      <span className="font-mono text-[9px] sm:text-xs">No Portrait</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Portrait Label Caption */}
              <div className="portrait-caption mt-4 sm:mt-6 font-mono text-[9px] sm:text-[11px] tracking-[0.1em] uppercase text-brass font-bold text-center px-2 max-w-full leading-normal whitespace-nowrap">
                {personalInfo.name} | {personalInfo.title}
              </div>

              {/* Education Button with toggle */}
              <button
                onClick={() => setIsEducationOpen(!isEducationOpen)}
                className="mt-3.5 sm:mt-4 font-mono text-[9px] sm:text-[10px] md:text-[10.5px] tracking-[0.12em] uppercase text-ink-soft hover:text-brass border border-ink/15 hover:border-brass/35 px-3 py-1.5 rounded-[2px] transition-all duration-300 flex items-center gap-2 cursor-pointer bg-paper-deep/30 hover:bg-paper-deep/80 select-none shadow-sm font-bold animate-fade-in"
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
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col items-center w-full max-w-[200px] sm:max-w-[240px] text-center"
                  >
                    <div className="w-10 h-[1px] bg-ink/15 mb-3.5" />
                    
                    <div className="space-y-3.5 w-full pb-1">
                      {/* Bennett University */}
                      <div className="flex flex-col items-center px-1">
                        <p className="font-sans text-[10px] sm:text-[11.5px] font-bold text-ink uppercase tracking-wider leading-snug">
                          Bennett University
                        </p>
                        <p className="font-mono text-[8.5px] sm:text-[9.5px] text-brass font-semibold tracking-wide mt-0.5 uppercase">
                          LL.M. (Corp & Comm Law) • Ongoing
                        </p>
                        <p className="font-sans text-[8.5px] sm:text-[9px] text-ink-soft/85 italic mt-0.5">
                          Greater Noida
                        </p>
                      </div>

                      {/* KIIT School of Law */}
                      <div className="flex flex-col items-center px-1 pt-0.5">
                        <p className="font-sans text-[10px] sm:text-[11.5px] font-bold text-ink uppercase tracking-wider leading-snug">
                          KIIT School of Law
                        </p>
                        <p className="font-mono text-[8.5px] sm:text-[9.5px] text-brass font-semibold tracking-wide mt-0.5 uppercase">
                          B.A. LL.B. (Hons.)
                        </p>
                        <p className="font-sans text-[8.5px] sm:text-[9px] text-ink-soft/85 italic mt-0.5">
                          Bhubaneswar
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Action buttons (placed below the text/photo row but above cover photo) */}
        <div id="hero-actions" className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto mb-8">
          <button
            id="hero-cta-portfolio"
            onClick={onPortfolioClick}
            className="w-full sm:w-auto justify-center font-mono text-[11px] sm:text-[13px] md:text-[13.5px] tracking-wider px-[14px] sm:px-[22px] py-2.5 sm:py-3.5 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink hover:border-ink rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-sm hover:shadow-md"
          >
            View Writings
          </button>

          {personalInfo.introVideo && (
            <button
              id="hero-cta-video"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto justify-center font-mono text-[13px] sm:text-[13.5px] tracking-wider px-[14px] sm:px-[22px] py-2.5 sm:py-3.5 border border-line bg-paper-deep text-ink hover:bg-ink hover:border-ink hover:text-paper rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-sm hover:shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              Play Intro Video
            </button>
          )}

          <button
            id="hero-cta-contact"
            onClick={onContactClick}
            className="w-full sm:w-auto justify-center font-mono text-[11px] sm:text-[13px] md:text-[13.5px] tracking-wider px-[14px] sm:px-[22px] py-2.5 sm:py-3.5 border border-ink bg-transparent text-ink hover:text-paper hover:bg-ink rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold"
          >
            Get in Touch
          </button>
        </div>


        {/* Middle Row: Full-width Cover Photo Banner */}
        <div className="w-full mb-2 relative rounded-[4px] overflow-hidden border border-line shadow-sm group">
          <div className="absolute inset-0 bg-gradient-to-t from-paper/40 via-transparent to-transparent z-10 pointer-events-none" />
          <img 
            src="https://res.cloudinary.com/ywmg6avw/image/upload/v1784023092/Gemini_Generated_Image_51tl351tl351tl35_qudg4a.png"
            alt="Rahul Goyal Editorial Cover"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          {/* Elegant corner brackets for that bespoke design feel */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brass/50 z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brass/50 z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brass/50 z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brass/50 z-20 pointer-events-none" />
        </div>

        {/* Eyebrow Label "the attached" (Now below the right side of cover photo) */}
        <div className="w-full mb-6 flex justify-end text-right">
          <div className="eyebrow font-mono text-[11.5px] sm:text-[13px] tracking-[0.14em] uppercase text-brass flex items-center gap-2.5 before:content-[''] before:w-3 before:h-[2px] before:bg-brass before:inline-block font-bold leading-relaxed">
            <span>{personalInfo.name}</span>
          </div>
        </div>


      </div>

      {/* Immersive Video Theater Modal */}
      {isVideoModalOpen && personalInfo.introVideo && (
        <div id="video-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
          />
          
          <div
            className="relative w-full max-w-4xl bg-paper border border-rule shadow-2xl overflow-hidden z-10 rounded-[2px]"
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                id="close-video-modal-btn"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 bg-paper/90 hover:bg-ink text-ink hover:text-paper border border-rule transition-colors cursor-pointer rounded-[2px] active:scale-95"
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

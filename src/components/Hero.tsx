import React, { useState, useRef } from 'react';
import { ArrowRight, Linkedin, Mail, MapPin, Briefcase, Settings, Play, X, Edit, Lock, Globe, MoreVertical, RefreshCw, Upload } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onContactClick: () => void;
  onPortfolioClick: () => void;
}

export default function Hero({ onContactClick, onPortfolioClick }: HeroProps) {
  const { personalInfo, updatePersonalInfo, setIsEditorOpen } = usePortfolio();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [indexingStatus, setIndexingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setAvatarLoadError(false);
    setAvatarVersion(Date.now());
  }, [personalInfo.avatar]);

  const processAndUploadFile = (file: File) => {
    // Create highly memory-efficient Object URL instead of FileReader base64 strings to prevent crashes
    const blobUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      const maxDimension = 1600; // Ultra high resolution limit for razor-sharp display on 4K/Retina screens
      let w = img.width;
      let h = img.height;
      
      if (w > maxDimension || h > maxDimension) {
        if (w > h) {
          h = Math.round((h * maxDimension) / w);
          w = maxDimension;
        } else {
          w = Math.round((w * maxDimension) / h);
          h = maxDimension;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        try {
          // Highly pristine 0.95 quality for crisp original detail with zero compression artifacts
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.95);
          updatePersonalInfo({ avatar: compressedBase64 });
        } catch (err) {
          console.error("Compression failed, trying fallback to generic canvas URL", err);
          try {
            const fallbackBase64 = canvas.toDataURL('image/png');
            updatePersonalInfo({ avatar: fallbackBase64 });
          } catch (fallbackErr) {
            console.error("Fallback image rendering failed", fallbackErr);
          }
        }
      }
      URL.revokeObjectURL(blobUrl);
    };
    
    img.onerror = () => {
      console.error("Failed to load image via ObjectURL");
      URL.revokeObjectURL(blobUrl);
      // Robust fallback to reader if ObjectURL is not fully supported
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    };
    
    img.src = blobUrl;
  };

  const handleDirectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (personalInfo.isAvatarLocked) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processAndUploadFile(file);
    }
  };

  const handleReindex = () => {
    setIndexingStatus('loading');
    setTimeout(() => {
      setIndexingStatus('success');
    }, 1500);
  };

  // Animation container variants for staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

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
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 md:py-32 overflow-hidden scroll-mt-20"
    >
      {/* Background soft geometric pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
          {/* Main Info Columns */}
          <div
            id="hero-content"
            className="md:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Heading Name & Role */}
            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tighter text-brand-900 leading-[1.1]"
              >
                {renderFormattedHeading(personalInfo.shortBio)}
              </h1>
              {personalInfo.name.toLowerCase() !== 'rahul goyal' && (
                <p
                  id="hero-subheading"
                  className="font-display text-[11px] uppercase tracking-[0.3em] text-neutral-400 mt-2 font-bold"
                >
                  {`${personalInfo.name} | ${personalInfo.title}`}
                </p>
              )}
            </div>

            {/* Detailed Bio paragraph */}
            <p
              id="hero-bio"
              className="text-neutral-500 text-sm leading-relaxed max-w-md font-light whitespace-pre-line"
            >
              {personalInfo.bio}
            </p>



            {/* Meta Tags (Location & Main Focus) */}
            {personalInfo.location && 
             personalInfo.location.toLowerCase() !== 'new delhi, india' && 
             personalInfo.location.toLowerCase() !== 'new delhi' && (
              <div
                id="hero-metadata"
                className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-neutral-400 font-mono uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div id="hero-social-links" className="flex items-center space-x-3 pt-2">
              <a
                id="hero-social-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                id="hero-social-email"
                href={`mailto:${personalInfo.email}`}
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Call To Action Buttons */}
            <div id="hero-actions" className="flex items-center gap-6 pt-4">
              <button
                id="hero-cta-portfolio"
                onClick={onPortfolioClick}
                className="bg-black text-white px-7 py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all rounded-none cursor-pointer"
              >
                View Writings
              </button>
              <button
                id="hero-cta-contact"
                onClick={onContactClick}
                className="text-[11px] uppercase tracking-widest font-bold border-b border-neutral-200 hover:border-black transition-all pb-1 cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Portrait Column */}
          <div
            id="hero-portrait-container"
            className="md:col-span-5 flex justify-center md:justify-end"
          >
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative group w-full max-w-[250px] xs:max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] aspect-square select-none ${
                personalInfo.introVideo ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Back framing accent */}
              <div className="absolute inset-0 border border-brand-200 rotate-1 group-hover:rotate-4 group-hover:scale-[1.02] group-active:rotate-4 group-active:scale-[1.02] transition-all duration-500 rounded-none bg-neutral-50"></div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDirectFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Drag over upload overlay */}
              {isDragging && !personalInfo.isAvatarLocked && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-40 flex flex-col items-center justify-center text-white p-4 border-2 border-dashed border-emerald-500 animate-pulse transition-all">
                  <Upload className="w-8 h-8 mb-2 text-emerald-400" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-center">Drop to Upload Portrait</span>
                </div>
              )}

              {/* Main image card wrapper */}
              {personalInfo.introVideo ? (
                <div 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute inset-0 bg-[#EBECE9] overflow-hidden border border-neutral-200 transition-all duration-500 shadow-none rounded-none -rotate-1 group-hover:rotate-0 group-hover:scale-[1.02] group-active:rotate-0 group-active:scale-[1.02] cursor-pointer"
                >
                  {avatarLoadError || !personalInfo.avatar ? (
                    <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-6 text-center">
                      <span className="font-sans text-xs font-bold text-neutral-800">No Portrait</span>
                    </div>
                  ) : (
                    <img
                      id="hero-portrait-img"
                      src={personalInfo.avatar.startsWith('data:') ? personalInfo.avatar : `${personalInfo.avatar}?v=${avatarVersion}`}
                      alt={personalInfo.name}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarLoadError(true)}
                      className="w-full h-full object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-108 group-active:scale-108 filter group-hover:brightness-[1.03] group-active:brightness-[1.03]"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white flex items-center justify-center scale-95 group-hover:scale-100 group-active:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] font-bold">Play Intro Video</span>
                  </div>
                </div>
              ) : (
                <div 
                  className="absolute inset-0 bg-[#EBECE9] overflow-hidden border border-neutral-200 transition-all duration-500 shadow-none rounded-none -rotate-1 group-hover:rotate-0 group-hover:scale-[1.02] group-active:rotate-0 group-active:scale-[1.02] cursor-default"
                >
                  {avatarLoadError || !personalInfo.avatar ? (
                    <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-6 text-center">
                      <span className="font-sans text-xs font-bold text-neutral-800">No Portrait</span>
                    </div>
                  ) : (
                    <img
                      id="hero-portrait-img"
                      src={personalInfo.avatar.startsWith('data:') ? personalInfo.avatar : `${personalInfo.avatar}?v=${avatarVersion}`}
                      alt={personalInfo.name}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarLoadError(true)}
                      className="w-full h-full object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-108 group-active:scale-108 filter group-hover:brightness-[1.03] group-active:brightness-[1.03]"
                    />
                  )}
                </div>
              )}

              {/* Absolute hovering Action Badges */}
              {!personalInfo.isAvatarLocked && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-3 right-3 z-30 bg-white/90 hover:bg-white backdrop-blur-md text-brand-900 border border-brand-200/50 px-2 py-1 flex items-center space-x-1 font-mono text-[8px] tracking-wider uppercase shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  title="Upload custom portrait photo"
                >
                  <Upload className="w-2.5 h-2.5 text-brand-600 animate-bounce" />
                  <span>Upload Photo</span>
                </button>
              )}

              {/* Optional pulsing "Intro Video" badge at top right - Rendered on top of image wrapper */}
              {personalInfo.introVideo && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoModalOpen(true);
                  }}
                  className="absolute -top-3.5 -right-3.5 z-30 bg-black text-white border border-neutral-800 px-3.5 py-2.5 sm:px-2 sm:py-1 flex items-center space-x-2 sm:space-x-1 font-mono text-[10px] sm:text-[8px] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-md min-h-[40px] sm:min-h-0"
                >
                  <span className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Intro Video</span>
                </div>
              )}

              {/* Minimal floating tech accent */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-brand-200 px-3 py-1.5 rounded-none shadow-none flex items-center space-x-2 font-mono text-[9px] tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-brand-600 font-bold">Based in New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immersive Video Theater Modal */}
      {isVideoModalOpen && personalInfo.introVideo && (
        <div id="video-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with elegant blur */}
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />
          
          {/* Playback Box */}
          <div
            className="relative w-full max-w-4xl bg-black border border-neutral-800 shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button overlay */}
            <div className="absolute top-4 right-4 z-20">
              <button
                id="close-video-modal-btn"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
                title="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive aspect video player */}
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

            {/* Informative footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-900 flex justify-between items-center">
              <div>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Introduction video</span>
                <h4 className="text-xs font-sans font-bold text-neutral-200 uppercase tracking-wide">{personalInfo.name} | Profile Pitch</h4>
              </div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase border border-neutral-900 px-2.5 py-0.5">
                {personalInfo.introVideoType === 'file' ? 'Local Upload' : 'External Stream'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

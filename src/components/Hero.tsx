import React, { useState, useRef } from 'react';
import { ArrowRight, Linkedin, Mail, MapPin, Briefcase, Settings, Play, X, Edit, Lock, Globe, MoreVertical, RefreshCw, Upload } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'motion/react';

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
    // Clear input value so selecting the same file triggers onChange again
    e.target.value = '';
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
      className="relative min-h-[90vh] flex items-center justify-center pt-36 pb-20 md:py-48 overflow-hidden bg-paper scroll-mt-20"
    >
      {/* Bespoke circular background wireframes from your design */}
      <div className="absolute top-[-120px] right-[-160px] w-[520px] h-[520px] rounded-full border border-rule pointer-events-none select-none z-0 hidden lg:block" />
      <div className="absolute top-[-60px] right-[-100px] w-[520px] h-[520px] rounded-full border border-rule pointer-events-none select-none z-0 hidden lg:block" />

      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 w-full relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Main Copy Content */}
          <div
            id="hero-content"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="eyebrow font-mono text-[12.5px] tracking-[0.14em] uppercase text-brass flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-brass font-bold">
                {personalInfo.name} | {personalInfo.title}
              </div>
              
              <h1
                id="hero-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-ink mt-4"
              >
                {personalInfo.shortBio || "Making the complex, comprehensible."}
              </h1>
            </motion.div>

            {/* Detailed Bio paragraph */}
            <motion.p
              id="hero-bio"
              variants={itemVariants}
              className="text-ink-soft text-[17px] sm:text-lg leading-relaxed max-w-[540px] mt-[22px] font-sans"
            >
              I'm Rahul Goyal, a lawyer who reads fine print so you don't have to. I work in <strong className="text-ink font-semibold">corporate law, IP, and tech policy</strong>, turning tangled regulation into clear, confident moves. Contracts that hold up. Advice that's straight, not stuffy. Legal ground that's safe to build on.
            </motion.p>

            {/* Call To Action Buttons */}
            <motion.div id="hero-actions" variants={itemVariants} className="flex flex-wrap items-center gap-4 mt-10">
              <button
                id="hero-cta-portfolio"
                onClick={onPortfolioClick}
                className="font-mono text-[13.5px] tracking-wider px-[22px] py-3.5 border border-ink bg-ink text-paper hover:bg-brass hover:border-brass hover:text-white rounded-[2px] transition-all duration-200 hover:-translate-y-[1px] flex items-center gap-2 cursor-pointer font-semibold"
              >
                View Writings
              </button>

              {personalInfo.introVideo && (
                <button
                  id="hero-cta-video"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="font-mono text-[13.5px] tracking-wider px-[22px] py-3.5 border border-brass-soft bg-brass-soft text-ink hover:bg-brass hover:border-brass hover:text-white rounded-[2px] transition-all duration-200 hover:-translate-y-[1px] flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  Play Intro Video
                </button>
              )}

              <button
                id="hero-cta-contact"
                onClick={onContactClick}
                className="font-mono text-[13.5px] tracking-wider px-[22px] py-3.5 border border-ink bg-transparent text-ink hover:text-brass hover:border-brass rounded-[2px] transition-all duration-200 hover:-translate-y-[1px] flex items-center gap-2 cursor-pointer font-semibold"
              >
                Get in Touch
              </button>
            </motion.div>
          </div>

          {/* Portrait Column styled with elegant circular ring and outer outline wrapper */}
          <motion.div
            id="hero-portrait-container"
            variants={itemVariants}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="portrait-wrap relative flex flex-col items-center">
              <div 
                className="portrait-ring w-[280px] sm:w-[320px] aspect-square rounded-full p-2.5 border border-brass relative transition-all duration-300 cursor-default"
              >
                {/* Outer concentric decorative border outline */}
                <div className="absolute inset-[-16px] rounded-full border border-rule pointer-events-none" />
                
                {/* Image core */}
                <div className="w-full h-full rounded-full overflow-hidden bg-paper-deep">
                  {personalInfo.avatar ? (
                    <img
                      id="hero-portrait-img"
                      src={personalInfo.avatar.startsWith('data:') ? personalInfo.avatar : `${personalInfo.avatar}?v=${avatarVersion}`}
                      alt={personalInfo.name}
                      referrerPolicy="no-referrer"
                      onLoad={() => setAvatarLoadError(false)}
                      onError={() => setAvatarLoadError(true)}
                      className="w-full h-full object-cover filter grayscale-[6%] contrast-[103%] block"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-ink-soft">
                      <span className="font-mono text-xs">No Portrait</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Portrait Label Caption */}
              <div className="portrait-caption mt-[22px] font-mono text-[12px] tracking-[0.1em] uppercase text-ink-soft font-semibold">
                {personalInfo.name} | {personalInfo.title}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Immersive Video Theater Modal */}
      {isVideoModalOpen && personalInfo.introVideo && (
        <div id="video-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
          />
          
          <div
            className="relative w-full max-w-4xl bg-[#12213A] border border-brass/20 shadow-2xl overflow-hidden z-10 rounded-[2px]"
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                id="close-video-modal-btn"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 bg-ink/80 hover:bg-ink text-paper hover:text-white border border-rule transition-colors cursor-pointer rounded-[2px]"
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

            <div className="p-4 bg-ink border-t border-rule/20 flex justify-between items-center">
              <div>
                <span className="block text-[8px] font-mono text-brass uppercase tracking-widest">Introduction video</span>
                <h4 className="text-xs font-sans font-bold text-paper uppercase tracking-wide">{personalInfo.name} | Profile Pitch</h4>
              </div>
              <div className="text-[9px] font-mono text-brass-soft uppercase border border-rule/20 px-2.5 py-0.5">
                {personalInfo.introVideoType === 'file' ? 'Local Upload' : 'External Stream'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

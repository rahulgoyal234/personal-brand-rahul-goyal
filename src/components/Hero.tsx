import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, Twitter, MapPin, Briefcase, Camera } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolio';

interface HeroProps {
  onContactClick: () => void;
  onPortfolioClick: () => void;
}

export default function Hero({ onContactClick, onPortfolioClick }: HeroProps) {
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('custom_avatar') || PERSONAL_INFO.avatar;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('custom_avatar', base64String);
        setAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <section
      id="about"
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 md:py-32 overflow-hidden"
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
          <motion.div
            id="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Status Indicator */}
            <motion.div
              id="hero-status-badge"
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-100 border border-brand-200 text-brand-700 text-[10px] font-mono tracking-wider uppercase font-bold rounded-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for high-impact roles</span>
            </motion.div>

            {/* Heading Name & Role */}
            <div className="space-y-4">
              <motion.h1
                id="hero-heading"
                variants={itemVariants}
                className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tighter text-brand-900 leading-[1.1]"
              >
                Advocacy and precision in corporate law & <span className="italic font-serif font-light">tech policy</span>.
              </motion.h1>
              <motion.p
                id="hero-subheading"
                variants={itemVariants}
                className="font-display text-[11px] uppercase tracking-[0.3em] text-neutral-400 mt-2 font-bold"
              >
                {PERSONAL_INFO.name} — {PERSONAL_INFO.title}
              </motion.p>
            </div>

            {/* Detailed Bio paragraph */}
            <motion.p
              id="hero-bio"
              variants={itemVariants}
              className="text-neutral-500 text-sm leading-relaxed max-w-md font-light"
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            {/* Meta Tags (Location & Main Focus) */}
            <motion.div
              id="hero-metadata"
              variants={itemVariants}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-neutral-400 font-mono uppercase tracking-wider"
            >
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                <span>Corporate Law & Tech Policy</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div id="hero-social-links" variants={itemVariants} className="flex items-center space-x-3 pt-2">
              <a
                id="hero-social-github"
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="GitHub Profiles"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                id="hero-social-linkedin"
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                id="hero-social-twitter"
                href={PERSONAL_INFO.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                id="hero-social-email"
                href={`mailto:${PERSONAL_INFO.email}`}
                className="p-2 border border-brand-200 text-brand-600 hover:text-brand-900 hover:border-brand-900 hover:bg-white transition-all cursor-pointer rounded-none"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Call To Action Buttons */}
            <motion.div id="hero-actions" variants={itemVariants} className="flex items-center gap-6 pt-4">
              <button
                id="hero-cta-portfolio"
                onClick={onPortfolioClick}
                className="bg-black text-white px-7 py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all rounded-none cursor-pointer"
              >
                View Publications
              </button>
              <button
                id="hero-cta-contact"
                onClick={onContactClick}
                className="text-[11px] uppercase tracking-widest font-bold border-b border-neutral-200 hover:border-black transition-all pb-1 cursor-pointer"
              >
                Get in Touch
              </button>
            </motion.div>
          </motion.div>

          {/* Portrait Column */}
          <motion.div
            id="hero-portrait-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
            className="md:col-span-5 flex justify-center md:justify-end"
          >
            <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
              {/* Back framing accent */}
              <div className="absolute inset-0 border border-brand-200 rotate-1 group-hover:rotate-3 transition-transform duration-300 rounded-none bg-neutral-50"></div>
              {/* Main image card wrapper */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-[#EBECE9] overflow-hidden border border-neutral-200 -rotate-1 group-hover:rotate-0 transition-transform duration-300 shadow-none rounded-none cursor-pointer"
              >
                <img
                  id="hero-portrait-img"
                  src={avatar}
                  alt={PERSONAL_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-102 hover:scale-105"
                />
                
                {/* Hover overlay for quick upload */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2">
                  <Camera className="w-5 h-5 text-white/90" />
                  <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Upload New Photo</span>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Minimal floating tech accent */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-brand-200 px-3 py-1.5 rounded-none shadow-none flex items-center space-x-2 font-mono text-[9px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-brand-600 font-bold">BASED IN NEW DELHI</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

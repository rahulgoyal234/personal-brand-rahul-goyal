import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Linkedin, Copy, Check } from 'lucide-react';
import Card3D from './Card3D';

export default function Contact() {
  const { personalInfo } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    if (personalInfo.email) {
      navigator.clipboard.writeText(personalInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (personalInfo.phone) {
      navigator.clipboard.writeText(personalInfo.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-transparent relative scroll-mt-20">
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-[540px] mx-auto mb-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-semibold text-ink leading-tight">
            Get in Touch
          </h2>
          <p className="text-ink-soft text-sm sm:text-[15.5px] leading-relaxed font-sans">
            Structuring corporate moves, negotiating contracts, filing sensory trademarks, or reviewing tech policy? Reach out directly.
          </p>
        </div>

        {/* Contact Deck */}
        <Card3D 
          intensity={8}
          depth={16}
          glareOpacity={0.14}
          className="bg-paper-deep/80 backdrop-blur-[6px] border border-rule/80 p-6 sm:p-10 rounded-[2px] shadow-lg space-y-8"
        >
          
          {/* Main Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {/* Email Channel */}
            <div className="bg-paper border border-rule/70 p-5 rounded-[2px] flex items-start justify-between gap-4 hover:border-ink/40 transition-all shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-rule flex items-center justify-center text-brass flex-shrink-0 bg-paper-deep">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft font-bold block">
                    Email
                  </span>
                  <a 
                    href={`mailto:${personalInfo.email}`} 
                    className="text-sm sm:text-base text-ink hover:text-brass hover:underline transition-all font-semibold font-sans break-all"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 text-ink-soft hover:text-ink hover:bg-paper-deep rounded-[2px] transition-colors cursor-pointer flex-shrink-0"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-brass" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Channel */}
            <div className="bg-paper border border-rule/70 p-5 rounded-[2px] flex items-start justify-between gap-4 hover:border-ink/40 transition-all shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-rule flex items-center justify-center text-brass flex-shrink-0 bg-paper-deep">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft font-bold block">
                    Telephone
                  </span>
                  <a 
                    href={`tel:${personalInfo.phone}`} 
                    className="text-sm sm:text-base text-ink hover:text-brass hover:underline transition-all font-semibold font-sans"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                className="p-2 text-ink-soft hover:text-ink hover:bg-paper-deep rounded-[2px] transition-colors cursor-pointer flex-shrink-0"
                title="Copy telephone"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-brass" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Location & Social */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-rule/60 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-rule flex items-center justify-center text-ink-soft flex-shrink-0 bg-paper">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-soft font-bold block">
                  Location
                </span>
                <span className="text-xs sm:text-sm font-semibold text-ink font-sans">
                  {personalInfo.location || 'New Delhi, India'}
                </span>
              </div>
            </div>

            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-rule hover:border-ink hover:text-ink hover:bg-paper text-ink-soft rounded-[2px] transition-all duration-200 flex items-center gap-2 bg-paper"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>

        </Card3D>

      </div>
    </section>
  );
}

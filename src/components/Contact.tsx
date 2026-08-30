import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Card3D from './Card3D';

export default function Contact() {
  const { personalInfo } = usePortfolio();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 bg-transparent relative scroll-mt-20 border-t border-rule/50">
      <div className="max-w-[1120px] mx-auto px-4 xs:px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2 mb-8 sm:mb-12 text-left">
          <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-[42px] font-semibold text-ink leading-tight">
            Get in Touch
          </h2>
          <p className="text-ink-soft text-xs xs:text-sm sm:text-base font-sans max-w-xl">
            For inquiries, discussions, or potential collaborations.
          </p>
        </div>

        {/* Contact Information Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Email Card */}
          <Card3D
            intensity={4}
            depth={8}
            glareOpacity={0.06}
            className="bg-paper border border-rule p-5 xs:p-6 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-brass font-bold">
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </div>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-serif text-base sm:text-lg font-bold text-ink hover:text-brass break-all sm:truncate block transition-colors"
              >
                {personalInfo.email}
              </a>
            </div>

            <button
              onClick={() => handleCopy(personalInfo.email, 'email')}
              className="font-sans text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full border border-rule hover:border-ink bg-paper hover:bg-paper-deep/60 text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-fit active:scale-95 shadow-xs select-none"
            >
              {copiedField === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </Card3D>

          {/* Location Card */}
          <Card3D
            intensity={4}
            depth={8}
            glareOpacity={0.06}
            className="bg-paper border border-rule p-5 xs:p-6 rounded-[2px] shadow-xs flex flex-col justify-center space-y-4 text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-brass font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </div>
              <p className="font-serif text-base sm:text-lg font-bold text-ink">
                {personalInfo.location || 'New Delhi, India'}
              </p>
            </div>
          </Card3D>

          {/* Professional Network Card */}
          <Card3D
            intensity={4}
            depth={8}
            glareOpacity={0.06}
            className="bg-paper border border-rule p-5 xs:p-6 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4 text-left sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-brass font-bold">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </div>
              <p className="font-serif text-base sm:text-lg font-bold text-ink">
                Professional Profile
              </p>
            </div>

            {personalInfo.linkedin ? (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full border border-rule hover:border-brass/60 bg-paper hover:bg-paper-deep/60 text-ink transition-all flex items-center justify-center gap-1.5 cursor-pointer w-fit group shadow-xs active:scale-95 select-none"
              >
                <Linkedin className="w-3.5 h-3.5 text-brass" />
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-ink-soft group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <span className="font-sans text-xs text-ink-soft">LinkedIn connected</span>
            )}
          </Card3D>

        </div>

      </div>
    </section>
  );
}

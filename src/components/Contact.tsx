import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export default function Contact() {
  const { personalInfo } = usePortfolio();

  return (
    <section id="contact" className="py-28 bg-transparent relative scroll-mt-20">
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 relative z-10 text-center">
        
        <div className="space-y-6 max-w-[600px] mx-auto mb-16">
          <h2 className="font-serif text-[42px] font-semibold text-ink leading-tight">
            Get in Touch
          </h2>
          <p className="text-ink-soft text-sm sm:text-[16px] leading-relaxed font-sans">
            Have a complex legal question, policy research initiative, or a contract in need of expert drafting? Reach out and let's structure your next steps.
          </p>
        </div>

        {/* Beautiful, refined contact deck */}
        <div className="bg-paper-deep/80 backdrop-blur-[6px] border border-rule/70 p-5 sm:p-8 md:p-12 rounded-[2px] shadow-md flex flex-col gap-10">
          
          {/* Main Direct Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-b border-rule pb-10">
            {/* Email Channel */}
            <div className="flex items-start gap-3 sm:gap-4 p-2.5 sm:p-4 rounded-[2px] hover:bg-paper/50 transition-colors duration-200">
              <div className="w-10 h-10 rounded-full border border-rule flex items-center justify-center text-brass flex-shrink-0 bg-paper">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft font-bold block">
                  Email
                </span>
                <a 
                  href={`mailto:${personalInfo.email}`} 
                  className="text-base text-ink hover:text-brass hover:underline transition-all font-medium font-sans break-all"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>

            {/* Phone Channel */}
            <div className="flex items-start gap-3 sm:gap-4 p-2.5 sm:p-4 rounded-[2px] hover:bg-paper/50 transition-colors duration-200">
              <div className="w-10 h-10 rounded-full border border-rule flex items-center justify-center text-brass flex-shrink-0 bg-paper">
                <Phone className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft font-bold block">
                  Phone
                </span>
                <a 
                  href={`tel:${personalInfo.phone}`} 
                  className="text-base text-ink hover:text-brass hover:underline transition-all font-medium font-sans"
                >
                  {personalInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Details & Socials */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-left">
            {/* Location */}
            {personalInfo.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-ink-soft" />
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft font-bold block">
                    Based In
                  </span>
                  <span className="text-sm sm:text-base text-ink font-medium font-sans">
                    {personalInfo.location}
                  </span>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-4">
              {personalInfo.linkedin && (
                <a 
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-rule hover:border-ink hover:text-ink hover:bg-paper text-ink-soft rounded-[2px] transition-all duration-200 flex items-center gap-2"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}



import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact() {
  const { personalInfo } = usePortfolio();

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-brand-200 bg-[#fcfcfc] relative">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="space-y-4 max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold block">
            Let's connect
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extralight tracking-tight text-neutral-900">
            Get in <span className="italic font-serif font-light">touch</span>
          </h2>
          <p className="text-neutral-500 font-light text-xs sm:text-sm leading-relaxed">
            Have a project idea, a position proposal, or simply want to chat about product architecture? Reach out via direct email.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-neutral-200 rounded-none space-y-4 shadow-xs hover:border-black transition-all duration-300">
            <div className="p-3 border border-black text-black rounded-none">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-neutral-400 text-[8px] font-mono uppercase tracking-widest mb-1">Direct Email</span>
              <a 
                href={`mailto:${personalInfo.email}`} 
                className="text-neutral-800 hover:text-black font-semibold text-xs sm:text-sm uppercase tracking-wider block transition-colors"
              >
                {personalInfo.email}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-neutral-200 rounded-none space-y-4 shadow-xs hover:border-black transition-all duration-300">
            <div className="p-3 border border-black text-black rounded-none">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-neutral-400 text-[8px] font-mono uppercase tracking-widest mb-1">Based In</span>
              <span className="text-neutral-800 font-semibold text-xs sm:text-sm uppercase tracking-wider block">
                {personalInfo.location}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

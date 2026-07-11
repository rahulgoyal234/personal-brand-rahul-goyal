import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact() {
  const { personalInfo } = usePortfolio();

  return (
    <section id="contact" className="py-28 bg-transparent relative scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start">
          
          {/* Column 1: Info and Links */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-[38px] font-semibold text-ink leading-tight">
                Get in Touch
              </h2>
              <p className="text-ink-soft text-sm sm:text-[15.5px] leading-relaxed max-w-[440px] font-sans">
                Have a complex legal question, policy research initiative, or a contract in need of expert drafting? Reach out and let's structure your next steps.
              </p>
            </div>

            <div className="contact-methods flex flex-col gap-6 pt-2">
              <div className="contact-method flex flex-col gap-1.5">
                <strong className="font-mono text-[11px] uppercase tracking-widest text-ink-soft font-bold">
                  Email
                </strong>
                <a 
                  href={`mailto:${personalInfo.email}`} 
                  className="text-base sm:text-[16.5px] text-ink hover:text-ink hover:underline transition-colors font-medium font-sans no-underline"
                >
                  {personalInfo.email}
                </a>
              </div>

              {personalInfo.location && (
                <div className="contact-method flex flex-col gap-1.5">
                  <strong className="font-mono text-[11px] uppercase tracking-widest text-ink-soft font-bold">
                    Based in
                  </strong>
                  <span className="text-base sm:text-[16.5px] text-ink font-medium font-sans">
                    {personalInfo.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Formspree Contact Form */}
          <div>
            <form 
              action="https://formspree.io/f/xvonzgky" 
              method="POST"
              className="contact-form bg-paper-deep/80 backdrop-blur-[6px] border border-rule/70 p-8 sm:p-10 rounded-[2px] flex flex-col gap-6 shadow-md"
            >
              <div className="form-group flex flex-col gap-2">
                <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Your name"
                  className="px-4 py-3 border border-rule/60 bg-paper rounded-[2px] font-sans text-sm text-ink hover:border-ink-soft focus:border-ink focus:ring-0 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="form-group flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="_replyto" 
                  required 
                  placeholder="your.email@domain.com"
                  className="px-4 py-3 border border-rule/60 bg-paper rounded-[2px] font-sans text-sm text-ink hover:border-ink-soft focus:border-ink focus:ring-0 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="form-group flex flex-col gap-2">
                <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                  Message
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  required 
                  placeholder="Briefly describe your legal or research inquiry..."
                  className="px-4 py-3 border border-rule/60 bg-paper rounded-[2px] font-sans text-sm text-ink hover:border-ink-soft focus:border-ink focus:ring-0 focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full justify-center font-mono text-[13.5px] tracking-wider px-[22px] py-4 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink rounded-[2px] transition-all duration-200 flex items-center gap-2 cursor-pointer font-semibold shadow-sm hover:shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}


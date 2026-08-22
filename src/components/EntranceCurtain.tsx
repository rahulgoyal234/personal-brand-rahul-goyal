import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function EntranceCurtain() {
  const { personalInfo } = usePortfolio();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if session has already seen the curtain
    const hasSeen = sessionStorage.getItem('hasSeenCurtain');
    if (hasSeen) {
      setIsDismissed(true);
      return;
    }

    // Auto-dismiss after 2.4s if not clicked
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    sessionStorage.setItem('hasSeenCurtain', 'true');
    setTimeout(() => {
      setIsDismissed(true);
    }, 800);
  };

  if (isDismissed) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper text-ink cursor-pointer select-none transition-all duration-700 ease-in-out ${
        isAnimating ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="text-center space-y-4 px-6 max-w-lg">
        {/* Monogram Seal */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border border-ink/30 flex items-center justify-center bg-paper-deep/60 shadow-xs mb-2">
          <span className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-widest">
            RG
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            {personalInfo.name}
          </h1>
          <p className="font-mono text-xs sm:text-sm text-brass uppercase tracking-[0.2em] font-semibold">
            {personalInfo.title}
          </p>
        </div>

        <div className="w-12 h-[1px] bg-rule mx-auto my-4" />

        <p className="text-xs sm:text-sm text-ink-soft italic font-serif">
          {personalInfo.tagline}
        </p>

        <div className="pt-6">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-soft/70 border-b border-rule pb-1 hover:text-ink transition-colors">
            Click anywhere to enter
          </span>
        </div>
      </div>
    </div>
  );
}

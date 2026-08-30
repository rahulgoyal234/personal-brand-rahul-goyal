import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Check, Clock, Calendar, ExternalLink, Bookmark, Sparkles, ChevronRight } from 'lucide-react';
import { Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface ArticleViewProps {
  article: Project;
  onBack: () => void;
  onSelectArticle: (article: Project) => void;
}

export default function ArticleView({ article, onBack, onSelectArticle }: ArticleViewProps) {
  const { personalInfo, projects } = usePortfolio();
  const [copied, setCopied] = useState(false);

  // Set document title and scroll to top on mount / change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const originalTitle = document.title;
    document.title = `${article.title} — ${personalInfo.name}`;
    return () => {
      document.title = originalTitle;
    };
  }, [article.title, personalInfo.name]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Find related or other articles
  const otherArticles = projects
    .filter((p) => p.id !== article.id)
    .slice(0, 3);

  return (
    <article id="article-page" className="min-h-screen bg-paper text-ink selection:bg-brass selection:text-paper animate-fade-in pb-20">
      
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-rule/80 py-3.5 px-4 xs:px-6 sm:px-8">
        <div className="max-w-[880px] mx-auto flex items-center justify-between gap-4">
          
          {/* Back Button */}
          <button
            id="article-back-top-btn"
            onClick={onBack}
            className="group inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] text-ink-soft hover:text-ink transition-colors cursor-pointer py-1 select-none"
          >
            <ArrowLeft className="w-4 h-4 text-brass group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Reading Room</span>
          </button>

          {/* Center Brand / Category Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest px-2.5 py-0.5 bg-paper-deep border border-rule text-brass font-bold rounded-[2px]">
              {article.category}
            </span>
          </div>

          {/* Share Action */}
          <div className="flex items-center gap-2">
            <button
              id="article-share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-ink bg-paper-deep/80 hover:bg-paper-deep border border-rule hover:border-ink/60 px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none"
              title="Share or copy direct link to this piece"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brass" />
                  <span className="text-brass font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brass" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Reading Container */}
      <main className="max-w-[760px] mx-auto px-4 xs:px-6 sm:px-8 pt-8 sm:pt-12 md:pt-16">
        
        {/* Article Meta Bar */}
        <div className="space-y-4 border-b border-rule/70 pb-6 sm:pb-8">
          
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-brass font-bold">
            <span className="px-2 py-0.5 bg-paper-deep border border-rule rounded-[2px]">
              {article.category}
            </span>
            {article.date && (
              <>
                <span className="text-ink-soft">•</span>
                <span className="text-ink-soft font-normal flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brass" />
                  {article.date}
                </span>
              </>
            )}
            <span className="text-ink-soft">•</span>
            <span className="text-ink-soft font-normal flex items-center gap-1">
              <Clock className="w-3 h-3 text-brass" />
              3 min read
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[26px] xs:text-[30px] sm:text-[38px] md:text-[42px] font-bold text-ink leading-[1.18] tracking-tight">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-rule bg-paper-deep overflow-hidden flex items-center justify-center font-serif text-xs font-bold text-ink flex-shrink-0 shadow-xs">
                {personalInfo.avatar ? (
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <span>RG</span>
                )}
              </div>
              <div className="text-left">
                <div className="font-sans text-sm font-semibold text-ink">
                  {personalInfo.name}
                </div>
                <div className="font-mono text-[11px] text-brass font-medium">
                  {personalInfo.title} • {personalInfo.location}
                </div>
              </div>
            </div>

            {/* Direct External Citation Link if present */}
            {article.demoUrl && (
              <a
                href={article.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-ink-soft hover:text-ink flex items-center gap-1.5 underline decoration-rule hover:decoration-brass underline-offset-4"
              >
                <span>Original Publication</span>
                <ExternalLink className="w-3 h-3 text-brass" />
              </a>
            )}
          </div>

        </div>

        {/* Article Body Content */}
        <div className="pt-8 sm:pt-10 space-y-6 text-left">
          {article.content ? (
            article.content.split('\n\n').map((paragraph, pIdx) => {
              const cleanP = paragraph.trim();
              if (!cleanP) return null;

              // Section Subheadings
              if (cleanP.startsWith('### ')) {
                return (
                  <h2
                    key={pIdx}
                    className="font-serif text-xl sm:text-2xl font-bold text-ink pt-6 pb-2 border-b border-rule/50"
                  >
                    {cleanP.replace('### ', '')}
                  </h2>
                );
              }

              // Prominent Featured Thesis Pull-Quote
              if (
                cleanP.includes("I don't think one year fixes this") ||
                cleanP.includes("scrapped entirely") ||
                cleanP.startsWith('Entry-level judiciary should be open')
              ) {
                return (
                  <blockquote
                    key={pIdx}
                    className="my-7 p-5 sm:p-7 bg-paper-deep/60 border-l-4 border-brass rounded-r-[2px] font-serif text-[18px] sm:text-[21px] text-ink leading-relaxed italic shadow-2xs"
                  >
                    "{cleanP}"
                  </blockquote>
                );
              }

              return (
                <p
                  key={pIdx}
                  className="font-sans text-[16px] sm:text-[17px] text-ink/90 leading-[1.8] tracking-normal"
                >
                  {cleanP}
                </p>
              );
            })
          ) : (
            <div className="font-sans text-[16px] sm:text-[17px] text-ink/90 leading-[1.8] space-y-4">
              <p>{article.longDescription || article.description}</p>
            </div>
          )}
        </div>

        {/* Structured Key Takeaways Box */}
        {article.highlights && article.highlights.length > 0 && (
          <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-paper-deep/70 border border-rule rounded-[3px] space-y-4 text-left shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brass" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">
                Key Legal Takeaways
              </h3>
            </div>
            <ul className="space-y-3 font-sans text-[14px] sm:text-[14.5px] text-ink-soft leading-relaxed">
              {article.highlights.map((highlight, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2.5">
                  <span className="text-brass font-bold mt-1 font-mono text-xs">0{hIdx + 1}.</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags & Direct Link */}
        <div className="mt-10 pt-6 border-t border-rule/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2.5 py-1 bg-paper-deep text-ink-soft border border-rule/60 rounded-[2px]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="font-sans text-xs font-semibold px-4 py-2 bg-ink text-paper hover:bg-brass rounded-full transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Direct Link</span>
              </>
            )}
          </button>
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 bg-paper border border-rule rounded-[3px] text-left flex flex-col sm:flex-row items-start gap-5">
          <div className="w-14 h-14 rounded-full border border-rule bg-paper-deep overflow-hidden flex-shrink-0">
            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base font-bold text-ink">
              About {personalInfo.name}
            </h4>
            <p className="font-sans text-xs sm:text-[13px] text-ink-soft leading-relaxed">
              {personalInfo.bio}
            </p>
            <div className="pt-1 flex items-center gap-4 font-mono text-xs">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-brass hover:text-ink underline decoration-rule hover:decoration-brass"
              >
                LinkedIn Profile →
              </a>
              <button
                onClick={onBack}
                className="text-ink-soft hover:text-ink cursor-pointer"
              >
                View Full Portfolio →
              </button>
            </div>
          </div>
        </div>

        {/* Read More / Next Articles */}
        {otherArticles.length > 0 && (
          <div className="mt-14 pt-10 border-t border-rule/70 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass font-bold">
                More in Reading Room
              </h3>
              <button
                onClick={onBack}
                className="font-mono text-xs text-ink-soft hover:text-ink cursor-pointer flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherArticles.map((other) => (
                <div
                  key={other.id}
                  onClick={() => onSelectArticle(other)}
                  className="p-4 sm:p-5 bg-paper border border-rule hover:border-ink/50 rounded-[2px] transition-all cursor-pointer group flex flex-col justify-between text-left space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brass font-semibold">
                      {other.category}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-ink group-hover:text-brass transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                  </div>
                  <div className="font-mono text-[11px] text-ink-soft flex items-center gap-1">
                    <span>Read piece</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-12 text-center">
          <button
            id="article-back-bottom-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] px-6 py-2.5 bg-paper-deep border border-rule hover:border-ink text-ink font-medium rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-brass" />
            <span>Back to All Publications</span>
          </button>
        </div>

      </main>

    </article>
  );
}

import React, { useEffect } from 'react';
import { X, Calendar, Clock, User, Newspaper, Share2 } from 'lucide-react';
import { NewsArticle } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className={`w-full max-w-3xl rounded-[2px] border overflow-hidden shadow-2xl my-8 transition-all ${
          isDark ? 'bg-[#121212] border-[#2c2c2c] text-white' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-inherit">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-[2px] bg-[#E50914] text-white text-[10px] font-mono-cinema font-bold">
              {article.category}
            </span>
            <span className="text-xs font-mono-cinema text-slate-400">
              WARTA RESMI CINEMIND
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[2px] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Hero */}
        <div className="relative aspect-[21/9] bg-black overflow-hidden">
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono-cinema mb-2">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(article.publishDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {article.readTime}
              </span>
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1" />
                {article.author}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide leading-tight">
              {article.title}
            </h1>
          </div>

          <div className={`p-4 rounded-[2px] border text-xs sm:text-sm italic font-body text-slate-300 leading-relaxed ${
            isDark ? 'bg-[#181818] border-[#292929]' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            "{article.summary}"
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-body whitespace-pre-line text-justify">
            {article.content}
          </div>

          <div className="pt-6 border-t border-inherit flex items-center justify-between text-xs text-slate-400 font-mono-cinema">
            <span>Diterbitkan oleh Redaksi Medinfo CINEMIND KFTM</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Tautan warta disalin ke papan klip.');
              }}
              className="flex items-center space-x-1 text-slate-300 hover:text-[#E50914] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

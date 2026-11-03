import React, { useEffect } from 'react';
import { X, Award, Film, Calendar, Clock, Video, Building2, User } from 'lucide-react';
import { FilmWork } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface FilmDetailModalProps {
  film: FilmWork | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ film, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!film) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className={`w-full max-w-4xl rounded-[2px] border overflow-hidden shadow-2xl my-8 transition-all ${
          isDark ? 'bg-[#121212] border-[#2c2c2c] text-white' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Top bar with close button */}
        <div className="flex items-center justify-between p-4 border-b border-inherit">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-xs font-mono-cinema uppercase tracking-wider text-[#E50914] font-bold">
              CINEMIND PLAYER • EMBED NOCOOKIE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[2px] text-slate-400 hover:text-white transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Embed Player */}
        <div className="relative aspect-video bg-black w-full overflow-hidden">
          <iframe
            src={film.embedUrl}
            title={film.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Film Details */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono-cinema text-[#E50914] font-bold uppercase mb-1">
                <span>{film.genre}</span>
                <span>•</span>
                <span>{film.year}</span>
                <span>•</span>
                <span>{film.duration}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide">
                {film.title}
              </h2>
            </div>
          </div>

          {/* Credits Grid */}
          <div className={`p-4 rounded-[2px] border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${
            isDark ? 'bg-[#181818] border-[#2a2a2a]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono-cinema block">Sutradara</span>
              <span className="font-semibold">{film.director}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono-cinema block">Produser</span>
              <span className="font-semibold">{film.producer || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono-cinema block">Penata Kamera (DOP)</span>
              <span className="font-semibold">{film.dop || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono-cinema block">Rumah Produksi</span>
              <span className="font-semibold">{film.productionHouse || 'Cinemind Films'}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-2 font-mono-cinema">
              Sinopsis Karya
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body whitespace-pre-line">
              {film.synopsis}
            </p>
          </div>

          {/* Festival Laurels */}
          {film.festivalAwards && film.festivalAwards.length > 0 && (
            <div className="pt-4 border-t border-inherit">
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-amber-500 mb-2.5 flex items-center font-mono-cinema">
                <Award className="w-4 h-4 mr-1.5" />
                Catatan Festival & Penghargaan
              </h4>
              <div className="space-y-1.5">
                {film.festivalAwards.map((award, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-center space-x-2 font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-shrink-0" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

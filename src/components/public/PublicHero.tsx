import React from 'react';
import { Play, Info, Award, Calendar, Clock, Film } from 'lucide-react';
import { FilmWork } from '../../types';

interface PublicHeroProps {
  featuredFilm: FilmWork | null;
  onWatchFilm: (film: FilmWork) => void;
  onExploreFilms: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  featuredFilm,
  onWatchFilm,
  onExploreFilms
}) => {
  if (!featuredFilm) {
    return (
      <div className="relative py-28 bg-[#0A0A0A] text-white text-center">
        <h1 className="text-4xl font-bold font-display uppercase tracking-widest text-[#E50914]">
          CINEMIND FILM SHOWCASE
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Laboratorium Kreasi Mahasiswa Kajian Film, Televisi, dan Media</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[580px] lg:min-h-[680px] flex items-end overflow-hidden bg-black select-none">
      {/* Background Poster Image */}
      <img
        src={featuredFilm.thumbnailUrl}
        alt={featuredFilm.title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 filter contrast-125"
      />

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent max-w-4xl" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 pt-32 w-full">
        <div className="max-w-2xl space-y-4">
          {/* Festival Awards Badge */}
          {featuredFilm.festivalAwards && featuredFilm.festivalAwards.length > 0 && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[2px] bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-[11px] font-mono-cinema uppercase tracking-wider font-bold">
              <Award className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{featuredFilm.festivalAwards[0]}</span>
            </div>
          )}

          {/* Film Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display uppercase tracking-tight text-white leading-none drop-shadow-lg">
            {featuredFilm.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono-cinema">
            <span className="px-2 py-0.5 rounded-[2px] bg-[#E50914] text-white font-bold">
              {featuredFilm.genre}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {featuredFilm.duration}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {featuredFilm.year}
            </span>
            <span>•</span>
            <span className="text-slate-200">
              Karya: <strong>{featuredFilm.director}</strong>
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body max-w-xl line-clamp-3">
            {featuredFilm.synopsis}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onWatchFilm(featuredFilm)}
              className="px-6 py-3 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs sm:text-sm font-display uppercase tracking-wider font-bold transition-all shadow-hard-red flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Tonton Film / Trailer</span>
            </button>

            <button
              onClick={onExploreFilms}
              className="px-6 py-3 rounded-[2px] bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-display uppercase tracking-wider font-bold border border-white/20 transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <Info className="w-4 h-4" />
              <span>Eksplorasi Katalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

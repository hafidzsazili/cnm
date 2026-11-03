import React, { useState } from 'react';
import { Play, Award, Film, Search, Filter, Calendar, Clock } from 'lucide-react';
import { FilmWork } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PublicFilmShowcaseProps {
  films: FilmWork[];
  onSelectFilm: (film: FilmWork) => void;
}

export const PublicFilmShowcase: React.FC<PublicFilmShowcaseProps> = ({
  films,
  onSelectFilm
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');

  // Extract all unique genres
  const genres = ['ALL', ...Array.from(new Set(films.map(f => f.genre.split('/')[0].trim())))];

  const filteredFilms = films.filter((f) => {
    const matchSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGenre = selectedGenre === 'ALL' || f.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchSearch && matchGenre;
  });

  return (
    <section id="karya" className={`py-16 sm:py-20 border-b transition-colors ${
      isDark ? 'bg-[#0A0A0A] border-[#1F1F1F]' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
              <Film className="w-4 h-4" />
              <span>Etalase Sinema Mahasiswa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-wide">
              Katalog Karya Film Mahasiswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-body">
              Koleksi film pendek fiksi, dokumenter, dan eksperimental karya sineas muda Himpunan Mahasiswa KFTM CINEMIND.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, sutradara, genre..."
                className={`pl-9 pr-3 py-1.5 rounded-[2px] border text-xs focus-cinema w-full sm:w-60 ${
                  isDark ? 'bg-[#141414] border-[#2c2c2c] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Film Cards Grid (16:9) */}
        {filteredFilms.length === 0 ? (
          <div className={`p-12 text-center rounded-[2px] border ${
            isDark ? 'border-[#222] bg-[#111]' : 'border-slate-200 bg-slate-50'
          }`}>
            <p className="text-xs text-slate-400">Tidak ada film yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film, idx) => (
              <div
                key={film.id}
                onClick={() => onSelectFilm(film)}
                className={`group cursor-pointer rounded-[2px] border overflow-hidden shadow-hard transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-[#121212] border-[#242424] hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* 16:9 Thumbnail Frame with Hover Play Button */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={film.thumbnailUrl}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Slot Pill Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-[2px] bg-black/80 text-white text-[10px] font-mono-cinema font-bold border border-white/20">
                      SLOT #{idx + 1}
                    </span>
                    {film.featured && (
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#E50914] text-white text-[9px] font-mono-cinema font-bold shadow-hard-red">
                        UNGGULAN
                      </span>
                    )}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 font-mono-cinema">
                    <span>{film.duration}</span>
                    <span>{film.year}</span>
                  </div>
                </div>

                {/* Film Card Body */}
                <div className="p-4 flex flex-col">
                  <div className="text-[10px] font-mono-cinema text-[#E50914] font-bold uppercase mb-1">
                    {film.genre}
                  </div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wide group-hover:text-[#E50914] transition-colors truncate" title={film.title}>
                    {film.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 mb-2 font-body">
                    Sutradara: <span className="text-slate-200 font-semibold">{film.director}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-body">
                    {film.synopsis}
                  </p>

                  {/* Festival Laurels Preview */}
                  {film.festivalAwards && film.festivalAwards.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-inherit flex items-center text-[10px] text-amber-500 font-mono-cinema truncate">
                      <Award className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{film.festivalAwards[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

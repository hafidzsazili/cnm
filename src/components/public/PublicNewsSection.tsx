import React from 'react';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PublicNewsSectionProps {
  news: NewsArticle[];
  onSelectNews: (article: NewsArticle) => void;
}

export const PublicNewsSection: React.FC<PublicNewsSectionProps> = ({
  news,
  onSelectNews
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="berita" className={`py-16 sm:py-20 border-b transition-colors ${
      isDark ? 'bg-[#0E0E0E] border-[#1F1F1F]' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Publikasi & Siaran Pers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-wide">
              Warta Kegiatan & Catatan Sinema
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-body">
              Siaran pers resmi, kabar festival, workshop sinematografi, dan kegiatan Himpunan Mahasiswa KFTM CINEMIND.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item)}
              className={`group cursor-pointer rounded-[2px] border overflow-hidden shadow-hard flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                isDark ? 'bg-[#141414] border-[#262626] hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="relative aspect-[16/9] bg-black overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#E50914] text-white text-[10px] font-mono-cinema font-bold shadow-hard-red">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.publishDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide group-hover:text-[#E50914] transition-colors line-clamp-2 mb-2" title={item.title}>
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-body mb-4">
                  {item.summary}
                </p>

                <div className="mt-auto pt-3 border-t border-inherit flex items-center justify-between text-xs font-semibold text-[#E50914]">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

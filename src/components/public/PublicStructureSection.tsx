import React from 'react';
import { Network, ShieldCheck } from 'lucide-react';
import { Officer } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PublicStructureSectionProps {
  officers: Officer[];
}

export const PublicStructureSection: React.FC<PublicStructureSectionProps> = ({ officers }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="struktur" className={`py-16 sm:py-20 border-b transition-colors ${
      isDark ? 'bg-[#0A0A0A] border-[#1F1F1F]' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[2px] bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-xs font-mono-cinema uppercase tracking-wider font-semibold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Kabinet Sinema Lentera 2026/2027</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-wide">
            Struktur Pengurus Organisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-body">
            Fungsionaris Himpunan Mahasiswa Kajian Film, Televisi, dan Media "CINEMIND" yang berdedikasi mengawal kemajuan sinema kampus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.map((off) => (
            <div
              key={off.id}
              className={`rounded-[2px] border overflow-hidden shadow-hard flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                isDark ? 'bg-[#121212] border-[#242424] hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="relative aspect-[4/5] bg-black overflow-hidden group">
                <img
                  src={off.avatar}
                  alt={off.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] font-mono-cinema text-[#E50914] font-bold uppercase tracking-wider">
                    {off.division}
                  </div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wide truncate">
                    {off.name}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium font-body truncate">
                    {off.roleTitle}
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  {off.bio}
                </p>
                {off.nim && (
                  <div className="mt-3 pt-2.5 border-t border-inherit text-[10px] text-slate-400 font-mono-cinema">
                    NIM. {off.nim}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

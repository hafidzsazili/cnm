import React from 'react';
import { Film, Clapperboard, Video, BookOpen, Award, Target, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PublicAboutSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pillars = [
    {
      icon: Clapperboard,
      title: 'Inkubasi Produksi Film',
      desc: 'Memfasilitasi peminjaman perlengkapan kamera bioskop, lokakarya penulisan skenario, dan pendampingan mentor untuk produksi karya tugas akhir mahasiswa.'
    },
    {
      icon: Eye,
      title: 'Eksibisi & Kurasi Sinema',
      desc: 'Menyelenggarakan pemutaran berkala, forum screening night bulanan, dan mendistribusikan film mahasiswa ke festival film nasional maupun internasional.'
    },
    {
      icon: BookOpen,
      title: 'Kajian Kritis & Arsip Media',
      desc: 'Menerbitkan esai dan ulasan kritis perfilman, mendokumentasikan arsip audiovisual karya mahasiswa, dan membedah isu sosial melalui perspektif sinema.'
    }
  ];

  return (
    <section id="tentang" className={`py-16 sm:py-24 border-b transition-colors ${
      isDark ? 'bg-[#0E0E0E] border-[#1F1F1F]' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & About */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
                <Target className="w-4 h-4" />
                <span>Manifesto & Visi Organisasi</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-wide leading-tight">
                Menghidupkan Gagasan Melalui Bingkai Sinematik
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body text-justify">
              <strong>Himpunan Mahasiswa Kajian Film, Televisi, dan Media (KFTM) "CINEMIND"</strong> adalah organisasi intra-kampus yang mewadahi eksplorasi estetika, ketajaman analisis media, dan keberanian bertutur lewat media audio-visual.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-body text-justify">
              Berlandaskan semangat independensi dan kebebasan berekspresi, kami percaya bahwa setiap potongan adegan dan lantunan audio menyimpan kekuatan untuk merefleksikan dinamika kemanusiaan serta realitas sosial di sekitar kita.
            </p>

            {/* Quick Stat Counter */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-inherit">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[#E50914]">35+</div>
                <div className="text-[11px] text-slate-400 font-mono-cinema uppercase mt-0.5">Produksi Film</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-white">18</div>
                <div className="text-[11px] text-slate-400 font-mono-cinema uppercase mt-0.5">Penghargaan</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-white">120+</div>
                <div className="text-[11px] text-slate-400 font-mono-cinema uppercase mt-0.5">Anggota Aktif</div>
              </div>
            </div>
          </div>

          {/* Right Column: Three Pillars */}
          <div className="lg:col-span-6 space-y-4">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-[2px] border shadow-hard flex items-start space-x-4 transition-all ${
                    isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-[2px] bg-[#E50914]/10 text-[#E50914] flex items-center justify-center flex-shrink-0 border border-[#E50914]/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display uppercase tracking-wide mb-1">
                      {pil.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-body">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

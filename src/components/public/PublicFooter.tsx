import React from 'react';
import { Film, Lock, Mail, MapPin, Instagram, Youtube, Globe, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PublicFooterProps {
  onSecretAdminTrigger: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onSecretAdminTrigger }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors ${
      isDark ? 'bg-[#080808] border-[#1F1F1F] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-[2px] bg-[#E50914] flex items-center justify-center text-white font-bold tracking-wider font-display text-base shadow-hard-red">
                CIN
              </div>
              <span className="font-bold tracking-wider font-display text-lg text-white">
                CINEMIND
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Himpunan Mahasiswa Kajian Film, Televisi, dan Media (KFTM). Wadah eksplorasi sinematografi, analisis kritis, dan eksibisi karya mahasiswa.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300 mb-3 font-mono-cinema">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs font-body">
              <li>
                <a href="#karya" className="hover:text-[#E50914] transition-colors">Katalog Film Mahasiswa</a>
              </li>
              <li>
                <a href="#berita" className="hover:text-[#E50914] transition-colors">Warta & Siaran Pers</a>
              </li>
              <li>
                <a href="#struktur" className="hover:text-[#E50914] transition-colors">Struktur Kabinet 2026/2027</a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#E50914] transition-colors">Tentang Organisasi</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sekretariat */}
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300 mb-3 font-mono-cinema">
              Sekretariat & Kontak
            </h4>
            <div className="space-y-2 text-xs font-body text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E50914]" />
                <span>Gedung Pusat Kegiatan Mahasiswa (PKM) Lt. 2, Kampus Terpadu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#E50914]" />
                <span>sekretariat@cinemind.ac.id</span>
              </div>
            </div>
          </div>

          {/* Col 4: Secret Admin Gateway & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300 mb-3 font-mono-cinema">
              Gerbang Akses Internal
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-body">
              Akses khusus fungsionaris pengurus untuk modul persuratan, buku kas, dan CMS publik.
            </p>

            <button
              onClick={onSecretAdminTrigger}
              className={`w-full p-2.5 rounded-[2px] border text-left text-xs transition-all flex items-center justify-between group ${
                isDark ? 'bg-[#121212] border-[#2c2c2c] hover:border-[#E50914]' : 'bg-white border-slate-300 hover:border-[#E50914]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="font-mono-cinema text-[11px] group-hover:text-[#E50914] transition-colors">
                  Masuk Portal SIM
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-cinema">Ctrl+Shift+A</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-inherit flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono-cinema gap-3">
          <div>
            © 2026 Himpunan Mahasiswa KFTM CINEMIND • All Rights Reserved
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-3 h-3 text-emerald-500 mr-1" />
              RBAC Protected
            </span>
            <span>v2.4.0 (Sinema Lentera)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Film, Sun, Moon, Lock, Menu, X, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PublicNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminTrigger = () => {
    window.location.hash = 'admin';
  };

  return (
    <nav className={`sticky top-0 z-40 border-b transition-colors shadow-sm ${
      isDark ? 'bg-[#0A0A0A]/95 border-[#262626] backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-[2px] bg-[#E50914] flex items-center justify-center text-white font-bold tracking-wider font-display text-base shadow-hard-red group-hover:bg-[#c20811] transition-colors">
            CIN
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider font-display text-lg text-white">
                CINEMIND
              </span>
              <span className="text-[10px] text-slate-400 font-mono-cinema px-1.5 py-0.2 rounded-[2px] border border-inherit">
                KFTM
              </span>
            </div>
            <p className="text-[9px] text-slate-400 -mt-1 font-mono-cinema">
              Kajian Film, Televisi, dan Media
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-display tracking-wider uppercase font-semibold">
          <button 
            onClick={() => scrollTo('karya')}
            className="text-slate-300 hover:text-[#E50914] transition-colors"
          >
            Karya Film
          </button>
          <button 
            onClick={() => scrollTo('berita')}
            className="text-slate-300 hover:text-[#E50914] transition-colors"
          >
            Warta & Pers
          </button>
          <button 
            onClick={() => scrollTo('struktur')}
            className="text-slate-300 hover:text-[#E50914] transition-colors"
          >
            Struktur Kabinet
          </button>
          <button 
            onClick={() => scrollTo('tentang')}
            className="text-slate-300 hover:text-[#E50914] transition-colors"
          >
            Tentang Kami
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2 rounded-[2px] border text-xs transition-colors ${
              isDark 
                ? 'bg-[#181818] border-[#333] hover:border-slate-500 text-amber-400' 
                : 'bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-700'
            }`}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Discreet Admin Lock Button */}
          <button
            onClick={handleAdminTrigger}
            className={`p-2 rounded-[2px] border text-xs transition-colors group flex items-center space-x-1 ${
              isDark 
                ? 'bg-[#181818] border-[#333] hover:border-[#E50914] text-slate-400 hover:text-[#E50914]' 
                : 'bg-slate-100 border-slate-300 hover:border-[#E50914] text-slate-600 hover:text-[#E50914]'
            }`}
            title="Akses SIM Internal Pengurus (Ctrl+Shift+A)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-mono-cinema">SIM</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[2px] md:hidden text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-3 font-display uppercase tracking-wider text-xs ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => scrollTo('karya')}
            className="block w-full text-left py-2 hover:text-[#E50914]"
          >
            Karya Film
          </button>
          <button
            onClick={() => scrollTo('berita')}
            className="block w-full text-left py-2 hover:text-[#E50914]"
          >
            Warta & Pers
          </button>
          <button
            onClick={() => scrollTo('struktur')}
            className="block w-full text-left py-2 hover:text-[#E50914]"
          >
            Struktur Kabinet
          </button>
          <button
            onClick={() => scrollTo('tentang')}
            className="block w-full text-left py-2 hover:text-[#E50914]"
          >
            Tentang Kami
          </button>
          <button
            onClick={handleAdminTrigger}
            className="block w-full text-left py-2 text-[#E50914] font-bold"
          >
            Masuk Portal SIM Internal
          </button>
        </div>
      )}
    </nav>
  );
};

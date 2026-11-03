import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Archive, 
  Wallet, 
  Users, 
  Network, 
  Film, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronDown, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SimLayoutProps {
  currentUser: User;
  availableUsers: User[];
  currentView: string;
  onNavigate: (view: string) => void;
  onSwitchUser: (user: User) => void;
  onReturnToPublic: () => void;
  children: React.ReactNode;
}

export const SimLayout: React.FC<SimLayoutProps> = ({
  currentUser,
  availableUsers,
  currentView,
  onNavigate,
  onSwitchUser,
  onReturnToPublic,
  children
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'bph_inti':
        return { text: 'SUPERADMIN', color: 'bg-red-500/10 text-red-500 border-red-500/30' };
      case 'bph_sekretaris':
        return { text: 'SEKRETARIS', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' };
      case 'bph_bendahara':
        return { text: 'BENDAHARA', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' };
      case 'admin_medinfo':
        return { text: 'MEDINFO CMS', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' };
      default:
        return { text: role, color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
    }
  };

  const navSections = [
    {
      title: 'IKHTISAR UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roleNote: 'Semua Role' }
      ]
    },
    {
      title: 'TATA KELOLA PERSURATAN',
      items: [
        { id: 'surat-buat', label: 'Generator Surat Resmi', icon: FileText, roleNote: 'Sekretaris / Inti' },
        { id: 'surat-arsip', label: 'Arsip Dokumen Surat', icon: Archive, roleNote: 'Sekretaris / Inti' }
      ]
    },
    {
      title: 'KEBENDAHARAAN & KAS',
      items: [
        { id: 'keuangan', label: 'Buku Kas & Running Balance', icon: Wallet, roleNote: 'Bendahara / Inti' }
      ]
    },
    {
      title: 'SUMBER DAYA ORGANISASI',
      items: [
        { id: 'anggota', label: 'Database Buku Induk Anggota', icon: Users, roleNote: 'BPH' },
        { id: 'struktur', label: 'Struktur Kabinet & Tupoksi', icon: Network, roleNote: 'Semua Role' }
      ]
    },
    {
      title: 'MANAJEMEN KONTEN PUBLIK',
      items: [
        { id: 'cms', label: 'Etalase Film & Warta Berita', icon: Film, roleNote: 'Medinfo / Inti' }
      ]
    }
  ];

  const badge = getRoleBadge(currentUser.role);

  return (
    <div className={`min-h-screen flex flex-col font-body transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* TOPBAR */}
      <header className={`sticky top-0 z-40 border-b px-4 lg:px-6 h-16 flex items-center justify-between transition-colors shadow-sm ${
        isDark ? 'bg-[#121212]/95 border-[#262626] backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-[2px] lg:hidden text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#E50914] flex items-center justify-center text-white font-bold tracking-wider font-display text-sm shadow-hard-red">
              CIN
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-wider font-display text-base">
                  CINEMIND
                </span>
                <span className="text-[10px] uppercase font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30 font-semibold">
                  SIM INTERNAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono-cinema">
                Sistem Informasi Manajemen KFTM
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick RBAC Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-[2px] border text-xs transition-all ${
                isDark 
                  ? 'bg-[#1a1a1a] border-[#333] hover:border-slate-500' 
                  : 'bg-slate-100 border-slate-300 hover:border-slate-400'
              }`}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="w-5 h-5 rounded-[2px] object-cover"
              />
              <span className="font-medium hidden sm:inline">{currentUser.name}</span>
              <span className={`text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] border ${badge.color}`}>
                {badge.text}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-72 rounded-[2px] border shadow-hard-dark p-2 z-50 transition-all ${
                isDark ? 'bg-[#181818] border-[#333]' : 'bg-white border-slate-200'
              }`}>
                <div className="px-2.5 py-1.5 border-b border-inherit mb-1 text-[11px] font-semibold text-slate-400 uppercase font-mono-cinema">
                  Ganti Akun Penguji (RBAC Simulation):
                </div>
                {availableUsers.map((u) => {
                  const isSelected = u.nim === currentUser.nim;
                  const uBadge = getRoleBadge(u.role);
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-[2px] text-xs flex items-center space-x-2.5 transition-colors ${
                        isSelected 
                          ? 'bg-[#E50914]/10 text-[#E50914] font-semibold' 
                          : isDark ? 'hover:bg-[#222]' : 'hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-7 h-7 rounded-[2px] object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono-cinema truncate">
                          {u.nim} • {uBadge.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2 rounded-[2px] border text-xs transition-colors ${
              isDark 
                ? 'bg-[#1a1a1a] border-[#333] hover:border-slate-500 text-amber-400' 
                : 'bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-700'
            }`}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap Sinema'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Return to Public Website */}
          <button
            onClick={onReturnToPublic}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display uppercase tracking-wider transition-all shadow-hard-red"
            title="Keluar dari SIM & Buka Portal Publik"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Portal Publik</span>
          </button>
        </div>
      </header>

      {/* BODY WITH SIDEBAR & CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`w-64 border-r flex flex-col flex-shrink-0 transition-all ${
          isDark ? 'bg-[#0E0E0E] border-[#222222]' : 'bg-slate-100/60 border-slate-200'
        } ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 flex shadow-2xl mt-16 lg:mt-0' : 'hidden lg:flex'}`}>
          <div className="p-4 border-b border-inherit">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono-cinema">
              <Building2 className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="truncate">KABINET SINEMA LENTERA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono-cinema">
              Periode 2026 / 2027
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono-cinema mb-1.5">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-[#E50914] text-white shadow-hard-red font-semibold'
                          : isDark
                            ? 'text-slate-300 hover:bg-[#1a1a1a] hover:text-white'
                            : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#E50914]'
                        }`} />
                        <span className="truncate font-body">{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-mono-cinema px-1 py-0.2 rounded-[2px] ml-1 flex-shrink-0 ${
                        isActive 
                          ? 'bg-black/30 text-white/90' 
                          : isDark ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-black/5'
                      }`}>
                        {item.roleNote}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer inside sidebar */}
          <div className="p-3 border-t border-inherit text-[11px] text-slate-400 font-mono-cinema flex items-center justify-between">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              RBAC Aktif
            </span>
            <span className="text-[10px] text-slate-400">v2.4.0</span>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

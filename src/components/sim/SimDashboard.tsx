import React from 'react';
import { 
  Wallet, 
  Users, 
  FileText, 
  Film, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  ChevronRight, 
  Shield, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  User, 
  Member, 
  Letter, 
  FinanceTransaction, 
  FilmWork, 
  BalanceSummary 
} from '../../types';
import { StorageService } from '../../services/storage';
import { useTheme } from '../../context/ThemeContext';

interface SimDashboardProps {
  currentUser: User;
  members: Member[];
  letters: Letter[];
  finances: FinanceTransaction[];
  works: FilmWork[];
  balanceData: BalanceSummary;
  onNavigate: (view: string) => void;
  onOpenLetter: () => void;
}

export const SimDashboard: React.FC<SimDashboardProps> = ({
  currentUser,
  members,
  letters,
  finances,
  works,
  balanceData,
  onNavigate,
  onOpenLetter
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const activeMembers = members.filter((m) => m.status === 'Aktif').length;
  const publishedLetters = letters.filter((l) => l.status === 'Diterbitkan').length;

  // Build Recent Activity Feed from combined datasets
  interface ActivityItem {
    id: string;
    type: 'finance' | 'letter' | 'film' | 'member';
    title: string;
    subtitle: string;
    timestamp: number;
    badge: string;
    badgeColor: string;
  }

  const activities: ActivityItem[] = [];

  finances.slice(0, 4).forEach((f) => {
    activities.push({
      id: `f-${f.id}`,
      type: 'finance',
      title: `${f.type === 'in' ? 'Kas Masuk' : 'Kas Keluar'}: ${StorageService.formatRupiah(f.amount)}`,
      subtitle: `${f.category} — ${f.description}`,
      timestamp: f.createdAt || new Date(f.transactionDate).getTime(),
      badge: f.type === 'in' ? 'Debit' : 'Kredit',
      badgeColor: f.type === 'in' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
    });
  });

  letters.slice(0, 3).forEach((l) => {
    activities.push({
      id: `l-${l.id}`,
      type: 'letter',
      title: `Surat Resmi Diterbitkan: ${l.letterNumber}`,
      subtitle: `Perihal: ${l.subject}`,
      timestamp: l.createdAt,
      badge: l.classificationCode,
      badgeColor: 'text-blue-500 bg-blue-500/10'
    });
  });

  works.slice(0, 3).forEach((w) => {
    activities.push({
      id: `w-${w.id}`,
      type: 'film',
      title: `Katalog Film: "${w.title}" (${w.year})`,
      subtitle: `Sutradara: ${w.director} • Durasi: ${w.duration}`,
      timestamp: w.createdAt,
      badge: 'Film CMS',
      badgeColor: 'text-purple-500 bg-purple-500/10'
    });
  });

  activities.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-[2px] border relative overflow-hidden shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#E50914]/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Informasi Manajemen Terintegrasi</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display uppercase tracking-wide">
              Selamat Bertugas, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-body">
              Masuk sebagai <span className="font-semibold text-slate-200">{currentUser.roleLabel}</span> ({currentUser.division}). Seluruh perubahan data langsung tersinkronisasi dengan Firestore.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('surat-buat')}
              className="px-3.5 py-2 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Surat</span>
            </button>
            <button
              onClick={() => onNavigate('keuangan')}
              className={`px-3.5 py-2 rounded-[2px] border text-xs font-semibold font-display tracking-wider uppercase transition-all ${
                isDark 
                  ? 'border-[#333] bg-[#1a1a1a] hover:border-slate-500 text-slate-200' 
                  : 'border-slate-300 bg-slate-100 hover:border-slate-400 text-slate-700'
              }`}
            >
              <span>Catat Kas</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Saldo Kas */}
        <div className={`p-5 rounded-[2px] border shadow-hard transition-all ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema">
              Total Saldo Berjalan
            </span>
            <div className="w-8 h-8 rounded-[2px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display tracking-wide text-emerald-500">
            {StorageService.formatRupiah(balanceData.currentBalance)}
          </div>
          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema">
            <span className="flex items-center text-emerald-500">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              In: {StorageService.formatRupiah(balanceData.totalIn)}
            </span>
            <span className="flex items-center text-red-500">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              Out: {StorageService.formatRupiah(balanceData.totalOut)}
            </span>
          </div>
        </div>

        {/* KPI 2: Anggota Aktif */}
        <div className={`p-5 rounded-[2px] border shadow-hard transition-all ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema">
              Anggota Aktif Himpunan
            </span>
            <div className="w-8 h-8 rounded-[2px] bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display tracking-wide">
            {activeMembers} <span className="text-xs font-normal text-slate-400 font-body">Mahasiswa</span>
          </div>
          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema">
            <span>Total Terdata: {members.length}</span>
            <span>Alumni: {members.filter((m) => m.status === 'Alumni').length}</span>
          </div>
        </div>

        {/* KPI 3: Surat Diterbitkan */}
        <div className={`p-5 rounded-[2px] border shadow-hard transition-all ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema">
              Surat Resmi Diterbitkan
            </span>
            <div className="w-8 h-8 rounded-[2px] bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display tracking-wide">
            {publishedLetters} <span className="text-xs font-normal text-slate-400 font-body">Dokumen</span>
          </div>
          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema truncate">
            <span>Arsip: {letters.length} Total</span>
            <button 
              onClick={onOpenLetter}
              className="text-[#E50914] hover:underline"
            >
              Lihat Arsip
            </button>
          </div>
        </div>

        {/* KPI 4: Katalog Film */}
        <div className={`p-5 rounded-[2px] border shadow-hard transition-all ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema">
              Katalog Film Mahasiswa
            </span>
            <div className="w-8 h-8 rounded-[2px] bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display tracking-wide">
            {works.length} <span className="text-xs font-normal text-slate-400 font-body">Karya</span>
          </div>
          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema">
            <span>Unggulan: {works.filter((w) => w.featured).length}</span>
            <span className="text-emerald-500 font-medium">Publik Tayang</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT ACTIVITIES & SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities (2 Cols) */}
        <div className={`lg:col-span-2 p-6 rounded-[2px] border shadow-hard ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#E50914]" />
              <h2 className="text-sm font-bold font-display uppercase tracking-wide">
                Log Aktivitas Organisasi Terkini
              </h2>
            </div>
            <span className="text-[10px] font-mono-cinema text-slate-400">Real-time Stream</span>
          </div>

          <div className="divide-y divide-inherit">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada rekaman aktivitas.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start justify-between gap-3 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-mono-cinema font-bold px-1.5 py-0.5 rounded-[2px] ${act.badgeColor}`}>
                        {act.badge}
                      </span>
                      <h4 className="text-xs font-semibold truncate group-hover:text-[#E50914] transition-colors font-body">
                        {act.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-body">
                      {act.subtitle}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-cinema flex-shrink-0 flex items-center pt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(act.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick RBAC Rights & Shortcuts (1 Col) */}
        <div className="space-y-4">
          {/* RBAC Rights Panel */}
          <div className={`p-5 rounded-[2px] border shadow-hard ${
            isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-inherit">
              <Shield className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold font-display uppercase tracking-wide">
                Hak Akses Anda ({currentUser.role})
              </h3>
            </div>
            
            <ul className="space-y-2 text-xs font-body">
              <li className="flex items-center justify-between text-slate-300">
                <span>Modul Persuratan</span>
                {currentUser.role === 'bph_inti' || currentUser.role === 'bph_sekretaris' ? (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 font-semibold">
                    DIIZINKAN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-red-500/10 text-red-400">
                    DIBATASI
                  </span>
                )}
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Buku Kas Digital</span>
                {currentUser.role === 'bph_inti' || currentUser.role === 'bph_bendahara' ? (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 font-semibold">
                    DIIZINKAN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-red-500/10 text-red-400">
                    DIBATASI
                  </span>
                )}
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Database Anggota</span>
                {currentUser.role !== 'admin_medinfo' ? (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 font-semibold">
                    DIIZINKAN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-red-500/10 text-red-400">
                    DIBATASI
                  </span>
                )}
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>CMS Etalase & Warta</span>
                {currentUser.role === 'bph_inti' || currentUser.role === 'admin_medinfo' ? (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 font-semibold">
                    DIIZINKAN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-red-500/10 text-red-400">
                    DIBATASI
                  </span>
                )}
              </li>
            </ul>
          </div>

          {/* Quick Shortcuts */}
          <div className={`p-5 rounded-[2px] border shadow-hard ${
            isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-bold font-display uppercase tracking-wide mb-3">
              Pintasan Modul Cepat
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('surat-buat')}
                className={`w-full p-2.5 rounded-[2px] border text-left text-xs flex items-center justify-between transition-colors ${
                  isDark ? 'border-[#262626] hover:bg-[#1a1a1a]' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Keluarkan Surat Tugas / SK</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('keuangan')}
                className={`w-full p-2.5 rounded-[2px] border text-left text-xs flex items-center justify-between transition-colors ${
                  isDark ? 'border-[#262626] hover:bg-[#1a1a1a]' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Buku Kas & Ekspor CSV</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('anggota')}
                className={`w-full p-2.5 rounded-[2px] border text-left text-xs flex items-center justify-between transition-colors ${
                  isDark ? 'border-[#262626] hover:bg-[#1a1a1a]' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Buku Induk Anggota</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('cms')}
                className={`w-full p-2.5 rounded-[2px] border text-left text-xs flex items-center justify-between transition-colors ${
                  isDark ? 'border-[#262626] hover:bg-[#1a1a1a]' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Film className="w-3.5 h-3.5 text-purple-500" />
                  <span>Unggah Karya Film Baru</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldX, ArrowLeft, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

interface SimAccessDeniedProps {
  currentRole: UserRole;
  requiredRoleDescription: string;
  onNavigateHome: () => void;
}

export const SimAccessDenied: React.FC<SimAccessDeniedProps> = ({
  currentRole,
  requiredRoleDescription,
  onNavigateHome
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 rounded-[2px] border flex flex-col items-center justify-center text-center my-8 shadow-hard ${
      isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
    }`}>
      <div className="w-16 h-16 rounded-[2px] bg-red-500/10 border border-red-500/30 text-[#E50914] flex items-center justify-center mb-5">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[2px] bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-mono-cinema uppercase mb-3">
        <Lock className="w-3.5 h-3.5" />
        <span>HTTP 403 Forbidden / Access Denied</span>
      </div>

      <h2 className="text-2xl font-bold font-display uppercase tracking-wide mb-2">
        Akses Modul Dibatasi oleh Sistem RBAC
      </h2>

      <p className="max-w-lg text-xs text-slate-400 mb-6 font-body leading-relaxed">
        Role Anda saat ini (<code className="text-amber-500 font-mono-cinema font-semibold">{currentRole}</code>) tidak memiliki izin otorisasi untuk mengakses atau memodifikasi modul ini. Modul ini hanya diperuntukkan bagi: <br />
        <strong className="text-slate-200">{requiredRoleDescription}</strong>.
      </p>

      <button
        onClick={onNavigateHome}
        className="px-5 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard Utama</span>
      </button>
    </div>
  );
};

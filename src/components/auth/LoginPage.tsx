import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onRequirePasswordChange: (pendingUser: User, temporaryToken: string) => void;
  onReturnToPublic: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onRequirePasswordChange,
  onReturnToPublic
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [nim, setNim] = useState('230101001');
  const [password, setPassword] = useState('cinemind2026');
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableUsers = StorageService.getAvailableUsers();

  const handleRecaptchaClick = () => {
    if (recaptchaChecked || recaptchaLoading) return;
    setRecaptchaLoading(true);
    setTimeout(() => {
      setRecaptchaLoading(false);
      setRecaptchaChecked(true);
      setErrorMessage(null);
    }, 700);
  };

  const handleSelectPreset = (targetUser: User) => {
    setNim(targetUser.nim);
    setPassword('cinemind2026');
    setErrorMessage(null);
    setRecaptchaChecked(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nim.trim()) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }
    if (!recaptchaChecked) {
      setErrorMessage('Harap selesaikan verifikasi reCAPTCHA "Saya bukan robot".');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = StorageService.verifyCredentials(nim, password);
      setIsSubmitting(false);

      if (!result.user) {
        setErrorMessage(result.reason || 'Kredensial login tidak valid.');
        return;
      }

      const verifiedUser = result.user;
      const token = StorageService.generateJwtSimulation(verifiedUser);

      // Check HTTP 428 Precondition Required: First Login
      if (verifiedUser.is_first_login) {
        onRequirePasswordChange(verifiedUser, token);
        return;
      }

      onLoginSuccess(verifiedUser, token);
    }, 500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className={`w-full max-w-lg border rounded-[2px] p-8 shadow-hard transition-all ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-inherit">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#E50914] flex items-center justify-center text-white font-bold tracking-wider font-display text-base">
              CIN
            </div>
            <div>
              <h1 className="text-lg font-bold font-display uppercase tracking-wide">
                CINEMIND SIM PORTAL
              </h1>
              <p className="text-xs text-slate-400 font-mono-cinema">
                Sistem Informasi Manajemen Pengurus KFTM
              </p>
            </div>
          </div>
          <button
            onClick={onReturnToPublic}
            className="text-xs text-slate-400 hover:text-[#E50914] flex items-center transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Portal Publik
          </button>
        </div>

        {/* Quick Role Tester Shortcuts */}
        <div className={`mb-6 p-3.5 rounded-[2px] border text-xs ${
          isDark ? 'bg-[#181818] border-[#2c2c2c]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] font-mono-cinema flex items-center">
              <KeyRound className="w-3 h-3 mr-1 text-[#E50914]" />
              Preset Akun Uji Coba RBAC:
            </span>
            <span className="text-[10px] text-slate-400 font-mono-cinema">Pass: cinemind2026</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableUsers.map((u) => {
              const isSelected = nim === u.nim;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectPreset(u)}
                  className={`text-left p-2 rounded-[2px] border transition-all text-[11px] truncate ${
                    isSelected
                      ? 'border-[#E50914] bg-[#E50914]/10 text-[#E50914] font-semibold'
                      : isDark
                        ? 'border-[#2d2d2d] bg-[#121212] text-slate-300 hover:border-slate-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                  title={`${u.name} (${u.role})`}
                >
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 truncate font-mono-cinema">
                    {u.role}
                    {u.is_first_login ? ' (428 Reset)' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-[2px] border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1 font-body">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono-cinema">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 230101001"
                className={`w-full pl-10 pr-4 py-2.5 rounded-[2px] border text-xs font-mono-cinema focus-cinema transition-all ${
                  isDark
                    ? 'bg-[#181818] border-[#333333] text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono-cinema">
              Kata Sandi Pengurus
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-[2px] border text-xs focus-cinema transition-all ${
                  isDark
                    ? 'bg-[#181818] border-[#333333] text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Google reCAPTCHA v2 Interactive Box */}
          <div className={`p-3.5 border rounded-[2px] flex items-center justify-between select-none ${
            isDark ? 'bg-[#181818] border-[#333333]' : 'bg-slate-50 border-slate-300'
          }`}>
            <div 
              onClick={handleRecaptchaClick}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-[2px] border flex items-center justify-center transition-all ${
                recaptchaChecked 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : isDark ? 'border-slate-600 bg-[#222] group-hover:border-slate-400' : 'border-slate-400 bg-white group-hover:border-slate-500'
              }`}>
                {recaptchaLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                ) : recaptchaChecked ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : null}
              </div>
              <span className="text-xs font-medium font-body">
                Saya bukan robot
              </span>
            </div>

            <div className="flex flex-col items-center pl-4 border-l border-inherit">
              <img 
                src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                alt="reCAPTCHA logo" 
                className="w-7 h-7 object-contain opacity-80" 
              />
              <span className="text-[9px] text-slate-400 font-mono-cinema tracking-tighter mt-0.5">
                reCAPTCHA v2
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white font-semibold text-xs font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Kredensial & RBAC...</span>
              </>
            ) : (
              <span>Masuk Sistem Informasi Manajemen</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400 font-mono-cinema">
          <span>Autentikasi: HMAC SHA-256 JWT</span>
          <span className="flex items-center text-amber-500">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Enkripsi Bcrypt
          </span>
        </div>
      </div>
    </div>
  );
};

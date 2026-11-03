import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ChangePasswordPageProps {
  pendingUser: User;
  temporaryToken: string;
  onPasswordChangedSuccess: (updatedUser: User, token: string) => void;
  onCancelToLogin: () => void;
}

export const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
  pendingUser,
  temporaryToken,
  onPasswordChangedSuccess,
  onCancelToLogin
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength checklist
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUpperOrLower = /[a-zA-Z]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hasMinLength) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.');
      return;
    }
    if (!hasNumber) {
      setErrorMessage('Kata sandi harus mengandung setidaknya satu angka.');
      return;
    }
    if (!isMatch) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (newPassword === 'cinemind2026') {
      setErrorMessage('Kata sandi baru tidak boleh sama dengan kata sandi bawaan awal.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updated = StorageService.updatePassword(pendingUser.nim, newPassword);
      setIsSubmitting(false);

      if (!updated) {
        setErrorMessage('Gagal memperbarui kata sandi. Silakan coba lagi.');
        return;
      }

      const newToken = StorageService.generateJwtSimulation(updated);
      onPasswordChangedSuccess(updated, newToken);
    }, 600);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className={`w-full max-w-lg border rounded-[2px] p-8 shadow-hard transition-all ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-inherit">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-[2px] bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display uppercase tracking-wide">
                Ubah Kata Sandi Awal Pengurus
              </h1>
              <p className="text-xs text-amber-500 font-mono-cinema font-semibold">
                HTTP 428 PRECONDITION REQUIRED
              </p>
            </div>
          </div>
          <button
            onClick={onCancelToLogin}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Batal
          </button>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3.5 rounded-[2px] bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 space-y-1 font-body">
          <p className="font-semibold flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Halo, {pendingUser.name} ({pendingUser.nim})!
          </p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Sistem mendeteksi bahwa akun pengurus Anda baru pertama kali mengakses SIM (<code>is_first_login = true</code>). Demi keamanan data himpunan, Anda wajib mengubah kata sandi standar sebelum dapat mengakses modul kerja.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-[2px] border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono-cinema">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono-cinema">
              Ulangi Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-[2px] border text-xs focus-cinema transition-all ${
                  isDark
                    ? 'bg-[#181818] border-[#333333] text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-3 rounded-[2px] border border-inherit text-[11px] space-y-1.5 text-slate-400 font-mono-cinema">
            <div className={`flex items-center space-x-2 ${hasMinLength ? 'text-emerald-500 font-medium' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Panjang minimal 8 karakter</span>
            </div>
            <div className={`flex items-center space-x-2 ${hasNumber ? 'text-emerald-500 font-medium' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mengandung angka (0-9)</span>
            </div>
            <div className={`flex items-center space-x-2 ${isMatch ? 'text-emerald-500 font-medium' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Konfirmasi kata sandi cocok</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hasMinLength || !hasNumber || !isMatch}
            className="w-full py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white font-semibold text-xs font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan & Mengaktifkan Sesi...</span>
              </>
            ) : (
              <span>Simpan Kata Sandi & Lanjut ke Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

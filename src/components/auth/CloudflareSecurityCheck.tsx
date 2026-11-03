import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CloudflareSecurityCheckProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const CloudflareSecurityCheck: React.FC<CloudflareSecurityCheckProps> = ({
  onVerified,
  onCancel
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-verify after 1.8 seconds if user doesn't click
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTriggerVerification();
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleTriggerVerification = () => {
    if (isVerifying || isSuccess) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsChecked(true);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 700);
    }, 900);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0A] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className={`w-full max-w-md p-8 border rounded-[2px] transition-all shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-inherit">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-[2px] bg-[#E50914] flex items-center justify-center text-white font-bold text-xs tracking-wider font-display">
              CIN
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase font-display">
                CINEMIND GATEWAY
              </h2>
              <p className="text-[11px] text-slate-400 font-mono-cinema">
                SECURE EDGE VERIFICATION
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-500 font-mono-cinema">
            <Lock className="w-3.5 h-3.5 mr-1" />
            TLS 1.3
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold font-display uppercase tracking-wider mb-2">
            Memeriksa Lingkungan Browser Anda
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-body">
            Sistem Informasi Manajemen CINEMIND dilindungi oleh gerbang autentikasi internal. Harap tunggu verifikasi integritas sesi Turnstile sebelum menuju gerbang login.
          </p>
        </div>

        {/* Turnstile Interactive Widget Box */}
        <div 
          onClick={handleTriggerVerification}
          className={`cursor-pointer border rounded-[2px] p-4 flex items-center justify-between transition-colors ${
            isDark 
              ? 'bg-[#181818] border-[#333333] hover:border-slate-500' 
              : 'bg-slate-50 border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`w-6 h-6 rounded-[2px] border flex items-center justify-center transition-all ${
              isSuccess 
                ? 'bg-emerald-600 border-emerald-600 text-white' 
                : isDark ? 'border-slate-600 bg-[#222]' : 'border-slate-400 bg-white'
            }`}>
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : null}
            </div>
            <span className="text-xs font-medium font-body select-none">
              {isVerifying 
                ? 'Memverifikasi kredensial koneksi...' 
                : isSuccess 
                  ? 'Verifikasi Berhasil' 
                  : 'Verifikasi bahwa Anda adalah pengurus manusia'}
            </span>
          </div>

          <div className="flex flex-col items-end opacity-75">
            <Shield className="w-5 h-5 text-amber-500" />
            <span className="text-[9px] font-mono-cinema tracking-tighter text-slate-400 uppercase mt-0.5">
              Cloudflare Turnstile
            </span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-inherit flex items-center justify-between text-[11px] text-slate-400">
          <span>Ray ID: <code className="font-mono-cinema text-slate-300 font-semibold">89e47c1a90f23b7</code></span>
          <button
            onClick={onCancel}
            className="flex items-center text-xs text-slate-400 hover:text-[#E50914] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Kembali ke Portal Publik
          </button>
        </div>
      </div>
    </div>
  );
};

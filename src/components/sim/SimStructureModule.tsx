import React, { useState } from 'react';
import { 
  Network, 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  X,
  FileImage
} from 'lucide-react';
import { Officer } from '../../types';
import { StorageService } from '../../services/storage';
import { useTheme } from '../../context/ThemeContext';

interface SimStructureModuleProps {
  officers: Officer[];
  onUpdateOfficerAvatar: (officerId: string, newAvatarUrl: string) => Promise<void>;
}

export const SimStructureModule: React.FC<SimStructureModuleProps> = ({
  officers,
  onUpdateOfficerAvatar
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Modal State for Image Editing
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleOpenPhotoModal = (off: Officer) => {
    setSelectedOfficer(off);
    setInputUrl(off.avatar);
    setUploadSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOfficer) return;

    try {
      setIsProcessing(true);
      // Auto compress image
      const compressedBase64 = await StorageService.compressImage(file, 600, 0.85);
      await onUpdateOfficerAvatar(selectedOfficer.id, compressedBase64);
      setIsProcessing(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setSelectedOfficer(null);
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      alert('Gagal memproses gambar unggahan.');
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficer || !inputUrl.trim()) return;

    setIsProcessing(true);
    await onUpdateOfficerAvatar(selectedOfficer.id, inputUrl.trim());
    setIsProcessing(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setSelectedOfficer(null);
    }, 1000);
  };

  const level1 = officers.filter(o => o.level === 1);
  const level2 = officers.filter(o => o.level === 2);
  const level3 = officers.filter(o => o.level >= 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Struktur Organisasi & Tata Kerja</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
            Susunan Pengurus Kabinet Sinema Lentera 2026/2027
          </h1>
          <p className="text-xs text-slate-400 font-body">
            Pengelolaan profil fungsionaris, tupoksi kerja, dan penggantian foto profil interaktif dengan kompresi otomatis.
          </p>
        </div>
      </div>

      {/* Organizational Roster: Level 1 (BPH Pimpinan) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold font-mono-cinema uppercase tracking-wider text-slate-400">
          <Building2 className="w-4 h-4 text-[#E50914]" />
          <span>Level 1 — Pimpinan Badan Pengurus Harian (BPH)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {level1.map((off) => (
            <div
              key={off.id}
              className={`p-6 rounded-[2px] border relative overflow-hidden shadow-hard flex flex-col sm:flex-row gap-5 items-start transition-all ${
                isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="relative group flex-shrink-0">
                <img
                  src={off.avatar}
                  alt={off.name}
                  className="w-24 h-28 object-cover rounded-[2px] border border-inherit shadow-md"
                />
                <button
                  onClick={() => handleOpenPhotoModal(off)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono-cinema uppercase font-bold p-1 text-center"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-5 h-5 mb-1 text-[#E50914]" />
                  <span>Ubah Foto</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-red-500/10 text-red-500 font-bold border border-red-500/30">
                    SUPERADMIN
                  </span>
                  {off.nim && (
                    <span className="text-[10px] text-slate-400 font-mono-cinema">NIM. {off.nim}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wide truncate">
                  {off.name}
                </h3>
                <h4 className="text-xs font-semibold text-[#E50914] mb-2 font-body">
                  {off.roleTitle}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  {off.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Roster: Level 2 (Sekretaris & Bendahara) */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center space-x-2 text-xs font-bold font-mono-cinema uppercase tracking-wider text-slate-400">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Level 2 — Sekretaris Umum & Bendahara Umum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {level2.map((off) => (
            <div
              key={off.id}
              className={`p-6 rounded-[2px] border relative overflow-hidden shadow-hard flex flex-col sm:flex-row gap-5 items-start transition-all ${
                isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="relative group flex-shrink-0">
                <img
                  src={off.avatar}
                  alt={off.name}
                  className="w-24 h-28 object-cover rounded-[2px] border border-inherit shadow-md"
                />
                <button
                  onClick={() => handleOpenPhotoModal(off)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono-cinema uppercase font-bold p-1 text-center"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-5 h-5 mb-1 text-[#E50914]" />
                  <span>Ubah Foto</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono-cinema px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 text-blue-500 font-bold border border-blue-500/30">
                    {off.division}
                  </span>
                  {off.nim && (
                    <span className="text-[10px] text-slate-400 font-mono-cinema">NIM. {off.nim}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wide truncate">
                  {off.name}
                </h3>
                <h4 className="text-xs font-semibold text-slate-200 mb-2 font-body">
                  {off.roleTitle}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  {off.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Roster: Level 3 (Kepala Divisi) */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center space-x-2 text-xs font-bold font-mono-cinema uppercase tracking-wider text-slate-400">
          <UserCheck className="w-4 h-4 text-purple-500" />
          <span>Level 3 — Kepala Divisi & Koordinator Operasional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {level3.map((off) => (
            <div
              key={off.id}
              className={`p-5 rounded-[2px] border relative overflow-hidden shadow-hard flex flex-col transition-all ${
                isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="relative group flex-shrink-0">
                  <img
                    src={off.avatar}
                    alt={off.name}
                    className="w-16 h-20 object-cover rounded-[2px] border border-inherit"
                  />
                  <button
                    onClick={() => handleOpenPhotoModal(off)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-mono-cinema uppercase font-bold"
                  >
                    <Camera className="w-4 h-4 text-[#E50914]" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono-cinema text-purple-400 block truncate">
                    {off.division}
                  </span>
                  <h3 className="text-base font-bold font-display uppercase tracking-wide truncate">
                    {off.name}
                  </h3>
                  <h4 className="text-xs text-slate-300 font-medium truncate">
                    {off.roleTitle}
                  </h4>
                  {off.nim && (
                    <span className="text-[10px] text-slate-500 font-mono-cinema block">NIM. {off.nim}</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-body mt-auto pt-2 border-t border-inherit">
                {off.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO EDIT MODAL */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[2px] border overflow-hidden shadow-2xl p-6 ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                  Kelola Foto Profil: {selectedOfficer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="p-1.5 rounded-[2px] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess && (
              <div className="mb-4 p-3 rounded-[2px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Foto profil berhasil diperbarui secara real-time!</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Option 1: File Upload with Auto-compress */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                  Opsi 1: Unggah dari Perangkat (Kompresi Otomatis)
                </label>
                <label className={`w-full py-6 px-4 border border-dashed rounded-[2px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDark ? 'border-slate-700 hover:border-slate-400 bg-[#1a1a1a]' : 'border-slate-300 hover:border-slate-500 bg-slate-50'
                }`}>
                  <FileImage className="w-8 h-8 text-[#E50914] mb-2" />
                  <span className="text-xs font-medium">Pilih file foto dari laptop / ponsel</span>
                  <span className="text-[10px] text-slate-400 font-mono-cinema mt-0.5">JPG, PNG, WebP (Dikompres otomatis)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-inherit"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-mono-cinema">Atau</span>
                <div className="flex-grow border-t border-inherit"></div>
              </div>

              {/* Option 2: Image URL */}
              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                    Opsi 2: Tautan URL Gambar Web
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className={`w-full pl-9 pr-3 py-2 rounded-[2px] border text-xs focus-cinema ${
                        isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOfficer(null)}
                    className={`flex-1 py-2 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                      isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !inputUrl.trim()}
                    className="flex-1 py-2 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
                  >
                    {isProcessing ? 'Memproses...' : 'Simpan Tautan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

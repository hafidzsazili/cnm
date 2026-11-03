import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  PlusCircle, 
  FileText, 
  Calendar,
  X,
  Printer
} from 'lucide-react';
import { Letter, LetterClassification } from '../../types';
import { PdfGeneratorService } from '../../services/pdfGenerator';
import { useTheme } from '../../context/ThemeContext';

interface SimLetterArchiveProps {
  letters: Letter[];
  onNavigateToCreate: () => void;
  onDeleteLetter: (id: string) => Promise<void>;
}

export const SimLetterArchive: React.FC<SimLetterArchiveProps> = ({
  letters,
  onNavigateToCreate,
  onDeleteLetter
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null);

  const filteredLetters = letters.filter((l) => {
    const matchSearch = 
      l.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClassification === 'ALL' || l.classificationCode === selectedClassification;
    return matchSearch && matchClass;
  });

  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!letterToDelete) return;
    setIsDeleting(true);
    await onDeleteLetter(letterToDelete.id);
    setIsDeleting(false);
    setLetterToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
            <Archive className="w-3.5 h-3.5" />
            <span>Kearsipan & Legalitas</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
            Buku Arsip Surat Resmi Organisasi
          </h1>
          <p className="text-xs text-slate-400 font-body">
            Dokumen surat keluar tersimpan dengan penomoran berurutan dan dapat diunduh ulang sewaktu-waktu.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="px-4 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Surat Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-[2px] border flex flex-col md:flex-row gap-3 items-center justify-between shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor, perihal, atau penerima..."
            className={`w-full pl-9 pr-3 py-2 rounded-[2px] border text-xs focus-cinema ${
              isDark ? 'bg-[#181818] border-[#333] text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Filter Classification */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono-cinema text-slate-400 uppercase flex-shrink-0 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Klasifikasi:
          </span>
          {['ALL', 'SK', 'ST', 'SP', 'UB', 'ND', 'BA'].map((code) => {
            const isSelected = selectedClassification === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedClassification(code)}
                className={`px-2.5 py-1 rounded-[2px] text-xs font-mono-cinema transition-all ${
                  isSelected
                    ? 'bg-[#E50914] text-white font-semibold shadow-hard-red'
                    : isDark
                      ? 'bg-[#1a1a1a] border border-[#333] text-slate-300 hover:border-slate-500'
                      : 'bg-slate-100 border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Letters Table */}
      <div className={`rounded-[2px] border overflow-hidden shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] font-semibold uppercase tracking-wider font-mono-cinema ${
              isDark ? 'bg-[#181818] border-[#262626] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="py-3 px-4">Nomor Surat</th>
                <th className="py-3 px-4">Klasifikasi</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Penerima</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Penandatangan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredLetters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada arsip surat yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredLetters.map((l) => (
                  <tr key={l.id} className={`transition-colors ${
                    isDark ? 'hover:bg-[#181818]' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-3.5 px-4 font-mono-cinema font-bold text-[#E50914] whitespace-nowrap">
                      {l.letterNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono-cinema">
                      <span className="px-2 py-0.5 rounded-[2px] bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20 text-[10px]">
                        {l.classificationCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-xs truncate" title={l.subject}>
                      {l.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[180px] truncate" title={l.recipient}>
                      {l.recipient}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono-cinema text-slate-400">
                      {new Date(l.letterDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium">{l.signerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono-cinema">{l.signerRole}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono-cinema bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setPreviewLetter(l)}
                          className="p-1.5 rounded-[2px] hover:text-[#E50914] text-slate-400 transition-colors"
                          title="Pratinjau Dokumen Surat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => PdfGeneratorService.downloadLetterPdf(l)}
                          className="p-1.5 rounded-[2px] hover:text-[#E50914] text-slate-400 transition-colors"
                          title="Unduh PDF Resmi"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLetterToDelete(l)}
                          className="p-1.5 rounded-[2px] hover:text-red-500 text-slate-400 transition-colors"
                          title="Hapus Arsip Surat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-[2px] border overflow-hidden shadow-2xl my-8 ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-inherit">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                  Pratinjau Arsip: {previewLetter.letterNumber}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => PdfGeneratorService.downloadLetterPdf(previewLetter)}
                  className="px-3 py-1.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-hard-red"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  onClick={() => setPreviewLetter(null)}
                  className="p-1.5 rounded-[2px] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {/* Rendered Letter Sheet */}
              <div className="letter-paper bg-white text-slate-900 p-8 sm:p-12 rounded-[2px] border border-slate-300 shadow-md font-sans text-xs select-text">
                {/* Kop Surat */}
                <div className="text-center pb-3 border-b-2 border-slate-900 relative">
                  <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
                    Himpunan Mahasiswa Kajian Film, Televisi, dan Media
                  </div>
                  <div className="font-display font-extrabold text-2xl tracking-widest text-[#E50914] my-0.5">
                    CINEMIND
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    KABINET SINEMA LENTERA 2026/2027
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Gedung Pusat Kegiatan Mahasiswa Lt. 2, Kampus Terpadu | Surel: sekretariat@cinemind.ac.id
                  </div>
                  <div className="absolute -bottom-[5px] left-0 right-0 h-[1.5px] bg-[#E50914]" />
                </div>

                {/* Metadata */}
                <div className="mt-6 flex justify-between text-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex">
                      <span className="w-20">Nomor</span>
                      <span>: <strong className="font-mono-cinema">{previewLetter.letterNumber}</strong></span>
                    </div>
                    <div className="flex">
                      <span className="w-20">Lampiran</span>
                      <span>: -</span>
                    </div>
                    <div className="flex">
                      <span className="w-20">Perihal</span>
                      <span>: <strong>{previewLetter.subject}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    Jakarta, {new Date(previewLetter.letterDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Penerima */}
                <div className="mt-6 text-slate-800">
                  <div>Kepada Yth.</div>
                  <div className="font-bold">{previewLetter.recipient}</div>
                  {previewLetter.recipientAddress && <div className="text-slate-600">{previewLetter.recipientAddress}</div>}
                  <div>di Tempat</div>
                </div>

                {/* Isi Surat */}
                <div className="mt-6 space-y-3 text-justify text-slate-800 leading-relaxed">
                  <div>Dengan hormat,</div>
                  <p className="whitespace-pre-line indent-6">
                    {previewLetter.content}
                  </p>
                  <p>
                    Demikian surat ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik, kami ucapkan terima kasih.
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="mt-10 flex justify-end text-slate-800">
                  <div className="w-60 text-center">
                    <div>Hormat kami,</div>
                    <div className="font-bold mt-1">{previewLetter.signerRole}</div>
                    <div className="my-3 flex items-center justify-center">
                      <div className="w-24 h-16 border-2 border-dashed border-[#E50914] rounded-[2px] flex flex-col items-center justify-center text-[#E50914] rotate-[-5deg] bg-red-50/50">
                        <span className="text-[8px] font-bold tracking-wider font-mono-cinema">TERVERIFIKASI</span>
                        <span className="text-[10px] font-extrabold font-display">CINEMIND</span>
                        <span className="text-[7px] font-mono-cinema">SIM RESMI</span>
                      </div>
                    </div>
                    <div className="font-bold underline text-sm">{previewLetter.signerName}</div>
                    {previewLetter.signerNim && <div className="text-[11px] text-slate-600 font-mono-cinema">NIM. {previewLetter.signerNim}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE LETTER MODAL */}
      {letterToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[2px] border p-6 shadow-2xl ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center space-x-3 text-red-500 mb-3">
              <div className="w-10 h-10 rounded-[2px] bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="font-bold font-display uppercase tracking-wider text-base">
                  Hapus Arsip Surat
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-cinema">Tindakan ini permanen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-body mb-6">
              Apakah Anda yakin ingin menghapus arsip surat nomor <strong className="text-white">"{letterToDelete.letterNumber}"</strong>?
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setLetterToDelete(null)}
                disabled={isDeleting}
                className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                  isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Arsip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

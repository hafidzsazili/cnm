import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Save, 
  Check, 
  RefreshCw, 
  Eye, 
  Building2, 
  Calendar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Letter, LetterClassification } from '../../types';
import { StorageService } from '../../services/storage';
import { PdfGeneratorService } from '../../services/pdfGenerator';
import { useTheme } from '../../context/ThemeContext';

interface SimLetterGeneratorProps {
  existingLetters: Letter[];
  onSaveLetter: (letter: Letter) => Promise<void>;
  onNavigateToArchive: () => void;
}

const CLASSIFICATIONS: { code: LetterClassification; name: string }[] = [
  { code: 'SK', name: 'SK - Surat Keputusan' },
  { code: 'ST', name: 'ST - Surat Tugas' },
  { code: 'SP', name: 'SP - Surat Permohonan' },
  { code: 'UB', name: 'UB - Undangan Bersama' },
  { code: 'ND', name: 'ND - Nota Dinas' },
  { code: 'BA', name: 'BA - Berita Acara' },
  { code: 'KTM', name: 'KTM - Keterangan Mahasiswa' }
];

export const SimLetterGenerator: React.FC<SimLetterGeneratorProps> = ({
  existingLetters,
  onSaveLetter,
  onNavigateToArchive
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Determine next sequence number
  const nextSeq = existingLetters.length > 0 
    ? Math.max(...existingLetters.map(l => l.sequenceNumber || 0)) + 1 
    : 1;

  const [sequenceNumber, setSequenceNumber] = useState<number>(nextSeq);
  const [classification, setClassification] = useState<LetterClassification>('ST');
  const [recipient, setRecipient] = useState('Delegasi Mahasiswa Festival Film');
  const [recipientAddress, setRecipientAddress] = useState('Kampus Terpadu & Lokasi Acara');
  const [subject, setSubject] = useState('Surat Tugas Delegasi Penayangan & Diskusi Film Mahasiswa');
  const [letterDate, setLetterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState(
    'Sehubungan dengan terselenggaranya kegiatan pemutaran dan kurasi film mahasiswa tingkat regional, Badan Pengurus Harian Himpunan Mahasiswa KFTM "CINEMIND" dengan ini memberikan tugas kepada nama-nama terlampir untuk mewakili himpunan dalam seluruh rangkaian agenda eksibisi dan diskusi sinematografi.\n\nDemikian surat tugas ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya dengan penuh tanggung jawab.'
  );
  const [signerName, setSignerName] = useState('Arya Pratama');
  const [signerRole, setSignerRole] = useState('Ketua Umum CINEMIND');
  const [signerNim, setSignerNim] = useState('230101001');
  const [status, setStatus] = useState<'Diterbitkan' | 'Draft'>('Diterbitkan');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Computed Letter Number: e.g. 012/SK/A/CINEMIND/X/2026
  const seqPadded = String(sequenceNumber).padStart(3, '0');
  const romanMonth = StorageService.getRomanMonth(new Date(letterDate));
  const year = new Date(letterDate).getFullYear() || 2026;
  const generatedLetterNumber = `${seqPadded}/${classification}/A/CINEMIND/${romanMonth}/${year}`;

  const currentLetterObject: Letter = {
    id: `letter-${Date.now()}`,
    letterNumber: generatedLetterNumber,
    sequenceNumber,
    classificationCode: classification,
    recipient,
    recipientAddress,
    subject,
    letterDate,
    content,
    signerName,
    signerRole,
    signerNim,
    status,
    createdAt: Date.now()
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveLetter(currentLetterObject);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadPdf = () => {
    PdfGeneratorService.downloadLetterPdf(currentLetterObject);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Tata Kelola Dokumen Resmi</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
            Generator Surat Resmi Organisasi
          </h1>
          <p className="text-xs text-slate-400 font-body">
            Format nomor otomatis sesuai standar klasifikasi surat himpunan (e.g. <code>012/SK/A/CINEMIND/X/2026</code>).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToArchive}
            className={`px-3 py-2 rounded-[2px] border text-xs font-semibold font-display tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
              isDark ? 'border-[#333] hover:border-slate-500 text-slate-300' : 'border-slate-300 hover:border-slate-400 text-slate-700'
            }`}
          >
            <span>Buka Arsip Surat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Editor Form (Left) & Real-time Letter Preview (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* FORM (5 Cols) */}
        <div className={`xl:col-span-5 p-6 rounded-[2px] border space-y-4 shadow-hard ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <h2 className="text-sm font-bold font-display uppercase tracking-wider">
              Parameter Persuratan
            </h2>
            <span className="text-[10px] font-mono-cinema text-[#E50914] font-bold">
              KOP STANDAR
            </span>
          </div>

          {/* Generated Number Badge */}
          <div className={`p-3 rounded-[2px] border ${
            isDark ? 'bg-[#181818] border-[#333]' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[10px] font-mono-cinema uppercase text-slate-400 mb-1">
              Nomor Surat Otomatis Terkalkulasi:
            </label>
            <div className="font-mono-cinema text-sm font-bold text-[#E50914] break-all">
              {generatedLetterNumber}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                Nomor Urut
              </label>
              <input
                type="number"
                min="1"
                value={sequenceNumber}
                onChange={(e) => setSequenceNumber(parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                  isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                Kode Klasifikasi
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as LetterClassification)}
                className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                  isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {CLASSIFICATIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Tanggal Penerbitan Surat
            </label>
            <input
              type="date"
              value={letterDate}
              onChange={(e) => setLetterDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Kepada Yth. (Penerima)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Contoh: Kepala Biro Kemahasiswaan"
              className={`w-full px-3 py-2 rounded-[2px] border text-xs focus-cinema ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Alamat / Instansi Penerima
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Contoh: Gedung Rektorat Lt. 2 Kampus Terpadu"
              className={`w-full px-3 py-2 rounded-[2px] border text-xs focus-cinema ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Perihal Surat
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Perihal surat resmi..."
              className={`w-full px-3 py-2 rounded-[2px] border text-xs font-medium focus-cinema ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Isi Dokumen Surat
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi surat lengkap..."
              className={`w-full p-3 rounded-[2px] border text-xs leading-relaxed focus-cinema ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                Nama Penandatangan
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                  isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                NIM Penandatangan
              </label>
              <input
                type="text"
                value={signerNim}
                onChange={(e) => setSignerNim(e.target.value)}
                className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                  isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
              Jabatan Penandatangan
            </label>
            <input
              type="text"
              value={signerRole}
              onChange={(e) => setSignerRole(e.target.value)}
              className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-inherit flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Tersimpan di Arsip!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Arsip</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className={`py-2.5 px-4 rounded-[2px] border text-xs font-display uppercase tracking-wider font-semibold transition-all flex items-center space-x-1.5 ${
                isDark ? 'border-[#333] bg-[#1a1a1a] hover:border-slate-500 text-white' : 'border-slate-300 bg-slate-100 hover:border-slate-400 text-slate-900'
              }`}
              title="Unduh format PDF Standar Tata Kelola"
            >
              <Download className="w-4 h-4 text-[#E50914]" />
              <span>Unduh PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className={`py-2.5 px-3 rounded-[2px] border text-xs transition-all ${
                isDark ? 'border-[#333] bg-[#1a1a1a] hover:border-slate-500 text-slate-300' : 'border-slate-300 bg-slate-100 hover:border-slate-400 text-slate-700'
              }`}
              title="Cetak Langsung Dokumen"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRATINJAU DOKUMEN SURAT RESMI (7 Cols - A4 Mockup) */}
        <div className="xl:col-span-7">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-cinema text-slate-400 uppercase font-semibold flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1 text-[#E50914]" />
                Pratinjau Standar Tata Kelola A4:
              </span>
              <span className="text-[10px] text-slate-500 font-mono-cinema">A4 Portrait (210 x 297 mm)</span>
            </div>

            {/* A4 Document Paper Simulation */}
            <div className="letter-paper bg-white text-slate-900 p-8 sm:p-12 rounded-[2px] border border-slate-300 shadow-2xl min-h-[640px] font-serif text-[13px] leading-relaxed select-text">
              {/* Kop Surat Resmi */}
              <div className="text-center pb-3 border-b-2 border-slate-900 relative">
                <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-800">
                  Himpunan Mahasiswa Kajian Film, Televisi, dan Media
                </div>
                <div className="font-display font-extrabold text-2xl tracking-widest text-[#E50914] my-0.5">
                  CINEMIND
                </div>
                <div className="font-sans text-[11px] text-slate-600 font-medium">
                  KABINET SINEMA LENTERA 2026/2027
                </div>
                <div className="font-sans text-[9px] text-slate-500">
                  Gedung Pusat Kegiatan Mahasiswa Lt. 2, Kampus Terpadu | Surel: sekretariat@cinemind.ac.id
                </div>
                {/* Double Border accent */}
                <div className="absolute -bottom-[5px] left-0 right-0 h-[1.5px] bg-[#E50914]" />
              </div>

              {/* Tanggal & Nomor */}
              <div className="mt-8 flex justify-between font-sans text-xs text-slate-800">
                <div className="space-y-0.5">
                  <div className="flex">
                    <span className="w-20">Nomor</span>
                    <span>: <strong className="font-mono-cinema">{generatedLetterNumber}</strong></span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Lampiran</span>
                    <span>: -</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Perihal</span>
                    <span>: <strong>{subject}</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  Jakarta, {new Date(letterDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Penerima */}
              <div className="mt-6 font-sans text-xs text-slate-800">
                <div>Kepada Yth.</div>
                <div className="font-bold">{recipient}</div>
                {recipientAddress && <div className="text-slate-600">{recipientAddress}</div>}
                <div>di Tempat</div>
              </div>

              {/* Salam Pembuka & Isi */}
              <div className="mt-6 text-slate-800 font-sans text-xs space-y-3 text-justify">
                <div>Dengan hormat,</div>
                <p className="whitespace-pre-line leading-relaxed indent-6">
                  {content}
                </p>
                <p>
                  Demikian surat ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik, kami ucapkan terima kasih.
                </p>
              </div>

              {/* Tanda Tangan & Cap */}
              <div className="mt-12 flex justify-end font-sans text-xs text-slate-800">
                <div className="w-64 text-center">
                  <div>Hormat kami,</div>
                  <div className="font-bold mt-1">{signerRole}</div>

                  {/* Stamp box simulation */}
                  <div className="my-3 flex items-center justify-center">
                    <div className="w-24 h-16 border-2 border-dashed border-[#E50914] rounded-[2px] flex flex-col items-center justify-center text-[#E50914] rotate-[-5deg] bg-red-50/50">
                      <span className="text-[8px] font-bold tracking-wider font-mono-cinema">TERVERIFIKASI</span>
                      <span className="text-[10px] font-extrabold font-display">CINEMIND</span>
                      <span className="text-[7px] font-mono-cinema">SIM RESMI</span>
                    </div>
                  </div>

                  <div className="font-bold underline text-sm">{signerName}</div>
                  {signerNim && <div className="text-[11px] text-slate-600 font-mono-cinema">NIM. {signerNim}</div>}
                </div>
              </div>

              {/* Watermark Footer */}
              <div className="mt-12 pt-4 border-t border-slate-200 text-center font-sans text-[9px] text-slate-400 font-mono-cinema">
                Dokumen resmi diterbitkan melalui Sistem Informasi Manajemen (SIM) CINEMIND KFTM.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

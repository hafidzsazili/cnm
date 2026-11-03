import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  Receipt, 
  TrendingUp,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { FinanceTransaction, BalanceSummary } from '../../types';
import { StorageService } from '../../services/storage';
import { useTheme } from '../../context/ThemeContext';

interface SimFinanceLedgerProps {
  finances: FinanceTransaction[];
  balanceData: BalanceSummary;
  onSaveFinance: (tx: FinanceTransaction) => Promise<void>;
  onDeleteFinance: (id: string) => Promise<void>;
}

const CATEGORIES = [
  'Iuran Pengurus',
  'Danus',
  'Sponsorship',
  'Sewa Alat',
  'Konsumsi',
  'Honorarium/Produksi',
  'Transportasi',
  'Publikasi & Desain',
  'Kas Operasional',
  'Lain-lain'
];

export const SimFinanceLedger: React.FC<SimFinanceLedgerProps> = ({
  finances,
  balanceData,
  onSaveFinance,
  onDeleteFinance
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'in' | 'out'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Form State
  const [type, setType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [recordedBy, setRecordedBy] = useState<string>('Dimas Wicaksono (Bendahara)');
  const [receiptNote, setReceiptNote] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute Running Balances
  const withRunningBalances = StorageService.calculateRunningBalances(finances);

  // Filter transactions
  const filteredList = withRunningBalances.filter((tx) => {
    const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
    const matchCat = categoryFilter === 'ALL' || tx.category === categoryFilter;
    const matchSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.receiptNote && tx.receiptNote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchCat && matchSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount <= 0) {
      alert('Harap masukkan nominal transaksi yang valid.');
      return;
    }
    if (!description.trim()) {
      alert('Deskripsi transaksi wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      transactionDate,
      type,
      amount: numAmount,
      category,
      description,
      recordedBy,
      receiptNote: receiptNote.trim() || undefined,
      createdAt: Date.now()
    };

    await onSaveFinance(newTx);
    setIsSubmitting(false);
    setModalOpen(false);

    // Reset Form
    setAmount('');
    setDescription('');
    setReceiptNote('');
  };

  const [txToDelete, setTxToDelete] = useState<FinanceTransaction | null>(null);
  const [isDeletingTx, setIsDeletingTx] = useState(false);

  const handleConfirmDeleteTx = async () => {
    if (!txToDelete) return;
    setIsDeletingTx(true);
    await onDeleteFinance(txToDelete.id);
    setIsDeletingTx(false);
    setTxToDelete(null);
  };

  // Export to CSV Function
  const handleExportCsv = () => {
    const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Nominal (IDR)', 'Saldo Berjalan (IDR)', 'Pencatat', 'Bukti'];
    const rows = withRunningBalances.map((tx) => [
      tx.id,
      tx.transactionDate,
      tx.type === 'in' ? 'DEBIT (MASUK)' : 'KREDIT (KELUAR)',
      `"${tx.category.replace(/"/g, '""')}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.amount,
      tx.runningBalance || 0,
      `"${tx.recordedBy.replace(/"/g, '""')}"`,
      `"${(tx.receiptNote || '-').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Kas_Cinemind_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>Kebendaharaan & Akuntansi</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
            Buku Kas Digital & Running Balance
          </h1>
          <p className="text-xs text-slate-400 font-body">
            Pencatatan kas masuk/keluar secara real-time dengan kalkulasi saldo berjalan otomatis dan ekspor CSV.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className={`px-3.5 py-2.5 rounded-[2px] border text-xs font-semibold font-display tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
              isDark ? 'border-[#333] hover:border-slate-500 text-slate-200' : 'border-slate-300 hover:border-slate-400 text-slate-700'
            }`}
            title="Ekspor seluruh data kas ke CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Kas Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-[2px] border shadow-hard ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema mb-1">
            Total Kas Masuk (Debit)
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display text-emerald-500 tracking-wide flex items-center">
            <ArrowUpRight className="w-5 h-5 mr-1 flex-shrink-0" />
            {StorageService.formatRupiah(balanceData.totalIn)}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono-cinema">Dari sponsorship, iuran, & danus</p>
        </div>

        <div className={`p-5 rounded-[2px] border shadow-hard ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema mb-1">
            Total Kas Keluar (Kredit)
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display text-red-500 tracking-wide flex items-center">
            <ArrowDownRight className="w-5 h-5 mr-1 flex-shrink-0" />
            {StorageService.formatRupiah(balanceData.totalOut)}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono-cinema">Alat, produksi film, & konsumsi</p>
        </div>

        <div className={`p-5 rounded-[2px] border shadow-hard ${
          isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs font-semibold text-slate-400 uppercase font-mono-cinema mb-1">
            Saldo Kas Berjalan Saat Ini
          </div>
          <div className="text-xl lg:text-2xl font-bold font-display text-white tracking-wide">
            {StorageService.formatRupiah(balanceData.currentBalance)}
          </div>
          <div className="mt-2 text-[10px] font-mono-cinema text-emerald-500 flex items-center font-semibold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Kondisi Kas Sehat & Terverifikasi
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-[2px] border flex flex-col md:flex-row gap-3 items-center justify-between shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari deskripsi, kategori, atau kwitansi..."
            className={`w-full pl-9 pr-3 py-2 rounded-[2px] border text-xs focus-cinema ${
              isDark ? 'bg-[#181818] border-[#333] text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center space-x-1">
            {(['ALL', 'in', 'out'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-mono-cinema transition-all ${
                  typeFilter === t
                    ? 'bg-[#E50914] text-white font-semibold shadow-hard-red'
                    : isDark
                      ? 'bg-[#1a1a1a] border border-[#333] text-slate-300 hover:border-slate-500'
                      : 'bg-slate-100 border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {t === 'ALL' ? 'Semua' : t === 'in' ? 'Masuk' : 'Keluar'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
              isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="ALL">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table with Running Balance */}
      <div className={`rounded-[2px] border overflow-hidden shadow-hard ${
        isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] font-semibold uppercase tracking-wider font-mono-cinema ${
              isDark ? 'bg-[#181818] border-[#262626] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Uraian / Deskripsi</th>
                <th className="py-3 px-4 text-right">Debit (Masuk)</th>
                <th className="py-3 px-4 text-right">Kredit (Keluar)</th>
                <th className="py-3 px-4 text-right">Running Balance</th>
                <th className="py-3 px-4 text-center">Bukti</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit font-body">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Belum ada rekaman transaksi yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((tx) => (
                  <tr key={tx.id} className={`transition-colors ${
                    isDark ? 'hover:bg-[#181818]' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-3.5 px-4 font-mono-cinema whitespace-nowrap text-slate-400">
                      {tx.transactionDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono-cinema">
                      {tx.type === 'in' ? (
                        <span className="px-2 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 text-[10px] inline-flex items-center">
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          MASUK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[2px] bg-red-500/10 text-red-500 font-bold border border-red-500/20 text-[10px] inline-flex items-center">
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                          KELUAR
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-300">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate" title={tx.description}>
                      <div className="font-medium text-slate-100">{tx.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono-cinema">Oleh: {tx.recordedBy}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-cinema font-bold text-emerald-500 whitespace-nowrap">
                      {tx.type === 'in' ? StorageService.formatRupiah(tx.amount) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-cinema font-bold text-red-500 whitespace-nowrap">
                      {tx.type === 'out' ? StorageService.formatRupiah(tx.amount) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-cinema font-bold whitespace-nowrap text-slate-100">
                      {StorageService.formatRupiah(tx.runningBalance || 0)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono-cinema text-[11px] text-slate-400">
                      {tx.receiptNote ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] bg-white/5 border border-slate-700" title={tx.receiptNote}>
                          <Receipt className="w-3 h-3 mr-1 text-[#E50914]" />
                          <span className="max-w-[100px] truncate">{tx.receiptNote}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setTxToDelete(tx)}
                        className="p-1.5 rounded-[2px] hover:text-red-500 text-slate-400 transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRANSACTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-[2px] border overflow-hidden shadow-2xl p-6 ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                  Catat Transaksi Keuangan Baru
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-[2px] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                  Jenis Arus Kas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('in')}
                    className={`py-2 px-3 rounded-[2px] text-xs font-mono-cinema font-bold flex items-center justify-center space-x-1.5 border transition-all ${
                      type === 'in'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : isDark ? 'border-[#333] bg-[#1a1a1a] text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>KAS MASUK (DEBIT)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('out')}
                    className={`py-2 px-3 rounded-[2px] text-xs font-mono-cinema font-bold flex items-center justify-center space-x-1.5 border transition-all ${
                      type === 'out'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : isDark ? 'border-[#333] bg-[#1a1a1a] text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>KAS KELUAR (KREDIT)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                    Nominal Rupiah (Rp)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 1500000"
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema font-bold focus-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                  Kategori Transaksi
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono-cinema">
                  Uraian / Deskripsi Rinci
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi peruntukan dana / sumber pemasukan..."
                  className={`w-full p-3 rounded-[2px] border text-xs focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Nomor Nota / Kwitansi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    placeholder="Contoh: Kwitansi #042/10"
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Pencatat / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={recordedBy}
                    onChange={(e) => setRecordedBy(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-inherit flex space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                    isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi Kas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE TRANSACTION MODAL */}
      {txToDelete && (
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
                  Hapus Transaksi Kas
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-cinema">Tindakan ini permanen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-body mb-6">
              Apakah Anda yakin ingin menghapus catatan kas {txToDelete.type === 'in' ? 'Masuk' : 'Keluar'} senilai <strong className="text-white">{StorageService.formatRupiah(txToDelete.amount)}</strong> ({txToDelete.description})?
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setTxToDelete(null)}
                disabled={isDeletingTx}
                className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                  isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTx}
                disabled={isDeletingTx}
                className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
              >
                {isDeletingTx ? 'Menghapus...' : 'Ya, Hapus Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

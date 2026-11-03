import React, { useState } from 'react';
import { 
  Film, 
  Newspaper, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Star, 
  Sparkles, 
  Clock, 
  Calendar, 
  X,
  Play,
  Award,
  Video
} from 'lucide-react';
import { FilmWork, NewsArticle } from '../../types';
import { StorageService } from '../../services/storage';
import { useTheme } from '../../context/ThemeContext';

interface SimCmsModuleProps {
  works: FilmWork[];
  news: NewsArticle[];
  onSaveWork: (work: FilmWork) => Promise<void>;
  onDeleteWork: (id: string) => Promise<void>;
  onSaveNews: (newsItem: NewsArticle) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
}

export const SimCmsModule: React.FC<SimCmsModuleProps> = ({
  works,
  news,
  onSaveWork,
  onDeleteWork,
  onSaveNews,
  onDeleteNews
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'works' | 'news'>('works');

  // Work Modal State
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<FilmWork | null>(null);

  const [filmTitle, setFilmTitle] = useState('');
  const [director, setDirector] = useState('');
  const [producer, setProducer] = useState('');
  const [dop, setDop] = useState('');
  const [productionHouse, setProductionHouse] = useState('Cinemind Films');
  const [year, setYear] = useState<number>(2026);
  const [duration, setDuration] = useState('15 Menit');
  const [genre, setGenre] = useState('Drama / Fiksi');
  const [synopsis, setSynopsis] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [awardsInput, setAwardsInput] = useState('');
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);

  // News Modal State
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Siaran Pers');
  const [author, setAuthor] = useState('Divisi Media & Informasi');
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [newsThumbnail, setNewsThumbnail] = useState('');
  const [readTime, setReadTime] = useState('3 Menit Baca');
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);

  // In-App Confirmation Modal States for Reliable Deletion
  const [workToDelete, setWorkToDelete] = useState<FilmWork | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<NewsArticle | null>(null);
  const [isDeletingWork, setIsDeletingWork] = useState(false);
  const [isDeletingNews, setIsDeletingNews] = useState(false);

  const handleConfirmDeleteWork = async () => {
    if (!workToDelete) return;
    setIsDeletingWork(true);
    await onDeleteWork(workToDelete.id);
    setIsDeletingWork(false);
    setWorkToDelete(null);
  };

  const handleConfirmDeleteNews = async () => {
    if (!newsToDelete) return;
    setIsDeletingNews(true);
    await onDeleteNews(newsToDelete.id);
    setIsDeletingNews(false);
    setNewsToDelete(null);
  };

  // Open Work Form
  const handleOpenAddWork = () => {
    setEditingWork(null);
    setFilmTitle('');
    setDirector('');
    setProducer('');
    setDop('');
    setProductionHouse('Cinemind Media Works');
    setYear(2026);
    setDuration('15 Menit');
    setGenre('Drama / Eksperimental');
    setSynopsis('');
    setYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setThumbnailUrl('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80');
    setFeatured(false);
    setAwardsInput('');
    setWorkModalOpen(true);
  };

  const handleOpenEditWork = (w: FilmWork) => {
    setEditingWork(w);
    setFilmTitle(w.title);
    setDirector(w.director);
    setProducer(w.producer || '');
    setDop(w.dop || '');
    setProductionHouse(w.productionHouse || 'Cinemind Films');
    setYear(w.year);
    setDuration(w.duration);
    setGenre(w.genre);
    setSynopsis(w.synopsis);
    setYoutubeUrl(w.embedUrl);
    setThumbnailUrl(w.thumbnailUrl);
    setFeatured(Boolean(w.featured));
    setAwardsInput((w.festivalAwards || []).join('\n'));
    setWorkModalOpen(true);
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmTitle.trim() || !director.trim()) {
      alert('Judul dan Sutradara wajib diisi.');
      return;
    }

    setIsSubmittingWork(true);
    const awardsList = awardsInput
      .split('\n')
      .map(a => a.trim())
      .filter(Boolean);

    const workObj: FilmWork = {
      id: editingWork ? editingWork.id : `work-${Date.now()}`,
      title: filmTitle.trim(),
      director: director.trim(),
      producer: producer.trim() || undefined,
      dop: dop.trim() || undefined,
      productionHouse: productionHouse.trim() || undefined,
      year: Number(year) || 2026,
      duration: duration.trim() || '15 Menit',
      genre: genre.trim(),
      synopsis: synopsis.trim(),
      embedUrl: youtubeUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200',
      featured,
      festivalAwards: awardsList,
      createdAt: editingWork ? editingWork.createdAt : Date.now() // Newest uploads automatically stay top
    };

    await onSaveWork(workObj);
    setIsSubmittingWork(false);
    setWorkModalOpen(false);
  };

  // Open News Form
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsTitle('');
    setNewsCategory('Siaran Pers');
    setAuthor('Divisi Media & Informasi');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setSummary('');
    setContent('');
    setNewsThumbnail('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80');
    setReadTime('3 Menit Baca');
    setNewsModalOpen(true);
  };

  const handleOpenEditNews = (n: NewsArticle) => {
    setEditingNews(n);
    setNewsTitle(n.title);
    setNewsCategory(n.category);
    setAuthor(n.author);
    setPublishDate(n.publishDate);
    setSummary(n.summary);
    setContent(n.content);
    setNewsThumbnail(n.thumbnailUrl);
    setReadTime(n.readTime);
    setNewsModalOpen(true);
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !summary.trim() || !content.trim()) {
      alert('Judul, Ringkasan, dan Konten berita wajib diisi.');
      return;
    }

    setIsSubmittingNews(true);
    const newsObj: NewsArticle = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: newsTitle.trim(),
      category: newsCategory.trim(),
      author: author.trim(),
      publishDate,
      summary: summary.trim(),
      content: content.trim(),
      thumbnailUrl: newsThumbnail.trim() || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200',
      readTime: readTime.trim() || '3 Menit Baca',
      createdAt: editingNews ? editingNews.createdAt : Date.now()
    };

    await onSaveNews(newsObj);
    setIsSubmittingNews(false);
    setNewsModalOpen(false);
  };

  const handleDeleteNews = async (n: NewsArticle) => {
    if (confirm(`Hapus warta berita "${n.title}"?`)) {
      await onDeleteNews(n.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#E50914] font-mono-cinema uppercase tracking-wider font-semibold mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Content Management System (CMS)</span>
          </div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-wide">
            Manajemen Etalase Film & Warta Publik
          </h1>
          <p className="text-xs text-slate-400 font-body">
            Kurasi karya film mahasiswa dengan konversi YouTube nocookie otomatis dan siaran pers publik.
          </p>
        </div>

        {activeTab === 'works' ? (
          <button
            onClick={handleOpenAddWork}
            className="px-4 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center space-x-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Karya Film</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAddNews}
            className="px-4 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-semibold font-display tracking-wider uppercase transition-all shadow-hard-red flex items-center space-x-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Warta Baru</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-inherit space-x-6">
        <button
          onClick={() => setActiveTab('works')}
          className={`pb-3 text-sm font-display uppercase tracking-wider font-bold transition-all relative ${
            activeTab === 'works'
              ? 'text-[#E50914]'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4" />
            <span>Etalase Karya Film Mahasiswa ({works.length})</span>
          </div>
          {activeTab === 'works' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`pb-3 text-sm font-display uppercase tracking-wider font-bold transition-all relative ${
            activeTab === 'news'
              ? 'text-[#E50914]'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Newspaper className="w-4 h-4" />
            <span>Warta Berita & Siaran Pers ({news.length})</span>
          </div>
          {activeTab === 'news' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914]" />
          )}
        </button>
      </div>

      {/* TAB 1: FILM WORKS */}
      {activeTab === 'works' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono-cinema flex items-center justify-between">
            <span>Katalog diurutkan dari unggahan paling baru (Slot 1 otomatis tampil di depan)</span>
            <span className="text-[#E50914] font-semibold">Semua URL YouTube otomatis format Nocookie</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {works.map((w, index) => (
              <div
                key={w.id}
                className={`rounded-[2px] border overflow-hidden shadow-hard flex flex-col transition-all ${
                  isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
                }`}
              >
                {/* 16:9 Thumbnail Box */}
                <div className="relative aspect-video bg-black overflow-hidden group">
                  <img
                    src={w.thumbnailUrl}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Slot & Featured Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-[2px] bg-black/80 text-white text-[10px] font-mono-cinema font-bold border border-white/20">
                      SLOT #{index + 1}
                    </span>
                    {w.featured && (
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#E50914] text-white text-[10px] font-mono-cinema font-bold flex items-center space-x-0.5 shadow-hard-red">
                        <Star className="w-3 h-3 fill-current" />
                        <span>UNGGULAN</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-mono-cinema">
                    <span>{w.duration}</span>
                    <span>{w.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] font-mono-cinema text-[#E50914] font-bold uppercase mb-1">
                    {w.genre}
                  </div>
                  <h3 className="text-base font-bold font-display uppercase tracking-wide truncate mb-1" title={w.title}>
                    {w.title}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium mb-2">
                    Sutradara: <span className="text-white font-semibold">{w.director}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-body mb-4">
                    {w.synopsis}
                  </p>

                  {/* Awards count */}
                  {w.festivalAwards && w.festivalAwards.length > 0 && (
                    <div className="mb-4 text-[11px] text-amber-400 flex items-center space-x-1 font-mono-cinema">
                      <Award className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{w.festivalAwards.length} Penghargaan / Seleksi Festival</span>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-inherit flex items-center justify-between">
                    <a
                      href={w.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-[#E50914] flex items-center space-x-1 font-mono-cinema"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Nocookie Embed</span>
                    </a>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditWork(w)}
                        className="p-1.5 rounded-[2px] hover:text-[#E50914] text-slate-400 transition-colors"
                        title="Edit Film"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setWorkToDelete(w)}
                        className="p-1.5 rounded-[2px] hover:text-red-500 text-slate-400 transition-colors"
                        title="Hapus Film"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NEWS & PRESS ARTICLES */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono-cinema">
            Daftar rilis pers dan berita kegiatan mahasiswa yang dipublikasikan pada website publik CINEMIND.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((item) => (
              <div
                key={item.id}
                className={`rounded-[2px] border overflow-hidden shadow-hard flex flex-col transition-all ${
                  isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="relative aspect-[16/9] bg-black overflow-hidden group">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#E50914] text-white text-[10px] font-mono-cinema font-bold">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white/90 font-mono-cinema">
                    <span>{item.author}</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] font-mono-cinema text-slate-400 mb-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.publishDate}
                  </div>
                  <h3 className="text-base font-bold font-display uppercase tracking-wide line-clamp-2 mb-2" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-body mb-4">
                    {item.summary}
                  </p>

                  <div className="mt-auto pt-3 border-t border-inherit flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEditNews(item)}
                      className="p-1.5 rounded-[2px] hover:text-[#E50914] text-slate-400 transition-colors"
                      title="Edit Berita"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNewsToDelete(item)}
                      className="p-1.5 rounded-[2px] hover:text-red-500 text-slate-400 transition-colors"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT FILM WORK */}
      {workModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-[2px] border overflow-hidden shadow-2xl p-6 my-8 ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                  {editingWork ? 'Edit Data Film Etalase' : 'Unggah Film Mahasiswa Baru ke Etalase (Slot #1)'}
                </h3>
              </div>
              <button
                onClick={() => setWorkModalOpen(false)}
                className="p-1.5 rounded-[2px] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Judul Film
                  </label>
                  <input
                    type="text"
                    required
                    value={filmTitle}
                    onChange={(e) => setFilmTitle(e.target.value)}
                    placeholder="Judul karya film..."
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs focus-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Genre Film
                  </label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Contoh: Drama / Neo-Noir"
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs focus-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Sutradara (Director)
                  </label>
                  <input
                    type="text"
                    required
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="Nama sutradara..."
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Produser
                  </label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Nama produser..."
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Director of Photography (DOP)
                  </label>
                  <input
                    type="text"
                    value={dop}
                    onChange={(e) => setDop(e.target.value)}
                    placeholder="Nama penata kamera..."
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Tahun Rilis
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2026)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Contoh: 18 Menit"
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Rumah Produksi / Lab
                  </label>
                  <input
                    type="text"
                    value={productionHouse}
                    onChange={(e) => setProductionHouse(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Tautan Video YouTube (Otomatis Dikonversi ke Nocookie)
                </label>
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-mono-cinema mt-0.5 block">
                  Akan ditransformasikan otomatis menjadi: <code>https://www.youtube-nocookie.com/embed/...</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  URL Thumbnail Poster 16:9
                </label>
                <input
                  type="url"
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Sinopsis Film
                </label>
                <textarea
                  rows={3}
                  required
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Sinopsis cerita film..."
                  className={`w-full p-3 rounded-[2px] border text-xs focus-cinema leading-relaxed ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Daftar Penghargaan / Seleksi Festival (1 baris per penghargaan)
                </label>
                <textarea
                  rows={2}
                  value={awardsInput}
                  onChange={(e) => setAwardsInput(e.target.value)}
                  placeholder="Official Selection Festival Film...&#10;Best Student Cinematography..."
                  className={`w-full p-3 rounded-[2px] border text-xs font-mono-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded-[2px] text-[#E50914] focus:ring-[#E50914] w-4 h-4 bg-transparent border-slate-600"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold select-none font-body cursor-pointer">
                  Jadikan Film Unggulan Utama di Hero Banner Publik
                </label>
              </div>

              <div className="pt-4 border-t border-inherit flex space-x-2">
                <button
                  type="button"
                  onClick={() => setWorkModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                    isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWork}
                  className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
                >
                  {isSubmittingWork ? 'Menyimpan...' : editingWork ? 'Perbarui Film' : 'Terbitkan Film ke Etalase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT NEWS */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-[2px] border overflow-hidden shadow-2xl p-6 my-8 ${
            isDark ? 'bg-[#141414] border-[#333]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                  {editingNews ? 'Edit Warta Berita' : 'Tulis Rilis Pers / Warta Baru'}
                </h3>
              </div>
              <button
                onClick={() => setNewsModalOpen(false)}
                className="p-1.5 rounded-[2px] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNews} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Judul Berita / Siaran Pers
                </label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Judul rilis warta..."
                  className={`w-full px-3 py-2 rounded-[2px] border text-xs font-medium focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Kategori Berita
                  </label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema focus-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Siaran Pers">Siaran Pers</option>
                    <option value="Warta Kegiatan">Warta Kegiatan</option>
                    <option value="Prestasi Mahasiswa">Prestasi Mahasiswa</option>
                    <option value="Kajian Sinema">Kajian Sinema</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Penulis / Redaksi
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Estimasi Baca
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="Contoh: 4 Menit Baca"
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    required
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                    URL Thumbnail Berita
                  </label>
                  <input
                    type="url"
                    required
                    value={newsThumbnail}
                    onChange={(e) => setNewsThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full px-3 py-2 rounded-[2px] border text-xs font-mono-cinema ${
                      isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Ringkasan Singkat (Lead Paragraph)
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  className={`w-full p-3 rounded-[2px] border text-xs focus-cinema ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1 font-mono-cinema">
                  Konten Berita Lengkap
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi berita lengkap..."
                  className={`w-full p-3 rounded-[2px] border text-xs focus-cinema leading-relaxed ${
                    isDark ? 'bg-[#181818] border-[#333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-inherit flex space-x-2">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                    isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNews}
                  className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
                >
                  {isSubmittingNews ? 'Menyimpan...' : editingNews ? 'Perbarui Warta' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE FILM WORK MODAL */}
      {workToDelete && (
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
                  Hapus Karya Film
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-cinema">Tindakan ini permanen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-body mb-6">
              Apakah Anda yakin ingin menghapus film <strong className="text-white">"{workToDelete.title}" ({workToDelete.year})</strong> dari etalase publik dan database?
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setWorkToDelete(null)}
                disabled={isDeletingWork}
                className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                  isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteWork}
                disabled={isDeletingWork}
                className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
              >
                {isDeletingWork ? 'Menghapus...' : 'Ya, Hapus Karya'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE NEWS MODAL */}
      {newsToDelete && (
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
                  Hapus Warta Berita
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-cinema">Tindakan ini permanen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-body mb-6">
              Apakah Anda yakin ingin menghapus warta <strong className="text-white">"{newsToDelete.title}"</strong>?
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setNewsToDelete(null)}
                disabled={isDeletingNews}
                className={`flex-1 py-2.5 rounded-[2px] border text-xs font-semibold uppercase transition-colors ${
                  isDark ? 'border-[#333] hover:bg-[#222] text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteNews}
                disabled={isDeletingNews}
                className="flex-1 py-2.5 rounded-[2px] bg-[#E50914] hover:bg-[#c20811] text-white text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-hard-red disabled:opacity-50"
              >
                {isDeletingNews ? 'Menghapus...' : 'Ya, Hapus Berita'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

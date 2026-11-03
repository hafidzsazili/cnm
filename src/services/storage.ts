import bcrypt from 'bcryptjs';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  User, 
  Member, 
  Letter, 
  FinanceTransaction, 
  FilmWork, 
  NewsArticle, 
  Officer,
  BalanceSummary 
} from '../types';

// Pre-hashed bcrypt string for initial default password "cinemind2026"
const DEFAULT_HASHED_PASSWORD = bcrypt.hashSync('cinemind2026', 10);

const SEED_USERS: User[] = [
  {
    id: 'user-1',
    nim: '230101001',
    name: 'Arya Pratama',
    role: 'bph_inti',
    roleLabel: 'Ketua Umum (Superadmin)',
    division: 'Badan Pengurus Harian',
    email: 'arya.pratama@cinemind.ac.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    is_first_login: false,
    passwordHash: DEFAULT_HASHED_PASSWORD
  },
  {
    id: 'user-2',
    nim: '230101002',
    name: 'Nadia Salsabila',
    role: 'bph_sekretaris',
    roleLabel: 'Sekretaris Umum (Admin Persuratan)',
    division: 'Sekretariat & Tata Kelola',
    email: 'nadia.salsabila@cinemind.ac.id',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    is_first_login: false,
    passwordHash: DEFAULT_HASHED_PASSWORD
  },
  {
    id: 'user-3',
    nim: '230101003',
    name: 'Dimas Wicaksono',
    role: 'bph_bendahara',
    roleLabel: 'Bendahara Umum (Admin Keuangan)',
    division: 'Kebendaharaan & Aset',
    email: 'dimas.wicaksono@cinemind.ac.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    is_first_login: false,
    passwordHash: DEFAULT_HASHED_PASSWORD
  },
  {
    id: 'user-4',
    nim: '230101004',
    name: 'Rania Kirana',
    role: 'admin_medinfo',
    roleLabel: 'Koordinator Medinfo (Admin CMS)',
    division: 'Media, Informasi & Publikasi',
    email: 'rania.kirana@cinemind.ac.id',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    is_first_login: false,
    passwordHash: DEFAULT_HASHED_PASSWORD
  },
  {
    id: 'user-5',
    nim: '240101005',
    name: 'Bintang Ramadhan',
    role: 'bph_sekretaris',
    roleLabel: 'Staf Sekretariat (User Baru - Wajib Ganti Password)',
    division: 'Sekretariat & Tata Kelola',
    email: 'bintang.ramadhan@cinemind.ac.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_first_login: true, // HTTP 428 Precondition Required demo
    passwordHash: DEFAULT_HASHED_PASSWORD
  }
];

const SEED_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    nim: '230101001',
    name: 'Arya Pratama',
    batch: '2023',
    division: 'BPH Inti',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '081234567890',
    email: 'arya.pratama@cinemind.ac.id',
    joinedDate: '2023-09-01'
  },
  {
    id: 'mem-2',
    nim: '230101002',
    name: 'Nadia Salsabila',
    batch: '2023',
    division: 'Sekretariat',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    phone: '081234567891',
    email: 'nadia.salsabila@cinemind.ac.id',
    joinedDate: '2023-09-01'
  },
  {
    id: 'mem-3',
    nim: '230101003',
    name: 'Dimas Wicaksono',
    batch: '2023',
    division: 'Kebendaharaan',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: '081234567892',
    email: 'dimas.wicaksono@cinemind.ac.id',
    joinedDate: '2023-09-01'
  },
  {
    id: 'mem-4',
    nim: '230101004',
    name: 'Rania Kirana',
    batch: '2023',
    division: 'Media & Informasi',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    phone: '081234567893',
    email: 'rania.kirana@cinemind.ac.id',
    joinedDate: '2023-09-01'
  },
  {
    id: 'mem-5',
    nim: '230101012',
    name: 'Fikri Haikal',
    batch: '2023',
    division: 'Produksi Film & Kreatif',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    phone: '081398765432',
    email: 'fikri.haikal@cinemind.ac.id',
    joinedDate: '2023-09-01'
  },
  {
    id: 'mem-6',
    nim: '220101045',
    name: 'Alika Maheswari',
    batch: '2022',
    division: 'Kajian & Eksibisi',
    status: 'Alumni',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    phone: '081287654321',
    email: 'alika.m@alumni.ac.id',
    joinedDate: '2022-09-01'
  },
  {
    id: 'mem-7',
    nim: '240101088',
    name: 'Zahra Amelia',
    batch: '2024',
    division: 'Hubungan Masyarakat',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '081512345678',
    email: 'zahra.amelia@cinemind.ac.id',
    joinedDate: '2024-09-01'
  },
  {
    id: 'mem-8',
    nim: '220101033',
    name: 'Rizky Ramadan',
    batch: '2022',
    division: 'Produksi Film & Kreatif',
    status: 'Cuti',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    phone: '081776543210',
    email: 'rizky.r@student.ac.id',
    joinedDate: '2022-09-01'
  }
];

const SEED_LETTERS: Letter[] = [
  {
    id: 'let-1',
    letterNumber: '001/SK/A/CINEMIND/X/2026',
    sequenceNumber: 1,
    classificationCode: 'SK',
    recipient: 'Seluruh Fungsionaris Kabinet Sinema Lentera 2026',
    recipientAddress: 'Kampus Fakultas Ilmu Budaya & Media',
    subject: 'Surat Keputusan Pengesahan Struktur Pengurus Himpunan Mahasiswa KFTM Periode 2026/2027',
    letterDate: '2026-10-15',
    content: 'Menimbang pentingnya kelancaran roda organisasi dan tertib administrasi kepengurusan Himpunan Mahasiswa Kajian Film, Televisi, dan Media "CINEMIND", maka dengan ini Badan Pengurus Harian menetapkan susunan pengurus Kabinet Sinema Lentera tahun 2026/2027 sebagaimana terlampir.',
    signerName: 'Arya Pratama',
    signerRole: 'Ketua Umum CINEMIND',
    signerNim: '230101001',
    status: 'Diterbitkan',
    createdAt: 1760500000000
  },
  {
    id: 'let-2',
    letterNumber: '002/SP/A/CINEMIND/X/2026',
    sequenceNumber: 2,
    classificationCode: 'SP',
    recipient: 'Kepala UPT Studio Multimedia & Audio Visual',
    recipientAddress: 'Gedung Rektorat Lt. 3 Kampus Terpadu',
    subject: 'Permohonan Peminjaman Studio Bioskop Mini & Perlengkapan Sinematografi',
    letterDate: '2026-10-20',
    content: 'Sehubungan dengan diselenggarakannya agenda pemutaran film tahunan mahasiswa "Cinemind Screening Night 2026", kami memohon izin peminjaman ruangan Studio Bioskop Mini serta proyektor DCI beserta tata suara stereo pada hari Sabtu, 28 Oktober 2026.',
    signerName: 'Nadia Salsabila',
    signerRole: 'Sekretaris Umum CINEMIND',
    signerNim: '230101002',
    status: 'Diterbitkan',
    createdAt: 1760900000000
  },
  {
    id: 'let-3',
    letterNumber: '003/ST/A/CINEMIND/X/2026',
    sequenceNumber: 3,
    classificationCode: 'ST',
    recipient: 'Delegasi Mahasiswa Delegasi Jogja-NETPAC Asian Film Festival (JAFF)',
    recipientAddress: 'Yogyakarta, D.I. Yogyakarta',
    subject: 'Surat Tugas Delegasi Kajian & Eksibisi Festival Film Nasional',
    letterDate: '2026-10-22',
    content: 'Memberikan tugas kepada nama-nama terlampir untuk mewakili Himpunan Mahasiswa KFTM CINEMIND dalam forum kurasi dan jejaring komunitas film mahasiswa di agenda JAFF 2026.',
    signerName: 'Arya Pratama',
    signerRole: 'Ketua Umum CINEMIND',
    signerNim: '230101001',
    status: 'Diterbitkan',
    createdAt: 1761100000000
  }
];

const SEED_FINANCES: FinanceTransaction[] = [
  {
    id: 'fin-1',
    transactionDate: '2026-10-01',
    type: 'in',
    amount: 15000000,
    category: 'Sponsorship',
    description: 'Penerimaan dana sponsor utama dari Indie Cinema Lab untuk Festival',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Kwitansi #SPON-01/10/2026',
    createdAt: 1759276800000
  },
  {
    id: 'fin-2',
    transactionDate: '2026-10-05',
    type: 'in',
    amount: 3200000,
    category: 'Iuran Pengurus',
    description: 'Iuran wajib kas kabinet bulan Oktober 32 orang pengurus',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Transfer Bank Mandiri Virtual',
    createdAt: 1759622400000
  },
  {
    id: 'fin-3',
    transactionDate: '2026-10-08',
    type: 'out',
    amount: 4500000,
    category: 'Sewa Alat',
    description: 'Sewa kamera Sony FX3, lensa anamorphic, dan wireless follow focus produksi film pendek',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Invoice Rental #REN-8812',
    createdAt: 1759881600000
  },
  {
    id: 'fin-4',
    transactionDate: '2026-10-12',
    type: 'out',
    amount: 1250000,
    category: 'Konsumsi',
    description: 'Konsumsi rapat kerja gabungan BPH dan pembagian divisi produksi',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Struk Catering Dapur Rinjani',
    createdAt: 1760227200000
  },
  {
    id: 'fin-5',
    transactionDate: '2026-10-18',
    type: 'in',
    amount: 2800000,
    category: 'Danus',
    description: 'Penjualan merchandise t-shirt, tote bag, dan enamel pin official Cinemind',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Nota Rekap Danus Lapangan',
    createdAt: 1760745600000
  },
  {
    id: 'fin-6',
    transactionDate: '2026-10-23',
    type: 'out',
    amount: 1800000,
    category: 'Honorarium/Produksi',
    description: 'Biaya kurasi naskah dan juri screening internal karya tugas akhir',
    recordedBy: 'Dimas Wicaksono',
    receiptNote: 'Voucher Kas Keluar #023',
    createdAt: 1761177600000
  }
];

const SEED_WORKS: FilmWork[] = [
  {
    id: 'work-1',
    title: 'Gema di Ujung Rel',
    director: 'Fikri Haikal',
    producer: 'Arya Pratama',
    dop: 'Rifqi Alamsyah',
    productionHouse: 'Cinemind Films & Lab FIB',
    year: 2026,
    duration: '19 Menit',
    genre: 'Drama / Realisme Sosial',
    synopsis: 'Seorang penjaga palang pintu kereta api tua di pinggiran kota menyimpan arsip surat kabar tentang rel yang rencananya akan ditutup, sementara putrinya bersiap merantau ke Jakarta dengan membawa rol film peninggalan ibunya.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    festivalAwards: [
      'Official Selection Jogja-NETPAC Asian Film Festival (JAFF) 2026',
      'Pemenang Film Pendek Terbaik Festival Mahasiswa Nasional 2026',
      'Best Cinematography - Screen Student Awards'
    ],
    createdAt: 1761200000000
  },
  {
    id: 'work-2',
    title: 'Distorsi Suara Kota',
    director: 'Rania Kirana',
    producer: 'Nadia Salsabila',
    dop: 'Dimas Prasetyo',
    productionHouse: 'Cinemind Media Works',
    year: 2026,
    duration: '14 Menit',
    genre: 'Dokumenter Eksperimental',
    synopsis: 'Eksplorasi sensoris ritme akustik kota metropolis melalui lensa pemusik jalanan tunanetra yang merekam gelombang kebisingan knalpot, klakson, dan dengung rel MRT sebagai komposisi musik.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200&auto=format&fit=crop&q=80',
    featured: false,
    festivalAwards: [
      'Nominasi Dokumenter Inovatif DocFest Indonesia 2026',
      'Special Jury Mention Film Forum Surabaya'
    ],
    createdAt: 1761000000000
  },
  {
    id: 'work-3',
    title: 'Sebelum Layar Terang',
    director: 'Bagus Wicaksono',
    producer: 'Cindy Permata',
    dop: 'Aditya Surya',
    productionHouse: 'Cinemind Pictures',
    year: 2025,
    duration: '22 Menit',
    genre: 'Misteri Psikologis / Neo-Noir',
    synopsis: 'Malam penayangan perdana film bisu 1970 yang telah direstorasi berubah mencekam saat proyeksionis menemukan potongan adegan tersembunyi yang merekam kejahatan yang tak pernah diadili.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    featured: false,
    festivalAwards: [
      'Piala Maya Kategori Film Pendek Indie 2025',
      'Official Selection Balinale International Film Festival'
    ],
    createdAt: 1759000000000
  }
];

const SEED_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'CINEMIND Luncurkan Pekan Sinema Mahasiswa 2026: Merayakan Estetika & Keberanian Narasi',
    category: 'Siaran Pers',
    author: 'Divisi Media & Informasi',
    publishDate: '2026-10-23',
    summary: 'Rangkaian eksibisi 15 film pendek mahasiswa, workshop tata artistik bersama praktisi industri, dan masterclass kurasi festival resmi dibuka.',
    content: 'Himpunan Mahasiswa Kajian Film, Televisi, dan Media "CINEMIND" dengan bangga mengumumkan peluncuran "Pekan Sinema Mahasiswa 2026". Program ini diselenggarakan sebagai wadah dialog kritis antara karya akademis, produksi sinematografi independen, dan khalayak umum.\n\nDalam penyelenggaraan tahun ini, kurator menghadirkan kurasi bertema "Ruang & Memori" yang menyoroti pergulatan identitas urban dan narasi lokal. Kegiatan akan berlangsung selama 4 hari penuh di Bioskop Mini Kampus Terpadu.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80',
    readTime: '4 Menit Baca',
    createdAt: 1761210000000
  },
  {
    id: 'news-2',
    title: 'Kunjungan Studi Industri ke Studio Pascamuka & Foley Sound Jakarta',
    category: 'Warta Kegiatan',
    author: 'Rania Kirana',
    publishDate: '2026-10-18',
    summary: 'Sebanyak 35 mahasiswa KFTM berkesempatan mendalami proses mixing Dolby Atmos dan rancang suara foley langsung bersama desainer suara profesional.',
    content: 'Mahasiswa angkatan 2023 dan 2024 didampingi dosen pembina melakukan kunjungan lapangan ke fasilitas pascaproduksi audio film terkemuka di Jakarta. Mahasiswa diajak membedah proses sinkronisasi ambience, recording dialog ADR, hingga teknik foley organik menggunakan instrumen sehari-hari.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
    readTime: '3 Menit Baca',
    createdAt: 1760750000000
  },
  {
    id: 'news-3',
    title: 'Prestasi Gemilang: Tiga Karya Mahasiswa Lolos Kurasi Festival Asia 2026',
    category: 'Prestasi Mahasiswa',
    author: 'Sekretariat Kabinet',
    publishDate: '2026-10-10',
    summary: 'Film produksi mahasiswa Cinemind sukses menembus seleksi kurasi bergengsi di tingkat regional Asia Tenggara.',
    content: 'Ketua Umum CINEMIND mengapresiasi dedikasi sineas muda kampus yang terus membuktikan mutu karya di kancah perfilman internasional. Ketiga karya tersebut meliputi genre fiksi sosial, dokumenter puitik, dan eksplorasi animasi stop-motion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
    readTime: '5 Menit Baca',
    createdAt: 1760050000000
  }
];

const SEED_OFFICERS: Officer[] = [
  {
    id: 'off-1',
    nim: '230101001',
    name: 'Arya Pratama',
    roleTitle: 'Ketua Umum Kabinet Sinema Lentera',
    division: 'Badan Pengurus Harian (BPH)',
    level: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Mahasiswa KFTM 2023, sutradara film fiksi independen, berfokus pada penguatan ekosistem produksi mahasiswa dan tata kelola organisasi yang transparan.'
  },
  {
    id: 'off-2',
    nim: '230101002',
    name: 'Nadia Salsabila',
    roleTitle: 'Sekretaris Umum',
    division: 'Sekretariat & Tata Kelola',
    level: 2,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Bertanggung jawab atas standarisasi persuratan resmi berstandar tata kelola, kearsipan digital, dan koordinasi internal himpunan.'
  },
  {
    id: 'off-3',
    nim: '230101003',
    name: 'Dimas Wicaksono',
    roleTitle: 'Bendahara Umum',
    division: 'Kebendaharaan & Aset',
    level: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Mengelola buku kas digital, akuntabilitas anggaran produksi film, dan transparansi keuangan berbasis running balance real-time.'
  },
  {
    id: 'off-4',
    nim: '230101004',
    name: 'Rania Kirana',
    roleTitle: 'Kepala Divisi Media & Informasi',
    division: 'Media, Informasi & Publikasi',
    level: 3,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    bio: 'Mengawal kurasi etalase film publik, publikasi pers warta, dan representasi visual estetika sinematik CINEMIND.'
  },
  {
    id: 'off-5',
    nim: '230101012',
    name: 'Fikri Haikal',
    roleTitle: 'Kepala Divisi Produksi Film & Kreatif',
    division: 'Produksi & Kreatif',
    level: 3,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Mengarahkan workshop penulisan skenario, peminjaman alat kamera, dan inkubasi produksi film tugas akhir.'
  },
  {
    id: 'off-6',
    nim: '230101019',
    name: 'Sheila Amanda',
    roleTitle: 'Kepala Divisi Kajian & Eksibisi',
    division: 'Kajian, Litbang & Festival',
    level: 3,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Menggagas forum bedah film, penerbitan jurnal sinema berkala, dan kurasi film untuk festival mahasiswa.'
  }
];

export class StorageService {
  // In-memory / localStorage cache keys
  private static STORAGE_KEY_USERS = 'cinemind_users_v2';
  private static STORAGE_KEY_AUTH_TOKEN = 'cinemind_auth_token_v2';
  private static STORAGE_KEY_CURRENT_USER = 'cinemind_current_user_v2';
  private static STORAGE_KEY_MEMBERS = 'cinemind_members_v2';
  private static STORAGE_KEY_LETTERS = 'cinemind_letters_v2';
  private static STORAGE_KEY_FINANCES = 'cinemind_finances_v2';
  private static STORAGE_KEY_WORKS = 'cinemind_works_v2';
  private static STORAGE_KEY_NEWS = 'cinemind_news_v2';
  private static STORAGE_KEY_OFFICERS = 'cinemind_officers_v2';

  // ----------------------------------------------------
  // USER AUTHENTICATION & RBAC
  // ----------------------------------------------------
  static getAvailableUsers(): User[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  static saveUser(user: User): void {
    const users = this.getAvailableUsers();
    const idx = users.findIndex(u => u.id === user.id || u.nim === user.nim);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
  }

  static verifyCredentials(nim: string, plainPassword: string): { user: User | null; reason?: string } {
    const users = this.getAvailableUsers();
    const user = users.find(u => u.nim === nim.trim());
    if (!user) {
      return { user: null, reason: 'NIM tidak terdaftar dalam sistem SIM Cinemind.' };
    }

    // Compare with bcrypt hash
    const hash = user.passwordHash || DEFAULT_HASHED_PASSWORD;
    const isValid = bcrypt.compareSync(plainPassword, hash);
    if (!isValid) {
      return { user: null, reason: 'Kata sandi tidak sesuai. Pastikan huruf besar dan kecil benar.' };
    }

    return { user };
  }

  static updatePassword(nim: string, newPlainPassword: string): User | null {
    const users = this.getAvailableUsers();
    const idx = users.findIndex(u => u.nim === nim.trim());
    if (idx < 0) return null;

    const newHash = bcrypt.hashSync(newPlainPassword, 10);
    const updatedUser: User = {
      ...users[idx],
      passwordHash: newHash,
      is_first_login: false
    };

    users[idx] = updatedUser;
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));

    // Also update current user if matches
    const current = this.getCurrentUser();
    if (current && current.nim === nim) {
      this.setCurrentUser(updatedUser);
    }

    return updatedUser;
  }

  static generateJwtSimulation(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      nim: user.nim,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa(`cinemind_sig_${user.nim}_${Date.now()}`);
    return `${header}.${payload}.${signature}`;
  }

  static getCurrentUser(): User {
    const raw = localStorage.getItem(this.STORAGE_KEY_CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    // Default to bph_inti Superadmin for easy development experience
    return SEED_USERS[0];
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }

  static getAuthToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_AUTH_TOKEN);
  }

  static setAuthToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY_AUTH_TOKEN, token);
  }

  static clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY_AUTH_TOKEN);
  }

  // ----------------------------------------------------
  // REAL-TIME FIRESTORE SUBSCRIPTIONS WITH LOCAL FALLBACK
  // ----------------------------------------------------

  static subscribeFinances(callback: (data: FinanceTransaction[]) => void): () => void {
    // 1. Immediately emit from local cache or seed
    const local = this.getLocalFinances();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'finances');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: FinanceTransaction[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as FinanceTransaction);
          });
          // Sort descending by transactionDate or createdAt
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          localStorage.setItem(this.STORAGE_KEY_FINANCES, JSON.stringify(list));
          callback(list);
        } else {
          // If remote is empty, seed it
          this.seedCollection('finances', local);
        }
      }, (err) => {
        console.warn('Firestore finances sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  static subscribeLetters(callback: (data: Letter[]) => void): () => void {
    const local = this.getLocalLetters();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'letters');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: Letter[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Letter);
          });
          list.sort((a, b) => (b.sequenceNumber || 0) - (a.sequenceNumber || 0));
          localStorage.setItem(this.STORAGE_KEY_LETTERS, JSON.stringify(list));
          callback(list);
        } else {
          this.seedCollection('letters', local);
        }
      }, (err) => {
        console.warn('Firestore letters sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  static subscribeMembers(callback: (data: Member[]) => void): () => void {
    const local = this.getLocalMembers();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'members');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: Member[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Member);
          });
          list.sort((a, b) => a.nim.localeCompare(b.nim));
          localStorage.setItem(this.STORAGE_KEY_MEMBERS, JSON.stringify(list));
          callback(list);
        } else {
          this.seedCollection('members', local);
        }
      }, (err) => {
        console.warn('Firestore members sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  static subscribeWorks(callback: (data: FilmWork[]) => void): () => void {
    const local = this.getLocalWorks();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'works');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: FilmWork[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as FilmWork);
          });
          // Newest first
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          localStorage.setItem(this.STORAGE_KEY_WORKS, JSON.stringify(list));
          callback(list);
        } else {
          this.seedCollection('works', local);
        }
      }, (err) => {
        console.warn('Firestore works sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  static subscribeNews(callback: (data: NewsArticle[]) => void): () => void {
    const local = this.getLocalNews();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'news');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: NewsArticle[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
          });
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          localStorage.setItem(this.STORAGE_KEY_NEWS, JSON.stringify(list));
          callback(list);
        } else {
          this.seedCollection('news', local);
        }
      }, (err) => {
        console.warn('Firestore news sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  static subscribeOfficers(callback: (data: Officer[]) => void): () => void {
    const local = this.getLocalOfficers();
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'officers');
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: Officer[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Officer);
          });
          list.sort((a, b) => a.level - b.level);
          localStorage.setItem(this.STORAGE_KEY_OFFICERS, JSON.stringify(list));
          callback(list);
        } else {
          this.seedCollection('officers', local);
        }
      }, (err) => {
        console.warn('Firestore officers sync notice:', err);
      });
    } catch {
      return () => {};
    }
  }

  // ----------------------------------------------------
  // MUTATION HANDLERS
  // ----------------------------------------------------

  static async saveFinance(tx: FinanceTransaction): Promise<void> {
    const list = this.getLocalFinances();
    const idx = list.findIndex(item => item.id === tx.id);
    if (idx >= 0) {
      list[idx] = tx;
    } else {
      list.unshift(tx);
    }
    localStorage.setItem(this.STORAGE_KEY_FINANCES, JSON.stringify(list));

    if (db) {
      try {
        await setDoc(doc(db, 'finances', tx.id), tx);
      } catch (err) {
        console.warn('Firestore write error (cached locally):', err);
      }
    }
  }

  static async deleteFinance(id: string): Promise<void> {
    const list = this.getLocalFinances().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_FINANCES, JSON.stringify(list));

    if (db) {
      try {
        await deleteDoc(doc(db, 'finances', id));
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }
  }

  static async saveLetter(letter: Letter): Promise<void> {
    const list = this.getLocalLetters();
    const idx = list.findIndex(item => item.id === letter.id);
    if (idx >= 0) {
      list[idx] = letter;
    } else {
      list.unshift(letter);
    }
    localStorage.setItem(this.STORAGE_KEY_LETTERS, JSON.stringify(list));

    if (db) {
      try {
        await setDoc(doc(db, 'letters', letter.id), letter);
      } catch (err) {
        console.warn('Firestore letter write error:', err);
      }
    }
  }

  static async deleteLetter(id: string): Promise<void> {
    const list = this.getLocalLetters().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_LETTERS, JSON.stringify(list));

    if (db) {
      try {
        await deleteDoc(doc(db, 'letters', id));
      } catch (err) {
        console.warn('Firestore letter delete error:', err);
      }
    }
  }

  static async saveMember(member: Member): Promise<void> {
    const list = this.getLocalMembers();
    const idx = list.findIndex(item => item.id === member.id);
    if (idx >= 0) {
      list[idx] = member;
    } else {
      list.unshift(member);
    }
    localStorage.setItem(this.STORAGE_KEY_MEMBERS, JSON.stringify(list));

    if (db) {
      try {
        await setDoc(doc(db, 'members', member.id), member);
      } catch (err) {
        console.warn('Firestore member write error:', err);
      }
    }
  }

  static async deleteMember(id: string): Promise<void> {
    const list = this.getLocalMembers().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_MEMBERS, JSON.stringify(list));

    if (db) {
      try {
        await deleteDoc(doc(db, 'members', id));
      } catch (err) {
        console.warn('Firestore member delete error:', err);
      }
    }
  }

  static async saveWork(work: FilmWork): Promise<void> {
    const normalized = {
      ...work,
      embedUrl: this.normalizeYouTubeEmbed(work.embedUrl)
    };
    const list = this.getLocalWorks();
    const idx = list.findIndex(item => item.id === normalized.id);
    if (idx >= 0) {
      list[idx] = normalized;
    } else {
      list.unshift(normalized); // slot 1 (newest first)
    }
    localStorage.setItem(this.STORAGE_KEY_WORKS, JSON.stringify(list));

    if (db) {
      try {
        await setDoc(doc(db, 'works', normalized.id), normalized);
      } catch (err) {
        console.warn('Firestore work write error:', err);
      }
    }
  }

  static async deleteWork(id: string): Promise<void> {
    const list = this.getLocalWorks().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_WORKS, JSON.stringify(list));

    if (db) {
      try {
        await deleteDoc(doc(db, 'works', id));
      } catch (err) {
        console.warn('Firestore work delete error:', err);
      }
    }
  }

  static async saveNews(newsItem: NewsArticle): Promise<void> {
    const list = this.getLocalNews();
    const idx = list.findIndex(item => item.id === newsItem.id);
    if (idx >= 0) {
      list[idx] = newsItem;
    } else {
      list.unshift(newsItem);
    }
    localStorage.setItem(this.STORAGE_KEY_NEWS, JSON.stringify(list));

    if (db) {
      try {
        await setDoc(doc(db, 'news', newsItem.id), newsItem);
      } catch (err) {
        console.warn('Firestore news write error:', err);
      }
    }
  }

  static async deleteNews(id: string): Promise<void> {
    const list = this.getLocalNews().filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_NEWS, JSON.stringify(list));

    if (db) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (err) {
        console.warn('Firestore news delete error:', err);
      }
    }
  }

  static async updateOfficerAvatar(officerId: string, avatarUrl: string): Promise<void> {
    const list = this.getLocalOfficers();
    const idx = list.findIndex(item => item.id === officerId);
    if (idx >= 0) {
      list[idx].avatar = avatarUrl;
      localStorage.setItem(this.STORAGE_KEY_OFFICERS, JSON.stringify(list));

      if (db) {
        try {
          await setDoc(doc(db, 'officers', officerId), list[idx]);
        } catch (err) {
          console.warn('Firestore officer update error:', err);
        }
      }
    }
  }

  // ----------------------------------------------------
  // UTILITIES & CALCULATIONS
  // ----------------------------------------------------

  static calculateBalance(transactions: FinanceTransaction[]): BalanceSummary {
    let totalIn = 0;
    let totalOut = 0;
    for (const tx of transactions) {
      if (tx.type === 'in') {
        totalIn += tx.amount;
      } else {
        totalOut += tx.amount;
      }
    }
    return {
      totalIn,
      totalOut,
      currentBalance: totalIn - totalOut
    };
  }

  static calculateRunningBalances(transactions: FinanceTransaction[]): (FinanceTransaction & { runningBalance: number })[] {
    // Sort chronological first (oldest to newest) to calculate running balance correctly
    const sortedAsc = [...transactions].sort((a, b) => {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

    let balance = 0;
    const withRunning = sortedAsc.map((tx) => {
      if (tx.type === 'in') {
        balance += tx.amount;
      } else {
        balance -= tx.amount;
      }
      return {
        ...tx,
        runningBalance: balance
      };
    });

    // Return descending (newest first) for UI display
    return withRunning.reverse();
  }

  /**
   * Converts any standard YouTube URL (watch, share, shorts) to youtube-nocookie.com embed format
   */
  static normalizeYouTubeEmbed(url: string): string {
    if (!url) return '';
    const cleanUrl = url.trim();

    // Already nocookie embed
    if (cleanUrl.includes('youtube-nocookie.com/embed/')) {
      return cleanUrl;
    }

    let videoId = '';
    // youtu.be/ID
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      videoId = shortMatch[1];
    } else {
      // youtube.com/watch?v=ID
      const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (watchMatch) {
        videoId = watchMatch[1];
      } else {
        // youtube.com/embed/ID or shorts/ID
        const embedMatch = cleanUrl.match(/\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) {
          videoId = embedMatch[1];
        }
      }
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    // fallback if user provided direct embed link or iframe src
    return cleanUrl;
  }

  /**
   * Helper to format Rupiah currency
   */
  static formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Helper to format Roman Numeral for official letter month
   */
  static getRomanMonth(date: Date = new Date()): string {
    const month = date.getMonth() + 1;
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return roman[month - 1] || 'X';
  }

  /**
   * Image compression utility for file upload (returns compressed base64 JPEG)
   */
  static compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const elem = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(elem.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  // ----------------------------------------------------
  // INTERNAL LOCALSTORAGE RETRIEVAL
  // ----------------------------------------------------

  private static getLocalFinances(): FinanceTransaction[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_FINANCES);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_FINANCES, JSON.stringify(SEED_FINANCES));
      return SEED_FINANCES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_FINANCES;
    }
  }

  private static getLocalLetters(): Letter[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_LETTERS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_LETTERS, JSON.stringify(SEED_LETTERS));
      return SEED_LETTERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_LETTERS;
    }
  }

  private static getLocalMembers(): Member[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_MEMBERS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_MEMBERS, JSON.stringify(SEED_MEMBERS));
      return SEED_MEMBERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_MEMBERS;
    }
  }

  private static getLocalWorks(): FilmWork[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_WORKS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_WORKS, JSON.stringify(SEED_WORKS));
      return SEED_WORKS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_WORKS;
    }
  }

  private static getLocalNews(): NewsArticle[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_NEWS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_NEWS, JSON.stringify(SEED_NEWS));
      return SEED_NEWS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_NEWS;
    }
  }

  private static getLocalOfficers(): Officer[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_OFFICERS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_OFFICERS, JSON.stringify(SEED_OFFICERS));
      return SEED_OFFICERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_OFFICERS;
    }
  }

  private static async seedCollection(colName: string, items: any[]): Promise<void> {
    if (!db) return;
    try {
      for (const item of items) {
        if (item.id) {
          await setDoc(doc(db, colName, item.id), item);
        }
      }
    } catch {
      // silent
    }
  }
}

import { User, UserRole } from '../types';

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: User;
  require_password_change?: boolean;
  status_code?: number;
  temporary_token?: string;
  error?: string;
}

export interface ChangePasswordResponse {
  message?: string;
  token?: string;
  user?: User;
  error?: string;
}

/**
 * Mendapatkan basis URL API.
 * 1. Mengutamakan VITE_API_BASE_URL dari environment variable (.env / build config).
 * 2. Jika di development pada domain yang sama, menggunakan string kosong (relatif).
 * 3. Jika di-host di GitHub Pages (*.github.io) dan VITE_API_BASE_URL belum diatur,
 *    mengembalikan string kosong untuk memicu deteksi host statis.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
};

/**
 * Helper untuk parsing respons HTTP secara aman, mencegah error "Unexpected token '<'".
 */
async function parseResponseSafely<T = any>(response: Response): Promise<{ data: T | null; errorText: string | null }> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await response.json();
      return { data, errorText: null };
    } catch {
      return { data: null, errorText: 'Gagal mem-parsing payload JSON dari server.' };
    }
  }

  // Jika respons berupa HTML atau teks polos (misal halaman error 404/405/502 dari GitHub Pages atau proxy)
  const rawText = await response.text();
  return { 
    data: null, 
    errorText: `Server mengembalikan konten tipe non-JSON (${contentType || 'teks'}). Status: ${response.status} ${response.statusText}. Cuplikan: ${rawText.slice(0, 150)}` 
  };
}

export const AuthApi = {
  /**
   * POST /api/login
   */
  async login(nim: string, password: string): Promise<LoginResponse> {
    const baseUrl = getApiBaseUrl();

    // Deteksi khusus jika berjalan di domain GitHub Pages tanpa backend URL terkonfigurasi
    if (!baseUrl && typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
      return {
        error: 'Backend API belum terhubung. Frontend di-host di GitHub Pages (hanya melayani file statis), sedangkan sistem login memerlukan server backend Express. Silakan deploy backend Express (misalnya di Render/Railway) dan atur variabel VITE_API_BASE_URL pada environment / GitHub Secrets.',
        status_code: 405,
      };
    }

    const endpoint = `${baseUrl}/api/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ nim: nim.trim(), password: password.trim() }),
      });

      // Deteksi jika server mengembalikan HTTP 405 Method Not Allowed
      if (response.status === 405) {
        return {
          error: 'Permintaan POST ke endpoint login ditolak oleh server (HTTP 405 Method Not Allowed). Frontend di-host pada penyedia statis (GitHub Pages). Pastikan backend Express berjalan di hosting terpisah dan VITE_API_BASE_URL diarahkan ke sana.',
          status_code: 405,
        };
      }

      // Deteksi jika endpoint tidak ditemukan (HTTP 404)
      if (response.status === 404) {
        return {
          error: `Endpoint API login tidak ditemukan (HTTP 404 Not Found) pada: ${endpoint}. Periksa kembali alamat backend.`,
          status_code: 404,
        };
      }

      const { data, errorText } = await parseResponseSafely<any>(response);

      if (errorText || !data) {
        return {
          error: errorText || `Respons server tidak valid (HTTP ${response.status}).`,
          status_code: response.status,
        };
      }

      // Menangani status 428 Precondition Required (Wajib Ganti Password Pertama Kali)
      if (response.status === 428 || data.require_password_change) {
        return {
          require_password_change: true,
          status_code: 428,
          temporary_token: data.temporary_token,
          user: data.user,
          message: data.message,
        };
      }

      // Menangani status error seperti 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Server Error
      if (!response.ok) {
        return {
          error: data.error || `Login gagal dengan status ${response.status}`,
          status_code: response.status,
        };
      }

      return {
        token: data.token,
        user: data.user,
        message: data.message,
        status_code: 200,
      };
    } catch (err: any) {
      console.error('Network error during login:', err);
      return { 
        error: `Gagal terhubung ke server backend API (${endpoint || 'relatif'}). Pastikan server backend sedang aktif, CORS diizinkan, dan koneksi internet stabil.`,
        status_code: 0,
      };
    }
  },

  /**
   * POST /api/change-password
   */
  async changePassword(password_baru: string, temporary_token: string): Promise<ChangePasswordResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/change-password`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${temporary_token}`,
        },
        body: JSON.stringify({
          password_baru: password_baru.trim(),
          temporary_token,
        }),
      });

      if (response.status === 405) {
        return { error: 'Permintaan ditolak oleh server (HTTP 405 Method Not Allowed).' };
      }

      const { data, errorText } = await parseResponseSafely<any>(response);

      if (errorText || !data) {
        return { error: errorText || 'Respons tidak valid saat mengubah kata sandi.' };
      }

      if (!response.ok) {
        return { error: data.error || 'Gagal mengubah kata sandi.' };
      }

      return {
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (err: any) {
      console.error('Network error during change password:', err);
      return { error: 'Gagal terhubung ke server saat menyimpan kata sandi baru.' };
    }
  },

  /**
   * GET /api/me
   */
  async getMe(token: string): Promise<User | null> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/me`;

    try {
      const response = await fetch(endpoint, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) return null;
      const { data } = await parseResponseSafely<any>(response);
      return data?.user || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/roster
   */
  async getRoster(): Promise<any[]> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/roster`;

    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) return [];
      const { data } = await parseResponseSafely<any>(response);
      return data?.users || [];
    } catch {
      return [];
    }
  },

  /**
   * POST /api/reset-seeder
   */
  async resetSeeder(): Promise<boolean> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/reset-seeder`;

    try {
      const response = await fetch(endpoint, { 
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

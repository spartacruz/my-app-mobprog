/**
 * Zodiac Database Queries – Drizzle ORM
 * Fungsi-fungsi query untuk mengakses data zodiak dari SQLite.
 */
import { getExpoDb, zodiacImages } from './database';
import { zodiak } from './schema';

// ── Tipe data ────────────────────────────────────────────────────────────────
/** Tipe record zodiak dari database + gambar yang di-resolve runtime */
export type ZodiacRecord = typeof zodiak.$inferSelect & {
  gambar: any; // require() image asset, di-resolve dari gambar_key
};

// ── Helper: resolve gambar_key ke image asset ────────────────────────────────
function attachGambar(row: typeof zodiak.$inferSelect): ZodiacRecord {
  return {
    ...row,
    gambar: zodiacImages[row.gambar_key] ?? null,
  };
}

// ── Query: cari zodiak berdasarkan tanggal lahir ─────────────────────────────
/**
 * Mencari zodiak berdasarkan bulan dan hari lahir.
 * @param bulan - bulan (1-12)
 * @param hari  - hari (1-31)
 * @returns ZodiacRecord | null
 */
export async function findZodiacByDate(bulan: number, hari: number): Promise<ZodiacRecord | null> {
  // Gunakan async raw query untuk menghindari limitasi buffer "SyncSerializer" di Web
  // (Unterminated string in JSON) yang sering terjadi pada payload data besar.
  const rows = await getExpoDb().getAllAsync<typeof zodiak.$inferSelect>('SELECT * FROM zodiak');

  const match = rows.find((z) => {
    if (z.bulan_mulai === z.bulan_selesai) {
      // Zodiak dalam 1 bulan yang sama
      return bulan === z.bulan_mulai && hari >= z.hari_mulai && hari <= z.hari_selesai;
    }
    // Zodiak yang melewati batas bulan
    const afterStart = bulan === z.bulan_mulai && hari >= z.hari_mulai;
    const beforeEnd  = bulan === z.bulan_selesai && hari <= z.hari_selesai;
    return afterStart || beforeEnd;
  });

  return match ? attachGambar(match) : null;
}

// ── Query: ambil semua zodiak ────────────────────────────────────────────────
/**
 * Mengambil semua 12 record zodiak dari database.
 * @returns ZodiacRecord[]
 */
export async function getAllZodiacs(): Promise<ZodiacRecord[]> {
  const rows = await getExpoDb().getAllAsync<typeof zodiak.$inferSelect>('SELECT * FROM zodiak');
  return rows.map(attachGambar);
}

// ── Query: cari zodiak berdasarkan nama ──────────────────────────────────────
/**
 * Mencari zodiak berdasarkan nama (case-sensitive).
 * @param nama - nama zodiak, contoh: "Aries"
 * @returns ZodiacRecord | null
 */
export async function findZodiacByName(nama: string): Promise<ZodiacRecord | null> {
  const row = await getExpoDb().getFirstAsync<typeof zodiak.$inferSelect>(
    'SELECT * FROM zodiak WHERE nama_zodiak = ? LIMIT 1',
    [nama]
  );

  return row ? attachGambar(row) : null;
}

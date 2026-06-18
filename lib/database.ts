/**
 * Database Module – expo-sqlite + Drizzle ORM
 * Menginisialisasi database SQLite, membuat tabel, dan menyisipkan data seed zodiak.
 */
import { openDatabaseSync, openDatabaseAsync } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { zodiak } from './schema';
import { count } from 'drizzle-orm';

// ── Image mapping ────────────────────────────────────────────────────────────
// SQLite tidak bisa menyimpan require(), jadi kita simpan key string di DB
// dan resolve ke asset gambar di sini.
export const zodiacImages: Record<string, any> = {
  aries:       require('@/assets/images/zodiac-aries.png'),
  taurus:      require('@/assets/images/zodiac-taurus.png'),
  gemini:      require('@/assets/images/zodiac-gemini.png'),
  cancer:      require('@/assets/images/zodiac-cancer.png'),
  leo:         require('@/assets/images/zodiac-leo.png'),
  virgo:       require('@/assets/images/zodiac-virgo.png'),
  libra:       require('@/assets/images/zodiac-libra.png'),
  scorpio:     require('@/assets/images/zodiac-scorpio.png'),
  sagittarius: require('@/assets/images/zodiac-sagittarius.png'),
  capricorn:   require('@/assets/images/zodiac-capricorn.png'),
  aquarius:    require('@/assets/images/zodiac-aquarius.png'),
  pisces:      require('@/assets/images/zodiac-pisces.png'),
};

// ── Database instance (lazy init) ───────────────────────────────────────────
// PENTING: openDatabaseSync TIDAK boleh dipanggil di module level pada web,
// karena WASM engine belum siap saat module di-import pertama kali.
// Gunakan lazy initialization — db dibuat hanya sekali saat initDatabase() dipanggil.
let _db: ExpoSQLiteDatabase | null = (globalThis as any)._db || null;
let _expoDb: ReturnType<typeof openDatabaseSync> | null = (globalThis as any)._expoDb || null;

export function getDb(): ExpoSQLiteDatabase {
  if (!_db) {
    throw new Error('Database belum diinisialisasi. Panggil initDatabase() terlebih dahulu.');
  }
  return _db;
}

export function getExpoDb() {
  if (!_expoDb) {
    throw new Error('Database belum diinisialisasi. Panggil initDatabase() terlebih dahulu.');
  }
  return _expoDb;
}

// ── Seed data ────────────────────────────────────────────────────────────────
const seedData = [
  {
    nama_zodiak: 'Aries', simbol: '♈', elemen: 'Api',
    tanggal_mulai: '21 Maret', tanggal_selesai: '19 April',
    bulan_mulai: 3, hari_mulai: 21, bulan_selesai: 4, hari_selesai: 19,
    warna: '#E53935', gambar_key: 'aries',
    deskripsi_karier: 'Aries dikenal sebagai pemimpin alami di tempat kerja. Tahun ini adalah waktu yang tepat untuk mengambil inisiatif dan memimpin proyek baru. Energi tinggi Anda akan mendorong tim menuju keberhasilan. Hindari tergesa-gesa dalam mengambil keputusan penting.',
    deskripsi_keuangan: 'Kondisi keuangan Aries cukup menjanjikan. Ada potensi pemasukan tambahan dari sumber yang tidak terduga. Namun, kendalikan impuls untuk berbelanja secara berlebihan. Investasi jangka pendek bisa memberikan hasil yang baik jika direncanakan dengan matang.',
    deskripsi_asmara: 'Kehidupan asmara Aries penuh semangat dan gairah. Pasangan Anda akan mengagumi keberanian dan kejujuran Anda. Bagi yang masih lajang, peluang bertemu seseorang yang spesial sangat besar dalam waktu dekat. Komunikasikan perasaan Anda dengan terbuka.',
    deskripsi_kesehatan: 'Energi Aries yang tinggi perlu diimbangi dengan istirahat yang cukup. Olahraga rutin sangat dianjurkan untuk menjaga stamina. Perhatikan area kepala dan wajah yang rentan. Jaga pola makan dan hindari stres berlebihan.',
  },
  {
    nama_zodiak: 'Taurus', simbol: '♉', elemen: 'Tanah',
    tanggal_mulai: '20 April', tanggal_selesai: '20 Mei',
    bulan_mulai: 4, hari_mulai: 20, bulan_selesai: 5, hari_selesai: 20,
    warna: '#43A047', gambar_key: 'taurus',
    deskripsi_karier: 'Taurus unggul dalam pekerjaan yang membutuhkan ketelitian dan ketekunan. Stabilitas karier Anda terus meningkat. Jangan ragu untuk bernegosiasi mengenai posisi atau gaji yang lebih baik. Kolaborasi dengan rekan kerja akan membuka peluang baru.',
    deskripsi_keuangan: 'Keuangan Taurus sangat stabil berkat sifat hemat dan bijak dalam pengelolaan uang. Pertimbangkan investasi properti atau instrumen keuangan jangka panjang. Hindari pengeluaran mewah yang tidak perlu. Tabungan Anda akan bertumbuh pesat.',
    deskripsi_asmara: 'Taurus mencari cinta yang stabil dan tulus. Hubungan Anda berkembang dalam suasana yang hangat dan penuh perhatian. Tunjukkan rasa sayang melalui tindakan nyata, bukan hanya kata-kata. Bagi yang lajang, pendekatan yang sabar akan membuahkan hasil.',
    deskripsi_kesehatan: 'Taurus perlu memperhatikan kesehatan area leher dan tenggorokan. Pola makan seimbang sangat penting karena Taurus cenderung menyukai makanan lezat. Olahraga ringan seperti yoga atau berjalan kaki sangat cocok. Jaga berat badan ideal.',
  },
  {
    nama_zodiak: 'Gemini', simbol: '♊', elemen: 'Udara',
    tanggal_mulai: '21 Mei', tanggal_selesai: '20 Juni',
    bulan_mulai: 5, hari_mulai: 21, bulan_selesai: 6, hari_selesai: 20,
    warna: '#F9A825', gambar_key: 'gemini',
    deskripsi_karier: 'Kemampuan komunikasi Gemini yang luar biasa menjadi aset utama di tempat kerja. Anda akan unggul dalam pekerjaan yang melibatkan presentasi, negosiasi, atau penulisan. Multitasking adalah kekuatan Anda, namun pastikan untuk menyelesaikan setiap tugas dengan tuntas.',
    deskripsi_keuangan: 'Keuangan Gemini cenderung berfluktuasi karena sifat spontan. Buat anggaran bulanan yang jelas dan patuhi rencana keuangan Anda. Ada peluang penghasilan dari bidang kreatif atau teknologi. Hindari keputusan investasi yang terburu-buru.',
    deskripsi_asmara: 'Gemini adalah kekasih yang menyenangkan dan penuh kejutan. Komunikasi adalah kunci hubungan yang harmonis bagi Anda. Jaga komitmen dan konsistensi dalam berhubungan. Bagi yang lajang, media sosial atau komunitas online bisa menjadi tempat bertemu pasangan.',
    deskripsi_kesehatan: 'Area paru-paru, bahu, dan tangan perlu mendapat perhatian khusus. Hindari kebiasaan merokok dan jaga kualitas udara di lingkungan Anda. Latihan pernapasan dan meditasi sangat bermanfaat. Istirahat yang cukup membantu menjaga fokus dan energi.',
  },
  {
    nama_zodiak: 'Cancer', simbol: '♋', elemen: 'Air',
    tanggal_mulai: '21 Juni', tanggal_selesai: '22 Juli',
    bulan_mulai: 6, hari_mulai: 21, bulan_selesai: 7, hari_selesai: 22,
    warna: '#039BE5', gambar_key: 'cancer',
    deskripsi_karier: 'Intuisi tajam Cancer sangat berharga dalam lingkungan kerja. Anda berbakat dalam pekerjaan yang berkaitan dengan perawatan, seni, atau manajemen. Kepercayaan tim terhadap Anda semakin meningkat. Jangan biarkan emosi mempengaruhi keputusan profesional.',
    deskripsi_keuangan: 'Cancer cenderung berhati-hati dalam urusan keuangan. Simpan dana darurat yang cukup untuk menghadapi situasi tak terduga. Properti atau investasi yang berhubungan dengan rumah tangga bisa menjadi pilihan terbaik. Kepercayaan diri dalam negosiasi keuangan perlu ditingkatkan.',
    deskripsi_asmara: 'Cancer adalah pecinta yang penuh kasih dan setia. Anda memberikan segalanya dalam sebuah hubungan. Namun, belajarlah untuk tidak terlalu bergantung pada pasangan. Ciptakan momen romantis di rumah untuk mempererat ikatan emosional.',
    deskripsi_kesehatan: 'Perhatikan kesehatan sistem pencernaan dan area dada. Stres emosional dapat berdampak langsung pada kesehatan fisik Anda. Luangkan waktu untuk relaksasi dan aktivitas yang Anda sukai. Menjaga hubungan sosial yang sehat juga berpengaruh besar pada kesejahteraan Anda.',
  },
  {
    nama_zodiak: 'Leo', simbol: '♌', elemen: 'Api',
    tanggal_mulai: '23 Juli', tanggal_selesai: '22 Agustus',
    bulan_mulai: 7, hari_mulai: 23, bulan_selesai: 8, hari_selesai: 22,
    warna: '#FB8C00', gambar_key: 'leo',
    deskripsi_karier: 'Leo lahir untuk bersinar di panggung profesional. Kreativitas dan karisma Anda menarik perhatian atasan dan rekan kerja. Kepemimpinan Anda semakin diakui. Gunakan kemampuan Anda untuk menginspirasi orang lain dan jangan takut tampil menonjol.',
    deskripsi_keuangan: 'Gaya hidup mewah Leo bisa menjadi tantangan keuangan. Buat prioritas antara kebutuhan dan keinginan. Peluang bisnis di bidang hiburan atau seni sangat menjanjikan. Dengan disiplin finansial, kekayaan Leo bisa bertumbuh signifikan.',
    deskripsi_asmara: 'Leo adalah pasangan yang penuh gairah, romantis, dan setia. Anda suka menjadi perhatian utama pasangan. Apresiasi pasangan Anda secara tulus dan beri ruang untuk mereka bersinar juga. Hubungan Anda akan semakin kuat dengan saling mendukung.',
    deskripsi_kesehatan: 'Leo perlu memperhatikan kesehatan jantung dan punggung. Aktivitas fisik yang menyenangkan seperti menari atau olahraga tim sangat dianjurkan. Jaga ego dan hindari stres akibat kompetisi yang tidak sehat. Istirahat berkualitas adalah kunci vitalitas Anda.',
  },
  {
    nama_zodiak: 'Virgo', simbol: '♍', elemen: 'Tanah',
    tanggal_mulai: '23 Agustus', tanggal_selesai: '22 September',
    bulan_mulai: 8, hari_mulai: 23, bulan_selesai: 9, hari_selesai: 22,
    warna: '#558B2F', gambar_key: 'virgo',
    deskripsi_karier: 'Ketelitian dan dedikasi Virgo membuat Anda menjadi aset tak ternilai di tempat kerja. Anda unggul dalam analisis, penelitian, dan pekerjaan yang membutuhkan perhatian terhadap detail. Jangan terlalu keras pada diri sendiri jika tidak sempurna. Pengakuan atas kerja keras Anda akan datang.',
    deskripsi_keuangan: 'Virgo sangat mahir dalam manajemen keuangan. Kemampuan analitis Anda membantu menghindari keputusan finansial yang buruk. Pertimbangkan investasi di sektor kesehatan atau teknologi. Anggaran yang rapi adalah senjata terkuat Anda.',
    deskripsi_asmara: 'Virgo mencari pasangan yang cerdas dan dapat diandalkan. Anda menunjukkan kasih sayang melalui perhatian pada detail kecil. Belajarlah untuk lebih ekspresif dalam mengungkapkan perasaan. Kepercayaan dibangun perlahan tapi pasti dalam hubungan Virgo.',
    deskripsi_kesehatan: 'Area pencernaan dan usus adalah fokus kesehatan Virgo. Pola makan sehat dan teratur sangat penting. Hindari kekhawatiran berlebihan yang dapat memicu gangguan kesehatan psikosomatik. Praktik mindfulness dan olahraga ringan sangat bermanfaat.',
  },
  {
    nama_zodiak: 'Libra', simbol: '♎', elemen: 'Udara',
    tanggal_mulai: '23 September', tanggal_selesai: '22 Oktober',
    bulan_mulai: 9, hari_mulai: 23, bulan_selesai: 10, hari_selesai: 22,
    warna: '#E91E63', gambar_key: 'libra',
    deskripsi_karier: 'Libra unggul dalam pekerjaan yang membutuhkan diplomasi dan keadilan. Kemampuan Anda dalam menjaga harmoni tim sangat dihargai. Peran mediator atau konsultan sangat cocok untuk Anda. Tingkatkan kemampuan dalam pengambilan keputusan yang cepat dan tegas.',
    deskripsi_keuangan: 'Libra terkadang sulit memutuskan antara menabung dan berbelanja. Cari keseimbangan antara menikmati hidup dan menjaga stabilitas finansial. Kemitraan bisnis yang adil dan transparan sangat menguntungkan. Hindari hutang konsumtif.',
    deskripsi_asmara: 'Libra adalah zodiak romansa yang ideal. Anda mencintai keindahan dan harmoni dalam hubungan. Selalu berusaha untuk adil terhadap pasangan. Jangan takut mengungkapkan kebutuhan Anda. Hubungan yang saling menghormati adalah impian Libra.',
    deskripsi_kesehatan: 'Ginjal dan area pinggang menjadi fokus kesehatan Libra. Minum air yang cukup sangat penting. Seimbangkan aktivitas fisik dengan waktu istirahat. Hindari kebiasaan menunda keputusan yang menimbulkan stres berkepanjangan.',
  },
  {
    nama_zodiak: 'Scorpio', simbol: '♏', elemen: 'Air',
    tanggal_mulai: '23 Oktober', tanggal_selesai: '21 November',
    bulan_mulai: 10, hari_mulai: 23, bulan_selesai: 11, hari_selesai: 21,
    warna: '#6A1B9A', gambar_key: 'scorpio',
    deskripsi_karier: 'Scorpio memiliki determinasi dan fokus yang luar biasa dalam karier. Kemampuan investigasi dan analisis mendalam membuat Anda unggul di bidang penelitian, keuangan, atau hukum. Kepercayaan diri Anda menginspirasi orang lain. Waspada terhadap konflik kekuasaan di lingkungan kerja.',
    deskripsi_keuangan: 'Scorpio memiliki naluri keuangan yang tajam. Anda mampu mengidentifikasi peluang investasi yang tidak terlihat orang lain. Pertahankan kerahasiaan rencana finansial Anda. Investasi jangka panjang di bidang teknologi atau properti sangat menguntungkan.',
    deskripsi_asmara: 'Scorpio adalah pecinta yang intens, penuh gairah, dan setia sampai mati. Anda mencari koneksi yang dalam dan bermakna. Belajar untuk mempercayai pasangan sepenuhnya dan lepaskan rasa cemburu berlebihan. Keintiman emosional adalah pondasi hubungan Scorpio yang sehat.',
    deskripsi_kesehatan: 'Area reproduksi dan sistem kekebalan tubuh perlu diperhatikan Scorpio. Manajemen stres sangat krusial karena Scorpio cenderung memendam emosi. Olahraga intensitas tinggi seperti martial arts atau HIIT sangat cocok. Detoksifikasi mental dan fisik secara rutin sangat dianjurkan.',
  },
  {
    nama_zodiak: 'Sagittarius', simbol: '♐', elemen: 'Api',
    tanggal_mulai: '22 November', tanggal_selesai: '21 Desember',
    bulan_mulai: 11, hari_mulai: 22, bulan_selesai: 12, hari_selesai: 21,
    warna: '#7B1FA2', gambar_key: 'sagittarius',
    deskripsi_karier: 'Sagittarius penuh dengan antusiasme dan visi besar. Anda cocok untuk pekerjaan yang melibatkan perjalanan, pendidikan, atau pengembangan bisnis internasional. Kemampuan Anda melihat gambaran besar sangat berharga. Fokus pada satu tujuan utama agar energi tidak tersebar.',
    deskripsi_keuangan: 'Sagittarius cenderung optimis dalam keuangan, terkadang terlalu percaya diri. Rencanakan pengeluaran untuk perjalanan dan petualangan dengan bijak. Diversifikasi investasi Anda untuk meminimalkan risiko. Peluang dari bisnis internasional atau edukasi sangat menjanjikan.',
    deskripsi_asmara: 'Sagittarius menginginkan kebebasan dalam cinta. Anda mencari pasangan yang bisa menjadi teman petualangan seumur hidup. Jangan takut berkomitmen jika menemukan orang yang tepat. Kejujuran dan humor adalah senjata terkuat Sagittarius dalam asmara.',
    deskripsi_kesehatan: 'Paha, pinggul, dan hati adalah area yang perlu diperhatikan Sagittarius. Aktivitas outdoor seperti hiking atau bersepeda sangat cocok untuk Anda. Jaga pola makan dan hindari konsumsi alkohol berlebihan. Menjaga optimisme adalah obat terbaik untuk Sagittarius.',
  },
  {
    nama_zodiak: 'Capricorn', simbol: '♑', elemen: 'Tanah',
    tanggal_mulai: '22 Desember', tanggal_selesai: '19 Januari',
    bulan_mulai: 12, hari_mulai: 22, bulan_selesai: 1, hari_selesai: 19,
    warna: '#00695C', gambar_key: 'capricorn',
    deskripsi_karier: 'Capricorn adalah pekerja keras yang ambisius dan disiplin. Anda menginginkan posisi tertinggi dan siap bekerja keras untuk meraihnya. Kemampuan kepemimpinan yang matang membuat Anda dipercaya rekan dan atasan. Jangan abaikan work-life balance dalam mengejar ambisi.',
    deskripsi_keuangan: 'Capricorn adalah zodiak paling bijak dalam urusan keuangan. Anda sabar dalam membangun kekayaan secara bertahap. Investasi jangka panjang seperti saham blue chip atau reksa dana sangat cocok. Disiplin finansial Anda adalah teladan bagi banyak orang.',
    deskripsi_asmara: 'Capricorn serius dalam urusan cinta. Anda mencari hubungan yang stabil dan berorientasi masa depan. Tunjukkan sisi hangat dan lucu Anda kepada pasangan. Bagi yang lajang, jangan terlalu sibuk bekerja hingga melupakan kehidupan asmara.',
    deskripsi_kesehatan: 'Lutut, tulang, dan gigi adalah area kesehatan yang perlu diperhatikan Capricorn. Hindari bekerja terlalu keras tanpa istirahat. Olahraga teratur seperti jogging atau yoga menjaga kesehatan sendi. Perhatikan asupan kalsium dan vitamin D untuk menjaga kekuatan tulang.',
  },
  {
    nama_zodiak: 'Aquarius', simbol: '♒', elemen: 'Udara',
    tanggal_mulai: '20 Januari', tanggal_selesai: '18 Februari',
    bulan_mulai: 1, hari_mulai: 20, bulan_selesai: 2, hari_selesai: 18,
    warna: '#0277BD', gambar_key: 'aquarius',
    deskripsi_karier: 'Aquarius adalah inovator dan visioner. Anda unggul di bidang teknologi, sains, atau pekerjaan sosial yang berdampak besar. Ide-ide revolusioner Anda bisa mengubah dunia. Bangun jaringan yang kuat karena kolaborasi adalah kunci kesuksesan Aquarius.',
    deskripsi_keuangan: 'Aquarius sering mengorbankan keuntungan pribadi demi tujuan yang lebih besar. Seimbangkan antara filantropi dan kebutuhan finansial pribadi. Investasi di teknologi inovatif atau startup bisa sangat menguntungkan. Rencanakan masa pensiun sejak dini.',
    deskripsi_asmara: 'Aquarius menginginkan pasangan yang juga bisa menjadi sahabat terbaik. Anda menghargai kebebasan dan independensi dalam hubungan. Jangan takut menunjukkan sisi emosional Anda. Hubungan yang didasari persahabatan tulus akan paling bertahan lama.',
    deskripsi_kesehatan: 'Betis, pergelangan kaki, dan sirkulasi darah perlu diperhatikan Aquarius. Aktivitas sosial dan komunitas sangat baik untuk kesehatan mental Anda. Latihan aerobik membantu melancarkan sirkulasi. Hindari kebiasaan duduk terlalu lama tanpa bergerak.',
  },
  {
    nama_zodiak: 'Pisces', simbol: '♓', elemen: 'Air',
    tanggal_mulai: '19 Februari', tanggal_selesai: '20 Maret',
    bulan_mulai: 2, hari_mulai: 19, bulan_selesai: 3, hari_selesai: 20,
    warna: '#00838F', gambar_key: 'pisces',
    deskripsi_karier: 'Pisces memiliki intuisi dan kreativitas yang tinggi. Anda unggul di bidang seni, musik, desain, atau pekerjaan yang membutuhkan empati tinggi seperti konseling. Percayai insting Anda dalam mengambil keputusan. Tetapkan batasan yang jelas antara pekerjaan dan kehidupan pribadi.',
    deskripsi_keuangan: 'Pisces perlu meningkatkan disiplin finansial. Anda terkadang terlalu murah hati hingga mengabaikan kebutuhan sendiri. Buat rencana keuangan yang realistis dan ikuti dengan konsisten. Peluang penghasilan dari dunia seni atau healing arts sangat menjanjikan.',
    deskripsi_asmara: 'Pisces adalah pecinta yang paling romantis dan penuh kasih di antara semua zodiak. Anda rela berkorban demi kebahagiaan pasangan. Namun, jaga diri Anda dari pasangan yang memanfaatkan kebaikan hati Anda. Cinta yang tulus dan timbal balik adalah hak Anda.',
    deskripsi_kesehatan: 'Kaki dan sistem limfatik adalah area kesehatan yang perlu diperhatikan Pisces. Jaga kualitas tidur karena Pisces sangat membutuhkan istirahat yang cukup. Aktivitas di alam atau dekat air sangat menyehatkan jiwa Pisces. Hindari pelarian dari masalah melalui substansi berbahaya.',
  },
];

// ── Inisialisasi database ────────────────────────────────────────────────────
/**
 * Membuat koneksi SQLite, tabel zodiak (jika belum ada), dan mengisi data seed.
 * Panggil sekali saat aplikasi startup (di _layout.tsx).
 * openDatabaseSync dipanggil di sini (bukan module level) agar WASM siap di web.
 */
export async function initDatabase(): Promise<void> {
  // Lazy init: buka koneksi hanya sekali
  if (!_expoDb) {
    _expoDb = await openDatabaseAsync('zodiac.db');
    _db = drizzle(_expoDb);
    (globalThis as any)._expoDb = _expoDb;
    (globalThis as any)._db = _db;
  }

  // Buat tabel menggunakan raw SQL (tanpa drizzle-kit push)
  await _expoDb.execAsync(`
    CREATE TABLE IF NOT EXISTS zodiak (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_zodiak         TEXT NOT NULL,
      simbol              TEXT NOT NULL,
      elemen              TEXT NOT NULL,
      tanggal_mulai       TEXT NOT NULL,
      tanggal_selesai     TEXT NOT NULL,
      bulan_mulai         INTEGER NOT NULL,
      hari_mulai          INTEGER NOT NULL,
      bulan_selesai       INTEGER NOT NULL,
      hari_selesai        INTEGER NOT NULL,
      warna               TEXT NOT NULL,
      deskripsi_karier    TEXT NOT NULL,
      deskripsi_keuangan  TEXT NOT NULL,
      deskripsi_asmara    TEXT NOT NULL,
      deskripsi_kesehatan TEXT NOT NULL,
      gambar_key          TEXT NOT NULL
    );
  `);

  // Cek apakah tabel sudah ada datanya menggunakan raw query async agar tidak error di Web
  const result = await _expoDb.getFirstAsync<{ jumlah: number }>('SELECT COUNT(*) as jumlah FROM zodiak');
  if (result && result.jumlah > 0) {
    return; // Data sudah ada, skip seeding
  }

  // Seed semua 12 zodiak menggunakan execAsync agar lebih aman di web
  // Untuk insert satu-satu, lebih baik gunakan runAsync
  for (const data of seedData) {
    await _expoDb.runAsync(
      `INSERT INTO zodiak (nama_zodiak, simbol, elemen, tanggal_mulai, tanggal_selesai, bulan_mulai, hari_mulai, bulan_selesai, hari_selesai, warna, deskripsi_karier, deskripsi_keuangan, deskripsi_asmara, deskripsi_kesehatan, gambar_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nama_zodiak, data.simbol, data.elemen, data.tanggal_mulai, data.tanggal_selesai,
        data.bulan_mulai, data.hari_mulai, data.bulan_selesai, data.hari_selesai,
        data.warna, data.deskripsi_karier, data.deskripsi_keuangan, data.deskripsi_asmara, data.deskripsi_kesehatan, data.gambar_key
      ]
    );
  }

  console.log('✅ Database zodiak berhasil di-seed dengan 12 record.');
}


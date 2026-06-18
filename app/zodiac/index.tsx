import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findZodiacByDate, ZodiacRecord } from '@/lib/zodiac-db';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// ── DatePicker cross-platform ────────────────────────────────────────────────
// Gunakan @react-native-community/datetimepicker bila tersedia, fallback ke input
// Untuk Expo Go kita pakai solusi native ringan tanpa package tambahan:
// Picker berbasis 3 kolom scroll (bulan, hari).
// Agar simple dan kompatibel, kita pakai JS Date + state pickers manual.

const BULAN_NAMA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// ── Komponen kartu info ──────────────────────────────────────────────────────
function InfoCard({ icon, judul, isi, warna }: { icon: string; judul: string; isi: string; warna: string }) {
  return (
    <View style={[styles.infoCard, { borderLeftColor: warna }]}>
      <View style={styles.infoHeader}>
        <ThemedText style={[styles.infoIcon]}>{icon}</ThemedText>
        <ThemedText type="defaultSemiBold" style={[styles.infoJudul, { color: warna }]}>
          {judul}
        </ThemedText>
      </View>
      <ThemedText style={styles.infoIsi}>{isi}</ThemedText>
    </View>
  );
}

// ── Picker scroll sederhana ──────────────────────────────────────────────────
function PickerRow({
  label,
  value,
  items,
  onDecrement,
  onIncrement,
  warna,
}: {
  label: string;
  value: string;
  items: string[];
  onDecrement: () => void;
  onIncrement: () => void;
  warna?: string;
}) {
  return (
    <View style={styles.pickerRow}>
      <ThemedText style={styles.pickerLabel}>{label}</ThemedText>
      <View style={styles.pickerControl}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onDecrement}>
          <ThemedText style={styles.arrowText}>‹</ThemedText>
        </TouchableOpacity>
        <View style={[styles.pickerValueBox, warna ? { borderColor: warna } : {}]}>
          <ThemedText type="defaultSemiBold" style={styles.pickerValue}>{value}</ThemedText>
        </View>
        <TouchableOpacity style={styles.arrowBtn} onPress={onIncrement}>
          <ThemedText style={styles.arrowText}>›</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Layar utama ──────────────────────────────────────────────────────────────
export default function ZodiacScreen() {
  const today = new Date();
  const [selectedBulan, setSelectedBulan] = useState(today.getMonth()); // 0-based
  const [selectedHari, setSelectedHari]   = useState(today.getDate());   // 1-based

  const [hasil, setHasil] = useState<ZodiacRecord | null | undefined>(undefined);

  const maxHari = new Date(today.getFullYear(), selectedBulan + 1, 0).getDate();

  const ubahBulan = (delta: number) => {
    setSelectedBulan((prev) => {
      const next = (prev + delta + 12) % 12;
      // Sesuaikan hari jika melebihi hari maks bulan baru
      const maxH = new Date(today.getFullYear(), next + 1, 0).getDate();
      if (selectedHari > maxH) setSelectedHari(maxH);
      return next;
    });
  };

  const ubahHari = (delta: number) => {
    setSelectedHari((prev) => {
      if (prev + delta < 1) return maxHari;
      if (prev + delta > maxHari) return 1;
      return prev + delta;
    });
  };

  const cariZodiak = () => {
    // Drift: query ke database zodiak berdasarkan bulan & hari
    const bulan = selectedBulan + 1; // konversi ke 1-based
    const hari  = selectedHari;
    const record = findZodiacByDate(bulan, hari);
    setHasil(record ?? null);
  };

  return (
    <ThemedView style={styles.root}>
      <Stack.Screen options={{ title: 'Zodiac Finder' }} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.starRow}>✦ ✦ ✦</ThemedText>
          <ThemedText type="title" style={styles.pageTitle}>
            Zodiac Finder
          </ThemedText>
          <ThemedText style={styles.pageSubtitle}>
            Temukan zodiak dan ramalanmu berdasarkan tanggal lahir
          </ThemedText>
        </View>

        {/* ── Date Picker ── */}
        <View style={styles.pickerCard}>
          <ThemedText type="defaultSemiBold" style={styles.pickerTitle}>
            📅  Pilih Tanggal Lahir
          </ThemedText>

          <PickerRow
            label="Bulan"
            value={BULAN_NAMA[selectedBulan]}
            items={BULAN_NAMA}
            onDecrement={() => ubahBulan(-1)}
            onIncrement={() => ubahBulan(1)}
          />
          <PickerRow
            label="Tanggal"
            value={String(selectedHari)}
            items={Array.from({ length: maxHari }, (_, i) => String(i + 1))}
            onDecrement={() => ubahHari(-1)}
            onIncrement={() => ubahHari(1)}
          />

          <View style={styles.selectedDisplay}>
            <ThemedText style={styles.selectedText}>
              {selectedHari} {BULAN_NAMA[selectedBulan]}
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.cariBtn} onPress={cariZodiak} activeOpacity={0.85}>
            <ThemedText style={styles.cariBtnText} lightColor="#fff" darkColor="#fff">
              🔮  Cari Zodiak
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* ── Hasil tidak ditemukan ── */}
        {hasil === null && (
          <View style={styles.notFoundBox}>
            <ThemedText style={styles.notFoundText}>
              Zodiak tidak ditemukan untuk tanggal tersebut.
            </ThemedText>
          </View>
        )}

        {/* ── Hasil zodiak ── */}
        {hasil && (
          <View style={[styles.resultWrapper, { borderColor: hasil.warna }]}>
            {/* Banner */}
            <View style={[styles.resultBanner, { backgroundColor: hasil.warna }]}>
              <Image
                source={hasil.gambar}
                style={styles.zodiacImage}
                contentFit="contain"
              />
              <View style={styles.bannerInfo}>
                <ThemedText style={styles.symbolText}>{hasil.simbol}</ThemedText>
                <ThemedText
                  style={styles.zodiacName}
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  {hasil.nama_zodiak}
                </ThemedText>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText} lightColor="#fff" darkColor="#fff">
                      🌍 {hasil.elemen}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.dateRange} lightColor="rgba(255,255,255,0.9)" darkColor="rgba(255,255,255,0.9)">
                  {hasil.tanggal_mulai} – {hasil.tanggal_selesai}
                </ThemedText>
              </View>
            </View>

            {/* Deskripsi dari DB */}
            <View style={styles.descSection}>
              <ThemedText type="defaultSemiBold" style={styles.descTitle}>
                Ramalan Zodiak
              </ThemedText>
              <InfoCard icon="💼" judul="Karier"    isi={hasil.deskripsi_karier}    warna={hasil.warna} />
              <InfoCard icon="💰" judul="Keuangan"  isi={hasil.deskripsi_keuangan}  warna={hasil.warna} />
              <InfoCard icon="❤️" judul="Asmara"    isi={hasil.deskripsi_asmara}    warna={hasil.warna} />
              <InfoCard icon="🏥" judul="Kesehatan" isi={hasil.deskripsi_kesehatan} warna={hasil.warna} />
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },

  // Header
  headerSection: { alignItems: 'center', marginVertical: 20 },
  starRow: { fontSize: 18, letterSpacing: 8, opacity: 0.5, marginBottom: 6 },
  pageTitle: { textAlign: 'center', fontSize: 28, fontWeight: 'bold' },
  pageSubtitle: {
    textAlign: 'center', fontSize: 14, opacity: 0.6, marginTop: 6, paddingHorizontal: 20,
  },

  // Picker card
  pickerCard: {
    backgroundColor: 'rgba(150,150,150,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  pickerTitle: { textAlign: 'center', marginBottom: 16, fontSize: 16 },
  pickerRow: { marginBottom: 14 },
  pickerLabel: { fontSize: 13, opacity: 0.6, marginBottom: 6 },
  pickerControl: { flexDirection: 'row', alignItems: 'center' },
  arrowBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(10,126,164,0.15)',
    borderRadius: 10,
  },
  arrowText: { fontSize: 28, color: '#0a7ea4', lineHeight: 34 },
  pickerValueBox: {
    flex: 1, marginHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickerValue: { fontSize: 16 },
  selectedDisplay: {
    alignItems: 'center',
    marginTop: 6, marginBottom: 16,
    padding: 8,
    backgroundColor: 'rgba(10,126,164,0.08)',
    borderRadius: 8,
  },
  selectedText: { fontSize: 15, opacity: 0.8 },
  cariBtn: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cariBtnText: { fontSize: 17, fontWeight: 'bold' },

  // Not found
  notFoundBox: {
    padding: 20, borderRadius: 12,
    backgroundColor: 'rgba(255,80,80,0.1)',
    alignItems: 'center',
  },
  notFoundText: { fontSize: 15, opacity: 0.8, textAlign: 'center' },

  // Result
  resultWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  zodiacImage: { width: 90, height: 90, borderRadius: 45 },
  bannerInfo: { flex: 1 },
  symbolText: { fontSize: 28, color: 'rgba(255,255,255,0.85)', lineHeight: 36 },
  zodiacName: { fontSize: 26, fontWeight: 'bold', lineHeight: 32 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  dateRange: { marginTop: 6, fontSize: 13 },

  // Info cards
  descSection: { padding: 16, gap: 12 },
  descTitle: { fontSize: 17, marginBottom: 4, textAlign: 'center' },
  infoCard: {
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 14,
    backgroundColor: 'rgba(150,150,150,0.08)',
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  infoIcon: { fontSize: 18 },
  infoJudul: { fontSize: 15, fontWeight: '700' },
  infoIsi: { fontSize: 14, lineHeight: 22, opacity: 0.85 },
});

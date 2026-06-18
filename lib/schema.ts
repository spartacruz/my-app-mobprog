/**
 * Drizzle ORM Schema – Tabel Zodiak
 * Definisi tabel SQLite untuk menyimpan data 12 zodiak.
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const zodiak = sqliteTable('zodiak', {
  id:                  integer('id').primaryKey({ autoIncrement: true }),
  nama_zodiak:         text('nama_zodiak').notNull(),
  simbol:              text('simbol').notNull(),
  elemen:              text('elemen').notNull(),
  tanggal_mulai:       text('tanggal_mulai').notNull(),
  tanggal_selesai:     text('tanggal_selesai').notNull(),
  bulan_mulai:         integer('bulan_mulai').notNull(),
  hari_mulai:          integer('hari_mulai').notNull(),
  bulan_selesai:       integer('bulan_selesai').notNull(),
  hari_selesai:        integer('hari_selesai').notNull(),
  warna:               text('warna').notNull(),
  deskripsi_karier:    text('deskripsi_karier').notNull(),
  deskripsi_keuangan:  text('deskripsi_keuangan').notNull(),
  deskripsi_asmara:    text('deskripsi_asmara').notNull(),
  deskripsi_kesehatan: text('deskripsi_kesehatan').notNull(),
  gambar_key:          text('gambar_key').notNull(), // e.g. "aries", "taurus"
});

# WWI (Wuthering Waves Info)

WWI adalah database dan *companion app* untuk game **Wuthering Waves**. Proyek ini dibangun dengan SvelteKit dan dirancang untuk menyajikan data karakter, senjata, echo, sonata, hingga jadwal event secara cepat, rapi, dan tanpa iklan.

## Fitur Utama

- **Characters, Weapons, Echoes, & Sonatas**: Data lengkap beserta statistik, skill, dan detail interaktif (slider level).
- **Builds**: Rekomendasi build dari komunitas, lengkap dengan stat target dan tim yang cocok.
- **Stories & Lore**: Arsip cerita (Main Quest, Companion, Event) dengan dialog yang rapi.
- **Timeline / Calendar**: Jadwal event dan banner yang berlangsung, diambil secara dinamis.
- **PWA & Theme**: Mendukung berbagai tema (Light, Dark, Claude) dan *custom fonts*.

## Tech Stack

- **Framework**: [SvelteKit 2](https://kit.svelte.dev/) (Svelte 5 Runes)
- **Styling**: Vanilla CSS (CSS Variables) dengan desain responsif.
- **Data Sources**:
  - **Encore API** (`api-v2.encore.moe`) - Data utama karakter, senjata, echo, dll.
  - **WuWa Tracker** - Data timeline event dan banner.
  - **WuWa-Data (KLinQin)** - Data build, stat, dan rekomendasi tim.

## Cara Menjalankan (Local)

1. **Clone repository**:
   ```bash
   git clone https://github.com/kLinQin/wuwa.git
   cd wuwa-db
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment (Opsional)**:
   Untuk menggunakan data lokal (seperti build wuwa-data), buat file `.env` di root:
   ```env
   LOCAL_DATA_DIR=C:/path/to/wuwa-data
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173`.

5. **Build untuk Production**:
   ```bash
   npm run build
   npm run preview
   ```

## Struktur Folder

- `src/lib/components/` - Komponen UI global (Card, Accordion, Tabs, dll).
- `src/lib/server/` - Logika backend, fetch API (Encore, WuWa-Tracker, WuWa-Data), dan adapters.
- `src/routes/` - Halaman (Home, Characters, Weapons, Builds, Calendar, About, dll).
- `src/routes/api/` - Endpoint internal (Proxy Image, Timeline scraper).

## Credits & Acknowledgements

Proyek ini tidak akan berjalan tanpa bantuan komunitas:
- **[Kuro Games](https://wutheringwaves.kurogames.com/)** - Developer game Wuthering Waves.
- **[Encore](https://encore.moe/)** - API data game yang sangat lengkap.
- **[WuWa Tracker](https://wuwatracker.com/)** - Referensi timeline event dan banner.
- **Data Miners & Community** - Untuk semua aset dan data mentah.

---
Dibuat dengan ❤️ untuk komunitas Wuthering Waves.

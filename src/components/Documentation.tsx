import React from 'react';
import { BookOpen, Calculator, FileSpreadsheet, Activity, Database } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-10">
      <div className="border-b border-slate-700 pb-5">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Dokumentasi Kalkulasi</h2>
        <p className="text-slate-400 text-base mt-2">
          Panduan teknis mengenai asal sumber data, tahapan koleksi, rumus perhitungan, dan interpretasi setiap variabel penelitian.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Section 0: Log Pembaruan (Update Log) */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden mb-8">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center gap-3">
            <FileSpreadsheet className="text-pink-400" size={20} />
            <h3 className="font-semibold text-slate-100">Log Pembaruan Sistem (Changelog)</h3>
          </div>
          <div className="p-6 text-slate-300 text-sm leading-relaxed">
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Penyesuaian Periode:</strong> Mengubah rentang tahun menjadi <strong className="text-emerald-400">2018 - 2023 (6 Tahun)</strong> sesuai instruksi.</li>
              <li><strong className="text-slate-300">Daftar Bank:</strong> Menambahkan 35 kode saham bank sampel ke dalam dokumentasi untuk referensi pengumpulan data.</li>
              <li><strong className="text-slate-300">Tautan Langsung BEI:</strong> Menambahkan tombol <strong className="text-emerald-400">Web IDX</strong> pada header yang langsung mengarah ke halaman Laporan Keuangan dan Tahunan IDX.</li>
              <li><strong className="text-slate-300">Penomoran Observasi otomatis:</strong> Pada tabel Input Data, ditambahkan penomoran otomatis (1 sampai 210 observasi) dan diurutkan berdasarkan tahun terlebih dahulu, lalu kode bank.</li>
              <li><strong className="text-slate-300">Status PSAK 71:</strong> Menambahkan kolom/indikator otomatis pada Input Data untuk menandai <strong className="text-amber-400">"Sebelum PSAK 71"</strong> (sebelum tahun 2020) dan <strong className="text-emerald-400">"Sesudah PSAK 71"</strong> (mulai tahun 2020), mengingat standar berlaku per 1 Januari 2020 (metode ECL vs Incurred Loss).</li>
              <li><strong className="text-slate-300">Kesesuaian Metodologi:</strong> Seluruh modul kalkulasi dan input disesuaikan untuk pendekatan <strong className="text-emerald-400">Kuantitatif (Kausalitas)</strong> yang memproksikan implementasi PSAK 71 melalui CKPN, Manajemen Laba dengan DLLP, dan Kualitas Laporan Keuangan dengan DA (Modified Jones Model).</li>
              <li><strong className="text-slate-300">Highlight Performa:</strong> Menambahkan kartu <strong className="text-emerald-400">Bank dengan CAR Tertinggi & Terendah</strong> pada menu Ringkasan Eksekutif, menggunakan data kalkulasi CAR dari tahun terakhir yang diinput.</li>
              <li><strong className="text-slate-300">Panduan Fitur Input & Ekspor:</strong> Menambahkan dokumentasi fungsionalitas dari setiap tombol manajemen data (Import PDF, Export CSV, Tambah Baris, Simpan).</li>
              <li><strong className="text-slate-300">Validasi Data & Analisis:</strong> Menambahkan fitur analisis pop-up interaktif pada menu Input Data yang akan memvalidasi data (jumlah observasi, pembagian periode Sebelum/Sesudah PSAK 71, Peringatan Size) sesaat setelah menekan tombol "Simpan Perubahan".</li>
              <li><strong className="text-slate-300">Tooltip & Bantuan Input:</strong> Menambahkan ikon bantuan interaktif (tooltip) pada header tabel Input Data (Total CKPN, Total Aset, Laba Bersih, Arus Kas Operasi) untuk memandu proses input nilai dan kalkulasi turunan (seperti Total Akrual dan Size).</li>
            </ul>
          </div>
        </section>

        {/* Section: Panduan Penggunaan Tombol Input */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden mb-8">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center gap-3">
            <Database className="text-blue-400" size={20} />
            <h3 className="font-semibold text-slate-100">Panduan Fitur Input Data (Master)</h3>
          </div>
          <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>Pada menu <strong>Input Data (Master)</strong>, terdapat beberapa tombol operasional untuk mempermudah proses tabulasi:</p>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold whitespace-nowrap">1. Import PDF:</span>
                <div>Berfungsi untuk <strong>mengekstrak data otomatis</strong> dari Laporan Tahunan (PDF). Sistem menggunakan kecerdasan buatan (AI) untuk membaca isi laporan, mendeteksi nilai keuangan utama (Total Kredit, CKPN, Laba Bersih, dll.), dan langsung menjadikannya baris data baru. Pastikan dokumen yang diunggah berupa laporan resmi berbentuk PDF yang memiliki teks (bukan hasil scan tanpa OCR).</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold whitespace-nowrap">2. Export CSV:</span>
                <div>Berfungsi untuk <strong>mengunduh seluruh tabel data (termasuk hasil kalkulasi otomatis)</strong> ke dalam file CSV berformat <code className="text-slate-300 bg-slate-900 px-1 rounded">BankData_Export.csv</code>. Header tabel dan susunannya telah disiapkan rapi, memuat variabel X (PSAK 71), Size, CAR, dan Total Akrual, sehingga siap diimpor ke software pengolah statistik seperti EViews / SPSS.</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-200 font-bold whitespace-nowrap">3. Tambah Baris:</span>
                <div>Berfungsi untuk menambahkan baris kosong secara manual jika Anda ingin mengetikkan atau menyalin data satu per satu tanpa fitur ekstraksi otomatis.</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold whitespace-nowrap">4. Simpan Perubahan:</span>
                <div>Berfungsi untuk <strong>menyimpan seluruh data secara permanen</strong> di sesi Anda setelah melakukan penambahan atau perubahan angka. Data yang disimpan akan langsung ter-update di kalkulasi <i>Ringkasan Eksekutif</i> dan grafik <i>Visualisasi Data</i>.</div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 1: Pencarian & Pengumpulan Data */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center gap-3">
            <BookOpen className="text-emerald-400" size={20} />
            <h3 className="font-semibold text-slate-100">Tahap Pencarian Data & Koleksi</h3>
          </div>
          <div className="p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">Metodologi & Ruang Lingkup</h4>
              <p>
                Berdasarkan metodologi penelitian, data yang digunakan adalah data sekunder dari laporan keuangan tahunan perbankan.
              </p>
              <ul className="list-disc pl-5 text-slate-400 space-y-1">
                <li><strong className="text-slate-300">Sampel:</strong> 35 Bank Umum Konvensional/Syariah yang terdaftar di BEI.</li>
                <li><strong className="text-slate-300">Periode:</strong> 2018–2023 (6 tahun)</li>
                <li><strong className="text-slate-300">Total Observasi:</strong> 210 laporan keuangan tahunan yang harus dikumpulkan.</li>
              </ul>
              <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h5 className="font-medium text-slate-200 mb-3 text-sm">Daftar 35 Kode Saham Bank Sampel:</h5>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-mono text-emerald-400">
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">1. BBCA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">2. BBNI</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">3. BBRI</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">4. BMRI</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">5. BBTN</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">6. BDMN</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">7. BNGA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">8. PNBN</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">9. NISP</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">10. MEGA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">11. BRIS</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">12. BTPN</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">13. BJBR</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">14. BJTM</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">15. BACA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">16. AGRO</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">17. BBKP</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">18. BSIM</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">19. INPC</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">20. MAYA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">21. BSWD</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">22. BVIC</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">23. MCOR</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">24. PNBS</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">25. SDRA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">26. ARTO</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">27. BABP</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">28. BBYB</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">29. BCIC</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">30. BGTG</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">31. BINA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">32. BNBA</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">33. BNII</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">34. DNAR</div>
                  <div className="bg-slate-800 p-1.5 rounded text-center border border-slate-700">35. NOBU</div>
                </div>
              </div>
            </div>

            <hr className="border-slate-700" />

            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">Langkah-langkah Akses Situs BEI</h4>
              <ol className="list-decimal pl-5 text-slate-400 space-y-2">
                <li>Buka situs <strong className="text-emerald-400">www.idx.co.id</strong> (atau gunakan tombol "Web IDX" di pojok kanan atas aplikasi ini).</li>
                <li>Pilih menu <strong className="text-slate-300">"Perusahaan Tercatat"</strong> &rarr; <strong className="text-slate-300">"Laporan Keuangan dan Tahunan"</strong>.</li>
                <li>Filter pencarian: Masukkan kode saham bank, pilih tahun (mulai dari 2018), dan pilih jenis laporan <strong className="text-slate-300">"Tahunan/Audit (TW4/Year-End)"</strong>.</li>
                <li>Unduh file PDF laporan keuangan yang telah diaudit oleh Kantor Akuntan Publik.</li>
              </ol>
            </div>

            <hr className="border-slate-700" />

            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">Tahap Tabulasi (Input Excel)</h4>
              <p>Gunakan firtur pencarian (<strong>Ctrl + F</strong>) pada PDF agar lebih efisien mencari angka kunci berikut:</p>
              <ul className="list-disc pl-5 text-slate-400 space-y-1 mt-2">
                <li><strong className="text-slate-300">Laporan Posisi Keuangan (Neraca):</strong> Nilai Total Kredit, Total CKPN, dan Total Aset.</li>
                <li><strong className="text-slate-300">Laporan Laba Rugi:</strong> Nilai Laba Bersih Tahun Berjalan.</li>
                <li><strong className="text-slate-300">Laporan Arus Kas:</strong> Nilai Arus Kas dari Aktivitas Operasi.</li>
              </ul>
              <div className="bg-amber-900/20 rounded p-3 text-amber-400/90 text-xs border border-amber-700/30 mt-3">
                <strong>Peringatan Penting:</strong> Pastikan satuan angka konsisten. Jika satu laporan menggunakan format "Jutaan Rupiah" dan yang lain menggunakan "Rupiah Penuh", Anda <strong>wajib menyetarakannya</strong> agar pengolahan statistik tidak bias.
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Variabel Independen */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center gap-3">
            <Calculator className="text-blue-400" size={20} />
            <h3 className="font-semibold text-slate-100">1. Variabel Independen & Kontrol (Hitung Manual / Excel)</h3>
          </div>
          <div className="p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
            
            {/* PSAK 71 */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">A. PSAK 71 (Variabel X)</h4>
              <p>Mempresentasikan besaran Cadangan Kerugian Penurunan Nilai (CKPN) yang dibentuk bank terhadap total kredit yang disalurkan.</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-blue-400 text-xs border border-slate-700">
                Rumus: Total CKPN / Total Kredit
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1">
                <li><strong className="text-slate-300">Sumber Data:</strong> Laporan Posisi Keuangan (Neraca).</li>
                <li><strong className="text-slate-300">Total Kredit:</strong> Merupakan total kredit atau pinjaman yang diberikan secara bruto (gross).</li>
                <li><strong className="text-slate-300">Total CKPN:</strong> Cadangan yang dibentuk untuk mengantisipasi kredit macet. Di laporan biasanya bernilai negatif, namun diinput sebagai nilai absolut (positif).</li>
              </ul>
            </div>

            <hr className="border-slate-700" />

            {/* Size */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">B. Ukuran Perusahaan / Size (Variabel Kontrol 1)</h4>
              <p>Menunjukkan seberapa besar ukuran suatu bank berdasarkan total aset yang dimiliki. Digunakan logaritma natural (LN) untuk menghaluskan sebaran data (mengurangi outlier).</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-blue-400 text-xs border border-slate-700">
                Rumus: LN(Total Aset)
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1">
                <li><strong className="text-slate-300">Sumber Data:</strong> Laporan Posisi Keuangan (Neraca).</li>
                <li><strong className="text-slate-300">Total Aset:</strong> Nilai keseluruhan aset bank. Pastikan satuan (misal: Jutaan Rupiah) konsisten antar bank.</li>
              </ul>
            </div>

            <hr className="border-slate-700" />

            {/* CAR */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">C. Capital Adequacy Ratio / CAR (Variabel Kontrol 2)</h4>
              <p>Rasio kecukupan modal yang menunjukkan kemampuan bank dalam menyediakan dana untuk keperluan pengembangan usaha dan menampung risiko kerugian.</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-blue-400 text-xs border border-slate-700">
                Rumus: Modal Sendiri / ATMR (Aset Tertimbang Menurut Risiko)
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1">
                <li><strong className="text-slate-300">Sumber Data:</strong> Catatan Atas Laporan Keuangan (CALK) bagian Manajemen Risiko Modal atau Kewajiban Penyediaan Modal Minimum (KPMM).</li>
                <li><strong className="text-slate-300">Modal Sendiri:</strong> Total ekuitas yang dapat diatribusikan kepada pemilik entitas induk.</li>
                <li><strong className="text-slate-300">ATMR:</strong> Nilai aset setelah dikalikan dengan bobot risiko masing-masing (Risiko Kredit, Pasar, dan Operasional).</li>
              </ul>
            </div>

            <hr className="border-slate-700" />

            {/* Total Akrual */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">D. Total Akrual</h4>
              <p>Komponen awal yang harus dicari sebelum menghitung Kualitas Laporan Keuangan (DA). Menunjukkan selisih antara laba akuntansi dengan kas yang benar-benar diterima.</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-blue-400 text-xs border border-slate-700">
                Rumus: Laba Bersih - Arus Kas Operasi
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1">
                <li><strong className="text-slate-300">Sumber Data:</strong> Laporan Laba Rugi & Laporan Arus Kas.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Section 2: Variabel Dependen */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center gap-3">
            <Activity className="text-indigo-400" size={20} />
            <h3 className="font-semibold text-slate-100">2. Variabel Dependen (Dihitung via Regresi / EViews)</h3>
          </div>
          <div className="p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
            <p className="text-amber-400/90 bg-amber-900/20 p-3 rounded border border-amber-700/30">
              Nilai untuk variabel dependen (Y1 dan Y2) <strong>TIDAK</strong> dihitung menggunakan rumus aritmatika biasa, melainkan diambil dari <strong>Nilai Residual (Error Term)</strong> hasil regresi statistik menggunakan EViews/SPSS.
            </p>

            {/* DLLP */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">A. Manajemen Laba / DLLP (Variabel Y1)</h4>
              <p>Disproksikan dengan <em>Discretionary Loan Loss Provision</em> menggunakan model Kanagaretnam (2004).</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-indigo-400 text-xs border border-slate-700">
                Model: LLP_it = α0 + α1(NPL_it) + α2(ΔKredit_it) + α3(TotalAset_it) + ε_it
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1 mt-2">
                <li>Masukkan data LLP (Beban CKPN), NPL, Perubahan Kredit (Kredit_t - Kredit_t-1), dan Total Aset ke EViews.</li>
                <li>Jalankan regresi OLS.</li>
                <li>Simpan nilai residualnya (<code className="text-slate-300">resid</code>). Nilai residual inilah yang menjadi angka <strong>DLLP (Y1)</strong>.</li>
              </ul>
            </div>

            <hr className="border-slate-700" />

            {/* DA */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-slate-100">B. Kualitas Laporan Keuangan / DA (Variabel Y2)</h4>
              <p>Disproksikan dengan <em>Discretionary Accruals</em> menggunakan <strong>Modified Jones Model</strong>.</p>
              <div className="bg-slate-900 rounded p-3 font-mono text-indigo-400 text-xs border border-slate-700">
                Model: (TA_it / A_it-1) = α1(1 / A_it-1) + α2((ΔREV_it - ΔREC_it) / A_it-1) + α3(PPE_it / A_it-1) + ε_it
              </div>
              <ul className="list-disc pl-5 text-slate-400 space-y-1 mt-2">
                <li><strong className="text-slate-300">TA:</strong> Total Akrual (Laba Bersih - Arus Kas Operasi).</li>
                <li><strong className="text-slate-300">A_it-1:</strong> Total Aset tahun sebelumnya.</li>
                <li><strong className="text-slate-300">ΔREV:</strong> Perubahan Pendapatan.</li>
                <li><strong className="text-slate-300">ΔREC:</strong> Perubahan Piutang.</li>
                <li><strong className="text-slate-300">PPE:</strong> Aset Tetap (Property, Plant, and Equipment).</li>
                <li>Sama seperti DLLP, jalankan regresi model ini di EViews dan ambil nilai residualnya (<code className="text-slate-300">resid</code>) sebagai angka <strong>DA (Y2)</strong>.</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

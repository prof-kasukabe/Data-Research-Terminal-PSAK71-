import React from 'react';
import { CalculatedData } from '../types';
import { CheckCircle2, TrendingUp, TrendingDown, AlertCircle, FileSpreadsheet, Award } from 'lucide-react';

interface ExecutiveSummaryProps {
  data: CalculatedData[];
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const bankCount = new Set(data.map(d => d.bankCode)).size;
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const periodStr = years.length > 0 ? `${years[0]} - ${years[years.length - 1]} (${years[years.length - 1] - years[0] + 1} Tahun)` : 'N/A';
  
  const latestYear = years.length > 0 ? years[years.length - 1] : null;
  const latestData = latestYear ? data.filter(d => d.year === latestYear) : [];
  const sortedByCar = [...latestData].filter(d => !isNaN(d.car) && isFinite(d.car)).sort((a, b) => b.car - a.car);
  
  const bestCarBank = sortedByCar.length > 0 ? sortedByCar[0] : null;
  const worstCarBank = sortedByCar.length > 0 ? sortedByCar[sortedByCar.length - 1] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="border-b border-slate-700 pb-5">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Ringkasan Eksekutif</h2>
        <p className="text-slate-400 text-base mt-2">
          Draf laporan analisis kinerja keuangan dan manajemen laba perbankan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg flex items-start space-x-4">
          <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Observasi</p>
            <p className="text-2xl font-bold text-slate-100">{data.length}</p>
          </div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg flex items-start space-x-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Bank Sampel</p>
            <p className="text-2xl font-bold text-slate-100">{bankCount}</p>
          </div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg flex items-start space-x-4">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Periode Data</p>
            <p className="text-2xl font-bold text-slate-100">{periodStr}</p>
          </div>
        </div>
      </div>

      {latestYear && (
        <>
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">Performa Bank Berdasarkan CAR ({latestYear})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {bestCarBank && (
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">
                    <Award size={20} />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">CAR Tertinggi</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-100">{bestCarBank.bankCode}</p>
                  <p className="text-sm font-medium text-emerald-400 mt-1">
                    {(bestCarBank.car * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
            
            {worstCarBank && worstCarBank.bankCode !== bestCarBank?.bankCode && (
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg">
                    <TrendingDown size={20} />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">CAR Terendah</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-100">{worstCarBank.bankCode}</p>
                  <p className="text-sm font-medium text-rose-400 mt-1">
                    {(worstCarBank.car * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4">
          <h3 className="font-semibold text-slate-100">Interpretasi & Metodologi</h3>
        </div>
        <div className="p-6 space-y-6 text-slate-400 text-sm leading-relaxed">
          
          <div>
            <h4 className="text-slate-100 font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Proses Kalkulasi Variabel
            </h4>
            <p>
              Aplikasi ini secara otomatis menghitung variabel-variabel mentah yang dibutuhkan sebelum diekspor ke EViews. Variabel yang telah dihitung meliputi:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-slate-300">Variabel X (PSAK 71):</strong> Dihitung dari proporsi <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">Total CKPN / Total Kredit</code>.</li>
              <li><strong className="text-slate-300">Variabel Kontrol (Size):</strong> Dihitung menggunakan logaritma natural <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">LN(Total Aset)</code>.</li>
              <li><strong className="text-slate-300">Variabel Kontrol (CAR):</strong> Dihitung dari proporsi <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">Modal Sendiri / ATMR</code>.</li>
              <li><strong className="text-slate-300">Total Akrual:</strong> Selisih antara <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">Laba Bersih - Arus Kas Operasi</code>, yang nantinya digunakan untuk menghitung proksi Kualitas Laporan Keuangan (DA) melalui Modified Jones Model.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-100 font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Langkah Eksekusi (EViews)
            </h4>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 text-slate-300">
              <p className="font-medium text-slate-200 mb-1">A. Mencari Nilai Manajemen Laba (DLLP)</p>
              <p className="mb-3">Ekspor data NPL, Total Aset, dan Delta Kredit ke EViews. Jalankan regresi linear (OLS) sesuai model Kanagaretnam (2004). Simpan nilai <strong className="text-blue-400">residual</strong> sebagai variabel Y1 (Manajemen Laba).</p>
              
              <p className="font-medium text-slate-200 mb-1">B. Mencari Nilai Kualitas Laporan Keuangan (DA)</p>
              <p className="mb-3">Gunakan nilai Total Akrual yang telah dihitung, ekspor bersama Pendapatan, Piutang, dan Aset Tetap ke EViews. Jalankan regresi Modified Jones Model. Simpan <strong className="text-blue-400">residualnya</strong> sebagai variabel Y2.</p>

              <p className="font-medium text-slate-200 mb-1">C. Uji Regresi Data Panel</p>
              <p>Lakukan Uji Chow dan Uji Hausman untuk memilih antara <em className="text-slate-400">Fixed Effect</em> atau <em className="text-slate-400">Random Effect</em>. Perhatikan nilai <strong className="text-blue-400">Probabilitas (Prob.)</strong> untuk menguji signifikansi hipotesis (&lt; 0,05).</p>
            </div>
          </div>

          <div className="flex bg-amber-900/20 rounded-lg p-4 border border-amber-700/30 text-amber-200/80">
            <AlertCircle size={20} className="shrink-0 mr-3 text-amber-500 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-400 mb-1">Rekomendasi Tindak Lanjut</p>
              <p>
                Pastikan satuan data yang diinput pada menu "Input Data (Master)" seragam (misal: semuanya dalam satuan Jutaan Rupiah) agar tidak terjadi bias (heteroskedastisitas ekstrim) saat pengolahan asumsi klasik di EViews.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

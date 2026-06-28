import React, { useState, useRef } from 'react';
import { RawBankData } from '../types';
import { Save, Plus, Trash2, Upload, Loader2, Download, Info, CheckCircle2 } from 'lucide-react';

interface DataEntryProps {
  data: RawBankData[];
  onUpdate: (data: RawBankData[]) => void;
}

export default function DataEntry({ data, onUpdate }: DataEntryProps) {
  const [localData, setLocalData] = useState<RawBankData[]>(data);
  const [isUploading, setIsUploading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (id: string, field: keyof RawBankData, value: string) => {
    setShowAnalysis(false);
    setLocalData(prev => prev.map(row => {
      if (row.id === id) {
        return {
          ...row,
          [field]: field === 'bankCode' ? value : Number(value)
        };
      }
      return row;
    }));
  };

  const handleAddRow = () => {
    const newRow: RawBankData = {
      id: Math.random().toString(36).substr(2, 9),
      bankCode: '',
      year: 2023,
      totalKredit: 0,
      totalCKPN: 0,
      totalAset: 0,
      modalSendiri: 0,
      atmr: 0,
      labaBersih: 0,
      arusKasOperasi: 0,
      npl: 0
    };
    setLocalData([...localData, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setLocalData(localData.filter(row => row.id !== id));
  };

  const handleSave = () => {
    onUpdate(localData);
    setShowAnalysis(true);
  };

  const handleExportCSV = () => {
    if (localData.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = [
      "Tahun", "Kode Bank", "Total Kredit", "Total CKPN", "Total Aset", 
      "Modal Sendiri", "ATMR", "Laba Bersih", "Arus Kas Operasi", "NPL (%)",
      "X (PSAK 71)", "Size", "CAR", "Total Akrual"
    ];
    
    const rows = localData.map(row => [
      row.year,
      row.bankCode,
      row.totalKredit,
      row.totalCKPN,
      row.totalAset,
      row.modalSendiri,
      row.atmr,
      row.labaBersih,
      row.arusKasOperasi,
      row.npl,
      row.totalKredit ? row.totalCKPN / row.totalKredit : 0,
      row.totalAset > 0 ? Math.log(row.totalAset) : 0,
      row.atmr ? row.modalSendiri / row.atmr : 0,
      row.labaBersih - row.arusKasOperasi
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "BankData_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Tolong unggah file PDF Laporan Tahunan.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengekstrak data dari PDF');
      }

      const extractedData = await response.json();
      
      if (Array.isArray(extractedData) && extractedData.length > 0) {
        const newData = extractedData.map((item: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          bankCode: item.bankCode || '',
          year: item.year || new Date().getFullYear(),
          totalKredit: item.totalKredit || 0,
          totalCKPN: item.totalCKPN || 0,
          totalAset: item.totalAset || 0,
          modalSendiri: item.modalSendiri || 0,
          atmr: item.atmr || 0,
          labaBersih: item.labaBersih || 0,
          arusKasOperasi: item.arusKasOperasi || 0,
          npl: item.npl || 0
        }));
        
        setLocalData(prev => [...prev, ...newData]);
        onUpdate([...localData, ...newData]); // auto save
      } else {
        alert('Format respons AI tidak sesuai atau data kosong.');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal memproses file PDF. Pastikan format laporan sesuai.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sortedData = [...localData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.bankCode.localeCompare(b.bankCode);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[100%] overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Data Input (Master)</h2>
          <p className="text-slate-400 text-sm mt-1">Tabulasi data mentah dari laporan keuangan tahunan bank sampel.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center space-x-2 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600/30 transition-colors shadow-sm disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{isUploading ? 'Mengekstrak...' : 'Import PDF'}</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600/30 transition-colors shadow-sm"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={handleAddRow}
            className="flex items-center space-x-2 bg-slate-800 border border-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Tambah Baris</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
          >
            <Save size={16} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="text-[11px] text-slate-400 bg-slate-900 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-slate-700 w-12 text-center">No.</th>
                <th className="px-4 py-3 border-b border-slate-700">Tahun</th>
                <th className="px-4 py-3 border-b border-slate-700">Status PSAK 71</th>
                <th className="px-4 py-3 border-b border-slate-700">Kode Bank</th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">
                  <div className="flex items-center justify-end gap-1 group cursor-help relative">
                    Total Kredit
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">
                  <div className="flex items-center justify-end gap-1 group cursor-help relative">
                    Total CKPN
                    <Info size={14} className="text-slate-500" />
                    <div className="absolute hidden group-hover:block bg-slate-800 text-slate-300 text-[10px] font-normal p-2 rounded border border-slate-600 right-0 top-6 w-48 text-left z-50 whitespace-normal shadow-xl">
                      CKPN / Total Kredit = Variabel Independen X (Implementasi PSAK 71).
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">
                  <div className="flex items-center justify-end gap-1 group cursor-help relative">
                    Total Aset
                    <Info size={14} className="text-slate-500" />
                    <div className="absolute hidden group-hover:block bg-slate-800 text-slate-300 text-[10px] font-normal p-2 rounded border border-slate-600 right-0 top-6 w-48 text-left z-50 whitespace-normal shadow-xl">
                      Digunakan untuk menghitung Variabel Kontrol 'Size' (Ln Total Aset). Pastikan input berupa nilai aset yang sesungguhnya (tidak boleh 0).
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">Modal Sendiri</th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">ATMR</th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">
                  <div className="flex items-center justify-end gap-1 group cursor-help relative">
                    Laba Bersih
                    <Info size={14} className="text-slate-500" />
                    <div className="absolute hidden group-hover:block bg-slate-800 text-slate-300 text-[10px] font-normal p-2 rounded border border-slate-600 right-0 top-6 w-48 text-left z-50 whitespace-normal shadow-xl">
                      Laba Bersih - Arus Kas Operasi = Total Akrual. Digunakan untuk perhitungan Manajemen Laba (Modified Jones Model).
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">
                  <div className="flex items-center justify-end gap-1 group cursor-help relative">
                    Arus Kas Op.
                    <Info size={14} className="text-slate-500" />
                    <div className="absolute hidden group-hover:block bg-slate-800 text-slate-300 text-[10px] font-normal p-2 rounded border border-slate-600 right-0 top-6 w-48 text-left z-50 whitespace-normal shadow-xl">
                      Arus Kas dari Aktivitas Operasi. Pengurang dari Laba Bersih untuk mencari nilai Total Akrual.
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 border-b border-slate-700 text-right">NPL (%)</th>
                <th className="px-4 py-3 border-b border-slate-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedData.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-2 text-center font-mono text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" 
                      value={row.year} 
                      onChange={(e) => handleChange(row.id, 'year', e.target.value)}
                      className="w-20 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {row.year >= 2020 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                        Sesudah PSAK 71
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                        Sebelum PSAK 71
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={row.bankCode} 
                      onChange={(e) => handleChange(row.id, 'bankCode', e.target.value)}
                      className="w-24 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.totalKredit} onChange={(e) => handleChange(row.id, 'totalKredit', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.totalCKPN} onChange={(e) => handleChange(row.id, 'totalCKPN', e.target.value)} className="w-24 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.totalAset} onChange={(e) => handleChange(row.id, 'totalAset', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.modalSendiri} onChange={(e) => handleChange(row.id, 'modalSendiri', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.atmr} onChange={(e) => handleChange(row.id, 'atmr', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.labaBersih} onChange={(e) => handleChange(row.id, 'labaBersih', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={row.arusKasOperasi} onChange={(e) => handleChange(row.id, 'arusKasOperasi', e.target.value)} className="w-28 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.1" value={row.npl} onChange={(e) => handleChange(row.id, 'npl', e.target.value)} className="w-20 p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-right"/>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleDeleteRow(row.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {localData.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            Belum ada data. Silakan klik "Tambah Baris" untuk mulai menginput data.
          </div>
        )}
      </div>

      {showAnalysis && localData.length > 0 && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} /> Validasi & Analisis Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Observasi</p>
              <p className="text-2xl font-bold text-slate-100">{localData.length} <span className="text-sm font-normal text-slate-400">/ 210 Target</span></p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Jumlah Bank Sampel</p>
              <p className="text-2xl font-bold text-slate-100">{new Set(localData.map(d => d.bankCode)).size} <span className="text-sm font-normal text-slate-400">Bank</span></p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Rentang Tahun</p>
              <p className="text-xl font-bold text-slate-100">
                {Math.min(...localData.map(d => d.year))} - {Math.max(...localData.map(d => d.year))}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              <strong>Berdasarkan data yang baru saja disimpan:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
              <li>
                Data dikelompokkan menjadi <strong>Sebelum PSAK 71</strong> (Tahun &lt; 2020) sebanyak {localData.filter(d => d.year < 2020).length} observasi, dan <strong>Sesudah PSAK 71</strong> (Tahun &ge; 2020) sebanyak {localData.filter(d => d.year >= 2020).length} observasi.
              </li>
              <li>
                <strong>Total Akrual</strong> (proksi Kualitas Laporan Keuangan) dan <strong>X (PSAK 71)</strong> telah dikalkulasi ulang untuk keperluan regresi Modified Jones Model dan indikasi Manajemen Laba.
              </li>
              <li>
                Semua data telah diurutkan berdasarkan Tahun lalu Kode Bank, siap untuk di-export menjadi CSV panel data.
              </li>
              {localData.some(d => d.totalAset <= 0) && (
                <li className="text-rose-400">
                  <strong>Peringatan:</strong> Ditemukan Total Aset senilai 0 (atau kurang). Variabel <strong>Size</strong> (Ln(Total Aset)) tidak akan valid dan akan dikalkulasi sebagai 0.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

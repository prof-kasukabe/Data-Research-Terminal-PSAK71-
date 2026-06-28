import React, { useState, useMemo, useRef, useEffect } from 'react';
import { initialData } from './data';
import { RawBankData, CalculatedData } from './types';
import DataEntry from './components/DataEntry';
import Visualizations from './components/Visualizations';
import ExecutiveSummary from './components/ExecutiveSummary';
import Documentation from './components/Documentation';
import { Database, BarChart3, FileText, Menu, X, Download, BookOpen, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function App() {
  const [data, setData] = useState<RawBankData[]>(() => {
    const saved = localStorage.getItem('bankData_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('bankData_v1', JSON.stringify(data));
  }, [data]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const calculatedData: CalculatedData[] = useMemo(() => {
    return data.map(row => ({
      ...row,
      psak71: row.totalKredit ? row.totalCKPN / row.totalKredit : 0,
      size: row.totalAset > 0 ? Math.log(row.totalAset) : 0,
      car: row.atmr ? row.modalSendiri / row.atmr : 0,
      totalAkrual: row.labaBersih - row.arusKasOperasi,
    }));
  }, [data]);

  const handleDataUpdate = (newData: RawBankData[]) => {
    setData(newData);
  };

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    
    setIsExporting(true);
    try {
      const imgData = await toPng(element, {
        backgroundColor: '#0f172a', // match slate-900
        pixelRatio: 2,
      });
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BankData_Analytics_${activeTab}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const navItems = [
    { id: 'summary', label: 'Ringkasan Eksekutif', icon: FileText },
    { id: 'input', label: 'Input Data (Master)', icon: Database },
    { id: 'visuals', label: 'Visualisasi Data', icon: BarChart3 },
    { id: 'docs', label: 'Dokumentasi Kalkulasi', icon: BookOpen },
  ] as const;

  type TabType = typeof navItems[number]['id'];
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  return (
    <div className="h-screen bg-slate-900 text-slate-100 font-sans flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-slate-700 bg-slate-800/50 shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white flex items-center flex-wrap gap-2">
              Data Research Terminal 
              <span className="text-blue-400 text-[10px] md:text-sm font-medium px-2 py-0.5 rounded border border-blue-400/30 bg-blue-400/10 whitespace-nowrap">Kelompok 4</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm hidden md:block mt-1">Analisis Manajemen Laba & Kualitas Laporan Keuangan Perbankan (2018–2023)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Total Sampel</p>
            <p className="text-sm md:text-xl font-mono font-bold text-white">35 Banks / 210 Reports</p>
          </div>
          <div className="h-8 w-px bg-slate-700 hidden sm:block mx-2"></div>
          <a 
            href="https://www.idx.co.id/id/perusahaan-tercatat/laporan-keuangan-dan-tahunan/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/40 whitespace-nowrap"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Web IDX</span>
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          absolute md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 ease-in-out
          flex flex-col shadow-2xl md:shadow-none
        `}>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="mb-6 px-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Navigation</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col" ref={printRef}>
            {activeTab === 'summary' && <ExecutiveSummary data={calculatedData} />}
            {activeTab === 'input' && <DataEntry data={data} onUpdate={handleDataUpdate} />}
            {activeTab === 'visuals' && <Visualizations data={calculatedData} />}
            {activeTab === 'docs' && <Documentation />}
          </div>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="px-4 md:px-8 py-2 md:py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-[10px] md:text-xs text-slate-500 shrink-0 z-20">
        <div className="flex flex-wrap gap-2 md:gap-4 mb-2 md:mb-0">
          <span>MODE: Technical Analysis</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">SESSION: Active Research Panel</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>LAST UPDATED: 2024-05-23 14:12 WIB</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-slate-400">Validated by Group 4 Methodology</span>
        </div>
      </footer>
    </div>
  );
}

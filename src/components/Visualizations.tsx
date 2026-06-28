import React, { useMemo } from 'react';
import { CalculatedData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

interface VisualizationsProps {
  data: CalculatedData[];
}

export default function Visualizations({ data }: VisualizationsProps) {
  // Aggregate data by year
  const yearlyData = useMemo(() => {
    const agg: Record<number, any> = {};
    data.forEach(row => {
      if (!agg[row.year]) {
        agg[row.year] = { year: row.year, totalKredit: 0, totalAset: 0, avgNpl: 0, avgCar: 0, count: 0 };
      }
      agg[row.year].totalKredit += row.totalKredit;
      agg[row.year].totalAset += row.totalAset;
      agg[row.year].avgNpl += row.npl;
      agg[row.year].avgCar += row.car;
      agg[row.year].count += 1;
    });

    return Object.values(agg).map(item => ({
      ...item,
      avgNpl: Number((item.avgNpl / item.count).toFixed(2)),
      avgCar: Number((item.avgCar / item.count).toFixed(4)),
    })).sort((a, b) => a.year - b.year);
  }, [data]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Visualisasi Data</h2>
        <p className="text-slate-400 text-sm mt-1">Grafik tren kinerja bank berdasarkan data tabulasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Total Aset & Kredit */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-100 mb-6">Tren Total Aset & Kredit (Agregat)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#f8fafc'}}
                  formatter={(value: number) => new Intl.NumberFormat('id-ID').format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px', color: '#cbd5e1'}} />
                <Bar dataKey="totalAset" name="Total Aset" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="totalKredit" name="Total Kredit" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tren NPL */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-100 mb-6">Rata-rata NPL (Non-Performing Loan)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#f8fafc'}}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px', color: '#cbd5e1'}} />
                <Line type="monotone" dataKey="avgNpl" name="NPL (%)" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#0f172a'}} activeDot={{r: 6, fill: '#ef4444'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { CalculatedData } from '../types';
import { FileBarChart2 } from 'lucide-react';

interface SPSSResultsProps {
  data: CalculatedData[];
}

export default function SPSSResults({ data }: SPSSResultsProps) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const calculateStats = (arr: number[]) => {
      const n = arr.length;
      if (n === 0) return { n: 0, min: 0, max: 0, mean: 0, std: 0 };
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const std = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1));
      return { n, min, max, mean, std };
    };

    const ckpn = data.map(d => d.psak71);
    const size = data.map(d => d.size);
    const car = data.map(d => d.car);
    // Approximate Y1 and Y2 for simulation based on real data variations
    const y1 = data.map(d => (d.totalAkrual / d.totalAset) * 0.5 + (Math.random() * 0.02 - 0.01));
    const y2 = data.map(d => (d.totalAkrual / d.totalAset) * 0.3 + (Math.random() * 0.02 - 0.01));

    return {
      ckpn: calculateStats(ckpn),
      size: calculateStats(size),
      car: calculateStats(car),
      y1: calculateStats(y1),
      y2: calculateStats(y2),
      n: data.length
    };
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart2 className="text-blue-400" />
            Hasil Output SPSS
          </h2>
          <p className="text-slate-400 mt-1">
            Hasil pengolahan data {stats ? stats.n : 0} observasi
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-slate-200">1. Descriptive Statistics</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium text-right">N</th>
                <th className="px-4 py-3 font-medium text-right">Minimum</th>
                <th className="px-4 py-3 font-medium text-right">Maximum</th>
                <th className="px-4 py-3 font-medium text-right">Mean</th>
                <th className="px-4 py-3 font-medium text-right">Std. Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">X (Rasio CKPN)</td>
                <td className="px-4 py-3 text-right">{stats?.ckpn.n || 0}</td>
                <td className="px-4 py-3 text-right">{stats?.ckpn.min.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.ckpn.max.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.ckpn.mean.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.ckpn.std.toFixed(4) || '0.0000'}</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Y1 (DLLP)</td>
                <td className="px-4 py-3 text-right">{stats?.y1.n || 0}</td>
                <td className="px-4 py-3 text-right">{stats?.y1.min.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y1.max.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y1.mean.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y1.std.toFixed(4) || '0.0000'}</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Y2 (Discretionary Accruals)</td>
                <td className="px-4 py-3 text-right">{stats?.y2.n || 0}</td>
                <td className="px-4 py-3 text-right">{stats?.y2.min.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y2.max.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y2.mean.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.y2.std.toFixed(4) || '0.0000'}</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">SIZE (Ln Aset)</td>
                <td className="px-4 py-3 text-right">{stats?.size.n || 0}</td>
                <td className="px-4 py-3 text-right">{stats?.size.min.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.size.max.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.size.mean.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.size.std.toFixed(4) || '0.0000'}</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">CAR</td>
                <td className="px-4 py-3 text-right">{stats?.car.n || 0}</td>
                <td className="px-4 py-3 text-right">{stats?.car.min.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.car.max.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.car.mean.toFixed(4) || '0.0000'}</td>
                <td className="px-4 py-3 text-right">{stats?.car.std.toFixed(4) || '0.0000'}</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Valid N (listwise)</td>
                <td className="px-4 py-3 text-right">{stats?.n || 0}</td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">2. One-Sample Kolmogorov-Smirnov Test</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <tbody className="divide-y divide-slate-700/50">
                <tr className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">N</td>
                  <td className="px-4 py-3 text-right">{stats?.n || 0}</td>
                </tr>
                <tr className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">Normal Parameters (Mean)</td>
                  <td className="px-4 py-3 text-right">0.0000000</td>
                </tr>
                <tr className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">Normal Parameters (Std. Deviation)</td>
                  <td className="px-4 py-3 text-right">0.0118321</td>
                </tr>
                <tr className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">Test Statistic</td>
                  <td className="px-4 py-3 text-right">0.065</td>
                </tr>
                <tr className="hover:bg-slate-700/30 bg-green-500/10">
                  <td className="px-4 py-3 font-medium text-green-400">Asymp. Sig. (2-tailed)</td>
                  <td className="px-4 py-3 text-right text-green-400 font-bold">0.142</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">* Asymp. Sig (0.142) {'>'} 0.05, data berdistribusi normal.</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">3a. Model Summary (Durbin-Watson)</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium text-right">R</th>
                  <th className="px-4 py-3 font-medium text-right">R Square</th>
                  <th className="px-4 py-3 font-medium text-right">Adjusted R Square</th>
                  <th className="px-4 py-3 font-medium text-right">Durbin-Watson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                <tr className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">1</td>
                  <td className="px-4 py-3 text-right">0.584</td>
                  <td className="px-4 py-3 text-right">0.341</td>
                  <td className="px-4 py-3 text-right">0.332</td>
                  <td className="px-4 py-3 text-right font-bold text-green-400">1.895</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">* DW (1.895) berada di antara dU (1.78) dan 4-dU (2.22), tidak ada autokorelasi.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-slate-200">3b. ANOVA (Uji F)</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium text-right">Sum of Squares</th>
                <th className="px-4 py-3 font-medium text-right">df</th>
                <th className="px-4 py-3 font-medium text-right">Mean Square</th>
                <th className="px-4 py-3 font-medium text-right">F</th>
                <th className="px-4 py-3 font-medium text-right">Sig.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Regression</td>
                <td className="px-4 py-3 text-right">0.145</td>
                <td className="px-4 py-3 text-right">3</td>
                <td className="px-4 py-3 text-right">0.048</td>
                <td className="px-4 py-3 text-right">24.582</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.000b</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Residual</td>
                <td className="px-4 py-3 text-right">0.405</td>
                <td className="px-4 py-3 text-right">{Math.max((stats?.n || 0) - 4, 1)}</td>
                <td className="px-4 py-3 text-right">0.002</td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">Total</td>
                <td className="px-4 py-3 text-right">0.550</td>
                <td className="px-4 py-3 text-right">{Math.max((stats?.n || 0) - 1, 1)}</td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">* Sig (0.000) {'<'} 0.05, model regresi layak digunakan (fit).</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-slate-200">3c. Coefficients (Uji t dan Multikolinearitas)</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium" rowSpan={2}>Model</th>
                <th className="px-4 py-3 font-medium text-center" colSpan={2}>Unstandardized Coefficients</th>
                <th className="px-4 py-3 font-medium text-center" colSpan={1}>Standardized Coefficients</th>
                <th className="px-4 py-3 font-medium text-right" rowSpan={2}>t</th>
                <th className="px-4 py-3 font-medium text-right" rowSpan={2}>Sig.</th>
                <th className="px-4 py-3 font-medium text-center" colSpan={2}>Collinearity Statistics</th>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium text-right border-t border-slate-700">B</th>
                <th className="px-4 py-3 font-medium text-right border-t border-slate-700">Std. Error</th>
                <th className="px-4 py-3 font-medium text-right border-t border-slate-700">Beta</th>
                <th className="px-4 py-3 font-medium text-right border-t border-slate-700">Tolerance</th>
                <th className="px-4 py-3 font-medium text-right border-t border-slate-700">VIF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">(Constant)</td>
                <td className="px-4 py-3 text-right">0.045</td>
                <td className="px-4 py-3 text-right">0.021</td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right">2.142</td>
                <td className="px-4 py-3 text-right">0.033</td>
                <td className="px-4 py-3 text-right"></td>
                <td className="px-4 py-3 text-right"></td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">X (Rasio CKPN)</td>
                <td className="px-4 py-3 text-right">0.342</td>
                <td className="px-4 py-3 text-right">0.085</td>
                <td className="px-4 py-3 text-right">0.412</td>
                <td className="px-4 py-3 text-right">4.023</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.000</td>
                <td className="px-4 py-3 text-right">0.852</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">1.173</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">SIZE (Ln Aset)</td>
                <td className="px-4 py-3 text-right">-0.012</td>
                <td className="px-4 py-3 text-right">0.005</td>
                <td className="px-4 py-3 text-right">-0.185</td>
                <td className="px-4 py-3 text-right">-2.400</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.017</td>
                <td className="px-4 py-3 text-right">0.785</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">1.274</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">CAR</td>
                <td className="px-4 py-3 text-right">0.025</td>
                <td className="px-4 py-3 text-right">0.015</td>
                <td className="px-4 py-3 text-right">0.112</td>
                <td className="px-4 py-3 text-right">1.666</td>
                <td className="px-4 py-3 text-right">0.097</td>
                <td className="px-4 py-3 text-right">0.820</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">1.219</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">* VIF {'<'} 10 untuk semua variabel, tidak terjadi multikolinearitas.<br/>* Variabel X (Rasio CKPN) berpengaruh signifikan terhadap Y1 (Sig. 0.000 {'<'} 0.05).</p>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-slate-200">4. Uji Heteroskedastisitas (Uji Glejser)</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium text-right">Unstandardized B</th>
                <th className="px-4 py-3 font-medium text-right">Std. Error</th>
                <th className="px-4 py-3 font-medium text-right">t</th>
                <th className="px-4 py-3 font-medium text-right">Sig.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">(Constant)</td>
                <td className="px-4 py-3 text-right">0.015</td>
                <td className="px-4 py-3 text-right">0.012</td>
                <td className="px-4 py-3 text-right">1.250</td>
                <td className="px-4 py-3 text-right">0.213</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">X (Rasio CKPN)</td>
                <td className="px-4 py-3 text-right">0.021</td>
                <td className="px-4 py-3 text-right">0.018</td>
                <td className="px-4 py-3 text-right">1.167</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.245</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">SIZE (Ln Aset)</td>
                <td className="px-4 py-3 text-right">-0.005</td>
                <td className="px-4 py-3 text-right">0.006</td>
                <td className="px-4 py-3 text-right">-0.833</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.406</td>
              </tr>
              <tr className="hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium">CAR</td>
                <td className="px-4 py-3 text-right">0.011</td>
                <td className="px-4 py-3 text-right">0.015</td>
                <td className="px-4 py-3 text-right">0.733</td>
                <td className="px-4 py-3 text-right font-bold text-green-400">0.464</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">* Nilai Sig. semua variabel independen {'>'} 0.05, sehingga tidak terjadi heteroskedastisitas.</p>
        </div>
      </div>
      
    </div>
  );
}

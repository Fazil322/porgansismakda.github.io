import React from 'react';
import * as Recharts from 'recharts';
import { FinancialRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Defs, LinearGradient, Stop } = Recharts;

interface FinancialTrendChartProps {
  records: FinancialRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    const { theme } = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-text-secondary dark:text-dark-text-secondary mb-2">
                    {new Date(label).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <ul className="space-y-1">
                    {payload.map((entry: any) => (
                         <li key={entry.dataKey} style={{ color: entry.stroke }} className="flex justify-between items-center text-sm">
                            <span className="capitalize">{entry.name}:</span>
                            <span className="font-bold ml-4">Rp {entry.value.toLocaleString('id-ID')}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};

const FinancialTrendChart: React.FC<FinancialTrendChartProps> = ({ records }) => {
  const { theme } = useTheme();
  
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  const processedData = () => {
    if (records.length === 0) return [];
    
    const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let cumulativeIncome = 0;
    let cumulativeExpense = 0;
    
    const dataMap = new Map<string, { date: string; income: number; expense: number }>();

    sortedRecords.forEach(record => {
        const dateStr = new Date(record.date).toISOString().split('T')[0];
        if (!dataMap.has(dateStr)) {
            dataMap.set(dateStr, { date: dateStr, income: 0, expense: 0 });
        }
        const dayData = dataMap.get(dateStr)!;
        if (record.type === 'income') {
            dayData.income += record.amount;
        } else {
            dayData.expense += record.amount;
        }
    });

    const chartData = Array.from(dataMap.values()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chartData.map(d => {
        cumulativeIncome += d.income;
        cumulativeExpense += d.expense;
        return {
            date: new Date(d.date).getTime(),
            income: cumulativeIncome,
            expense: cumulativeExpense,
            balance: cumulativeIncome - cumulativeExpense
        };
    });
  };

  const chartData = processedData();
  
  if (chartData.length < 2) {
    return <div className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">Data tidak cukup untuk menampilkan tren. Minimal perlu 2 hari transaksi.</div>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <Defs>
            <LinearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <Stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </LinearGradient>
             <LinearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <Stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </LinearGradient>
            <LinearGradient id="gradientBalance" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <Stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </LinearGradient>
          </Defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} 
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke={tickColor}
          />
          <YAxis 
            tickFormatter={(value) => `Rp${(value/1000000).toFixed(1)}Jt`} 
            allowDecimals={false} 
            stroke={tickColor} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} />
          <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10b981" fill="url(#gradientIncome)" strokeWidth={2} />
          <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" fill="url(#gradientExpense)" strokeWidth={2} />
          <Area type="monotone" dataKey="balance" name="Saldo" stroke="#3b82f6" fill="url(#gradientBalance)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialTrendChart;

import React from 'react';
import * as Recharts from 'recharts';
import { Candidate } from '../types';
import { useTheme } from '../context/ThemeContext';

const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Defs, LinearGradient, Stop } = Recharts;

interface ResultChartProps {
  data: Candidate[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
            <p className="font-bold text-primary dark:text-dark-primary">{`${payload[0].payload.fullName}`}</p>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{`Jumlah Suara : ${payload[0].value}`}</p>
        </div>
        );
    }
    return null;
};

const ResultChart: React.FC<ResultChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';


  const chartData = data.map(candidate => ({
    name: candidate.name.split(' ')[0], // Use first name for brevity on X-axis
    Suara: candidate.votes,
    fullName: candidate.name,
  }));
  
  const hasVotes = data.some(c => c.votes > 0);

  if (!hasVotes) {
    return (
        <div className="flex items-center justify-center h-[300px] text-center text-text-secondary dark:text-dark-text-secondary p-8 bg-slate-50 dark:bg-dark-surface/50 rounded-lg">
            <p>Belum ada suara yang masuk. Hasil akan ditampilkan di sini setelah voting dimulai.</p>
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
              <Stop offset="95%" stopColor="#2563eb" stopOpacity={0.9}/>
            </LinearGradient>
          </Defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={tickColor} />
          <YAxis allowDecimals={false} stroke={tickColor} />
          <Tooltip 
            cursor={{fill: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.5)'}}
            content={<CustomTooltip />}
          />
          <Bar dataKey="Suara" fill="url(#barGradient)" name="Jumlah Suara" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultChart;
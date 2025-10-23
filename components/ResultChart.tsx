
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Candidate } from '../types';

interface ResultChartProps {
  data: Candidate[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-slate-200">
            <p className="font-bold text-primary">{`${payload[0].payload.fullName}`}</p>
            <p className="text-sm text-secondary-dark">{`Jumlah Suara : ${payload[0].value}`}</p>
        </div>
        );
    }
    return null;
};

const ResultChart: React.FC<ResultChartProps> = ({ data }) => {
  const chartData = data.map(candidate => ({
    name: candidate.name.split(' ')[0], // Use first name for brevity on X-axis
    Suara: candidate.votes,
    fullName: candidate.name,
  }));
  
  const hasVotes = data.some(c => c.votes > 0);

  if (!hasVotes) {
    return (
        <div className="flex items-center justify-center h-[300px] text-center text-secondary-dark p-8 bg-slate-50 rounded-lg">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis allowDecimals={false} stroke="#64748b" />
          <Tooltip 
            cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
            content={<CustomTooltip />}
          />
          <Legend />
          <Bar dataKey="Suara" fill="#06b6d4" name="Jumlah Suara" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultChart;
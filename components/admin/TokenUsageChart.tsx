import React from 'react';
import * as Recharts from 'recharts';
import { VotingToken } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = Recharts;

interface TokenUsageChartProps {
  tokens: VotingToken[];
}

const TokenUsageChart: React.FC<TokenUsageChartProps> = ({ tokens }) => {
  const { theme } = useTheme();
  const usedCount = tokens.filter(t => t.status === 'used').length;
  const activeCount = tokens.length - usedCount;

  const data = [
    { name: 'Terpakai', value: usedCount },
    { name: 'Aktif', value: activeCount },
  ];
  
  const COLORS = theme === 'dark' ? ['#3b82f6', '#475569'] : ['#2563eb', '#cbd5e1'];

  return (
    <div className="w-full h-[250px] relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            cornerRadius={8}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth={4} />
            ))}
          </Pie>
          <Tooltip 
             cursor={{fill: 'transparent'}}
             contentStyle={{ 
                 backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                 backdropFilter: 'blur(4px)',
                 border: '1px solid',
                 borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                 borderRadius: '0.75rem',
             }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-primary dark:text-white">{tokens.length}</span>
          <span className="text-sm text-secondary-dark dark:text-slate-400">Total Token</span>
      </div>
    </div>
  );
};

export default TokenUsageChart;
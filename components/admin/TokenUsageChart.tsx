import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VotingToken } from '../../types';

interface TokenUsageChartProps {
  tokens: VotingToken[];
}

const TokenUsageChart: React.FC<TokenUsageChartProps> = ({ tokens }) => {
  const usedCount = tokens.filter(t => t.status === 'used').length;
  const activeCount = tokens.length - usedCount;

  const data = [
    { name: 'Terpakai', value: usedCount },
    { name: 'Aktif', value: activeCount },
  ];

  const COLORS = ['#06b6d4', '#94a3b8']; // accent, secondary-light

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart;
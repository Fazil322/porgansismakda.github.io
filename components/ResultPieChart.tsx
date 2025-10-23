import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Candidate } from '../types';

interface ResultPieChartProps {
  data: Candidate[];
}

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-slate-200">
            <p className="font-bold text-primary">{`${payload[0].name}`}</p>
            <p className="text-sm text-secondary-dark">{`Jumlah Suara : ${payload[0].value} (${(payload[0].percent * 100).toFixed(1)}%)`}</p>
        </div>
        );
    }
    return null;
};


const ResultPieChart: React.FC<ResultPieChartProps> = ({ data }) => {
  // Handle case where there are no votes yet to avoid chart errors
  const hasVotes = data.some(c => c.votes > 0);
  const chartData = hasVotes ? data : [{ name: 'Belum ada suara', votes: 1, id: 0, vision: '', mission: '', photoUrl: '' }];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="votes"
            nameKey="name"
            label={!hasVotes ? false : ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 15;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const textAnchor = x > cx ? 'start' : 'end';

                return (
                    <text x={x} y={y} fill="#475569" textAnchor={textAnchor} dominantBaseline="central" className="text-sm font-semibold">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={hasVotes ? COLORS[index % COLORS.length] : '#e2e8f0'} stroke={hasVotes ? '#fff' : '#e2e8f0'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultPieChart;

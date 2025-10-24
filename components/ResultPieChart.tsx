import React, { useState } from 'react';
import * as Recharts from 'recharts';
import { Candidate } from '../types';

const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } = Recharts;

interface ResultPieChartProps {
  data: Candidate[];
}

const MODERN_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-surface/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
            <p className="font-bold text-primary dark:text-sky-400">{`${payload[0].name}`}</p>
            <p className="text-sm text-text-secondary dark:text-slate-300">{`Suara : ${payload[0].value} (${(payload[0].percent * 100).toFixed(1)}%)`}</p>
        </div>
        );
    }
    return null;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4} // Make active slice pop
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 4px 8px ${fill}60)` }}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="#334155" className="dark:fill-slate-200 font-bold">{`${payload.name}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={18} textAnchor={textAnchor} fill="#64748b" className="dark:fill-slate-400">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};


const ResultPieChart: React.FC<ResultPieChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasVotes = data.some(c => c.votes > 0);
  const chartData = hasVotes ? data : [{ name: 'Belum ada suara', votes: 1, id: 0, vision: '', mission: '', photoUrl: '' }];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={hasVotes ? activeIndex : undefined}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            fill="#8884d8"
            dataKey="votes"
            nameKey="name"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={hasVotes ? MODERN_COLORS[index % MODERN_COLORS.length] : '#e2e8f0'} stroke={hasVotes ? '#fff' : '#e2e8f0'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} allowEscapeViewBox={{ x: true, y: true }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultPieChart;
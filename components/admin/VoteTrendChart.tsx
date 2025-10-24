import React from 'react';
import * as Recharts from 'recharts';
import { VoteRecord, Candidate } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, Defs, LinearGradient, Stop } = Recharts;

interface VoteTrendChartProps {
  voteHistory: VoteRecord[];
  candidates: Candidate[];
}

const CustomTooltip = ({ active, payload, label, candidates }: any) => {
    const { theme } = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
                <p className="font-bold text-text-secondary dark:text-slate-300 mb-2">
                    {new Date(label).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
                <ul className="space-y-1">
                    {payload.map((entry: any) => (
                         <li key={entry.dataKey} style={{ color: entry.color }} className="flex justify-between items-center text-sm">
                            <span>{candidates.find(c => c.id.toString() === entry.dataKey)?.name}:</span>
                            <span className="font-bold ml-4">{entry.value} suara</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};


const VoteTrendChart: React.FC<VoteTrendChartProps> = ({ voteHistory, candidates }) => {
  const { theme } = useTheme();
  if (voteHistory.length === 0) {
    return <div className="text-center p-8 text-text-secondary dark:text-slate-400">Data tren belum tersedia.</div>;
  }
  
  const candidateColors = ['#3b82f6', '#6366f1', '#8b5cf6'];
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  const processedData = () => {
    const sortedHistory = [...voteHistory].sort((a, b) => a.timestamp - b.timestamp);
    const timeInterval = 60 * 60 * 1000; // 1 hour intervals
    const startTime = sortedHistory[0].timestamp;
    const endTime = Date.now();
    
    const intervals: { time: number; [key: string]: number }[] = [];
    let currentIntervalStart = Math.floor(startTime / timeInterval) * timeInterval;

    while (currentIntervalStart <= endTime + timeInterval) { // Ensure last interval is included
      const intervalData: { time: number; [key: string]: number } = { time: currentIntervalStart };
      candidates.forEach(c => intervalData[String(c.id)] = 0);
      intervals.push(intervalData);
      currentIntervalStart += timeInterval;
    }

    const cumulativeVotes: {[key: string]: number} = {};
    candidates.forEach(c => cumulativeVotes[String(c.id)] = 0);
    
    let historyIndex = 0;
    for (const interval of intervals) {
      while (historyIndex < sortedHistory.length && sortedHistory[historyIndex].timestamp < interval.time + timeInterval) {
        const vote = sortedHistory[historyIndex];
        cumulativeVotes[String(vote.candidateId)]++;
        historyIndex++;
      }
      Object.keys(cumulativeVotes).forEach(candidateId => {
        interval[candidateId] = cumulativeVotes[candidateId];
      });
    }

    return intervals;
  };

  const chartData = processedData();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <Defs>
            {candidates.map((candidate, index) => (
                 <LinearGradient key={candidate.id} id={`gradient-${candidate.id}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="5%" stopColor={candidateColors[index % candidateColors.length]} stopOpacity={0.4}/>
                    <Stop offset="95%" stopColor={candidateColors[index % candidateColors.length]} stopOpacity={0}/>
                </LinearGradient>
            ))}
          </Defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="time" 
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], {hour: '2-digit'})} 
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke={tickColor}
          />
          <YAxis allowDecimals={false} stroke={tickColor} />
          <Tooltip 
             content={<CustomTooltip candidates={candidates} />}
          />
          <Legend wrapperStyle={{ color: tickColor }} />
          {candidates.map((candidate, index) => (
            <React.Fragment key={candidate.id}>
                 <Area 
                    type="monotone" 
                    dataKey={String(candidate.id)} 
                    stroke="none" 
                    fill={`url(#gradient-${candidate.id})`} 
                />
                <Line 
                  type="monotone" 
                  dataKey={String(candidate.id)} 
                  name={candidate.name} 
                  stroke={candidateColors[index % candidateColors.length]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteTrendChart;
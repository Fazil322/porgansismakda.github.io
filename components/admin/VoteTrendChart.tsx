import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VoteRecord, Candidate } from '../../types';

interface VoteTrendChartProps {
  voteHistory: VoteRecord[];
  candidates: Candidate[];
}

const VoteTrendChart: React.FC<VoteTrendChartProps> = ({ voteHistory, candidates }) => {
  if (voteHistory.length === 0) {
    return <div className="text-center p-8 text-secondary">Data tren belum tersedia.</div>;
  }
  
  const candidateColors = ['#06b6d4', '#8b5cf6', '#ec4899'];

  const processedData = () => {
    const sortedHistory = [...voteHistory].sort((a, b) => a.timestamp - b.timestamp);
    const timeInterval = 60 * 60 * 1000; // 1 hour intervals
    const startTime = sortedHistory[0].timestamp;
    const endTime = Date.now();
    
    const intervals: { time: number; [key: number]: number }[] = [];
    let currentIntervalStart = Math.floor(startTime / timeInterval) * timeInterval;

    while (currentIntervalStart <= endTime) {
      const intervalData: { time: number; [key: number]: number } = { time: currentIntervalStart };
      candidates.forEach(c => intervalData[c.id] = 0);
      intervals.push(intervalData);
      currentIntervalStart += timeInterval;
    }

    const cumulativeVotes: {[key: number]: number} = {};
    candidates.forEach(c => cumulativeVotes[c.id] = 0);
    
    let historyIndex = 0;
    for (const interval of intervals) {
      while (historyIndex < sortedHistory.length && sortedHistory[historyIndex].timestamp < interval.time + timeInterval) {
        const vote = sortedHistory[historyIndex];
        cumulativeVotes[vote.candidateId]++;
        historyIndex++;
      }
      Object.keys(cumulativeVotes).forEach(candidateId => {
        interval[parseInt(candidateId, 10)] = cumulativeVotes[parseInt(candidateId, 10)];
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis allowDecimals={false} />
          <Tooltip 
            labelFormatter={(unixTime) => new Date(unixTime).toLocaleString()}
            formatter={(value) => [value, 'Total Suara']}
          />
          <Legend />
          {candidates.map((candidate, index) => (
            <Line 
              key={candidate.id}
              type="monotone" 
              dataKey={candidate.id} 
              name={candidate.name} 
              stroke={candidateColors[index % candidateColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteTrendChart;
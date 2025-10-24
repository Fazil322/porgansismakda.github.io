import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as Recharts from 'recharts';
import { Aspiration } from '../../types';
import { generateAspirationThemes } from '../../services/geminiService';
import { useTheme } from '../../context/ThemeContext';

const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } = Recharts;

interface AspirationInsightsProps {
  aspirations: Aspiration[];
  onCategorize: () => Promise<void>;
  isCategorizing: boolean;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#64748b'];

const WordCloud: React.FC<{words: {text: string; value: number}[]}> = ({ words }) => {
    if (words.length === 0) return null;
    const maxFreq = Math.log(words[0].value);
    const minFreq = words.length > 1 ? Math.log(words[words.length - 1].value) : 0;

    const getFontSize = (value: number) => {
        if (maxFreq === minFreq) return '1rem';
        const logValue = Math.log(value);
        const percentage = (logValue - minFreq) / (maxFreq - minFreq);
        return `${0.8 + percentage * 1.5}rem`; // Font size from 0.8rem to 2.3rem
    };

    return (
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-4">
            {words.map((word, index) => (
                <span key={index} style={{ fontSize: getFontSize(word.value) }} className="font-bold text-text-secondary dark:text-slate-300">
                    {word.text}
                </span>
            ))}
        </div>
    );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill={fill} className="font-bold text-lg">{payload.name}</text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill={props.theme === 'dark' ? '#94a3b8' : '#64748b'}>{`${payload.value} item`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 2px 6px ${fill}80)` }}
      />
    </g>
  );
};


const AspirationInsights: React.FC<AspirationInsightsProps> = ({ aspirations, onCategorize, isCategorizing }) => {
    const [themes, setThemes] = useState('');
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { theme } = useTheme();
    
    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, []);

    const onPieLeave = useCallback(() => {
        setActiveIndex(null);
    }, []);

    const unreadCount = aspirations.filter(a => a.status === 'unread' && !a.category).length;

    const categoryData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        aspirations.forEach(a => {
            if (a.category) {
                counts[a.category] = (counts[a.category] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [aspirations]);

     const wordCloudData = useMemo(() => {
        const wordCounts: { [key: string]: number } = {};
        const stopWords = new Set(['yang', 'di', 'dan', 'untuk', 'agar', 'bisa', 'saya', 'tolong', 'lebih', 'itu', 'ini', 'dari', 'ke', 'dengan', 'para', 'sekolah', 'mohon']);
        
        aspirations.forEach(a => {
            a.text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).forEach(word => {
                if (word && !stopWords.has(word) && word.length > 3) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
        });

        return Object.entries(wordCounts)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 30);
    }, [aspirations]);

    const handleGenerateThemes = async () => {
        setIsLoadingThemes(true);
        setError('');
        try {
            const categorizedAspirations = aspirations.filter(a => a.category);
            if (categorizedAspirations.length === 0) {
                setError('Tidak ada aspirasi yang telah dikategorikan untuk dianalisis.');
                setIsLoadingThemes(false);
                return;
            }
            const result = await generateAspirationThemes(categorizedAspirations);
            setThemes(result);
        } catch (err) {
            setError('Gagal menghasilkan analisis tema. Silakan coba lagi.');
        } finally {
            setIsLoadingThemes(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                        <h4 className="font-bold text-primary dark:text-white mb-2">Aksi AI</h4>
                        <p className="text-sm text-text-secondary dark:text-slate-400 mb-4 flex-grow">Analisis feedback siswa untuk mendapatkan wawasan strategis.</p>
                        <div className="space-y-2">
                            <button onClick={onCategorize} disabled={isCategorizing || unreadCount === 0} className="bg-sky-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed w-full flex items-center justify-center transition-colors">
                                {isCategorizing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isCategorizing ? 'Mengkategorikan...' : `Kategorikan Aspirasi (${unreadCount} Baru)`}
                            </button>
                            <button onClick={handleGenerateThemes} disabled={isLoadingThemes || categoryData.length === 0} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed w-full flex items-center justify-center transition-colors">
                                {isLoadingThemes && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isLoadingThemes ? 'Menganalisis...' : 'Buat Ringkasan Tema'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-surface dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                     <h4 className="text-lg font-bold text-primary dark:text-white mb-2 text-center">Ringkasan Tema & Rekomendasi AI</h4>
                    {isLoadingThemes && <div className="text-center p-8 text-text-secondary dark:text-slate-400">Menganalisis data...</div>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {themes && !isLoadingThemes && (
                        <div className="prose prose-sm max-w-none text-text-secondary dark:text-slate-300 mt-4 prose-strong:text-primary dark:prose-strong:text-sky-400" dangerouslySetInnerHTML={{ __html: themes }} />
                    )}
                    {!themes && !isLoadingThemes && !error && (
                         <div className="text-center text-text-secondary dark:text-slate-400 p-8">Klik "Buat Ringkasan Tema" untuk melihat analisis dari AI.</div>
                    )}
                </div>
            </div>
             <div className="grid lg:grid-cols-2 gap-6">
                 <div className="bg-surface dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-primary dark:text-white mb-4 text-center">Distribusi Kategori Aspirasi</h4>
                    {categoryData.length > 0 ? (
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie 
                                        data={categoryData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60}
                                        outerRadius={90} 
                                        fill="#8884d8" 
                                        activeIndex={activeIndex}
                                        activeShape={(props) => renderActiveShape({...props, theme: theme})}
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth={3} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ display: 'none' }} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                         <div className="text-center p-8 text-text-secondary dark:text-slate-400">Data tidak tersedia. Kategorikan aspirasi terlebih dahulu.</div>
                    )}
                 </div>
                 <div className="bg-surface dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-primary dark:text-white mb-4 text-center">Topik Populer</h4>
                    {wordCloudData.length > 0 ? <WordCloud words={wordCloudData} /> : <div className="text-center p-8 text-text-secondary dark:text-slate-400">Data tidak cukup untuk menampilkan topik populer.</div>}
                 </div>
             </div>
        </div>
    );
};

export default AspirationInsights;
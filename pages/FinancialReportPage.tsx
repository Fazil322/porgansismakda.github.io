

import React from 'react';
import { FinancialRecord } from '../types';
import Card, { CardContent } from '../components/ui/Card';
import FinancialTrendChart from '../components/admin/FinancialTrendChart';

interface FinancialReportPageProps {
  records: FinancialRecord[];
}

const StatCard: React.FC<{ title: string; value: string; className?: string, icon: React.ReactNode }> = ({ title, value, className, icon }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="flex items-center space-x-4 p-4">
            <div className={`p-4 rounded-full ${className}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const FinancialReportPage: React.FC<FinancialReportPageProps> = ({ records }) => {
    let balance = 0;
    const processedRecords = [...records]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(record => {
            if (record.type === 'income') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
            return { ...record, balance };
        })
        .reverse();

    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    const finalBalance = totalIncome - totalExpense;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                <section className="text-center fade-in-up">
                    <h1 className="text-4xl font-extrabold text-primary dark:text-dark-primary">Laporan Keuangan OSIS</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-text-secondary dark:text-dark-text-secondary">Transparansi penggunaan dana untuk seluruh kegiatan kesiswaan.</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up" style={{animationDelay: '100ms'}}>
                     <StatCard 
                        title="Total Pemasukan" 
                        value={`Rp ${totalIncome.toLocaleString('id-ID')}`} 
                        className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                    />
                     <StatCard 
                        title="Total Pengeluaran" 
                        value={`Rp ${totalExpense.toLocaleString('id-ID')}`} 
                        className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m-4-8v8m-4-4h.01M17 10h.01M21 10h.01M3 7l3-3m0 0l3 3M6 4v12" /></svg>}
                    />
                     <StatCard 
                        title="Saldo Akhir" 
                        value={`Rp ${finalBalance.toLocaleString('id-ID')}`} 
                        className="bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2" /></svg>}
                    />
                </section>
                
                 <section className="fade-in-up" style={{animationDelay: '200ms'}}>
                     <Card className="shadow-md">
                        <CardContent>
                             <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Tren Keuangan</h3>
                             <FinancialTrendChart records={records} />
                        </CardContent>
                     </Card>
                 </section>

                <section className="fade-in-up" style={{animationDelay: '300ms'}}>
                    <Card className="shadow-md">
                        <CardContent>
                            <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Rincian Transaksi</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                                    <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Tanggal</th>
                                            <th scope="col" className="px-6 py-3">Deskripsi</th>
                                            <th scope="col" className="px-6 py-3 text-right">Pemasukan</th>
                                            <th scope="col" className="px-6 py-3 text-right">Pengeluaran</th>
                                            <th scope="col" className="px-6 py-3 text-right">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedRecords.map(record => (
                                            <tr key={record.id} className="bg-surface dark:bg-dark-surface border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                <td className="px-6 py-4">{new Date(record.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td className="px-6 py-4 font-medium text-text-primary dark:text-dark-text-primary">{record.description}</td>
                                                <td className="px-6 py-4 text-right font-medium text-green-500">{record.type === 'income' ? `Rp ${record.amount.toLocaleString('id-ID')}` : '-'}</td>
                                                <td className="px-6 py-4 text-right font-medium text-red-500">{record.type === 'expense' ? `Rp ${record.amount.toLocaleString('id-ID')}` : '-'}</td>
                                                <td className="px-6 py-4 text-right font-semibold text-text-secondary dark:text-dark-text-secondary">{`Rp ${record.balance.toLocaleString('id-ID')}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </div>
        </div>
    );
};

export default FinancialReportPage;
import React from 'react';
import { Aspiration } from '../../types';
import AspirationInsights from './AspirationInsights';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

interface AspirationManagerProps {
    aspirations: Aspiration[];
    onCategorize: () => Promise<void>;
    isCategorizing: boolean;
}

const statusBadge = (status: Aspiration['status']) => {
    switch (status) {
        case 'unread': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'read': return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
};

const AspirationManager: React.FC<AspirationManagerProps> = ({ aspirations, onCategorize, isCategorizing }) => {
    const sortedAspirations = [...aspirations].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-primary dark:text-dark-primary">Manajemen Aspirasi Siswa</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Lihat, kategorikan, dan analisis masukan dari siswa untuk pengembangan sekolah.</p>
            </div>
            
            <AspirationInsights 
                aspirations={aspirations}
                onCategorize={onCategorize}
                isCategorizing={isCategorizing}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Semua Aspirasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                            <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Aspirasi</th>
                                    <th scope="col" className="px-6 py-3">Kategori</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAspirations.length > 0 ? sortedAspirations.map(asp => (
                                    <tr key={asp.id} className={`bg-surface dark:bg-dark-surface border-b border-slate-200 dark:border-slate-700 ${asp.status === 'unread' ? 'font-semibold text-text-primary dark:text-dark-text-primary' : ''}`}>
                                        <td className="px-6 py-4 max-w-lg">
                                            {asp.status === 'unread' && <span className="inline-block h-2 w-2 mr-2 bg-blue-500 rounded-full"></span>}
                                            {asp.text}
                                        </td>
                                        <td className="px-6 py-4">{asp.category || <span className="text-slate-400 dark:text-slate-500 italic">Belum Dikategorikan</span>}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge(asp.status)}`}>
                                                {asp.status === 'read' ? 'Dibaca' : 'Baru'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(asp.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">Belum ada aspirasi yang tercatat.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AspirationManager;
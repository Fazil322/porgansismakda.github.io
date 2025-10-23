
import React, { useState, useMemo } from 'react';
import { VotingToken } from '../../types';
import Modal from '../Modal';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

// Helper function to generate new tokens, avoiding conflicts with existing ones.
const generateNewTokens = (count: number, existingTokens: VotingToken[]): VotingToken[] => {
    const existingIds = new Set(existingTokens.map(t => t.id));
    const newTokens: VotingToken[] = [];
    for (let i = 0; i < count; i++) {
        let id;
        do {
            id = Math.random().toString(36).substring(2, 8).toUpperCase();
        } while (existingIds.has(id) || id.length < 6);
        newTokens.push({ id, status: 'active' });
        existingIds.add(id);
    }
    return newTokens;
};

const statusBadge = (status: VotingToken['status']) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'used': return 'bg-slate-200 text-slate-600';
    }
};

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <CardContent className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-secondary-dark">{title}</p>
                <p className="text-2xl font-bold text-primary">{value}</p>
            </div>
            <div className="bg-accent-light p-3 rounded-full text-accent">
                {icon}
            </div>
        </CardContent>
    </Card>
);

const TokenManager: React.FC<{
    tokens: VotingToken[];
    setTokens: React.Dispatch<React.SetStateAction<VotingToken[]>>;
    addToast: (message: string, type: 'success' | 'error') => void;
}> = ({ tokens, setTokens, addToast }) => {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [generateCount, setGenerateCount] = useState('100');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { used, active } = useMemo(() => {
        return tokens.reduce((acc, token) => {
            acc[token.status]++;
            return acc;
        }, { used: 0, active: 0 });
    }, [tokens]);

    const paginatedTokens = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return tokens.slice(startIndex, startIndex + itemsPerPage);
    }, [tokens, currentPage]);
    const totalPages = Math.ceil(tokens.length / itemsPerPage);

    const handleGenerate = () => {
        const count = parseInt(generateCount, 10);
        if (isNaN(count) || count <= 0 || count > 5000) {
            addToast('Jumlah token harus antara 1 dan 5000.', 'error');
            return;
        }
        const newTokens = generateNewTokens(count, tokens);
        setTokens(prev => [...prev, ...newTokens]);
        addToast(`${count} token baru berhasil dibuat.`, 'success');
        setShowGenerateModal(false);
        setGenerateCount('100');
    };

    const handleDeleteUnused = () => {
        const unusedCount = tokens.filter(t => t.status === 'active').length;
        setTokens(prev => prev.filter(t => t.status === 'used'));
        addToast(`${unusedCount} token yang tidak terpakai telah dihapus.`, 'success');
        setShowDeleteModal(false);
    };
    
    const handleExport = () => {
        if(tokens.length === 0) {
            addToast('Tidak ada token untuk diekspor.', 'error');
            return;
        }
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Token,Status,DigunakanPada\n" 
            + tokens.map(t => `${t.id},${t.status},${t.usedAt ? `"${new Date(t.usedAt).toLocaleString('id-ID')}"` : 'Belum Digunakan'}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "daftar_token_voting.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Data token sedang diunduh.", "success");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">Manajemen Token Voting</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Token" value={tokens.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
                <StatCard title="Token Terpakai" value={used} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Token Aktif" value={active} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h7z" /></svg>} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Daftar Token</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={handleExport} className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">Ekspor CSV</button>
                            <button onClick={() => setShowDeleteModal(true)} disabled={active === 0} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-400 transition-colors">Hapus Tdk Terpakai</button>
                            <button onClick={() => setShowGenerateModal(true)} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">Buat Token Baru</button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-secondary-dark">
                            <thead className="text-xs uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Token ID</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Digunakan Pada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTokens.map(token => (
                                    <tr key={token.id} className="bg-surface border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono font-bold text-primary">{token.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge(token.status)}`}>{token.status}</span>
                                        </td>
                                        <td className="px-6 py-4">{token.usedAt ? new Date(token.usedAt).toLocaleString('id-ID') : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {tokens.length === 0 && <p className="text-center p-8 text-secondary">Belum ada token yang dibuat.</p>}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-sm text-secondary-dark">Halaman {currentPage} dari {totalPages}</span>
                            <div className="space-x-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Sebelumnya</button>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Berikutnya</button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {showGenerateModal && (
                <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} onConfirm={handleGenerate} title="Buat Token Baru" confirmText="Buat">
                    <label htmlFor="token-count" className="block text-sm font-medium text-secondary-dark">Jumlah token yang akan dibuat:</label>
                    <input
                        id="token-count"
                        type="number"
                        value={generateCount}
                        onChange={e => setGenerateCount(e.target.value)}
                        min="1"
                        max="5000"
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                    />
                    <p className="text-xs text-secondary-dark mt-2">Maksimal 5000 token per pembuatan.</p>
                </Modal>
            )}

            {showDeleteModal && (
                <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteUnused} title="Konfirmasi Hapus" confirmText="Ya, Hapus" confirmButtonClass="bg-red-600 hover:bg-red-700">
                    <p>Anda yakin ingin menghapus semua <strong>{active} token</strong> yang belum terpakai? Tindakan ini tidak dapat diurungkan.</p>
                </Modal>
            )}
        </div>
    );
};

export default TokenManager;

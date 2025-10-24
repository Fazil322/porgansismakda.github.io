import React, { useState } from 'react';
import { FinancialRecord } from '../../types';
import Modal from '../Modal';
import Card from '../ui/Card';

interface FinancialManagerProps {
    records: FinancialRecord[];
    addRecord: (record: Omit<FinancialRecord, 'id'>) => void;
    updateRecord: (record: FinancialRecord) => void;
    deleteRecord: (id: number) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyRecord: Omit<FinancialRecord, 'id'> = { date: '', description: '', type: 'expense', amount: 0 };

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string}> = ({label, value, onChange, type = "text"}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const FinancialManager: React.FC<FinancialManagerProps> = ({ records, addRecord, updateRecord, deleteRecord, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Omit<FinancialRecord, 'id'> | FinancialRecord | null>(null);
    const [deletingRecord, setDeletingRecord] = useState<FinancialRecord | null>(null);

    const openModalForNew = () => {
        setEditingRecord({...emptyRecord, date: new Date().toISOString().split('T')[0]});
        setIsModalOpen(true);
    };

    const openModalForEdit = (record: FinancialRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!editingRecord || !editingRecord.description || !editingRecord.date || editingRecord.amount <= 0) {
            addToast('Semua field harus diisi dan jumlah harus lebih dari 0.', 'error');
            return;
        }
        
        const recordToSave = { ...editingRecord, amount: Number(editingRecord.amount) };

        if ('id' in recordToSave) {
            updateRecord(recordToSave);
        } else {
            addRecord(recordToSave);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (deletingRecord) {
            deleteRecord(deletingRecord.id);
            setDeletingRecord(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };
    
    const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary dark:text-white">Manajemen Keuangan</h3>
                <button onClick={openModalForNew} className="bg-primary dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-cyan-500 transition-colors">
                    Tambah Catatan
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-slate-400">
                        <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Deskripsi</th>
                                <th scope="col" className="px-6 py-3">Tipe</th>
                                <th scope="col" className="px-6 py-3 text-right">Jumlah</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.map(record => (
                                <tr key={record.id} className="bg-surface dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">{new Date(record.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 font-medium text-primary dark:text-white">{record.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${record.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">{`Rp ${record.amount.toLocaleString('id-ID')}`}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => openModalForEdit(record)} className="font-medium text-accent hover:text-accent-hover dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Edit</button>
                                        <button onClick={() => setDeletingRecord(record)} className="font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && editingRecord && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingRecord ? 'Edit Catatan Keuangan' : 'Tambah Catatan Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <InputField label="Tanggal" type="date" value={editingRecord.date} onChange={value => setEditingRecord(prev => ({...prev!, date: value}))} />
                        <InputField label="Deskripsi" value={editingRecord.description} onChange={value => setEditingRecord(prev => ({...prev!, description: value}))} />
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">Tipe Transaksi</label>
                            <select value={editingRecord.type} onChange={e => setEditingRecord(prev => ({...prev!, type: e.target.value as 'income' | 'expense'}))} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm text-text-primary dark:text-dark-text-primary">
                                <option value="expense">Pengeluaran</option>
                                <option value="income">Pemasukan</option>
                            </select>
                        </div>
                        <InputField label="Jumlah (Rp)" type="number" value={String(editingRecord.amount)} onChange={value => setEditingRecord(prev => ({...prev!, amount: Number(value)}))} />
                    </div>
                </Modal>
            )}
            {deletingRecord && (
                <Modal
                    isOpen={!!deletingRecord}
                    onClose={() => setDeletingRecord(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus catatan <strong>"{deletingRecord.description}"</strong>? Tindakan ini tidak dapat diurungkan.</p>
                </Modal>
            )}
        </div>
    );
};

export default FinancialManager;
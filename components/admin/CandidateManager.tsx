import React, { useState } from 'react';
import { Candidate } from '../../types';
import Modal from '../Modal';
import ImageUploader from '../ImageUploader';
import EmptyState from '../EmptyState';

interface CandidateManagerProps {
    candidates: Candidate[];
    addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
    updateCandidate: (candidate: Candidate) => void;
    deleteCandidate: (id: number) => void;
    isEventActive: boolean;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyCandidate: Omit<Candidate, 'id' | 'votes'> = { name: '', vision: '', mission: '', photoUrl: '', bio: '' };

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const TextAreaField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const CandidateManager: React.FC<CandidateManagerProps> = ({ candidates, addCandidate, updateCandidate, deleteCandidate, isEventActive, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Omit<Candidate, 'id' | 'votes'> | Candidate | null>(null);
    const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(null);

    const openModalForNew = () => {
        setEditingCandidate(emptyCandidate);
        setIsModalOpen(true);
    };

    const openModalForEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!editingCandidate || !editingCandidate.name || !editingCandidate.vision || !editingCandidate.mission || !editingCandidate.photoUrl) {
            addToast('Semua field termasuk foto harus diisi, kecuali bio.', 'error');
            return;
        }
        
        if ('id' in editingCandidate) {
            updateCandidate(editingCandidate);
        } else {
            addCandidate(editingCandidate);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (deletingCandidate) {
            deleteCandidate(deletingCandidate.id);
            setDeletingCandidate(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCandidate(null);
    };
    
    const AddCandidateButton = ({ disabled }: { disabled: boolean }) => (
        <button onClick={openModalForNew} disabled={disabled} className="bg-primary dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
            Tambah Kandidat
        </button>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary dark:text-white">Manajemen Kandidat</h3>
                <AddCandidateButton disabled={isEventActive} />
            </div>
            {isEventActive && <p className="text-sm text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/50 p-3 rounded-lg mb-4 border border-amber-200 dark:border-amber-500/30">Manajemen kandidat dinonaktifkan selama event voting berlangsung untuk menjaga integritas data.</p>}
            
            {candidates.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-slate-400">
                        <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Foto</th>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Visi</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(candidate => (
                                <tr key={candidate.id} className="bg-surface dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4"><img src={candidate.photoUrl} alt={candidate.name} className="h-10 w-10 rounded-full object-cover"/></td>
                                    <td className="px-6 py-4 font-medium text-primary dark:text-white">{candidate.name}</td>
                                    <td className="px-6 py-4 max-w-sm truncate">{candidate.vision}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => openModalForEdit(candidate)} disabled={isEventActive} className="font-medium text-accent hover:text-accent-hover dark:text-cyan-400 dark:hover:text-cyan-300 disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors">Edit</button>
                                        <button onClick={() => setDeletingCandidate(candidate)} disabled={isEventActive} className="font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  title="Belum Ada Kandidat"
                  description="Mulai dengan menambahkan kandidat pertama untuk event voting Anda."
                >
                    <AddCandidateButton disabled={isEventActive} />
                </EmptyState>
            )}

            {isModalOpen && editingCandidate && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingCandidate ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <ImageUploader 
                            label="Foto Kandidat"
                            onImageSelected={base64 => setEditingCandidate(prev => ({ ...prev!, photoUrl: base64 }))}
                            currentImage={editingCandidate.photoUrl}
                        />
                        <InputField label="Nama Kandidat" value={editingCandidate.name} onChange={value => setEditingCandidate(prev => ({...prev!, name: value}))} />
                        <TextAreaField label="Visi" value={editingCandidate.vision} onChange={value => setEditingCandidate(prev => ({...prev!, vision: value}))} />
                        <TextAreaField label="Misi" value={editingCandidate.mission} onChange={value => setEditingCandidate(prev => ({...prev!, mission: value}))} />
                        <TextAreaField label="Bio Singkat (Opsional)" value={editingCandidate.bio || ''} onChange={value => setEditingCandidate(prev => ({...prev!, bio: value}))} />
                    </div>
                </Modal>
            )}
            {deletingCandidate && (
                <Modal
                    isOpen={!!deletingCandidate}
                    onClose={() => setDeletingCandidate(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus kandidat <strong>{deletingCandidate.name}</strong>? Tindakan ini tidak dapat diurungkan.</p>
                </Modal>
            )}
        </div>
    );
};

export default CandidateManager;
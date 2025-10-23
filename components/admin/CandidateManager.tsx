
import React, { useState } from 'react';
import { Candidate } from '../../types';
import Modal from '../Modal';
import ImageUploader from '../ImageUploader';

interface CandidateManagerProps {
    candidates: Candidate[];
    addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
    updateCandidate: (candidate: Candidate) => void;
    deleteCandidate: (id: number) => void;
    isEventActive: boolean;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyCandidate: Omit<Candidate, 'id' | 'votes'> = { name: '', vision: '', mission: '', photoUrl: '', bio: '' };

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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">Manajemen Kandidat</h3>
                <button onClick={openModalForNew} disabled={isEventActive} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                    Tambah Kandidat
                </button>
            </div>
            {isEventActive && <p className="text-sm text-amber-800 bg-amber-100 p-3 rounded-lg mb-4 border border-amber-200">Manajemen kandidat dinonaktifkan selama event voting berlangsung untuk menjaga integritas data.</p>}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left text-secondary-dark">
                    <thead className="text-xs uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Foto</th>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            <th scope="col" className="px-6 py-3">Visi</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id} className="bg-surface border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4"><img src={candidate.photoUrl} alt={candidate.name} className="h-10 w-10 rounded-full object-cover"/></td>
                                <td className="px-6 py-4 font-medium text-primary">{candidate.name}</td>
                                <td className="px-6 py-4 max-w-sm truncate">{candidate.vision}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openModalForEdit(candidate)} disabled={isEventActive} className="font-medium text-accent hover:text-accent-hover disabled:text-slate-400 transition-colors">Edit</button>
                                    <button onClick={() => setDeletingCandidate(candidate)} disabled={isEventActive} className="font-medium text-red-600 hover:text-red-700 disabled:text-slate-400 transition-colors">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-secondary-dark">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
    </div>
);

const TextAreaField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-secondary-dark">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
    </div>
);

export default CandidateManager;
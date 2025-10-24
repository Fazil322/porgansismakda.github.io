import React, { useState } from 'react';
import { Document } from '../../types';
import Modal from '../Modal';
import Card from '../ui/Card';

interface DocumentManagerProps {
    documents: Document[];
    addDocument: (doc: Omit<Document, 'id'>) => void;
    updateDocument: (doc: Document) => void;
    deleteDocument: (id: number) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyDocument: Omit<Document, 'id'> = { title: '', date: '', content: '', organization: 'OSIS' };

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string}> = ({label, value, onChange, type = "text"}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const TextAreaField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, addDocument, updateDocument, deleteDocument, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Omit<Document, 'id'> | Document | null>(null);
    const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);

    const openModalForNew = () => {
        setEditingDoc({...emptyDocument, date: new Date().toISOString().split('T')[0]});
        setIsModalOpen(true);
    };

    const openModalForEdit = (doc: Document) => {
        setEditingDoc(doc);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!editingDoc || !editingDoc.title || !editingDoc.date || !editingDoc.content || !editingDoc.organization) {
            addToast('Semua field harus diisi.', 'error');
            return;
        }
        
        if ('id' in editingDoc) {
            updateDocument(editingDoc);
        } else {
            addDocument(editingDoc);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (deletingDoc) {
            deleteDocument(deletingDoc.id);
            setDeletingDoc(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDoc(null);
    };
    
    const sortedDocuments = [...documents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary dark:text-white">Manajemen Bank Dokumen</h3>
                <button onClick={openModalForNew} className="bg-primary dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-cyan-500 transition-colors">
                    Tambah Dokumen
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-slate-400">
                        <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Judul Dokumen</th>
                                <th scope="col" className="px-6 py-3">Organisasi</th>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDocuments.map(doc => (
                                <tr key={doc.id} className="bg-surface dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-primary dark:text-white">{doc.title}</td>
                                    <td className="px-6 py-4">{doc.organization}</td>
                                    <td className="px-6 py-4">{new Date(doc.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => openModalForEdit(doc)} className="font-medium text-accent hover:text-accent-hover dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Edit</button>
                                        <button onClick={() => setDeletingDoc(doc)} className="font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && editingDoc && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingDoc ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <InputField label="Judul Dokumen" value={editingDoc.title} onChange={value => setEditingDoc(prev => ({...prev!, title: value}))} />
                        <InputField label="Tanggal" type="date" value={editingDoc.date} onChange={value => setEditingDoc(prev => ({...prev!, date: value}))} />
                        <InputField label="Organisasi" value={editingDoc.organization} onChange={value => setEditingDoc(prev => ({...prev!, organization: value}))} />
                        <TextAreaField label="Isi Dokumen / Ringkasan" value={editingDoc.content} onChange={value => setEditingDoc(prev => ({...prev!, content: value}))} />
                    </div>
                </Modal>
            )}
            {deletingDoc && (
                <Modal
                    isOpen={!!deletingDoc}
                    onClose={() => setDeletingDoc(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus dokumen <strong>"{deletingDoc.title}"</strong>? Tindakan ini tidak dapat diurungkan.</p>
                </Modal>
            )}
        </div>
    );
};

export default DocumentManager;
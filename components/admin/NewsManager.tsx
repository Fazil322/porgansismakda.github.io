import React, { useState } from 'react';
import { NewsItem } from '../../types';
import Modal from '../Modal';
import { generateNewsArticle } from '../../services/geminiService';
import ImageUploader from '../ImageUploader';

interface NewsManagerProps {
    newsItems: NewsItem[];
    addNewsItem: (item: Omit<NewsItem, 'id'>) => void;
    updateNewsItem: (item: NewsItem) => void;
    deleteNewsItem: (id: number) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyNewsItem: Omit<NewsItem, 'id'> = { title: '', content: '', imageUrl: '', organizationTag: 'OSIS' };

const NewsManager: React.FC<NewsManagerProps> = ({ newsItems, addNewsItem, updateNewsItem, deleteNewsItem, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNewsItem, setEditingNewsItem] = useState<Omit<NewsItem, 'id'> | NewsItem | null>(null);
    const [deletingNewsItem, setDeletingNewsItem] = useState<NewsItem | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const openModalForNew = () => {
        setEditingNewsItem(emptyNewsItem);
        setAiPrompt('');
        setIsModalOpen(true);
    };

    const openModalForEdit = (item: NewsItem) => {
        setEditingNewsItem(item);
        setAiPrompt('');
        setIsModalOpen(true);
    };

    const handleGenerateArticle = async () => {
        if (!aiPrompt.trim()) {
            addToast('Prompt AI tidak boleh kosong.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const article = await generateNewsArticle(aiPrompt);
            setEditingNewsItem(prev => ({...prev!, content: article}));
            addToast('Artikel berhasil dibuat oleh AI!', 'success');
        } catch (error) {
            addToast('Gagal membuat artikel dengan AI.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!editingNewsItem || !editingNewsItem.title || !editingNewsItem.content || !editingNewsItem.imageUrl || !editingNewsItem.organizationTag) {
            addToast('Semua field termasuk gambar harus diisi.', 'error');
            return;
        }
        
        if ('id' in editingNewsItem) {
            updateNewsItem(editingNewsItem);
        } else {
            addNewsItem(editingNewsItem);
        }
        closeModal();
    };

    const handleDelete = () => {
        if (deletingNewsItem) {
            deleteNewsItem(deletingNewsItem.id);
            setDeletingNewsItem(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNewsItem(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">Manajemen Berita</h3>
                <button onClick={openModalForNew} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light transition-colors">
                    Tambah Berita
                </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left text-secondary-dark">
                    <thead className="text-xs uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Gambar</th>
                            <th scope="col" className="px-6 py-3">Judul</th>
                            <th scope="col" className="px-6 py-3">Tag</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsItems.map(item => (
                            <tr key={item.id} className="bg-surface border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4"><img src={item.imageUrl} alt={item.title} className="h-10 w-16 object-cover rounded"/></td>
                                <td className="px-6 py-4 font-medium text-primary">{item.title}</td>
                                <td className="px-6 py-4"><span className="text-xs bg-accent-light text-accent-hover font-semibold px-2 py-1 rounded-full">{item.organizationTag}</span></td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openModalForEdit(item)} className="font-medium text-accent hover:text-accent-hover transition-colors">Edit</button>
                                    <button onClick={() => setDeletingNewsItem(item)} className="font-medium text-red-600 hover:text-red-700 transition-colors">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && editingNewsItem && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingNewsItem ? 'Edit Berita' : 'Tambah Berita Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-semibold text-primary mb-2">Buat Konten dengan AI ✨</h4>
                            <TextAreaField label="Masukkan poin-poin atau ide utama berita:" value={aiPrompt} onChange={setAiPrompt} rows={2} placeholder="Contoh: Rapat OSIS awal tahun, bahas proker, dihadiri perwakilan kelas..." />
                            <button onClick={handleGenerateArticle} disabled={isGenerating} className="mt-2 w-full text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors flex items-center justify-center">
                               {isGenerating && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                               {isGenerating ? 'Membuat...' : 'Generate Artikel'}
                            </button>
                        </div>
                        <ImageUploader 
                            label="Gambar Berita"
                            onImageSelected={base64 => setEditingNewsItem(prev => ({ ...prev!, imageUrl: base64 }))}
                            currentImage={editingNewsItem.imageUrl}
                        />
                        <InputField label="Judul Berita" value={editingNewsItem.title} onChange={value => setEditingNewsItem(prev => ({...prev!, title: value}))} />
                        <InputField label="Tag Organisasi (e.g., OSIS)" value={editingNewsItem.organizationTag} onChange={value => setEditingNewsItem(prev => ({...prev!, organizationTag: value}))} />
                        <TextAreaField label="Konten Berita" value={editingNewsItem.content} onChange={value => setEditingNewsItem(prev => ({...prev!, content: value}))} rows={8} />
                    </div>
                </Modal>
            )}
            {deletingNewsItem && (
                <Modal
                    isOpen={!!deletingNewsItem}
                    onClose={() => setDeletingNewsItem(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus berita <strong>"{deletingNewsItem.title}"</strong>? Tindakan ini tidak dapat diurungkan.</p>
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

const TextAreaField: React.FC<{label: string, value: string, onChange: (v: string) => void, rows?: number, placeholder?: string}> = ({label, value, onChange, rows = 3, placeholder}) => (
    <div>
        <label className="block text-sm font-medium text-secondary-dark">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
    </div>
);

export default NewsManager;

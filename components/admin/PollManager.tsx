
import React, { useState } from 'react';
import { Poll, PollOption } from '../../types';
import Modal from '../Modal';
import { XIcon } from '../icons/XIcon';
import EmptyState from '../EmptyState';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

interface PollManagerProps {
    polls: Poll[];
    addPoll: (poll: Omit<Poll, 'id' | 'createdAt'>) => void;
    updatePoll: (poll: Poll) => void;
    deletePoll: (id: number) => void;
    togglePollStatus: (id: number, isActive: boolean) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyPoll: Omit<Poll, 'id' | 'createdAt'> = { 
    question: '', 
    options: [{ id: 1, text: '', votes: 0 }, { id: 2, text: '', votes: 0 }], 
    isActive: false 
};

const PollResultBar: React.FC<{ text: string, percentage: number, votes: number }> = ({ text, percentage, votes }) => (
    <div>
        <div className="flex justify-between mb-1 text-sm">
            <span className="font-medium text-text-primary dark:text-dark-text-primary">{text}</span>
            <span className="text-text-secondary dark:text-dark-text-secondary">{votes} suara ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-primary dark:bg-dark-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const PollManager: React.FC<PollManagerProps> = ({ polls, addPoll, updatePoll, deletePoll, togglePollStatus, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoll, setEditingPoll] = useState<Omit<Poll, 'id' | 'createdAt'> | Poll | null>(null);
    const [deletingPoll, setDeletingPoll] = useState<Poll | null>(null);

    const openModalForNew = () => {
        setEditingPoll(emptyPoll);
        setIsModalOpen(true);
    };

    const openModalForEdit = (poll: Poll) => {
        setEditingPoll(poll);
        setIsModalOpen(true);
    };
    
    const handleOptionChange = (index: number, value: string) => {
        if (!editingPoll) return;
        const newOptions = [...editingPoll.options];
        newOptions[index].text = value;
        setEditingPoll({ ...editingPoll, options: newOptions });
    };

    const addOption = () => {
        if (!editingPoll) return;
        const newOption: PollOption = { id: Date.now(), text: '', votes: 0 };
        setEditingPoll({ ...editingPoll, options: [...editingPoll.options, newOption] });
    };

    const removeOption = (index: number) => {
        if (!editingPoll || editingPoll.options.length <= 2) {
            addToast("Polling harus memiliki minimal 2 pilihan.", "error");
            return;
        }
        const newOptions = editingPoll.options.filter((_, i) => i !== index);
        setEditingPoll({ ...editingPoll, options: newOptions });
    };

    const handleSave = () => {
        if (!editingPoll || !editingPoll.question.trim() || editingPoll.options.some(opt => !opt.text.trim())) {
            addToast('Pertanyaan dan semua pilihan harus diisi.', 'error');
            return;
        }
        
        if ('id' in editingPoll) {
            updatePoll(editingPoll);
        } else {
            addPoll(editingPoll);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (deletingPoll) {
            deletePoll(deletingPoll.id);
            setDeletingPoll(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPoll(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary dark:text-dark-primary">Manajemen Polling Cepat</h3>
                <button onClick={openModalForNew} className="bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-dark-primary-light transition-colors">
                    Buat Polling Baru
                </button>
            </div>
            
            {polls.length > 0 ? (
                <div className="space-y-6">
                    {polls.map(poll => {
                        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                        return (
                            <div key={poll.id} className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{poll.question}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${poll.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                            {poll.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModalForEdit(poll)} className="font-medium text-accent hover:text-accent-hover dark:text-cyan-400 dark:hover:text-cyan-300">Edit</button>
                                        <button onClick={() => setDeletingPoll(poll)} className="font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">Hapus</button>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3">
                                    {poll.options.map(option => (
                                        <PollResultBar 
                                            key={option.id} 
                                            text={option.text} 
                                            votes={option.votes}
                                            percentage={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0} 
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Total {totalVotes} suara</span>
                                    <button 
                                        onClick={() => togglePollStatus(poll.id, !poll.isActive)}
                                        className={`px-4 py-1.5 rounded-lg font-semibold text-sm ${poll.isActive ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                    >
                                        {poll.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                  icon={<ClipboardListIcon className="h-10 w-10" />}
                  title="Belum Ada Polling"
                  description="Buat polling pertama Anda untuk mulai mengumpulkan pendapat dari siswa."
                >
                    <button onClick={openModalForNew} className="bg-primary dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-cyan-500 transition-colors">
                        Buat Polling Baru
                    </button>
                </EmptyState>
            )}

            {isModalOpen && editingPoll && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingPoll ? 'Edit Polling' : 'Buat Polling Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">Pertanyaan Polling</label>
                            <input type="text" value={editingPoll.question} onChange={e => setEditingPoll(prev => ({...prev!, question: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-dark-primary sm:text-sm text-text-primary dark:text-dark-text-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">Pilihan Jawaban</label>
                            <div className="space-y-2 mt-1">
                                {editingPoll.options.map((option, index) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <input type="text" value={option.text} onChange={e => handleOptionChange(index, e.target.value)} className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm sm:text-sm text-text-primary dark:text-dark-text-primary" />
                                        <button onClick={() => removeOption(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                             <button onClick={addOption} className="mt-2 text-sm font-semibold text-primary dark:text-dark-primary hover:underline">
                                + Tambah Pilihan
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            {deletingPoll && (
                <Modal
                    isOpen={!!deletingPoll}
                    onClose={() => setDeletingPoll(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus polling <strong>"{deletingPoll.question}"</strong>? Semua data suara akan hilang.</p>
                </Modal>
            )}
        </div>
    );
};

export default PollManager;

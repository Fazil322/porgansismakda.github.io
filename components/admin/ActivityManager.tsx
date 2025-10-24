import React, { useState } from 'react';
import { Activity } from '../../types';
import Modal from '../Modal';

interface ActivityManagerProps {
    activities: Activity[];
    addActivity: (activity: Omit<Activity, 'id'>) => void;
    updateActivity: (activity: Activity) => void;
    deleteActivity: (id: number) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyActivity: Omit<Activity, 'id'> = { date: '', title: '', organizer: '' };

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary sm:text-sm text-text-primary dark:text-dark-text-primary" />
    </div>
);

const ActivityManager: React.FC<ActivityManagerProps> = ({ activities, addActivity, updateActivity, deleteActivity, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Omit<Activity, 'id'> | Activity | null>(null);
    const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

    const openModalForNew = () => {
        setEditingActivity(emptyActivity);
        setIsModalOpen(true);
    };

    const openModalForEdit = (activity: Activity) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!editingActivity || !editingActivity.title || !editingActivity.date || !editingActivity.organizer) {
             addToast('Semua field harus diisi.', 'error');
            return;
        }
        
        if ('id' in editingActivity) {
            updateActivity(editingActivity);
        } else {
            addActivity(editingActivity);
        }
        closeModal();
    };
    
    const handleDelete = () => {
        if (deletingActivity) {
            deleteActivity(deletingActivity.id);
            setDeletingActivity(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary dark:text-dark-primary">Manajemen Agenda Kegiatan</h3>
                <button onClick={openModalForNew} className="bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-dark-primary-light transition-colors">
                    Tambah Agenda
                </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                    <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3">Judul Kegiatan</th>
                            <th scope="col" className="px-6 py-3">Penyelenggara</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map(activity => (
                            <tr key={activity.id} className="bg-surface dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-primary dark:text-dark-primary">{activity.date}</td>
                                <td className="px-6 py-4 text-text-primary dark:text-dark-text-primary">{activity.title}</td>
                                <td className="px-6 py-4">{activity.organizer}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openModalForEdit(activity)} className="font-medium text-accent hover:text-accent-hover dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">Edit</button>
                                    <button onClick={() => setDeletingActivity(activity)} className="font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && editingActivity && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingActivity ? 'Edit Agenda' : 'Tambah Agenda Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <InputField label="Tanggal (e.g., 25 JUL)" value={editingActivity.date} onChange={value => setEditingActivity(prev => ({...prev!, date: value}))} />
                        <InputField label="Judul Kegiatan" value={editingActivity.title} onChange={value => setEditingActivity(prev => ({...prev!, title: value}))} />
                        <InputField label="Penyelenggara" value={editingActivity.organizer} onChange={value => setEditingActivity(prev => ({...prev!, organizer: value}))} />
                    </div>
                </Modal>
            )}
            {deletingActivity && (
                 <Modal
                    isOpen={!!deletingActivity}
                    onClose={() => setDeletingActivity(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus agenda <strong>{deletingActivity.title}</strong>? Tindakan ini tidak dapat diurungkan.</p>
                </Modal>
            )}
        </div>
    );
};

export default ActivityManager;
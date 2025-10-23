import React, { useState } from 'react';
import { Organization } from '../../types';
import Modal from '../Modal';
import ImageUploader from '../ImageUploader';

interface OrganizationManagerProps {
    organizations: Organization[];
    addOrganization: (org: Omit<Organization, 'id' | 'members'>) => void;
    updateOrganization: (org: Organization) => void;
    deleteOrganization: (id: number) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const emptyOrganization: Omit<Organization, 'id' | 'members'> = { name: '', imageUrl: '', description: '' };

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ organizations, addOrganization, updateOrganization, deleteOrganization, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Omit<Organization, 'id' | 'members'> | Organization | null>(null);
    const [deletingOrg, setDeletingOrg] = useState<Organization | null>(null);

    const openModalForNew = () => {
        setEditingOrg(emptyOrganization);
        setIsModalOpen(true);
    };

    const openModalForEdit = (org: Organization) => {
        setEditingOrg(org);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!editingOrg || !editingOrg.name || !editingOrg.description || !editingOrg.imageUrl) {
             addToast('Semua field termasuk logo harus diisi.', 'error');
            return;
        }
        
        if ('id' in editingOrg) {
            updateOrganization(editingOrg);
        } else {
            addOrganization(editingOrg);
        }
        closeModal();
    };

    const handleDelete = () => {
        if(deletingOrg) {
            deleteOrganization(deletingOrg.id);
            setDeletingOrg(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingOrg(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">Manajemen Direktori Organisasi</h3>
                <button onClick={openModalForNew} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light transition-colors">
                    Tambah Organisasi
                </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left text-secondary-dark">
                    <thead className="text-xs uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Logo</th>
                            <th scope="col" className="px-6 py-3">Nama Organisasi</th>
                            <th scope="col" className="px-6 py-3">Anggota</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.map(org => (
                            <tr key={org.id} className="bg-surface border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <img src={org.imageUrl} alt={org.name} className="h-10 w-10 rounded-full object-cover"/>
                                </td>
                                <td className="px-6 py-4 font-medium text-primary">{org.name}</td>
                                <td className="px-6 py-4">{org.members.length}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => openModalForEdit(org)} className="font-medium text-accent hover:text-accent-hover transition-colors">Edit</button>
                                    <button onClick={() => setDeletingOrg(org)} className="font-medium text-red-600 hover:text-red-700 transition-colors">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && editingOrg && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={handleSave}
                    title={'id' in editingOrg ? 'Edit Organisasi' : 'Tambah Organisasi Baru'}
                    confirmText="Simpan"
                >
                    <div className="space-y-4">
                        <ImageUploader 
                            label="Logo Organisasi"
                            onImageSelected={base64 => setEditingOrg(prev => ({ ...prev!, imageUrl: base64 }))}
                            currentImage={editingOrg.imageUrl}
                        />
                        <InputField label="Nama Organisasi" value={editingOrg.name} onChange={value => setEditingOrg(prev => ({...prev!, name: value}))} />
                        <TextAreaField label="Deskripsi" value={editingOrg.description} onChange={value => setEditingOrg(prev => ({...prev!, description: value}))} />
                    </div>
                </Modal>
            )}
            {deletingOrg && (
                <Modal
                    isOpen={!!deletingOrg}
                    onClose={() => setDeletingOrg(null)}
                    onConfirm={handleDelete}
                    title="Konfirmasi Hapus"
                    confirmText="Ya, Hapus"
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                >
                    <p>Apakah Anda yakin ingin menghapus organisasi <strong>{deletingOrg.name}</strong>? Tindakan ini tidak dapat diurungkan.</p>
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


export default OrganizationManager;

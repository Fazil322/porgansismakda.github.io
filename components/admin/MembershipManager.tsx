import React, { useState } from 'react';
import { Registration } from '../../types';
import Modal from '../Modal';
import EmptyState from '../EmptyState';

interface MembershipManagerProps {
    registrations: Registration[];
    onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const statusBadge = (status: Registration['status']) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
};

const MembershipManager: React.FC<MembershipManagerProps> = ({ registrations, onUpdateStatus, addToast }) => {
    const [action, setAction] = useState<{reg: Registration, type: 'approved' | 'rejected'} | null>(null);

    const handleConfirmAction = () => {
        if (action) {
            onUpdateStatus(action.reg.id, action.type);
            addToast(`Pendaftaran telah ${action.type === 'approved' ? 'disetujui' : 'ditolak'}.`, 'success');
            setAction(null);
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">Manajemen Pendaftaran Anggota</h3>
            {registrations.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="w-full text-sm text-left text-secondary-dark dark:text-slate-400">
                        <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nama Siswa</th>
                                <th scope="col" className="px-6 py-3">Kelas</th>
                                <th scope="col" className="px-6 py-3">Organisasi</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.id} className="bg-surface dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-primary dark:text-white">{reg.studentName}</td>
                                    <td className="px-6 py-4">{reg.studentClass}</td>
                                    <td className="px-6 py-4">{reg.organizationName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge(reg.status)}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {reg.status === 'pending' ? (
                                            <>
                                                <button onClick={() => setAction({reg, type: 'approved'})} className="font-medium text-green-600 hover:text-green-700">Setujui</button>
                                                <button onClick={() => setAction({reg, type: 'rejected'})} className="font-medium text-red-600 hover:text-red-700">Tolak</button>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 dark:text-slate-500">Ditindaklanjuti</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                 <EmptyState
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                  title="Tidak Ada Pendaftaran"
                  description="Saat ini tidak ada pendaftaran anggota baru yang masuk."
                />
            )}

            {action && (
                <Modal
                    isOpen={!!action}
                    onClose={() => setAction(null)}
                    onConfirm={handleConfirmAction}
                    title={`Konfirmasi Aksi`}
                    confirmText={`Ya, ${action.type === 'approved' ? 'Setujui' : 'Tolak'}`}
                    confirmButtonClass={action.type === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                    <p>Apakah Anda yakin ingin <strong>{action.type === 'approved' ? 'menyetujui' : 'menolak'}</strong> pendaftaran dari <strong>{action.reg.studentName}</strong> untuk organisasi <strong>{action.reg.organizationName}</strong>?</p>
                    {action.reg.reason && <div className="mt-4"><p className="font-semibold">Alasan pendaftar:</p><p className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 mt-1">{action.reg.reason}</p></div>}
                </Modal>
            )}
        </div>
    );
};

export default MembershipManager;

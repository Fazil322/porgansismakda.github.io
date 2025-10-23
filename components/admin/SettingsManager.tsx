import React, { useState } from 'react';

interface SettingsManagerProps {
    onUpdateCode: (newCode: string) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ onUpdateCode, addToast }) => {
    const [newCode, setNewCode] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = () => {
        setError('');

        if (!newCode || !confirmCode) {
            setError('Semua field harus diisi.');
            return;
        }
        if (newCode.length < 6) {
            setError('Kode baru minimal harus 6 karakter.');
            return;
        }
        if (newCode !== confirmCode) {
            setError('Kode baru dan konfirmasi tidak cocok.');
            return;
        }

        onUpdateCode(newCode);
        setNewCode('');
        setConfirmCode('');
        addToast('Kode akses berhasil diperbarui! Anda akan logout sebentar lagi.', 'success');
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-primary mb-6">Pengaturan</h3>
            <div className="max-w-md bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-primary mb-2">Ubah Kode Akses Admin</h4>
                <p className="text-sm text-secondary-dark mb-4">Gunakan kode yang kuat dan mudah diingat. Anda akan otomatis logout setelah mengubah kode.</p>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-secondary-dark">Kode Akses Baru</label>
                        <input 
                            type="password" 
                            value={newCode}
                            onChange={e => setNewCode(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-secondary-dark">Konfirmasi Kode Baru</label>
                        <input 
                            type="password" 
                            value={confirmCode}
                            onChange={e => setConfirmCode(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" 
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="text-right pt-2">
                        <button onClick={handleUpdate} className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-light transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
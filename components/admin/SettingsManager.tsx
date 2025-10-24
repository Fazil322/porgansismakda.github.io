import React, { useState, useMemo } from 'react';

interface SettingsManagerProps {
    onUpdateCode: (newCode: string) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
}

const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return { level: 0, text: '', color: 'bg-slate-200' };

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, text: 'Lemah', color: 'bg-red-500' };
    if (score <= 4) return { level: 2, text: 'Sedang', color: 'bg-yellow-500' };
    return { level: 3, text: 'Kuat', color: 'bg-green-500' };
};

const SettingsManager: React.FC<SettingsManagerProps> = ({ onUpdateCode, addToast }) => {
    const [newCode, setNewCode] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [error, setError] = useState('');
    
    const strength = useMemo(() => checkPasswordStrength(newCode), [newCode]);

    const handleUpdate = () => {
        setError('');

        if (!newCode || !confirmCode) {
            setError('Semua field harus diisi.');
            return;
        }
        if (strength.level < 2) {
            setError('Gunakan kode yang lebih kuat.');
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
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">Pengaturan</h3>
            <div className="max-w-md bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-primary dark:text-white mb-2">Ubah Kode Akses Admin</h4>
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">Gunakan kode yang kuat dan mudah diingat. Anda akan otomatis logout setelah mengubah kode.</p>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">Kode Akses Baru</label>
                        <input 
                            type="password" 
                            value={newCode}
                            onChange={e => setNewCode(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm" 
                        />
                        {newCode && (
                             <div className="mt-2">
                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${(strength.level / 3) * 100}%`}}></div>
                                </div>
                                <p className="text-xs text-right mt-1 font-semibold" style={{ color: strength.color.replace('bg-', 'text-')}}>{strength.text}</p>
                            </div>
                        )}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-slate-300">Konfirmasi Kode Baru</label>
                        <input 
                            type="password" 
                            value={confirmCode}
                            onChange={e => setConfirmCode(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-accent dark:focus:ring-cyan-400 focus:border-accent dark:focus:border-cyan-400 sm:text-sm" 
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="text-right pt-2">
                        <button onClick={handleUpdate} disabled={strength.level < 2} className="bg-primary dark:bg-cyan-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-light dark:hover:bg-cyan-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
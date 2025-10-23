import React, { useState } from 'react';
import { SchoolIcon } from '../components/icons/SchoolIcon';

interface AdminLoginProps {
    validateAdminCode: (code: string) => boolean;
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ validateAdminCode, onLoginSuccess }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (validateAdminCode(accessCode)) {
                onLoginSuccess();
            } else {
                setError('Kode akses salah. Silakan coba lagi.');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-surface p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
                    <div className="mx-auto bg-accent-light h-16 w-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Akses Panel Admin</h2>
                    <p className="text-secondary-dark mb-6">Halaman ini dilindungi dan hanya untuk administrator.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="access-code" className="sr-only">Kode Akses</label>
                            <input
                                id="access-code"
                                type="password"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="Masukkan Kode Akses"
                                disabled={isLoading}
                                className="w-full px-4 py-3 text-center border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading || !accessCode}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-light transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100 shadow-sm"
                        >
                            {isLoading ? 'Memverifikasi...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
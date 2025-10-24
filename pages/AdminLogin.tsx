import React, { useState, useEffect } from 'react';
import { SchoolIcon } from '../components/icons/SchoolIcon';

interface AdminLoginProps {
    validateAdminCode: (code: string) => boolean;
    onLoginSuccess: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_SECONDS = 30;

const AdminLogin: React.FC<AdminLoginProps> = ({ validateAdminCode, onLoginSuccess }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [lockoutTimer, setLockoutTimer] = useState(LOCKOUT_DURATION_SECONDS);

    useEffect(() => {
        // Fix: Use TypeScript's type inference for browser-compatible timer IDs and ensure both interval and timeout are cleared.
        if (isLockedOut) {
            const timer = setInterval(() => {
                setLockoutTimer(prev => prev - 1);
            }, 1000);

            const lockoutTimeout = setTimeout(() => {
                setIsLockedOut(false);
                setAttempts(0);
                setLockoutTimer(LOCKOUT_DURATION_SECONDS);
            }, LOCKOUT_DURATION_SECONDS * 1000);

            return () => {
                clearInterval(timer);
                clearTimeout(lockoutTimeout);
            };
        }
    }, [isLockedOut]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (validateAdminCode(accessCode)) {
                onLoginSuccess();
            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                if (newAttempts >= MAX_ATTEMPTS) {
                    setIsLockedOut(true);
                    setError(`Terlalu banyak percobaan. Coba lagi dalam ${LOCKOUT_DURATION_SECONDS} detik.`);
                } else {
                    setError(`Kode akses salah. Sisa percobaan: ${MAX_ATTEMPTS - newAttempts}.`);
                }
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-surface dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                        <div className="mx-auto bg-accent-light dark:bg-cyan-900/50 h-16 w-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-white dark:ring-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-hover dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Akses Panel Admin</h2>
                        <p className="text-text-secondary dark:text-slate-400 mb-6">Halaman ini dilindungi dan hanya untuk administrator.</p>
                        
                        {isLockedOut ? (
                            <div className="bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Akses Terkunci!</strong>
                                <span className="block sm:inline ml-1">Coba lagi dalam {lockoutTimer} detik.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="access-code" className="sr-only">Kode Akses</label>
                                    <input
                                        id="access-code"
                                        type="password"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        placeholder="Masukkan Kode Akses"
                                        disabled={isLoading || isLockedOut}
                                        className="w-full px-4 py-3 text-center border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary transition"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading || !accessCode || isLockedOut}
                                    className="w-full bg-primary dark:bg-cyan-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-light dark:hover:bg-cyan-500 transition-all transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {isLoading ? 'Memverifikasi...' : 'Login'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
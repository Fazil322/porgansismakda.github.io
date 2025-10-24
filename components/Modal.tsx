import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  confirmButtonClass?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm', cancelText = 'Cancel', isConfirming = false, confirmButtonClass = 'bg-primary dark:bg-cyan-600 hover:bg-primary-light dark:hover:bg-cyan-500' }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 dark:bg-opacity-80 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-surface dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary dark:text-white mb-4">{title}</h3>
          <div className="text-text-secondary dark:text-slate-300">
            {children}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} disabled={isConfirming} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={isConfirming} className={`px-4 py-2 text-white rounded-lg font-semibold disabled:bg-slate-400 dark:disabled:bg-slate-600 flex items-center justify-center min-w-[120px] transition-colors ${confirmButtonClass}`}>
            {isConfirming ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
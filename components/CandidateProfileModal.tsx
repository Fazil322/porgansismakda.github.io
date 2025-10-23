import React, { useEffect } from 'react';
import { Candidate } from '../types';

interface CandidateProfileModalProps {
  candidate: Candidate;
  onClose: () => void;
}

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ candidate, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-6">
                <img src={candidate.photoUrl} alt={candidate.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-accent-light shadow-md flex-shrink-0" />
                <div className="text-center sm:text-left mt-4 sm:mt-0">
                    <h2 className="text-3xl font-bold text-primary">{candidate.name}</h2>
                    <p className="text-secondary-dark mt-2">{candidate.bio || 'Bio singkat kandidat.'}</p>
                </div>
            </div>
            <div className="space-y-4 text-sm">
                <div>
                    <h3 className="font-bold text-primary tracking-wide uppercase">Visi</h3>
                    <p className="text-secondary-dark mt-1">{candidate.vision}</p>
                </div>
                 <div>
                    <h3 className="font-bold text-primary tracking-wide uppercase">Misi</h3>
                    <p className="text-secondary-dark mt-1 whitespace-pre-line">{candidate.mission}</p>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end items-center rounded-b-xl border-t border-slate-200">
          <button onClick={onClose} className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors">
            Tutup
          </button>
        </div>
      </div>
       <style jsx global>{`
          @keyframes fade-in-up {
              from {
                  opacity: 0;
                  transform: translateY(20px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default CandidateProfileModal;

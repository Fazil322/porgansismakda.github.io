

import React from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidateId: number) => void;
  onViewProfile: (candidate: Candidate) => void;
  isSelected: boolean;
  isVoted: boolean;
  isEventActive: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, onViewProfile, isSelected, isVoted, isEventActive }) => {
  const { name, photoUrl, vision, id } = candidate;
  
  const isDisabled = isVoted || !isEventActive;
  const buttonClasses = isSelected 
    ? "bg-primary text-white" 
    : "bg-slate-200 text-text-secondary group-hover:bg-primary/20 group-hover:text-primary-dark";
  const disabledClasses = "disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed";

  return (
    <div className={`bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md text-center group border-2 transition-all duration-300 ${isSelected ? 'border-primary shadow-lg scale-105' : 'border-slate-200 dark:border-slate-700 hover:shadow-lg'}`}>
        <div className="flex flex-col items-center">
            <div className="relative">
                <img src={photoUrl} alt={name} className="w-28 h-28 rounded-full mb-3 object-cover ring-4 ring-slate-200 dark:ring-slate-600 group-hover:ring-primary/30 transition-all" />
                <div className="absolute top-0 right-0 bg-primary text-white text-lg font-bold w-9 h-9 flex items-center justify-center rounded-full border-2 border-surface dark:border-dark-surface">
                    {id}
                </div>
            </div>
            <span className="font-bold text-xl text-text-primary dark:text-dark-text-primary mt-2">{name}</span>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2 h-16 line-clamp-3">"{vision}"</p>
        </div>
        <div className="mt-4 space-y-2">
            <button
                onClick={() => onViewProfile(candidate)}
                className="w-full text-primary dark:text-dark-primary font-semibold py-2 rounded-lg transition-colors duration-300 hover:bg-primary/10 dark:hover:bg-dark-primary/20"
            >
                Lihat Profil
            </button>
            <button 
                onClick={() => onVote(id)}
                disabled={isDisabled}
                className={`w-full font-bold py-2.5 rounded-lg transition-colors duration-300 text-lg ${buttonClasses} ${disabledClasses}`}
            >
                {isSelected ? 'Pilihan Anda' : 'Pilih'}
            </button>
        </div>
    </div>
  );
};

export default CandidateCard;
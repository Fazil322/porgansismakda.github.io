import React from 'react';
import { Organization } from '../types';

interface OrganizationCardProps {
    organization: Organization;
    onViewClick: (organization: Organization) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onViewClick }) => {
    const { name, imageUrl } = organization;

    return (
        <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-sm text-center group border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full mb-3 overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-accent transition-all">
                    <img src={imageUrl} alt={`${name} logo`} className="w-full h-full object-cover"/>
                </div>
                <span className="font-bold text-lg text-primary dark:text-dark-primary">{name}</span>
            </div>
            <button 
                onClick={() => onViewClick(organization)}
                className="mt-4 w-full bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary group-hover:bg-accent group-hover:text-white dark:group-hover:text-white font-semibold py-2 rounded-lg transition-colors duration-300"
            >
                Lihat Detail
            </button>
        </div>
    );
};

export default OrganizationCard;
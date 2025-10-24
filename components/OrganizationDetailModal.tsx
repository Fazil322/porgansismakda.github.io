import React, { useEffect } from 'react';
import { Organization, Activity, NewsItem } from '../types';

interface OrganizationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  organization: Organization;
  activities: Activity[];
  newsItems: NewsItem[];
}

const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({ isOpen, onClose, organization, activities, newsItems, onJoin }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const relevantActivities = activities.filter(a => a.organizer === organization.name).slice(0, 3);
  const relevantNews = newsItems.filter(n => n.organizationTag === organization.name).slice(0, 2);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
                 <div className="mx-auto bg-slate-100 dark:bg-slate-700 h-20 w-20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white dark:ring-dark-surface shadow-sm overflow-hidden">
                    <img src={organization.imageUrl} alt={`${organization.name} logo`} className="w-full h-full object-cover" />
                 </div>
                <h2 className="text-3xl font-bold text-primary dark:text-dark-primary">{organization.name}</h2>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-primary dark:text-dark-primary tracking-wide uppercase border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Deskripsi</h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary">{organization.description}</p>
                </div>

                <div>
                    <h3 className="font-bold text-primary dark:text-dark-primary tracking-wide uppercase border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Anggota Aktif ({organization.members.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {organization.members.map((member, index) => (
                            <span key={index} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium px-2.5 py-1 rounded-full">{member}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-primary dark:text-dark-primary tracking-wide uppercase border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Agenda Terdekat</h3>
                    {relevantActivities.length > 0 ? (
                        <ul className="space-y-3">
                        {relevantActivities.map(activity => (
                             <li key={activity.id} className="flex items-center space-x-4">
                                <div className="flex-shrink-0 text-center bg-accent-light p-2 rounded-lg w-14 border border-accent/20">
                                    <p className="text-accent-hover font-bold text-base leading-tight">{activity.date.split(' ')[0]}</p>
                                    <p className="text-accent-hover text-xs font-semibold uppercase">{activity.date.split(' ')[1]}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-primary dark:text-dark-primary text-sm">{activity.title}</p>
                                </div>
                            </li>
                        ))}
                        </ul>
                    ) : <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tidak ada agenda terdekat.</p>}
                </div>
                
                <div>
                    <h3 className="font-bold text-primary dark:text-dark-primary tracking-wide uppercase border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">Berita Terkait</h3>
                     {relevantNews.length > 0 ? (
                        <div className="space-y-4">
                            {relevantNews.map(item => (
                                <div key={item.id} className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <img src={item.imageUrl} alt={item.title} className="w-20 h-16 object-cover rounded-md flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-primary dark:text-dark-primary text-sm">{item.title}</h4>
                                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary line-clamp-2">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tidak ada berita terkait.</p>}
                </div>

            </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900/50 px-6 py-4 flex justify-between items-center rounded-b-xl border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            Tutup
          </button>
           <button onClick={onJoin} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold hover:bg-accent-hover transition-transform transform hover:scale-105 shadow-sm">
            Gabung Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailModal;
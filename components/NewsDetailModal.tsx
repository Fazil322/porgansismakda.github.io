
import React, { useEffect } from 'react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  newsItem: NewsItem;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ newsItem, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-56 object-cover rounded-lg mb-4" />
            <span className="text-xs bg-accent-light text-accent-hover font-semibold px-2.5 py-1 rounded-full">{newsItem.organizationTag}</span>
            <h2 className="text-3xl font-bold text-primary dark:text-dark-primary mt-3 mb-4">{newsItem.title}</h2>
            <div className="prose max-w-none text-text-secondary dark:text-dark-text-secondary whitespace-pre-line">
                <p>{newsItem.content}</p>
            </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end items-center rounded-b-xl border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
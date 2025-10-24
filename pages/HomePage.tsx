

import React, { useState, useEffect } from 'react';
import { Organization, Activity, NewsItem, VotingEvent, Document, Poll } from '../types';
import OrganizationCard from '../components/OrganizationCard';
import NewsDetailModal from '../components/NewsDetailModal';
import OrganizationDetailModal from '../components/OrganizationDetailModal';
import MembershipRegistrationModal from '../components/MembershipRegistrationModal';
import CallToActionBanner from '../components/CallToActionBanner';
import { Page } from '../App';
import Skeleton from '../components/ui/Skeleton';
import TabSelector from '../components/TabSelector';
import ActivityCalendar from '../components/ActivityCalendar';
import QuickPoll from '../components/QuickPoll';

interface HomePageProps {
  organizations: Organization[];
  activities: Activity[];
  newsItems: NewsItem[];
  documents: Document[];
  polls: Poll[];
  onRegister: (organization: Organization, data: { studentName: string; studentClass: string; reason: string; }) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  onAddAspiration: (text: string) => void;
  onPollVote: (pollId: number, optionId: number) => void;
  votingEvent: VotingEvent | null;
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ organizations, activities, newsItems, documents, polls, onRegister, addToast, onAddAspiration, onPollVote, votingEvent, setCurrentPage }) => {
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isRegistering, setIsRegistering] = useState<Organization | null>(null);
    const [aspirationText, setAspirationText] = useState('');
    const [isSubmittingAspiration, setIsSubmittingAspiration] = useState(false);
    const [activeTab, setActiveTab] = useState('Berita');
    
    useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    const handleViewOrg = (org: Organization) => setSelectedOrg(org);
    const handleCloseOrgDetail = () => setSelectedOrg(null);
    const handleJoinClick = () => {
        if(selectedOrg) {
            setIsRegistering(selectedOrg);
            setSelectedOrg(null);
        }
    }
    
    const handleRegistrationSubmit = (data: { studentName: string; studentClass: string; reason: string; }) => {
        if (isRegistering) {
            onRegister(isRegistering, data);
            setIsRegistering(null);
        }
    };

    const handleAspirationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aspirationText.trim()) return;
        setIsSubmittingAspiration(true);
        setTimeout(() => {
            onAddAspiration(aspirationText);
            setAspirationText('');
            setIsSubmittingAspiration(false);
        }, 500);
    };
    
    const activePoll = polls.find(p => p.isActive);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-16">
                <section className="text-center bg-surface dark:bg-dark-surface p-8 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:to-indigo-900/50 fade-in-up">
                    <h2 className="text-4xl font-extrabold text-primary dark:text-dark-primary mb-3">Selamat Datang di Portal Organisasi</h2>
                    <p className="max-w-3xl mx-auto text-lg text-text-secondary dark:text-dark-text-secondary">
                        Platform terpusat untuk semua kegiatan, informasi, dan aspirasi organisasi siswa di SMK LPPMRI 2 Kedungreja.
                    </p>
                </section>

                {votingEvent?.isActive && (
                    <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
                        <CallToActionBanner 
                            title={votingEvent.title}
                            description="Gunakan hak suaramu untuk masa depan organisasi yang lebih baik!"
                            buttonText="Beri Suara Sekarang"
                            onClick={() => setCurrentPage(Page.Voting)}
                        />
                    </div>
                )}

                <section className="fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6">Direktori Organisasi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                                    <Skeleton className="w-20 h-20 rounded-full mb-3" />
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))
                        ) : (
                            organizations.map(org => (
                                <OrganizationCard key={org.id} organization={org} onViewClick={handleViewOrg} />
                            ))
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <section className="lg:col-span-2 fade-in-up" style={{ animationDelay: '300ms' }}>
                        <TabSelector
                            tabs={['Berita', 'Agenda', 'Bank Dokumen']}
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                        <div className="bg-surface dark:bg-dark-surface p-4 sm:p-6 rounded-b-xl shadow-md border border-slate-200 dark:border-slate-700">
                             {loading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-start space-x-4">
                                            <Skeleton className="w-32 h-24 rounded-lg flex-shrink-0" />
                                            <div className="flex-grow space-y-2">
                                                <Skeleton className="h-4 w-1/4" />
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-5/6" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'Berita' && (
                                        <div className="space-y-4">
                                            {newsItems.map(item => (
                                                <div key={item.id} className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer" onClick={() => setSelectedNews(item)}>
                                                    <img src={item.imageUrl} alt={item.title} className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                                                    <div className="flex-grow">
                                                        <span className="text-xs bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary font-semibold px-2 py-1 rounded-full">{item.organizationTag}</span>
                                                        <h4 className="font-bold text-text-primary dark:text-dark-text-primary mt-2 text-lg">{item.title}</h4>
                                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2 mt-1">{item.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'Agenda' && <ActivityCalendar activities={activities} />}
                                    {activeTab === 'Bank Dokumen' && (
                                        <ul className="space-y-3">
                                            {documents.map(doc => (
                                                <li key={doc.id} className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <p className="font-bold text-text-primary dark:text-dark-text-primary">{doc.title}</p>
                                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{doc.organization} • {new Date(doc.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                    <aside className="space-y-8 fade-in-up" style={{ animationDelay: '400ms' }}>
                        {activePoll && (
                            <QuickPoll poll={activePoll} onVote={onPollVote} />
                        )}
                         <section className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-text-primary dark:text-dark-text-primary mb-3">Sampaikan Aspirasimu</h4>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">Punya ide atau masukan untuk sekolah? Sampaikan di sini secara anonim.</p>
                            <form onSubmit={handleAspirationSubmit}>
                                <textarea
                                  value={aspirationText}
                                  onChange={(e) => setAspirationText(e.target.value)}
                                  rows={4}
                                  placeholder="Ketik aspirasi Anda di sini..."
                                  className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary transition text-text-primary dark:text-dark-text-primary"
                                  disabled={isSubmittingAspiration}
                                />
                                <button
                                  type="submit"
                                  disabled={!aspirationText.trim() || isSubmittingAspiration}
                                  className="mt-3 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600"
                                >
                                  {isSubmittingAspiration ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </form>
                        </section>
                    </aside>
                </div>
                
                {selectedNews && <NewsDetailModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}
                {selectedOrg && <OrganizationDetailModal isOpen={!!selectedOrg} onClose={handleCloseOrgDetail} onJoin={handleJoinClick} organization={selectedOrg} activities={activities} newsItems={newsItems} />}
                {isRegistering && <MembershipRegistrationModal isOpen={!!isRegistering} onClose={() => setIsRegistering(null)} onSubmit={handleRegistrationSubmit} organization={isRegistering} />}

            </div>
        </div>
    );
};

export default HomePage;
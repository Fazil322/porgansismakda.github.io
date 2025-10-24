
import React, { useState } from 'react';
import { Organization, Activity, NewsItem, VotingEvent } from '../types';
import OrganizationCard from '../components/OrganizationCard';
import ActivityCalendar from '../components/ActivityCalendar';
import NewsDetailModal from '../components/NewsDetailModal';
import OrganizationDetailModal from '../components/OrganizationDetailModal';
import MembershipRegistrationModal from '../components/MembershipRegistrationModal';
import CallToActionBanner from '../components/CallToActionBanner';
import { Page } from '../App';

interface HomePageProps {
  organizations: Organization[];
  activities: Activity[];
  newsItems: NewsItem[];
  onRegister: (organization: Organization, data: { studentName: string; studentClass: string; reason: string; }) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  onAddAspiration: (text: string) => void;
  votingEvent: VotingEvent | null;
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ organizations, activities, newsItems, onRegister, addToast, onAddAspiration, votingEvent, setCurrentPage }) => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isRegistering, setIsRegistering] = useState<Organization | null>(null);
    const [aspirationText, setAspirationText] = useState('');
    const [isSubmittingAspiration, setIsSubmittingAspiration] = useState(false);

    const handleViewOrg = (org: Organization) => {
        setSelectedOrg(org);
    };

    const handleCloseOrgDetail = () => {
        setSelectedOrg(null);
    };

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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-12">
                <section className="text-center bg-surface p-8 rounded-2xl shadow-sm border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50">
                    <h2 className="text-4xl font-extrabold text-primary mb-3">Selamat Datang di Portal Organisasi</h2>
                    <p className="max-w-3xl mx-auto text-lg text-secondary-dark">
                        Platform terpusat untuk semua kegiatan, informasi, dan aspirasi organisasi siswa di SMK LPPMRI 2 Kedungreja.
                    </p>
                </section>

                {votingEvent?.isActive && (
                    <CallToActionBanner 
                        title={votingEvent.title}
                        description="Gunakan hak suaramu untuk masa depan organisasi yang lebih baik!"
                        buttonText="Beri Suara Sekarang"
                        onClick={() => setCurrentPage(Page.Voting)}
                    />
                )}

                <section>
                    <h3 className="text-2xl font-bold text-primary mb-6">Direktori Organisasi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {organizations.map(org => (
                            <OrganizationCard key={org.id} organization={org} onViewClick={handleViewOrg} />
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <section className="lg:col-span-3">
                        <h3 className="text-2xl font-bold text-primary mb-6">Sorotan Berita</h3>
                         <div className="space-y-4">
                            {newsItems.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 bg-surface p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setSelectedNews(item)}>
                                    <img src={item.imageUrl} alt={item.title} className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                                    <div className="flex-grow">
                                        <span className="text-xs bg-accent-light text-accent-hover font-semibold px-2 py-1 rounded-full">{item.organizationTag}</span>
                                        <h4 className="font-bold text-primary mt-2 text-lg">{item.title}</h4>
                                        <p className="text-sm text-secondary-dark line-clamp-2 mt-1">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <aside className="lg:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-6">Agenda Terdekat</h3>
                            <ActivityCalendar activities={activities} />
                        </section>
                         <section>
                            <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                                <h4 className="font-bold text-primary mb-3">Sampaikan Aspirasimu</h4>
                                <p className="text-sm text-secondary-dark mb-4">Punya ide atau masukan untuk sekolah? Sampaikan di sini secara anonim.</p>
                                <form onSubmit={handleAspirationSubmit}>
                                    <textarea
                                      value={aspirationText}
                                      onChange={(e) => setAspirationText(e.target.value)}
                                      rows={4}
                                      placeholder="Ketik aspirasi Anda di sini..."
                                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition"
                                      disabled={isSubmittingAspiration}
                                    />
                                    <button
                                      type="submit"
                                      disabled={!aspirationText.trim() || isSubmittingAspiration}
                                      className="mt-3 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-light transition-colors disabled:bg-slate-400"
                                    >
                                      {isSubmittingAspiration ? 'Mengirim...' : 'Kirim'}
                                    </button>
                                </form>
                            </div>
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

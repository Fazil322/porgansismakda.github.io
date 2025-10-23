
import React, { useState } from 'react';
import { Organization, Activity, NewsItem } from '../types';
import OrganizationCard from '../components/OrganizationCard';
import ActivityCalendar from '../components/ActivityCalendar';
import NewsDetailModal from '../components/NewsDetailModal';
import OrganizationDetailModal from '../components/OrganizationDetailModal';
import MembershipRegistrationModal from '../components/MembershipRegistrationModal';

interface HomePageProps {
  organizations: Organization[];
  activities: Activity[];
  newsItems: NewsItem[];
  onRegister: (organization: Organization, data: { studentName: string; studentClass: string; reason: string; }) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const HomePage: React.FC<HomePageProps> = ({ organizations, activities, newsItems, onRegister, addToast }) => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isRegistering, setIsRegistering] = useState<Organization | null>(null);

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


    return (
        <div className="space-y-12">
            <section className="text-center bg-surface p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-4xl font-extrabold text-primary mb-3">Selamat Datang di Portal Organisasi</h2>
                <p className="max-w-3xl mx-auto text-lg text-secondary-dark">
                    Platform terpusat untuk semua kegiatan, informasi, dan aspirasi organisasi siswa di SMK LPPMRI 2 Kedungreja.
                </p>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-primary mb-6">Direktori Organisasi</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {organizations.map(org => (
                        <OrganizationCard key={org.id} organization={org} onViewClick={handleViewOrg} />
                    ))}
                </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-primary mb-6">Sorotan Berita</h3>
                     <div className="space-y-4">
                        {newsItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 bg-surface p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setSelectedNews(item)}>
                                <img src={item.imageUrl} alt={item.title} className="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
                                <div>
                                    <span className="text-xs bg-accent-light text-accent-hover font-semibold px-2 py-1 rounded-full">{item.organizationTag}</span>
                                    <h4 className="font-bold text-primary mt-2 text-lg">{item.title}</h4>
                                    <p className="text-sm text-secondary-dark line-clamp-2">{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="text-2xl font-bold text-primary mb-6">Agenda Terdekat</h3>
                    <ActivityCalendar activities={activities} />
                </section>
            </div>
            
            {selectedNews && <NewsDetailModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}
            {selectedOrg && <OrganizationDetailModal isOpen={!!selectedOrg} onClose={handleCloseOrgDetail} onJoin={handleJoinClick} organization={selectedOrg} activities={activities} newsItems={newsItems} />}
            {isRegistering && <MembershipRegistrationModal isOpen={!!isRegistering} onClose={() => setIsRegistering(null)} onSubmit={handleRegistrationSubmit} organization={isRegistering} />}

        </div>
    );
};

export default HomePage;

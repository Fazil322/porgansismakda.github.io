
import React, { useState, useEffect } from 'react';
import { useMockVotingData } from '../hooks/useMockVotingData';
import AdminSidebar from '../components/admin/AdminSidebar';
import CandidateManager from '../components/admin/CandidateManager';
import TokenManager from '../components/admin/TokenManager';
import SettingsManager from '../components/admin/SettingsManager';
import { Candidate, NewsItem, Organization, Activity, Aspiration, Registration } from '../types';
import ActivityManager from '../components/admin/ActivityManager';
import NewsManager from '../components/admin/NewsManager';
import OrganizationManager from '../components/admin/OrganizationManager';
import DashboardHome from '../components/admin/DashboardHome';
import AspirationManager from '../components/admin/AspirationManager';
import MembershipManager from '../components/admin/MembershipManager';
import { MenuIcon } from '../components/icons/MenuIcon';

type AdminDashboardProps = {
    data: ReturnType<typeof useMockVotingData>;
    onLogout: () => void;
    onUpdateCode: (newCode: string) => void;
    addToast: (message: string, type: 'success' | 'error') => void;
    onCategorizeAspirations: () => Promise<void>;
    onUpdateRegistrationStatus: (id: number, status: 'approved' | 'rejected') => void;
};

export enum AdminPage {
    Dashboard,
    Candidates,
    Tokens,
    Organizations,
    Members,
    News,
    Activities,
    Aspirations,
    Settings
}

const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
    <div className="md:hidden bg-surface/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 p-4 flex items-center justify-between border-b border-slate-200">
        <h2 className="text-lg font-bold text-primary">Panel Admin</h2>
        <button onClick={onMenuClick} className="p-2 text-primary">
            <MenuIcon className="h-6 w-6" />
        </button>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onLogout, onUpdateCode, addToast, onCategorizeAspirations, onUpdateRegistrationStatus }) => {
    const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.Dashboard);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { votingEvent, setVotingEvent, votingTokens, setVotingTokens, organizations, setOrganizations, activities, setActivities, newsItems, setNewsItems, aspirations, setAspirations, voteHistory, registrations } = data;

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isSidebarOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    const handleSetPage = (page: AdminPage) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
    };

    const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>) => {
        setVotingEvent(prev => {
            if (!prev) return prev;
            const newCandidate: Candidate = { ...candidate, id: Date.now(), votes: 0, bio: candidate.bio || '' };
            return { ...prev, candidates: [...prev.candidates, newCandidate]};
        });
        addToast('Kandidat berhasil ditambahkan!', 'success');
    };

    const updateCandidate = (updatedCandidate: Candidate) => {
        setVotingEvent(prev => {
            if (!prev) return prev;
            return { ...prev, candidates: prev.candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c) };
        });
         addToast('Data kandidat berhasil diperbarui!', 'success');
    };

    const deleteCandidate = (id: number) => {
        setVotingEvent(prev => {
             if (!prev) return prev;
             return { ...prev, candidates: prev.candidates.filter(c => c.id !== id) };
        });
        addToast('Kandidat berhasil dihapus!', 'error');
    };
    
    const addActivity = (activity: Omit<Activity, 'id'>) => {
        setActivities(prev => [...prev, { ...activity, id: Date.now() }]);
        addToast('Agenda berhasil ditambahkan!', 'success');
    };

    const updateActivity = (updatedActivity: Activity) => {
        setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
        addToast('Agenda berhasil diperbarui!', 'success');
    };

    const deleteActivity = (id: number) => {
        setActivities(prev => prev.filter(a => a.id !== id));
        addToast('Agenda berhasil dihapus!', 'error');
    };
    
    const addNewsItem = (item: Omit<NewsItem, 'id'>) => {
        setNewsItems(prev => [{ ...item, id: Date.now() }, ...prev]);
        addToast('Berita berhasil ditambahkan!', 'success');
    };

    const updateNewsItem = (updatedItem: NewsItem) => {
        setNewsItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        addToast('Berita berhasil diperbarui!', 'success');
    };

    const deleteNewsItem = (id: number) => {
        setNewsItems(prev => prev.filter(item => item.id !== id));
        addToast('Berita berhasil dihapus!', 'error');
    };
    
    const addOrganization = (org: Omit<Organization, 'id' | 'members'>) => {
        setOrganizations(prev => [...prev, { ...org, id: Date.now(), members: [] }]);
        addToast('Organisasi berhasil ditambahkan!', 'success');
    };

    const updateOrganization = (updatedOrg: Organization) => {
        setOrganizations(prev => prev.map(o => o.id === updatedOrg.id ? updatedOrg : o));
        addToast('Data organisasi berhasil diperbarui!', 'success');
    };

    const deleteOrganization = (id: number) => {
        setOrganizations(prev => prev.filter(o => o.id !== id));
        addToast('Organisasi berhasil dihapus!', 'error');
    };

    const handleCategorize = async () => {
        setIsCategorizing(true);
        await onCategorizeAspirations();
        setIsCategorizing(false);
    };

    const renderContent = () => {
        if (!votingEvent) return <div>Loading...</div>;

        switch (currentPage) {
            case AdminPage.Dashboard:
                return <DashboardHome voteHistory={voteHistory} candidates={votingEvent.candidates} tokens={votingTokens} registrations={registrations} aspirations={aspirations} />;
            case AdminPage.Candidates:
                return <CandidateManager candidates={votingEvent.candidates} addCandidate={addCandidate} updateCandidate={updateCandidate} deleteCandidate={deleteCandidate} isEventActive={votingEvent.isActive} addToast={addToast} />;
            case AdminPage.Tokens:
                return <TokenManager tokens={votingTokens} setTokens={setVotingTokens} addToast={addToast} />;
            case AdminPage.Organizations:
                return <OrganizationManager organizations={organizations} addOrganization={addOrganization} updateOrganization={updateOrganization} deleteOrganization={deleteOrganization} addToast={addToast} />;
            case AdminPage.Members:
                return <MembershipManager registrations={registrations} onUpdateStatus={onUpdateRegistrationStatus} addToast={addToast} />;
            case AdminPage.News:
                 return <NewsManager newsItems={newsItems} addNewsItem={addNewsItem} updateNewsItem={updateNewsItem} deleteNewsItem={deleteNewsItem} addToast={addToast} />;
            case AdminPage.Activities:
                return <ActivityManager activities={activities} addActivity={addActivity} updateActivity={updateActivity} deleteActivity={deleteActivity} addToast={addToast} />;
            case AdminPage.Aspirations:
                return <AspirationManager aspirations={aspirations} onCategorize={handleCategorize} isCategorizing={isCategorizing} />;
            case AdminPage.Settings:
                return <SettingsManager onUpdateCode={onUpdateCode} addToast={addToast} />;
            default:
                return <div>Pilih menu dari sidebar</div>;
        }
    };

    return (
        <div className="flex h-full bg-slate-100">
             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
            <AdminSidebar 
                currentPage={currentPage} 
                setCurrentPage={handleSetPage} 
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <main className="flex-1 flex flex-col">
                <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <div className="bg-surface p-4 sm:p-8 rounded-2xl shadow-sm min-h-full">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

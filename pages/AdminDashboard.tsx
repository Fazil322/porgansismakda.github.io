
import React, { useState, useEffect } from 'react';
import { useMockVotingData } from '../hooks/useMockVotingData';
import AdminSidebar from '../components/admin/AdminSidebar';
import CandidateManager from '../components/admin/CandidateManager';
import TokenManager from '../components/admin/TokenManager';
import SettingsManager from '../components/admin/SettingsManager';
import { Candidate, NewsItem, Organization, Activity, Aspiration, Registration, Document, Poll, PollOption } from '../types';
import ActivityManager from '../components/admin/ActivityManager';
import NewsManager from '../components/admin/NewsManager';
import OrganizationManager from '../components/admin/OrganizationManager';
import DashboardHome from '../components/admin/DashboardHome';
import AspirationManager from '../components/admin/AspirationManager';
import MembershipManager from '../components/admin/MembershipManager';
import { MenuIcon } from '../components/icons/MenuIcon';
import DocumentManager from '../components/admin/DocumentManager';
import PollManager from '../components/admin/PollManager';

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
    Polls,
    Documents,
    Settings
}

const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
    <div className="md:hidden bg-surface/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-primary dark:text-white">Panel Admin</h2>
        <button onClick={onMenuClick} className="p-2 text-primary dark:text-white">
            <MenuIcon className="h-6 w-6" />
        </button>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onLogout, onUpdateCode, addToast, onCategorizeAspirations, onUpdateRegistrationStatus }) => {
    const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.Dashboard);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { 
        votingEvent, setVotingEvent, 
        votingTokens, setVotingTokens, 
        organizations, setOrganizations, 
        activities, setActivities, 
        newsItems, setNewsItems, 
        aspirations, setAspirations, 
        voteHistory, registrations,
        documents, setDocuments,
        polls, setPolls,
    } = data;

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

    // Candidate Handlers
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
    
    // Activity Handlers
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
    
    // NewsItem Handlers
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
    
    // Organization Handlers
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
    
    // Document Handlers
    const addDocument = (doc: Omit<Document, 'id'>) => {
        setDocuments(prev => [{ ...doc, id: Date.now() }, ...prev]);
        addToast('Dokumen berhasil ditambahkan!', 'success');
    };
    const updateDocument = (updatedDoc: Document) => {
        setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
        addToast('Dokumen berhasil diperbarui!', 'success');
    };
    const deleteDocument = (id: number) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
        addToast('Dokumen berhasil dihapus!', 'error');
    };

    // Poll Handlers
    const addPoll = (poll: Omit<Poll, 'id' | 'createdAt'>) => {
      const newPoll: Poll = { ...poll, id: Date.now(), createdAt: Date.now() };
      setPolls(prev => [newPoll, ...prev]);
      addToast('Polling berhasil dibuat!', 'success');
    };
    const updatePoll = (updatedPoll: Poll) => {
      setPolls(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p));
      addToast('Polling berhasil diperbarui!', 'success');
    };
    const deletePoll = (id: number) => {
      setPolls(prev => prev.filter(p => p.id !== id));
      addToast('Polling berhasil dihapus!', 'error');
    };
    const togglePollStatus = (id: number, isActive: boolean) => {
      setPolls(prev => prev.map(p => {
        if (p.id === id) return { ...p, isActive };
        // Deactivate all other polls if this one is being activated
        if (isActive) return { ...p, isActive: false };
        return p;
      }));
      addToast(`Polling telah ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`, 'success');
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
            case AdminPage.Polls:
                return <PollManager polls={polls} addPoll={addPoll} updatePoll={updatePoll} deletePoll={deletePoll} togglePollStatus={togglePollStatus} addToast={addToast} />;
            case AdminPage.Documents:
                return <DocumentManager documents={documents} addDocument={addDocument} updateDocument={updateDocument} deleteDocument={deleteDocument} addToast={addToast} />;
            case AdminPage.Settings:
                return <SettingsManager onUpdateCode={onUpdateCode} addToast={addToast} />;
            default:
                return <div>Pilih menu dari sidebar</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
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
                    <div className="bg-surface dark:bg-slate-800 p-4 sm:p-8 rounded-2xl shadow-sm min-h-full border border-slate-200 dark:border-slate-700">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

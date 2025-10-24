
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VotingPortal from './pages/VotingPortal';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { useMockVotingData } from './hooks/useMockVotingData';
import { Candidate, NewsItem, Organization, Registration, VotingToken, Aspiration, Document, Poll, PollOption } from './types';
import Toast from './components/Toast';
import { categorizeAspirations } from './services/geminiService';

export enum Page {
  Home,
  Voting,
  Admin,
  AdminLogin,
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAccessCode, setAdminAccessCode] = useState('ADMIN123'); // Default access code
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const mockData = useMockVotingData();

  useEffect(() => {
    // Simulate checking session storage for admin auth
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      setIsAdminAuthenticated(true);
      if (currentPage === Page.AdminLogin) {
        setCurrentPage(Page.Admin);
      }
    }
  }, [currentPage]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateAdminCode = (code: string): boolean => {
    return code === adminAccessCode;
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    setCurrentPage(Page.Admin);
    addToast('Login berhasil!', 'success');
  };
  
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    setCurrentPage(Page.Home);
    addToast('Anda telah logout.', 'success');
  };

  const handleUpdateAdminCode = (newCode: string) => {
    setAdminAccessCode(newCode);
    setTimeout(() => {
        handleLogout();
    }, 2000);
  };

  const handleVote = (candidateId: number, token: string) => {
    const usedToken = mockData.votingTokens.find(t => t.id === token);
    if (usedToken && usedToken.status === 'active') {
        mockData.setVotingEvent(prev => ({
            ...prev!,
            candidates: prev!.candidates.map(c => 
                c.id === candidateId ? {...c, votes: c.votes + 1} : c
            )
        }));
        mockData.setVotingTokens(prev => prev.map(t => 
            t.id === token ? {...t, status: 'used', usedAt: Date.now()} : t
        ));
         mockData.setVoteHistory(prev => [...prev, { id: token, candidateId, timestamp: Date.now() }]);
        addToast('Suara Anda berhasil direkam. Terima kasih!', 'success');
        return true;
    } else {
        addToast('Token tidak valid atau sudah digunakan.', 'error');
        return false;
    }
  };
  
  const handlePollVote = (pollId: number, optionId: number) => {
    mockData.setPolls(prevPolls => {
      return prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option =>
              option.id === optionId ? { ...option, votes: option.votes + 1 } : option
            ),
          };
        }
        return poll;
      });
    });

    try {
      const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}');
      votedPolls[pollId] = optionId;
      localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
    } catch (error) {
      console.error("Could not save poll vote to localStorage", error);
    }
    addToast('Pilihan Anda berhasil direkam!', 'success');
  };

  const handleCategorizeAspirations = async () => {
      const unreadAspirations = mockData.aspirations.filter(a => a.status === 'unread');
      if (unreadAspirations.length === 0) {
        addToast('Tidak ada aspirasi baru untuk dikategorikan.', 'success');
        return;
      }
      try {
          const categorizedAspirations = await categorizeAspirations(unreadAspirations);
          mockData.setAspirations(prev => {
              const categorizedIds = new Set(categorizedAspirations.map(c => c.id));
              const otherAspirations = prev.filter(a => !categorizedIds.has(a.id));
              return [...otherAspirations, ...categorizedAspirations];
          });
          addToast(`${categorizedAspirations.length} aspirasi berhasil dikategorikan oleh AI.`, 'success');
      } catch (error) {
          addToast('Gagal mengkategorikan aspirasi.', 'error');
      }
  };

  const handleAddRegistration = (data: { studentName: string; studentClass: string; reason: string; }, orgName: string) => {
        const newRegistration: Registration = {
            id: Date.now(),
            ...data,
            organizationName: orgName,
            status: 'pending',
            submittedAt: Date.now(),
        };
        mockData.setRegistrations(prev => [...prev, newRegistration]);
        addToast(`Pendaftaran untuk ${orgName} telah terkirim!`, 'success');
    };

    const handleUpdateRegistrationStatus = (id: number, status: 'approved' | 'rejected') => {
        const registration = mockData.registrations.find(r => r.id === id);
        if (!registration) return;

        mockData.setRegistrations(prev => prev.map(r => r.id === id ? {...r, status} : r));

        if (status === 'approved') {
            mockData.setOrganizations(prevOrgs => prevOrgs.map(org => {
                if (org.name === registration.organizationName) {
                    return { ...org, members: [...org.members, registration.studentName] };
                }
                return org;
            }));
        }
    };
    
    const handleAddAspiration = (text: string) => {
        const newAspiration: Aspiration = {
            id: Date.now(),
            text,
            status: 'unread',
            timestamp: Date.now(),
        };
        mockData.setAspirations(prev => [newAspiration, ...prev]);
        addToast('Aspirasi Anda telah terkirim. Terima kasih!', 'success');
    };


  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage 
                    organizations={mockData.organizations} 
                    activities={mockData.activities} 
                    newsItems={mockData.newsItems}
                    documents={mockData.documents}
                    polls={mockData.polls}
                    onRegister={(org: Organization, data) => handleAddRegistration(data, org.name)}
                    addToast={addToast}
                    onAddAspiration={handleAddAspiration}
                    onPollVote={handlePollVote}
                    votingEvent={mockData.votingEvent}
                    setCurrentPage={setCurrentPage}
                />;
      case Page.Voting:
        return mockData.votingEvent ? (
          <VotingPortal 
            votingEvent={mockData.votingEvent} 
            tokens={mockData.votingTokens}
            onVote={handleVote} 
          />
        ) : <p>Loading event...</p>;
      case Page.Admin:
        return isAdminAuthenticated ? (
            <AdminDashboard 
                data={mockData}
                onLogout={handleLogout}
                onUpdateCode={handleUpdateAdminCode}
                addToast={addToast}
                onCategorizeAspirations={handleCategorizeAspirations}
                onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
            />
        ) : <AdminLogin validateAdminCode={validateAdminCode} onLoginSuccess={handleLoginSuccess} />;
      case Page.AdminLogin:
         return <AdminLogin validateAdminCode={validateAdminCode} onLoginSuccess={handleLoginSuccess} />;
      default:
        return <HomePage 
                    organizations={mockData.organizations} 
                    activities={mockData.activities} 
                    newsItems={mockData.newsItems}
                    documents={mockData.documents}
                    polls={mockData.polls}
                    onRegister={(org: Organization, data) => handleAddRegistration(data, org.name)}
                    addToast={addToast}
                    onAddAspiration={handleAddAspiration}
                    onPollVote={handlePollVote}
                    votingEvent={mockData.votingEvent}
                    setCurrentPage={setCurrentPage}
                />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-dark-background font-sans text-text-secondary dark:text-dark-text-secondary">
      <Header 
        setCurrentPage={setCurrentPage} 
        votingEvent={mockData.votingEvent} 
        isAdminAuthenticated={isAdminAuthenticated} 
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
       <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
}

export default App;

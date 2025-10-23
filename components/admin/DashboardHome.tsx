import React from 'react';
import { VoteRecord, Candidate, VotingToken, Registration, Aspiration } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import ResultChart from '../ResultChart';
import RecentActivityFeed from './RecentActivityFeed';
import VoteTrendChart from './VoteTrendChart';

interface DashboardHomeProps {
  voteHistory: VoteRecord[];
  candidates: Candidate[];
  tokens: VotingToken[];
  registrations: Registration[];
  aspirations: Aspiration[];
}

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode, description?: string }> = ({ title, value, icon, description }) => (
    <Card>
        <CardContent className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-secondary-dark">{title}</p>
                <p className="text-3xl font-bold text-primary">{value}</p>
                {description && <p className="text-xs text-secondary-dark">{description}</p>}
            </div>
            <div className="bg-accent-light p-4 rounded-full text-accent">
                {icon}
            </div>
        </CardContent>
    </Card>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ voteHistory, candidates, tokens, registrations, aspirations }) => {
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pendingRegistrations = registrations.filter(r => r.status === 'pending').length;
    const unreadAspirations = aspirations.filter(a => a.status === 'unread').length;
    const usedTokens = tokens.filter(t => t.status === 'used').length;
    const tokenUsage = tokens.length > 0 ? `${Math.round((usedTokens / tokens.length) * 100)}%` : '0%';

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-primary">Dashboard Utama</h2>
                <p className="text-secondary-dark mt-1">Selamat datang kembali! Berikut adalah ringkasan aktivitas portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Suara Masuk" 
                    value={totalVotes}
                    icon={<VoteIcon />}
                 />
                 <StatCard 
                    title="Penggunaan Token" 
                    value={tokenUsage}
                    description={`${usedTokens} / ${tokens.length} terpakai`}
                    icon={<TokenIcon />}
                 />
                 <StatCard 
                    title="Pendaftaran Baru" 
                    value={pendingRegistrations}
                    description="Menunggu persetujuan"
                    icon={<UserAddIcon />}
                 />
                 <StatCard 
                    title="Aspirasi Baru" 
                    value={unreadAspirations}
                    description="Belum dibaca"
                    icon={<ChatIcon />}
                 />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Perolehan Suara Kandidat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResultChart data={candidates} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentActivityFeed 
                            voteHistory={voteHistory}
                            registrations={registrations}
                            aspirations={aspirations}
                            candidates={candidates}
                        />
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Tren Suara Masuk (per Jam)</CardTitle>
                </CardHeader>
                <CardContent>
                    <VoteTrendChart voteHistory={voteHistory} candidates={candidates} />
                </CardContent>
            </Card>
        </div>
    );
};

// Icons needed for StatCards
const VoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TokenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h7z" /></svg>;
const UserAddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

export default DashboardHome;
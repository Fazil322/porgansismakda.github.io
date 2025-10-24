
import React from 'react';
import { VoteRecord, Registration, Aspiration, Candidate } from '../../types';

interface RecentActivityFeedProps {
  voteHistory: VoteRecord[];
  registrations: Registration[];
  aspirations: Aspiration[];
  candidates: Candidate[];
}

const ActivityItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode; time: string }> = ({ icon, children, time }) => (
    <li className="flex items-start space-x-4 py-3">
        <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-full h-10 w-10 flex items-center justify-center text-slate-500 dark:text-slate-300">{icon}</div>
        <div className="flex-1">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">{children}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{time}</div>
        </div>
    </li>
);

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ voteHistory, registrations, aspirations, candidates }) => {
    const combinedActivities = [
        ...voteHistory.map(v => ({ type: 'vote', data: v, timestamp: v.timestamp })),
        ...registrations.filter(r => r.status === 'pending').map(r => ({ type: 'registration', data: r, timestamp: r.submittedAt })),
        ...aspirations.filter(a => a.status === 'unread').map(a => ({ type: 'aspiration', data: a, timestamp: a.timestamp })),
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5); // get latest 5 activities

    const timeSince = (date: number) => {
        const seconds = Math.floor((new Date().getTime() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    };
    
    const getCandidateName = (id: number) => candidates.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div>
            <h3 className="text-lg font-bold text-primary dark:text-dark-primary mb-4">Aktivitas Terbaru</h3>
            {combinedActivities.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {combinedActivities.map((activity, index) => {
                         switch (activity.type) {
                            case 'vote':
                                return <ActivityItem key={index} time={timeSince(activity.timestamp)} icon={<VoteIcon />}>Suara baru masuk untuk <strong>{getCandidateName((activity.data as VoteRecord).candidateId)}</strong>.</ActivityItem>
                            case 'registration':
                                return <ActivityItem key={index} time={timeSince(activity.timestamp)} icon={<UserAddIcon />}><strong>{(activity.data as Registration).studentName}</strong> mendaftar ke <strong>{(activity.data as Registration).organizationName}</strong>.</ActivityItem>
                            case 'aspiration':
                                return <ActivityItem key={index} time={timeSince(activity.timestamp)} icon={<ChatIcon />}>Aspirasi baru diterima: "{(activity.data as Aspiration).text.substring(0, 30)}..."</ActivityItem>
                            default:
                                return null;
                         }
                    })}
                </ul>
            ) : (
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tidak ada aktivitas terbaru.</p>
            )}
        </div>
    );
};

// Icons
const VoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserAddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

export default RecentActivityFeed;
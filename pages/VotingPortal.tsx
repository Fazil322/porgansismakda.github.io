
import React, { useState } from 'react';
import { VotingEvent, Candidate, VotingToken } from '../types';
import CandidateCard from '../components/CandidateCard';
import TokenInput from '../components/TokenInput';
import Modal from '../components/Modal';
import ResultChart from '../components/ResultChart';
import CountdownTimer from '../components/CountdownTimer';
import CandidateProfileModal from '../components/CandidateProfileModal';
import ResultPieChart from '../components/ResultPieChart';

interface VotingPortalProps {
  votingEvent: VotingEvent;
  tokens: VotingToken[];
  onVote: (candidateId: number, token: string) => boolean;
}

const VotingPortal: React.FC<VotingPortalProps> = ({ votingEvent, tokens, onVote }) => {
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [votingToken, setVotingToken] = useState('');
    const [error, setError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isVoted, setIsVoted] = useState(false);
    const [viewingProfile, setViewingProfile] = useState<Candidate | null>(null);

    const handleSelectCandidate = (id: number) => {
        if (!isVoted) {
            setSelectedCandidateId(id);
        }
    };

    const handleConfirmVote = () => {
        setError('');
        if (!selectedCandidateId) {
            setError('Silakan pilih salah satu kandidat.');
            return;
        }
        if (votingToken.length !== 6) {
            setError('Token harus terdiri dari 6 karakter.');
            return;
        }
        setIsConfirming(true);
    };
    
    const executeVote = () => {
        if (!selectedCandidateId || !votingToken) return;
        
        const success = onVote(selectedCandidateId, votingToken.toUpperCase());
        if(success) {
            setIsVoted(true);
        }
        setIsConfirming(false);
        setVotingToken('');
        setSelectedCandidateId(null);
    };
    
    const totalVotes = votingEvent.candidates.reduce((sum, c) => sum + c.votes, 0);

    return (
        <div className="space-y-12">
            <section className="text-center">
                <h1 className="text-4xl font-extrabold text-primary">{votingEvent.title}</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-secondary-dark">{votingEvent.description}</p>
            </section>
            
            {votingEvent.isActive && !isVoted && (
                 <div className="max-w-md mx-auto bg-primary/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
                    <CountdownTimer endDate={votingEvent.endDate} />
                </div>
            )}
            
            {!isVoted ? (
                <>
                <section>
                    <h2 className="text-2xl font-bold text-primary mb-6 text-center">Kandidat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {votingEvent.candidates.map(candidate => (
                            <CandidateCard 
                                key={candidate.id} 
                                candidate={candidate} 
                                onVote={handleSelectCandidate} 
                                onViewProfile={setViewingProfile}
                                isSelected={selectedCandidateId === candidate.id}
                                isVoted={isVoted}
                                isEventActive={votingEvent.isActive}
                            />
                        ))}
                    </div>
                </section>
                
                {votingEvent.isActive && (
                    <section className="max-w-xl mx-auto bg-surface p-8 rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-primary">Masukkan Token Anda</h2>
                            <p className="text-secondary-dark mt-2 mb-6">Gunakan token unik yang telah diberikan untuk memberikan suara Anda.</p>
                            <TokenInput value={votingToken} onChange={setVotingToken} disabled={isVoted} />
                            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                            <button 
                                onClick={handleConfirmVote}
                                disabled={!selectedCandidateId || votingToken.length < 6 || isVoted}
                                className="mt-8 w-full max-w-xs bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-light transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100 shadow-sm"
                            >
                                Konfirmasi Pilihan
                            </button>
                        </div>
                    </section>
                )}
                </>
            ) : (
                <div className="text-center bg-green-50 p-8 rounded-2xl border border-green-200">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="mt-4 text-2xl font-bold text-green-800">Terima Kasih!</h2>
                    <p className="mt-2 text-green-700">Suara Anda telah berhasil direkam. Partisipasi Anda sangat berarti.</p>
                </div>
            )}

            <section>
                 <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">Hasil Real-time</h2>
                    <p className="text-secondary-dark mt-2">Total {totalVotes} suara telah masuk.</p>
                </div>
                 <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="bg-surface p-6 rounded-xl shadow-lg border border-slate-200">
                        <ResultChart data={votingEvent.candidates} />
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-lg border border-slate-200">
                        <ResultPieChart data={votingEvent.candidates} />
                    </div>
                </div>
            </section>

            {isConfirming && selectedCandidateId && (
                <Modal
                    isOpen={isConfirming}
                    onClose={() => setIsConfirming(false)}
                    onConfirm={executeVote}
                    title="Konfirmasi Pilihan Anda"
                    confirmText="Ya, Saya Yakin"
                >
                    <p>Anda akan memberikan suara untuk kandidat <strong>{votingEvent.candidates.find(c => c.id === selectedCandidateId)?.name}</strong>. Tindakan ini tidak dapat diubah setelah dikonfirmasi.</p>
                </Modal>
            )}
            {viewingProfile && <CandidateProfileModal candidate={viewingProfile} onClose={() => setViewingProfile(null)} />}
        </div>
    );
};

export default VotingPortal;


import React, { useState, useEffect } from 'react';
import { Poll } from '../types';

interface QuickPollProps {
  poll: Poll;
  onVote: (pollId: number, optionId: number) => void;
}

const PollResultBar: React.FC<{ text: string, percentage: number, isVoted: boolean }> = ({ text, percentage, isVoted }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${isVoted ? 'text-primary dark:text-dark-primary' : 'text-text-primary dark:text-dark-text-primary'}`}>{text}</span>
            <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-primary dark:bg-dark-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);


const QuickPoll: React.FC<QuickPollProps> = ({ poll, onVote }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [voted, setVoted] = useState<number | null>(null);

    useEffect(() => {
        try {
            const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}');
            if (votedPolls[poll.id]) {
                setVoted(votedPolls[poll.id]);
            }
        } catch (error) {
            console.error("Could not parse votedPolls from localStorage", error);
        }
    }, [poll.id]);
    
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    const handleVote = () => {
        if (selectedOption !== null) {
            onVote(poll.id, selectedOption);
            setVoted(selectedOption);
        }
    };

    return (
        <section className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-text-primary dark:text-dark-text-primary mb-1">Polling Cepat</h4>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">{poll.question}</p>
            
            <div className="space-y-3">
                {voted !== null ? (
                    poll.options.map(option => (
                        <PollResultBar
                            key={option.id}
                            text={option.text}
                            percentage={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}
                            isVoted={option.id === voted}
                        />
                    ))
                ) : (
                    poll.options.map(option => (
                        <label key={option.id} className="flex items-center p-3 rounded-lg border border-slate-300 dark:border-slate-600 has-[:checked]:bg-primary/10 has-[:checked]:border-primary dark:has-[:checked]:border-dark-primary dark:has-[:checked]:bg-dark-primary/20 transition-colors cursor-pointer">
                            <input
                                type="radio"
                                name={`poll-${poll.id}`}
                                value={option.id}
                                checked={selectedOption === option.id}
                                onChange={() => setSelectedOption(option.id)}
                                className="h-4 w-4 text-primary dark:text-dark-primary focus:ring-primary dark:focus:ring-dark-primary border-slate-400 dark:border-slate-500 bg-transparent"
                            />
                            <span className="ml-3 text-sm font-medium text-text-primary dark:text-dark-text-primary">{option.text}</span>
                        </label>
                    ))
                )}
            </div>
            
            {voted === null && (
                 <button
                    onClick={handleVote}
                    disabled={selectedOption === null}
                    className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    Kirim Pilihan
                </button>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3">Total {totalVotes} suara</p>
        </section>
    );
};

export default QuickPoll;

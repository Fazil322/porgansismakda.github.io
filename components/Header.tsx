import React from 'react';
import { Page } from '../App';
import { SchoolIcon } from './icons/SchoolIcon';
import { VotingEvent } from '../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  votingEvent: VotingEvent | null;
  isAdminAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, votingEvent, isAdminAuthenticated }) => {
  const handleLogoClick = () => {
    setCurrentPage(Page.Home);
  };


  return (
    <header className="bg-surface/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
          <SchoolIcon className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-primary">Portal Organisasi</h1>
            <p className="text-xs text-secondary">SMK LPPMRI 2 KEDUNGREJA</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentPage(Page.Home)} className="text-secondary-dark hover:text-accent font-medium transition-colors">Beranda</button>
          {votingEvent?.isActive && (
            <button onClick={() => setCurrentPage(Page.Voting)} className="relative text-secondary-dark hover:text-accent font-medium transition-colors">
              E-Voting
              <span className="absolute top-0 right-[-12px] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </button>
          )}
        </nav>
        <div className="md:hidden flex items-center space-x-2">
            {votingEvent?.isActive && (
              <button onClick={() => setCurrentPage(Page.Voting)} className="relative text-secondary-dark p-2 text-sm font-semibold">
                  E-Voting
                   <span className="absolute top-1 right-0 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
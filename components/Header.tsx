import React from 'react';
import { Page } from '../App';
import { SchoolIcon } from './icons/SchoolIcon';
import { VotingEvent } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  votingEvent: VotingEvent | null;
  isAdminAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, votingEvent, isAdminAuthenticated }) => {
  const { theme, toggleTheme } = useTheme();
  
  const handleLogoClick = () => {
    setCurrentPage(Page.Home);
  };

  const handleAdminAccessClick = () => {
    setCurrentPage(Page.AdminLogin);
  };

  return (
    <header className="bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="cursor-pointer" onClick={handleLogoClick}>
            <SchoolIcon className="h-10 w-10 text-primary dark:text-dark-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary dark:text-dark-primary cursor-pointer" onClick={handleLogoClick}>Portal Organisasi</h1>
            <p className="text-xs text-secondary dark:text-dark-text-secondary cursor-pointer" onClick={handleAdminAccessClick}>SMK LPPMRI 2 KEDUNGREJA</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => setCurrentPage(Page.Home)} className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary font-medium transition-colors">Beranda</button>
          {votingEvent?.isActive && (
            <button onClick={() => setCurrentPage(Page.Voting)} className="relative text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary font-medium transition-colors">
              E-Voting
              <span className="absolute top-0 right-[-12px] flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </button>
          )}
        </nav>
        <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
             <div className="md:hidden flex items-center">
                {votingEvent?.isActive && (
                  <button onClick={() => setCurrentPage(Page.Voting)} className="relative text-text-secondary dark:text-dark-text-secondary p-2 text-sm font-semibold">
                      E-Voting
                       <span className="absolute top-1 right-0 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                  </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
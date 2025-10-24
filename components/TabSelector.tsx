

import React from 'react';

interface TabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`${
              activeTab === tab
                ? 'border-accent dark:border-indigo-400 text-accent dark:text-indigo-400'
                : 'border-transparent text-secondary-dark dark:text-slate-400 hover:text-primary dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabSelector;
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, children }) => {
  return (
    <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
      <div className="mx-auto bg-accent-light dark:bg-cyan-900/50 h-16 w-16 rounded-full flex items-center justify-center text-accent-hover dark:text-cyan-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-primary dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-secondary-dark dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default EmptyState;

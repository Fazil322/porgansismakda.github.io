import React from 'react';
import { Activity } from '../types';

interface ActivityCalendarProps {
    activities: Activity[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activities }) => {
    return (
        <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
            <ul className="space-y-5">
                {activities.map(activity => (
                    <li key={activity.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 text-center bg-accent-light dark:bg-teal-900/50 p-2.5 rounded-lg w-16 border border-accent/20 dark:border-teal-500/30">
                            <p className="text-accent-hover dark:text-teal-400 font-bold text-lg leading-tight">{activity.date.split(' ')[0]}</p>
                            <p className="text-accent-hover dark:text-teal-400 text-xs font-semibold uppercase">{activity.date.split(' ')[1]}</p>
                        </div>
                        <div>
                            <p className="font-bold text-primary dark:text-dark-primary">{activity.title}</p>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{activity.organizer}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityCalendar;
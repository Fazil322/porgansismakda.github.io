import React from 'react';
import { Activity } from '../types';

interface ActivityCalendarProps {
    activities: Activity[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activities }) => {
    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <ul className="space-y-5">
                {activities.map(activity => (
                    <li key={activity.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 text-center bg-accent-light p-2.5 rounded-lg w-16 border border-accent/20">
                            <p className="text-accent-hover font-bold text-lg leading-tight">{activity.date.split(' ')[0]}</p>
                            <p className="text-accent-hover text-xs font-semibold uppercase">{activity.date.split(' ')[1]}</p>
                        </div>
                        <div>
                            <p className="font-bold text-primary">{activity.title}</p>
                            <p className="text-sm text-secondary-dark">{activity.organizer}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityCalendar;
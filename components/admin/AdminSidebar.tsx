
import React from 'react';
import { AdminPage } from '../../pages/AdminDashboard';

interface AdminSidebarProps {
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
  const navItems = [
    { page: AdminPage.Dashboard, label: 'Dashboard', icon: ChartBarIcon },
    { page: AdminPage.Candidates, label: 'Kandidat', icon: UsersIcon },
    { page: AdminPage.Tokens, label: 'Token', icon: DocumentTextIcon },
    { page: AdminPage.Aspirations, label: 'Aspirasi', icon: ChatBubbleBottomCenterTextIcon },
    { page: AdminPage.Organizations, label: 'Organisasi', icon: UserGroupIcon },
    { page: AdminPage.Members, label: 'Pendaftaran', icon: UserPlusIcon},
    { page: AdminPage.News, label: 'Berita', icon: NewspaperIcon },
    { page: AdminPage.Activities, label: 'Agenda', icon: CalendarIcon },
    { page: AdminPage.Settings, label: 'Pengaturan', icon: CogIcon },
  ];

  return (
    <aside className="w-64 bg-primary-dark text-slate-300 flex flex-col flex-shrink-0">
      <div className="p-6 text-center border-b border-primary">
        <h2 className="text-xl font-bold text-white">Panel Admin</h2>
        <p className="text-xs text-slate-400">Portal Organisasi</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              currentPage === item.page
                ? 'bg-accent text-white shadow-inner'
                : 'hover:bg-primary hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-primary">
        <button onClick={onLogout} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-red-300 hover:bg-red-600 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" />;

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></Icon>;
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></Icon>;
const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25v8.25A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" /></Icon>;
const CogIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l-1.41-.513M5.106 17.785l1.153-.96m13.292-12.069l-1.153-.96M5.106 6.215l1.153.96m13.292 12.069l-1.153.96" /></Icon>;
const NewspaperIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M12 7.5V4.5m0 3V4.5m0 3h-3m3 0h-3m-3.375 0H7.5m0-3h3.375c.621 0 1.125-.504 1.125-1.125V4.5A2.25 2.25 0 008.625 2.25H6.375A2.25 2.25 0 004.125 4.5v13.5A2.25 2.25 0 006.375 20.25h9.25" /></Icon>;
const ChatBubbleBottomCenterTextIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></Icon>;
const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></Icon>;
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h.008v.008H-4.5V12z" /></Icon>;
const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></Icon>;


export default AdminSidebar;
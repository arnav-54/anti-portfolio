import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Cpu, MessageSquare, LogOut, Globe, Briefcase, User } from 'lucide-react';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const links = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/admin/skills', icon: Cpu, label: 'Skills' },
        { path: '/admin/experience', icon: Briefcase, label: 'Experience' },
        { path: '/admin/profile', icon: User, label: 'Profile & Resume' },
        { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    ];

    return (
        <div className="flex h-screen bg-darker text-slate-200 font-sans admin-layout">
            {/* Sidebar */}
            <aside className="w-64 bg-dark border-r border-white/10 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                        ADMIN
                    </h1>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <link.icon size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10 space-y-2">
                    <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Globe size={20} />
                        <span>View Site</span>
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-grow overflow-y-auto p-8 bg-darker text-slate-200">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

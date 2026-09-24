import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FolderKanban,
    Cpu,
    MessageSquare,
    LogOut,
    ExternalLink,
    Briefcase,
    User,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

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

    const NavContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                        <Shield size={18} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-wider">ADMIN PANEL</h1>
                        <p className="text-[11px] text-slate-500 font-medium">Portfolio Management</p>
                    </div>
                </Link>
                {mobileOpen && (
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Links */}
            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
                    Menu
                </div>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                            }`
                        }
                    >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800/80 space-y-1.5">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/60 text-sm font-medium"
                >
                    <span className="flex items-center gap-2.5">
                        <ExternalLink size={16} />
                        <span>View Live Site</span>
                    </span>
                    <span className="text-xs text-slate-500">↗</span>
                </a>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 font-sans admin-layout overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800/80 flex-col shrink-0">
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800/80 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Shield size={16} />
                    </div>
                    <span className="font-bold text-white text-sm">ADMIN PANEL</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 md:hidden flex">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-72 max-w-full bg-slate-900 h-full shadow-2xl z-10 flex flex-col"
                        >
                            <NavContent />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950 text-slate-200">
                <div className="max-w-6xl mx-auto pb-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

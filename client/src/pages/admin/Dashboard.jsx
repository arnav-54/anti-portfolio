import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    FolderKanban,
    MessageSquare,
    Cpu,
    Briefcase,
    ArrowRight,
    User,
    PlusCircle,
    CheckCircle,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({ projects: 0, messages: 0, unreadMessages: 0, skills: 0, experience: 0 });
    const [recentMessages, setRecentMessages] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [p, m, s, e] = await Promise.all([
                    axios.get('/projects').catch(() => ({ data: [] })),
                    axios.get('/messages').catch(() => ({ data: [] })),
                    axios.get('/skills').catch(() => ({ data: [] })),
                    axios.get('/experience').catch(() => ({ data: [] }))
                ]);

                const unread = m.data.filter(msg => !msg.read).length;
                setStats({
                    projects: p.data.length,
                    messages: m.data.length,
                    unreadMessages: unread,
                    skills: s.data.length,
                    experience: e.data.length
                });
                setRecentMessages(m.data.slice(0, 4));
                setRecentProjects(p.data.slice(0, 3));
            } catch (err) {
                console.error("Dashboard stats error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: FolderKanban,
            bgLight: 'bg-blue-500/10',
            textColor: 'text-blue-400',
            borderColor: 'border-blue-500/20',
            link: '/admin/projects'
        },
        {
            title: 'Skills Listed',
            value: stats.skills,
            icon: Cpu,
            bgLight: 'bg-emerald-500/10',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/20',
            link: '/admin/skills'
        },
        {
            title: 'Experience Items',
            value: stats.experience,
            icon: Briefcase,
            bgLight: 'bg-amber-500/10',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/20',
            link: '/admin/experience'
        },
        {
            title: 'Inquiries / Messages',
            value: stats.messages,
            badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : null,
            icon: MessageSquare,
            bgLight: 'bg-purple-500/10',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/20',
            link: '/admin/messages'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Welcome to your portfolio management control center.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/admin/projects"
                        className="px-4 py-2 bg-primary hover:bg-secondary text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/20"
                    >
                        <PlusCircle size={16} /> Add Project
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        key={card.title}
                        onClick={() => navigate(card.link)}
                        className={`bg-slate-900/90 border ${card.borderColor} rounded-2xl p-5 sm:p-6 flex items-center justify-between hover:bg-slate-800/80 transition-all cursor-pointer group shadow-lg`}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{card.title}</p>
                                {card.badge && (
                                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        {card.badge}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{card.value}</h2>
                        </div>
                        <div className={`p-3.5 rounded-2xl ${card.bgLight} ${card.textColor} group-hover:scale-110 transition-transform`}>
                            <card.icon size={26} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-4">Quick Shortcuts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/admin/projects')}
                        className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-primary/40 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between text-slate-300 group-hover:text-primary mb-1">
                            <span className="font-bold text-sm">Manage Projects</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400">Add, reorder, or edit showcase work</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/skills')}
                        className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between text-slate-300 group-hover:text-emerald-400 mb-1">
                            <span className="font-bold text-sm">Update Tech Stack</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400">Adjust proficiencies & categories</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/profile')}
                        className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between text-slate-300 group-hover:text-amber-400 mb-1">
                            <span className="font-bold text-sm">Profile & CV</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400">Bio, socials, and resume link</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/messages')}
                        className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/40 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between text-slate-300 group-hover:text-purple-400 mb-1">
                            <span className="font-bold text-sm">View Messages</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-slate-400">Review client inquiries</p>
                    </button>
                </div>
            </div>

            {/* Recent Messages & Projects Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <MessageSquare size={18} className="text-purple-400" />
                            Recent Inquiries
                        </h2>
                        <Link to="/admin/messages" className="text-xs font-semibold text-primary hover:underline">
                            View All ({stats.messages})
                        </Link>
                    </div>

                    {recentMessages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-sm">
                            <CheckCircle size={32} className="mb-2 text-slate-600" />
                            No messages received yet.
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1">
                            {recentMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => navigate('/admin/messages')}
                                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                        msg.read
                                            ? 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/70'
                                            : 'bg-primary/5 border-primary/30 hover:bg-primary/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-white">{msg.name}</span>
                                            {!msg.read && (
                                                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <Clock size={11} />
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium truncate mb-1">
                                        {msg.subject || 'No subject'}
                                    </p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Projects */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <FolderKanban size={18} className="text-blue-400" />
                            Showcase Projects
                        </h2>
                        <Link to="/admin/projects" className="text-xs font-semibold text-primary hover:underline">
                            Manage ({stats.projects})
                        </Link>
                    </div>

                    {recentProjects.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-sm">
                            <FolderKanban size={32} className="mb-2 text-slate-600" />
                            No projects created yet.
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1">
                            {recentProjects.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => navigate('/admin/projects')}
                                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800/70 transition-all cursor-pointer flex items-center gap-3"
                                >
                                    {p.images?.[0] ? (
                                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                            <FolderKanban size={20} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                                            {p.featured && (
                                                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>
                                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                                            {p.techStack?.join(' • ')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

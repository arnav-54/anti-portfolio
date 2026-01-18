import { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, FolderKanban, MessageSquare, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [p, m, s] = await Promise.all([
                    axios.get('/projects'),
                    axios.get('/messages'),
                    axios.get('/skills')
                ]);
                setStats({ projects: p.data.length, messages: m.data.length, skills: s.data.length });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Projects', value: stats.projects, icon: FolderKanban, color: 'bg-blue-500' },
        { title: 'Skills Listed', value: stats.skills, icon: Cpu, color: 'bg-emerald-500' },
        { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="glass-card p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div>
                            <p className="text-slate-400 mb-1 text-sm uppercase tracking-wider font-semibold">{card.title}</p>
                            <h2 className="text-4xl font-bold">{card.value}</h2>
                        </div>
                        <div className={`p-3 rounded-xl ${card.color}/10 text-${card.color.replace('bg-', '')}`}>
                            {/* Tailwind dynamic classes issue: safely use specific classes or just inline style for bg/text opacity if needed. Reverting to simple for reliability */}
                            <card.icon size={28} className="text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 text-slate-300">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="glass-card p-4 text-left hover:bg-primary/20 transition-colors border-l-4 border-primary">
                        <h3 className="font-bold">Add New Project</h3>
                        <p className="text-slate-400 text-sm">Showcase your latest work</p>
                    </button>
                    <button className="glass-card p-4 text-left hover:bg-secondary/20 transition-colors border-l-4 border-secondary">
                        <h3 className="font-bold">Update Skills</h3>
                        <p className="text-slate-400 text-sm">Keep your tech stack current</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;

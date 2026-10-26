import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Mail, MessageSquare, Reply, Clock, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get('/messages');
            setMessages(data || []);
        } catch (err) {
            console.error(err);
            showNotification('Failed to fetch messages', 'error');
        }
    };

    const handleRead = async (id) => {
        try {
            await axios.put(`/messages/${id}/read`);
            showNotification('Marked as read');
            fetchMessages();
        } catch (err) {
            console.error(err);
            showNotification('Failed to update status', 'error');
        }
    };

    const handleDelete = async (id, sender) => {
        if (window.confirm(`Delete message from "${sender}"?`)) {
            try {
                await axios.delete(`/messages/${id}`);
                showNotification('Message deleted');
                fetchMessages();
            } catch (err) {
                console.error(err);
                showNotification('Failed to delete message', 'error');
            }
        }
    };

    const filteredMessages = filter === 'unread'
        ? messages.filter(m => !m.read)
        : messages;

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <span>Messages</span>
                        {unreadCount > 0 && (
                            <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Inquiries and messages sent via the contact form on your portfolio.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filter === 'all'
                                ? 'bg-primary text-white'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        All ({messages.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filter === 'unread'
                                ? 'bg-primary text-white'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center gap-2.5 text-sm font-semibold shadow-lg ${
                            notification.type === 'error'
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}
                    >
                        <CheckCircle2 size={18} />
                        <span>{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages List */}
            <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                        <MessageSquare size={36} className="mx-auto mb-3 text-slate-600" />
                        <h3 className="text-base font-bold text-slate-300 mb-1">No messages found</h3>
                        <p className="text-xs text-slate-500">
                            {filter === 'unread' ? 'All messages have been read!' : 'No messages have been submitted yet.'}
                        </p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-slate-900/90 border rounded-2xl p-6 transition-all shadow-sm ${
                                msg.read
                                    ? 'border-slate-800/80 opacity-80 hover:opacity-100'
                                    : 'border-primary/40 bg-slate-900 shadow-md shadow-primary/5'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-primary font-bold shrink-0">
                                        {msg.name ? msg.name.charAt(0).toUpperCase() : <User size={18} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-base text-white">
                                                {msg.subject || 'No Subject'}
                                            </h3>
                                            {!msg.read && (
                                                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-slate-300">{msg.name}</span>
                                            <span>•</span>
                                            <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                                                {msg.email}
                                            </a>
                                            <span>•</span>
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                    <a
                                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your Portfolio Inquiry')}`}
                                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                                        title="Reply via Email"
                                    >
                                        <Reply size={14} />
                                        <span>Reply</span>
                                    </a>

                                    {!msg.read && (
                                        <button
                                            onClick={() => handleRead(msg.id)}
                                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors"
                                            title="Mark as Read"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(msg.id, msg.name)}
                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Messages;

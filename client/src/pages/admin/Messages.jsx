import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MailOpen, Mail, CheckCircle } from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get('/messages');
            setMessages(data);
        } catch (err) { console.error(err); }
    };

    const handleRead = async (id) => {
        try {
            await axios.put(`/messages/${id}/read`);
            fetchMessages();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete message?')) {
            try {
                await axios.delete(`/messages/${id}`);
                fetchMessages();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Messages</h1>
            <div className="space-y-4">
                {messages.length === 0 && <p className="text-slate-400">No messages yet.</p>}

                {messages.map(msg => (
                    <div key={msg.id} className={`glass-card p-6 transition-all ${msg.read ? 'opacity-70' : 'border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    {msg.subject || 'No Subject'}
                                    {!msg.read && <span className="bg-primary text-xs px-2 py-0.5 rounded-full text-white">New</span>}
                                </h3>
                                <div className="text-slate-400 text-sm">{msg.name} ({msg.email})</div>
                                <div className="text-slate-500 text-xs mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2">
                                {!msg.read && (
                                    <button onClick={() => handleRead(msg.id)} className="p-2 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors" title="Mark as Read">
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-300 bg-black/20 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Messages;

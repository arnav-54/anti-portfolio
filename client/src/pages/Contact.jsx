import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post('/messages', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="py-10 max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-8 text-center text-darker">Get In <span className="text-primary">Touch</span></h1>
                <p className="text-secondary text-center mb-12 text-lg">
                    Have a project in mind or just want to say hi? I'd love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 bg-white/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-dark/70 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark/70 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark/70 mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-white border border-orange-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Project Inquiry"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark/70 mb-2">Message</label>
                        <textarea
                            name="message"
                            required
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full bg-white border border-orange-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            placeholder="Tell me about your project..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                    >
                        {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
                    </button>

                    {status === 'success' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-center mt-4 font-medium">Message sent successfully!</motion.p>
                    )}
                    {status === 'error' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mt-4 font-medium">Something went wrong. Please try again.</motion.p>
                    )}
                </form>
            </motion.div>
        </div>
    );
};

export default Contact;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Mail,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    ExternalLink
} from 'lucide-react';

const SUBJECT_PRESETS = [
    'Freelance Project Inquiry',
    'Full-Time Job Opportunity',
    'Contract / Consulting Role',
    'Collaboration / Partnership',
    'Technical Question / Say Hi',
    'Other'
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Freelance Project Inquiry',
        message: ''
    });
    const [profile, setProfile] = useState({});
    const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/profile');
                if (data) setProfile(data);
            } catch (err) {
                // Ignore
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const directEmail = profile.email || 'arnavaru62@gmail.com';

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(directEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Construct deep links for Gmail and default mail client
    const emailSubject = encodeURIComponent(formData.subject || 'Portfolio Inquiry');
    const emailBody = encodeURIComponent(
        `Hi Arnav,\n\n${formData.message ? formData.message + '\n\n' : ''}From: ${formData.name || 'Anonymous'}\nContact Email: ${formData.email || 'Not provided'}`
    );

    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(directEmail)}&su=${emailSubject}&body=${emailBody}`;
    const mailtoLink = `mailto:${directEmail}?subject=${emailSubject}&body=${emailBody}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus('error');
            setErrorMessage('Please fill in all required fields (Name, Email, and Message).');
            return;
        }

        setStatus('sending');
        setErrorMessage('');

        try {
            await axios.post('/messages', formData);
            setStatus('success');
            // Keep formData subject as default preset
            setFormData({ name: '', email: '', subject: 'Freelance Project Inquiry', message: '' });
        } catch (error) {
            console.error('Contact form submission error:', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. You can also click "Open in Gmail" below to email directly.');
        }
    };

    return (
        <div className="py-6 max-w-5xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    Start a Conversation
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display text-darker">
                    Get In <span className="gradient-text">Touch</span>
                </h2>
                <p className="text-secondary/90 max-w-xl mx-auto text-base sm:text-lg">
                    Have a project in mind, a potential role, or just want to connect? My inbox is always open.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Info Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="glass-card p-6 sm:p-8 bg-white/85 shadow-lg shadow-orange-500/5">
                        <h3 className="text-xl font-bold text-darker mb-4 font-display">
                            Direct Contact
                        </h3>
                        <p className="text-secondary text-sm mb-6 leading-relaxed">
                            Reach out directly through email, open a pre-filled Gmail compose window, or submit the contact form.
                        </p>

                        <div className="space-y-4">
                            {/* Interactive Email Box */}
                            <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                                        <Mail size={16} />
                                        <span>Primary Email</span>
                                    </div>
                                    <button
                                        onClick={handleCopyEmail}
                                        className="text-xs text-secondary hover:text-primary flex items-center gap-1 font-semibold transition-colors"
                                        title="Copy email to clipboard"
                                    >
                                        {copied ? (
                                            <span className="text-emerald-600 flex items-center gap-1">
                                                <Check size={14} /> Copied!
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Copy size={14} /> Copy
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className="text-base font-bold text-darker truncate font-sans">
                                    {directEmail}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <a
                                        href={gmailWebLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-secondary text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                    >
                                        <ExternalLink size={13} />
                                        <span>Open in Gmail</span>
                                    </a>

                                    <a
                                        href={mailtoLink}
                                        className="py-2 px-3 rounded-lg bg-white hover:bg-orange-100 text-secondary border border-orange-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <Mail size={13} />
                                        <span>Mail App</span>
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/50">
                                <div className="w-10 h-10 rounded-lg bg-orange-200 text-secondary flex items-center justify-center shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-secondary uppercase">Location</div>
                                    <div className="text-sm font-bold text-darker">India (Available Worldwide Remote)</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/50">
                                <div className="w-10 h-10 rounded-lg bg-orange-200 text-secondary flex items-center justify-center shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-secondary uppercase">Response Time</div>
                                    <div className="text-sm font-bold text-darker">Within 24 Hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Availability Badge */}
                        <div className="mt-6 pt-6 border-t border-orange-200/60 flex items-center gap-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-secondary">
                                Open to Freelance & Full-time Roles
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Form Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="glass-card p-6 sm:p-8 bg-white/90 shadow-xl shadow-orange-500/5 space-y-5"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                                    Your Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-dark/40"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                                    Email Address <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-dark/40"
                                    placeholder="jane@company.com"
                                />
                            </div>
                        </div>

                        {/* Subject with Dropdown Presets */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-secondary">
                                    Subject (Choose or Customize)
                                </label>
                            </div>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer mb-2"
                            >
                                {SUBJECT_PRESETS.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                                Message <span className="text-primary">*</span>
                            </label>
                            <textarea
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-dark/40 resize-none"
                                placeholder="Hi Arnav, I would like to discuss..."
                            />
                        </div>

                        {/* Action Buttons: Web Form + Direct Gmail */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01]"
                            >
                                {status === 'sending' ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending to Dashboard...
                                    </span>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>

                            <a
                                href={gmailWebLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3.5 bg-orange-100/70 hover:bg-orange-100 text-secondary border border-orange-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                                title="Open this message directly in Gmail"
                            >
                                <ExternalLink size={16} />
                                <span>Send via Gmail</span>
                            </a>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-2"
                                >
                                    <div className="flex items-center gap-2 font-bold">
                                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                        <span>Message sent & saved to dashboard successfully!</span>
                                    </div>
                                    <p className="text-xs text-emerald-700">
                                        Thank you for reaching out. If you'd also like to shoot a direct email from your mail app:
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        <a
                                            href={gmailWebLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center gap-1"
                                        >
                                            <ExternalLink size={12} /> Launch Gmail
                                        </a>
                                        <a
                                            href={mailtoLink}
                                            className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
                                        >
                                            <Mail size={12} /> Launch Mail App
                                        </a>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <AlertCircle size={18} className="text-red-600 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                    <a
                                        href={gmailWebLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-red-700 text-white rounded-lg text-xs font-semibold shrink-0 hover:bg-red-800 transition-colors"
                                    >
                                        Use Gmail Instead
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;

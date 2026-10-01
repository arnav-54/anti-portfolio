import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, FileText, Globe, CheckCircle2, ExternalLink, Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProfile = () => {
    const [formData, setFormData] = useState({
        about: '',
        resumeUrl: '',
        email: '',
        phone: '',
        github: '',
        linkedin: '',
        twitter: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/profile');
            if (data && typeof data === 'object') {
                setFormData({
                    about: data.about || '',
                    resumeUrl: data.resumeUrl || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    github: data.github || '',
                    linkedin: data.linkedin || '',
                    twitter: data.twitter || ''
                });
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            showNotification('Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/profile', formData);
            showNotification('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to save profile:', err);
            showNotification(err.response?.data?.message || 'Error updating profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputClasses = "w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
    const labelClasses = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                Loading profile details...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Edit Profile & Resume</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Customize your personal bio, public contact details, resume, and social profiles.</p>
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

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* About Section */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
                        <User size={20} className="text-primary" />
                        <span>About & Professional Bio</span>
                    </h2>
                    <div>
                        <label className={labelClasses}>Bio / Summary</label>
                        <textarea
                            value={formData.about}
                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                            className={`${inputClasses} resize-none`}
                            rows="6"
                            placeholder="Write your professional bio, engineering philosophy, and what problems you love to solve..."
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            This text is displayed prominently in the About section on the public homepage.
                        </p>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
                        <FileText size={20} className="text-amber-400" />
                        <span>Resume Link</span>
                    </h2>
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Public Resume / CV URL
                            </label>
                            {formData.resumeUrl && (
                                <a
                                    href={formData.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <span>Test Link</span> <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                        <input
                            value={formData.resumeUrl}
                            onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                            className={inputClasses}
                            placeholder="https://drive.google.com/file/d/... or https://your-bucket.s3.amazonaws.com/resume.pdf"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Upload your PDF to Google Drive (set to 'Anyone with link can view') or cloud storage and paste the direct link here.
                        </p>
                    </div>
                </div>

                {/* Contact & Socials */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Globe size={20} className="text-blue-400" />
                        <span>Contact Info & Social Links</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="arnav@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>GitHub URL</label>
                            <div className="relative">
                                <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={formData.github}
                                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="https://github.com/your-username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={formData.linkedin}
                                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="https://linkedin.com/in/your-username"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClasses}>Twitter / X URL</label>
                            <div className="relative">
                                <Twitter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={formData.twitter}
                                    onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="https://twitter.com/your-handle"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] disabled:opacity-60"
                    >
                        <Save size={18} />
                        <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageProfile;

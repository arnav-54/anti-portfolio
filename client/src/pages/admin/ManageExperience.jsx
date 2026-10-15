import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Briefcase, Building, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMPLOYMENT_TYPES = [
    'Full-time',
    'Contract / Freelance',
    'Internship',
    'Part-time',
    'Self-Employed / Founder'
];

const LOCATION_TYPES = ['Remote', 'Hybrid', 'On-site'];

const YEARS = ['2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];

const ManageExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        employmentType: 'Full-time',
        locationType: 'Remote',
        startYear: '2023',
        endYear: 'Present',
        duration: '2023 - Present',
        description: '',
        current: true
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchExperiences = async () => {
        try {
            const { data } = await axios.get('/experience');
            setExperiences(data || []);
        } catch (err) {
            console.error('Failed to fetch experiences:', err);
            showNotification('Failed to fetch experiences', 'error');
        }
    };

    const handleYearChange = (start, end, isCurr) => {
        const durationStr = isCurr ? `${start} - Present` : `${start} - ${end}`;
        setFormData(prev => ({
            ...prev,
            startYear: start,
            endYear: isCurr ? 'Present' : end,
            current: isCurr,
            duration: durationStr
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                role: formData.role.trim(),
                company: formData.company.trim(),
                duration: formData.duration.trim(),
                description: formData.description.trim(),
                current: Boolean(formData.current)
            };

            const expId = currentId;
            if (isEditing) {
                if (!expId) throw new Error('Experience ID is missing');
                await axios.put(`/experience/${expId}`, payload);
                showNotification(`"${payload.role}" updated successfully!`);
            } else {
                await axios.post('/experience', payload);
                showNotification(`"${payload.role}" added to experience!`);
            }
            resetForm();
            await fetchExperiences();
        } catch (err) {
            console.error('Error saving experience:', err);
            showNotification(err.response?.data?.message || err.message || 'Error saving experience', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (exp) => {
        const expId = exp.id || exp._id;
        setIsEditing(true);
        setCurrentId(expId);
        setFormData({
            role: exp.role || '',
            company: exp.company || '',
            employmentType: 'Full-time',
            locationType: 'Remote',
            startYear: '2023',
            endYear: exp.current ? 'Present' : '2024',
            duration: exp.duration || '',
            description: exp.description || '',
            current: Boolean(exp.current)
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (exp) => {
        const expId = exp.id || exp._id;
        if (window.confirm(`Delete experience "${exp.role}"?`)) {
            try {
                await axios.delete(`/experience/${expId}`);
                showNotification(`Experience "${exp.role}" removed`);
                if (currentId === expId) resetForm();
                await fetchExperiences();
            } catch (err) {
                console.error('Delete error:', err);
                showNotification('Failed to delete experience', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            role: '',
            company: '',
            employmentType: 'Full-time',
            locationType: 'Remote',
            startYear: '2023',
            endYear: 'Present',
            duration: '2023 - Present',
            description: '',
            current: true
        });
    };

    const inputClasses = "w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
    const labelClasses = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

    return (
        <div className="space-y-8 relative">
            {/* Floating Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-6 right-6 z-50 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-2xl backdrop-blur-xl border ${
                            notification.type === 'error'
                                ? 'bg-red-950/90 border-red-500/40 text-red-200 shadow-red-950/50'
                                : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
                        }`}
                    >
                        {notification.type === 'error' ? (
                            <AlertCircle size={20} className="text-red-400 shrink-0" />
                        ) : (
                            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                        )}
                        <span>{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manage Experience</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Chronicle your professional roles, contracts, and internships.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
                isEditing ? 'border-primary ring-1 ring-primary/30' : 'border-slate-800'
            }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {isEditing ? <Edit size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                        <span>{isEditing ? `Edit Experience: "${formData.role}"` : 'Add New Experience'}</span>
                    </h2>
                    {isEditing && (
                        <button
                            onClick={resetForm}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg"
                        >
                            <X size={14} /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>Job Title / Role *</label>
                            <input
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className={inputClasses}
                                required
                                placeholder="e.g. Senior Full Stack Engineer"
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Company / Organization *</label>
                            <input
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                className={inputClasses}
                                required
                                placeholder="e.g. Google, Remote Startup, Freelance"
                            />
                        </div>
                    </div>

                    {/* Employment Type & Location Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>Employment Type (Dropdown)</label>
                            <select
                                value={formData.employmentType}
                                onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                {EMPLOYMENT_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>Workplace Policy (Dropdown)</label>
                            <select
                                value={formData.locationType}
                                onChange={e => setFormData({ ...formData, locationType: e.target.value })}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                {LOCATION_TYPES.map(loc => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Year Pickers Dropdown & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
                        <div>
                            <label className={labelClasses}>Start Year (Dropdown)</label>
                            <select
                                value={formData.startYear}
                                onChange={e => handleYearChange(e.target.value, formData.endYear, formData.current)}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                {YEARS.map(y => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}>End Year (Dropdown)</label>
                            <select
                                disabled={formData.current}
                                value={formData.current ? 'Present' : formData.endYear}
                                onChange={e => handleYearChange(formData.startYear, e.target.value, false)}
                                className={`${inputClasses} cursor-pointer disabled:opacity-50`}
                            >
                                <option value="Present">Present (Ongoing)</option>
                                {YEARS.map(y => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center pb-2.5">
                            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.current}
                                    onChange={e => handleYearChange(formData.startYear, formData.endYear, e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900 cursor-pointer"
                                />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Current Position
                                </span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Formatted Duration String</label>
                        <input
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            className={inputClasses}
                            required
                            placeholder="e.g. 2023 - Present or Jan 2022 - Dec 2023"
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>Description & Responsibilities *</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className={`${inputClasses} resize-none`}
                            rows="4"
                            required
                            placeholder="Describe your role, core technologies used, leadership duties, and key achievements..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                        >
                            {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                            {saving ? 'Saving...' : isEditing ? 'Update Experience' : 'Add Experience'}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                            >
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Experience List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase size={20} className="text-amber-400" />
                    Career Timeline ({experiences.length})
                </h2>

                {experiences.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
                        No work experience added yet. Add your first role using the form above!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {experiences.map(exp => {
                            const expId = exp.id || exp._id;
                            return (
                                <div
                                    key={expId}
                                    className={`bg-slate-900/90 border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-sm ${
                                        currentId === expId
                                            ? 'border-primary ring-1 ring-primary/40 bg-slate-900'
                                            : 'border-slate-800/80 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="space-y-1.5 max-w-3xl">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                                            {exp.current && (
                                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    Current Role
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1 text-primary font-semibold">
                                                <Building size={14} /> {exp.company}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} /> {exp.duration}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pt-2">
                                            {exp.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors"
                                            title="Edit Experience"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp)}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                            title="Delete Experience"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageExperience;

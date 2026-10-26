import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Cpu, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated list of popular skills with their default category
const POPULAR_SKILLS = [
    // Frontend
    { name: 'React', category: 'Frontend', defaultLevel: 90 },
    { name: 'Next.js', category: 'Frontend', defaultLevel: 85 },
    { name: 'JavaScript', category: 'Frontend', defaultLevel: 90 },
    { name: 'TypeScript', category: 'Frontend', defaultLevel: 85 },
    { name: 'HTML5', category: 'Frontend', defaultLevel: 95 },
    { name: 'CSS3', category: 'Frontend', defaultLevel: 90 },
    { name: 'Tailwind CSS', category: 'Frontend', defaultLevel: 95 },
    { name: 'Redux / Toolkit', category: 'Frontend', defaultLevel: 80 },
    { name: 'Vue.js', category: 'Frontend', defaultLevel: 75 },
    { name: 'Framer Motion', category: 'Frontend', defaultLevel: 80 },

    // Backend
    { name: 'Node.js', category: 'Backend', defaultLevel: 85 },
    { name: 'Express.js', category: 'Backend', defaultLevel: 85 },
    { name: 'Python', category: 'Backend', defaultLevel: 80 },
    { name: 'Django', category: 'Backend', defaultLevel: 75 },
    { name: 'FastAPI', category: 'Backend', defaultLevel: 75 },
    { name: 'Java', category: 'Backend', defaultLevel: 70 },
    { name: 'Spring Boot', category: 'Backend', defaultLevel: 70 },
    { name: 'PHP', category: 'Backend', defaultLevel: 65 },
    { name: 'Go (Golang)', category: 'Backend', defaultLevel: 70 },
    { name: 'GraphQL', category: 'Backend', defaultLevel: 75 },
    { name: 'REST APIs', category: 'Backend', defaultLevel: 90 },

    // Database
    { name: 'MongoDB', category: 'Database', defaultLevel: 85 },
    { name: 'PostgreSQL', category: 'Database', defaultLevel: 80 },
    { name: 'MySQL / SQL', category: 'Database', defaultLevel: 80 },
    { name: 'Prisma ORM', category: 'Database', defaultLevel: 85 },
    { name: 'Redis', category: 'Database', defaultLevel: 75 },
    { name: 'Firebase', category: 'Database', defaultLevel: 80 },
    { name: 'Supabase', category: 'Database', defaultLevel: 80 },

    // Tools & DevOps
    { name: 'Git & GitHub', category: 'Tools', defaultLevel: 90 },
    { name: 'Docker', category: 'DevOps', defaultLevel: 75 },
    { name: 'Kubernetes', category: 'DevOps', defaultLevel: 65 },
    { name: 'AWS (S3/EC2)', category: 'DevOps', defaultLevel: 70 },
    { name: 'Vercel / Netlify', category: 'DevOps', defaultLevel: 90 },
    { name: 'Postman', category: 'Tools', defaultLevel: 85 },
    { name: 'Linux / Bash', category: 'Tools', defaultLevel: 80 },
    { name: 'Jest / Testing', category: 'Tools', defaultLevel: 75 },
    { name: 'Vite / Webpack', category: 'Tools', defaultLevel: 85 },
];

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Mobile', 'Other'];

const LEVEL_PRESETS = [
    { label: 'Beginner (40%)', value: 40 },
    { label: 'Intermediate (60%)', value: 60 },
    { label: 'Advanced (80%)', value: 80 },
    { label: 'Expert (95%)', value: 95 },
];

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: 'Frontend', level: 80 });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchSkills = async () => {
        try {
            const { data } = await axios.get('/skills');
            setSkills(data || []);
        } catch (err) {
            console.error('Failed to fetch skills:', err);
            showNotification('Failed to fetch skills', 'error');
        }
    };

    // Auto-suggest category when selecting popular skill
    const handleSkillNameChange = (name) => {
        const found = POPULAR_SKILLS.find(s => s.name.toLowerCase() === name.toLowerCase());
        setFormData(prev => ({
            ...prev,
            name,
            category: found ? found.category : prev.category
        }));
    };

    const handleSelectPreset = (preset) => {
        setFormData(prev => ({
            ...prev,
            name: preset.name,
            category: preset.category,
            level: preset.defaultLevel || prev.level
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showNotification('Skill name cannot be empty', 'error');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: formData.name.trim(),
                category: formData.category,
                level: parseInt(formData.level, 10) || 50
            };

            if (isEditing) {
                if (!currentId) {
                    throw new Error('Skill ID is missing. Please click Edit on the skill again.');
                }
                await axios.put(`/skills/${currentId}`, payload);
                showNotification(`"${payload.name}" updated successfully to ${payload.level}%!`);
            } else {
                await axios.post('/skills', payload);
                showNotification(`"${payload.name}" added successfully!`);
            }
            resetForm();
            await fetchSkills();
        } catch (err) {
            console.error('Error saving skill:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Error saving skill';
            showNotification(errorMsg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill) => {
        setIsEditing(true);
        const skillId = skill.id || skill._id;
        setCurrentId(skillId);
        setFormData({
            name: skill.name || '',
            category: skill.category || 'Frontend',
            level: skill.level !== undefined ? parseInt(skill.level, 10) : 50
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (skill) => {
        const skillId = skill.id || skill._id;
        if (window.confirm(`Delete skill "${skill.name}"?`)) {
            try {
                await axios.delete(`/skills/${skillId}`);
                showNotification(`Skill "${skill.name}" removed successfully`);
                if (currentId === skillId) {
                    resetForm();
                }
                await fetchSkills();
            } catch (err) {
                console.error('Failed to delete skill:', err);
                showNotification('Failed to delete skill', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: '', category: 'Frontend', level: 80 });
    };

    const allCategoryFilters = ['All', ...CATEGORIES];
    const filteredSkills = selectedCategory === 'All'
        ? skills
        : skills.filter(s => s.category?.toLowerCase() === selectedCategory.toLowerCase());

    const inputClasses = "w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manage Skills</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Maintain your technical proficiencies and categorized tech stack.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
                isEditing ? 'border-primary ring-1 ring-primary/30' : 'border-slate-800'
            }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {isEditing ? <Edit size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                        <span>{isEditing ? `Edit Skill: "${formData.name}"` : 'Add New Skill'}</span>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Skill Name with Searchable Datalist Dropdown */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Skill Name * (Type or Select)
                            </label>
                            <div className="relative">
                                <input
                                    list="popular-skills-list"
                                    value={formData.name}
                                    onChange={e => handleSkillNameChange(e.target.value)}
                                    className={inputClasses}
                                    required
                                    placeholder="Search or type skill..."
                                />
                                <datalist id="popular-skills-list">
                                    {POPULAR_SKILLS.map(skill => (
                                        <option key={skill.name} value={skill.name}>
                                            {skill.category}
                                        </option>
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Proficiency Level with Slider & Level Presets Dropdown */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Proficiency Level
                                </label>
                                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                    {formData.level}%
                                </span>
                            </div>

                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={formData.level}
                                onChange={e => setFormData({ ...formData, level: parseInt(e.target.value, 10) })}
                                className="w-full accent-primary cursor-pointer mt-1"
                            />

                            {/* Level Preset Dropdown / Quick Selector */}
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[11px] text-slate-500 whitespace-nowrap">Preset:</span>
                                <select
                                    onChange={e => setFormData({ ...formData, level: parseInt(e.target.value, 10) })}
                                    value={formData.level}
                                    className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 border border-slate-700 w-full cursor-pointer focus:outline-none focus:border-primary"
                                >
                                    <option value="" disabled>Choose preset...</option>
                                    {LEVEL_PRESETS.map(p => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Quick Preset Badges (Top Skills) */}
                    <div>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                            <Sparkles size={14} className="text-amber-400" />
                            Popular Presets (Click to autofill):
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                            {POPULAR_SKILLS.slice(0, 16).map(preset => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                        formData.name.toLowerCase() === preset.name.toLowerCase()
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                                    }`}
                                >
                                    + {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex gap-3 pt-2 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                        >
                            {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                            {saving ? 'Saving...' : isEditing ? 'Update Skill' : 'Add Skill'}
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

            {/* Existing Skills Grid */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cpu size={20} className="text-emerald-400" />
                        Skills Directory ({skills.length})
                    </h2>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {allCategoryFilters.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredSkills.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
                        No skills found in this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map(skill => (
                            <div
                                key={skill.id || skill._id}
                                className={`bg-slate-900/90 border rounded-xl p-4 flex justify-between items-center transition-all shadow-sm group ${
                                    currentId === (skill.id || skill._id)
                                        ? 'border-primary ring-1 ring-primary/40 bg-slate-900'
                                        : 'border-slate-800/80 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex-1 min-w-0 pr-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-white text-sm truncate">{skill.name}</h3>
                                        <span className="text-xs font-bold text-primary">{skill.level}%</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium mb-2">{skill.category}</div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit Skill"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Skill"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSkills;

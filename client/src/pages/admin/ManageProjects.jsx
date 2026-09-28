import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Star, ExternalLink, Github, Image as ImageIcon, Search, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_TECH_PRESETS = [
    'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
    'TypeScript', 'JavaScript', 'Tailwind CSS', 'Python', 'Docker',
    'Redis', 'Prisma', 'Firebase', 'GraphQL', 'AWS', 'Redux'
];

const PROJECT_CATEGORIES = [
    'Full Stack Web App',
    'Frontend / UI Showcase',
    'Backend & REST API',
    'Mobile Application',
    'E-Commerce Platform',
    'AI / Machine Learning',
    'Cloud & DevOps Tool',
    'Open Source Project',
    'Other'
];

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const initialForm = {
        title: '',
        description: '',
        techStack: '', // Comma separated
        category: 'Full Stack Web App',
        liveLink: '',
        githubLink: '',
        images: '', // Comma separated URLs
        featured: false,
        order: 0
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchProjects();
    }, []);

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data || []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            showNotification('Failed to fetch projects', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Toggle tech stack chip
    const handleToggleTechChip = (tech) => {
        const currentList = formData.techStack
            ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        if (currentList.includes(tech)) {
            const updated = currentList.filter(t => t !== tech);
            setFormData(prev => ({ ...prev, techStack: updated.join(', ') }));
        } else {
            const updated = [...currentList, tech];
            setFormData(prev => ({ ...prev, techStack: updated.join(', ') }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const techArray = formData.techStack
            ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const imagesArray = formData.images
            ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            techStack: techArray,
            images: imagesArray,
            liveLink: formData.liveLink?.trim() || null,
            githubLink: formData.githubLink?.trim() || null,
            featured: Boolean(formData.featured),
            order: Number(formData.order) || 0
        };

        try {
            const projId = currentId;
            if (isEditing) {
                if (!projId) throw new Error('Project ID is missing');
                await axios.put(`/projects/${projId}`, payload);
                showNotification(`"${payload.title}" updated successfully!`);
            } else {
                await axios.post('/projects', payload);
                showNotification(`"${payload.title}" added to showcase!`);
            }

            resetForm();
            await fetchProjects();
        } catch (err) {
            console.error('Error saving project:', err);
            showNotification(err.response?.data?.message || err.message || 'Error saving project', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        const projId = project.id || project._id;
        setCurrentId(projId);
        setIsEditing(true);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            techStack: project.techStack ? project.techStack.join(', ') : '',
            category: project.category || 'Full Stack Web App',
            liveLink: project.liveLink || '',
            githubLink: project.githubLink || '',
            images: project.images ? project.images.join(', ') : '',
            featured: Boolean(project.featured),
            order: project.order || 0
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (project) => {
        const projId = project.id || project._id;
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            try {
                await axios.delete(`/projects/${projId}`);
                showNotification(`Project "${project.title}" deleted`);
                if (currentId === projId) resetForm();
                await fetchProjects();
            } catch (err) {
                console.error('Delete error:', err);
                showNotification('Error deleting project', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData(initialForm);
    };

    const inputClasses = "w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
    const labelClasses = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

    const filteredProjects = projects.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.techStack?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const firstImagePreview = formData.images ? formData.images.split(',')[0].trim() : '';
    const currentTechList = formData.techStack
        ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : [];

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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manage Projects</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Showcase your engineering work, live deployments, and source repos.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
                isEditing ? 'border-primary ring-1 ring-primary/30' : 'border-slate-800'
            }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {isEditing ? <Edit size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                        <span>{isEditing ? `Edit Project: "${formData.title}"` : 'Add New Project'}</span>
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
                            <label className={labelClasses}>Project Title *</label>
                            <input
                                name="title"
                                placeholder="e.g. AI Workflow Platform"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Project Category (Dropdown)</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                {PROJECT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tech Stack with Presets Dropdown / Chip Selector */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClasses}>
                                Technologies Used * (Type or Click Presets Below)
                            </label>
                            <span className="text-xs text-slate-400">
                                {currentTechList.length} Selected
                            </span>
                        </div>
                        <input
                            name="techStack"
                            placeholder="React, Node.js, Express, MongoDB..."
                            value={formData.techStack}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />

                        {/* Clickable Tech Stack Chips */}
                        <div className="mt-2.5">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
                                <Sparkles size={13} className="text-amber-400" />
                                Click to add / remove tech:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {POPULAR_TECH_PRESETS.map((tech) => {
                                    const isSelected = currentTechList.includes(tech);
                                    return (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => handleToggleTechChip(tech)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                                isSelected
                                                    ? 'bg-primary text-white shadow-sm font-semibold'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                                            }`}
                                        >
                                            {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Description *</label>
                        <textarea
                            name="description"
                            placeholder="Describe what problem this project solves, architectural choices, challenges overcome, and features..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className={`${inputClasses} resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>Live Demo URL</label>
                            <input
                                name="liveLink"
                                placeholder="https://myproject.vercel.app"
                                value={formData.liveLink}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>GitHub Repository URL</label>
                            <input
                                name="githubLink"
                                placeholder="https://github.com/username/project"
                                value={formData.githubLink}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Image URLs (Comma separated)</label>
                        <input
                            name="images"
                            placeholder="https://example.com/screenshot1.jpg, https://example.com/screenshot2.jpg"
                            value={formData.images}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                        {firstImagePreview && (
                            <div className="mt-3 flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                                <img
                                    src={firstImagePreview}
                                    alt="Preview"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    className="w-16 h-12 object-cover rounded-lg bg-slate-800 shrink-0"
                                />
                                <div className="text-xs text-slate-400 overflow-hidden">
                                    <span className="font-semibold text-slate-200">Image Preview: </span>
                                    <span className="truncate block">{firstImagePreview}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                        {/* Featured Dropdown / Toggle */}
                        <div>
                            <label className={labelClasses}>Homepage Feature Status (Dropdown)</label>
                            <select
                                name="featured"
                                value={formData.featured ? 'true' : 'false'}
                                onChange={e => setFormData({ ...formData, featured: e.target.value === 'true' })}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                <option value="false">Standard Project (Normal Display)</option>
                                <option value="true">★ Featured Project (Highlighted Badge on Home)</option>
                            </select>
                        </div>

                        {/* Display Order Dropdown */}
                        <div>
                            <label className={labelClasses}>Display Priority Order (Dropdown)</label>
                            <select
                                name="order"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value, 10) })}
                                className={`${inputClasses} cursor-pointer`}
                            >
                                <option value="0">0 - Top Showcase (First)</option>
                                <option value="1">1 - High Priority</option>
                                <option value="2">2 - Normal Priority</option>
                                <option value="3">3 - Low Priority</option>
                                <option value="4">4 - Archived / Bottom</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary hover:bg-secondary text-white transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                        >
                            {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                            {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Save Project'}
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

            {/* Existing Projects List */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-lg font-bold text-white">
                        Existing Projects ({projects.length})
                    </h2>
                    <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter projects by title or tech..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
                        {searchTerm ? 'No projects match your search.' : 'No projects added yet. Use the form above to add your first project!'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProjects.map((p) => {
                            const pId = p.id || p._id;
                            return (
                                <div
                                    key={pId}
                                    className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-sm ${
                                        currentId === pId
                                            ? 'border-primary ring-1 ring-primary/40 bg-slate-900'
                                            : 'border-slate-800/80 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {p.images?.[0] ? (
                                            <img
                                                src={p.images[0]}
                                                alt=""
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold text-base text-white">{p.title}</h3>
                                                {p.featured && (
                                                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Star size={10} fill="currentColor" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 max-w-2xl mb-2">
                                                {p.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
                                                {p.techStack?.map((t) => (
                                                    <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                        {p.liveLink && (
                                            <a
                                                href={p.liveLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                                                title="View Live App"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {p.githubLink && (
                                            <a
                                                href={p.githubLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                                                title="View GitHub"
                                            >
                                                <Github size={16} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors"
                                            title="Edit Project"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p)}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                            title="Delete Project"
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

export default ManageProjects;

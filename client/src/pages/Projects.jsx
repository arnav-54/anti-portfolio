import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, FolderGit2 } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState('All');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Extract all unique tech stack tags
    const allTags = ['All', ...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 8);

    const filteredProjects = selectedTag === 'All'
        ? projects
        : projects.filter(p => p.techStack?.includes(selectedTag));

    return (
        <div className="py-6 w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    Portfolio Highlights
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display text-darker">
                    Featured <span className="gradient-text">Projects</span>
                </h2>
                <p className="text-secondary/90 max-w-2xl mx-auto text-base sm:text-lg">
                    Real-world applications engineered with modern technologies, scalable architecture, and intuitive design.
                </p>
            </motion.div>

            {/* Filter Tags */}
            {allTags.length > 2 && (
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                                selectedTag === tag
                                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                                    : 'bg-white/80 border border-orange-200/80 text-dark/70 hover:bg-orange-50 hover:border-orange-300'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card overflow-hidden animate-pulse flex flex-col h-96">
                            <div className="h-48 bg-orange-200/40 w-full" />
                            <div className="p-6 flex-1 flex flex-col gap-3">
                                <div className="h-6 bg-orange-200/50 rounded w-3/4" />
                                <div className="h-4 bg-orange-100 rounded w-full" />
                                <div className="h-4 bg-orange-100 rounded w-2/3" />
                                <div className="mt-auto flex gap-2">
                                    <div className="h-5 bg-orange-200/40 rounded-full w-14" />
                                    <div className="h-5 bg-orange-200/40 rounded-full w-14" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                /* Empty State */
                <div className="glass-card p-12 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 text-primary mx-auto flex items-center justify-center mb-4">
                        <FolderGit2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-darker mb-2">No projects found</h3>
                    <p className="text-secondary text-sm mb-6">
                        {selectedTag === 'All'
                            ? "Projects will appear here once added from the admin dashboard."
                            : `No projects found tagged with "${selectedTag}".`}
                    </p>
                    {selectedTag !== 'All' && (
                        <button
                            onClick={() => setSelectedTag('All')}
                            className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                            Show All Projects
                        </button>
                    )}
                </div>
            ) : (
                /* Projects Grid */
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredProjects.map((project, index) => {
                            const imageSrc = project.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';

                            return (
                                <motion.div
                                    layout
                                    key={project.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="glass-card overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col h-full bg-white/80 hover:shadow-xl hover:shadow-orange-500/10"
                                >
                                    {/* Project Preview Image */}
                                    <div className="h-52 overflow-hidden relative bg-orange-100/50">
                                        <img
                                            src={imageSrc}
                                            alt={project.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transition-transform"
                                        />

                                        {/* Featured Tag */}
                                        {project.featured && (
                                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-primary/30">
                                                <Star size={12} fill="currentColor" /> Featured
                                            </div>
                                        )}

                                        {/* Hover Overlay with Action Buttons */}
                                        <div className="absolute inset-0 bg-darker/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 bg-white hover:bg-orange-50 text-darker rounded-full transition-all hover:scale-110 shadow-lg flex items-center gap-1.5 font-semibold text-xs"
                                                    title="View Source Code"
                                                >
                                                    <Github size={18} />
                                                    <span>Code</span>
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 bg-primary hover:bg-secondary text-white rounded-full transition-all hover:scale-110 shadow-lg flex items-center gap-1.5 font-semibold text-xs"
                                                    title="View Live App"
                                                >
                                                    <ExternalLink size={18} />
                                                    <span>Live</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-darker group-hover:text-primary transition-colors font-display">
                                                {project.title}
                                            </h3>
                                        </div>

                                        <p className="text-dark/75 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack Tags */}
                                        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-orange-100">
                                            {project.techStack?.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="text-[11px] px-2.5 py-1 rounded-md bg-orange-100/70 text-secondary border border-orange-200/60 font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default Projects;

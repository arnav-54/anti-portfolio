import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading projects...</div>;

    return (
        <div className="py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-darker">Featured <span className="text-primary">Projects</span></h1>
                <p className="text-secondary max-w-xl mx-auto">
                    A collection of projects exploring modern technologies and design patterns.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card overflow-hidden hover:border-primary/40 transition-all duration-300 group flex flex-col h-full bg-light/80"
                    >
                        <div className="h-56 overflow-hidden relative">
                            <img
                                src={project.images[0] || 'https://via.placeholder.com/600x400/ea580c/fff7ed?text=Project+Preview'}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full hover:bg-orange-50 text-primary transition-colors hover:scale-110 transform duration-200 shadow-lg" title="View Code">
                                        <Github size={20} />
                                    </a>
                                )}
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-3 bg-primary rounded-full hover:bg-primary/80 text-white transition-colors hover:scale-110 transform duration-200 shadow-lg" title="View Live">
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-dark/70 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-orange-100/50 text-secondary border border-orange-200/50 font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Projects;

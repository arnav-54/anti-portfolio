import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, Code, Sparkles, Calendar, Building, Layers } from 'lucide-react';

const About = () => {
    const [profile, setProfile] = useState({});
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillsRes, expRes, profileRes] = await Promise.all([
                    axios.get('/skills').catch(() => ({ data: [] })),
                    axios.get('/experience').catch(() => ({ data: [] })),
                    axios.get('/profile').catch(() => ({ data: {} }))
                ]);
                setSkills(skillsRes.data || []);
                setExperience(expRes.data || []);
                setProfile(profileRes.data || {});
            } catch (err) {
                console.error("About page data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const defaultAbout = "Hello! I'm a passionate Full Stack Developer and Software Engineer with an enthusiasm for building robust, scalable, and responsive web applications. I specialize in the modern JavaScript ecosystem (React, Node.js, Express, MongoDB, Prisma, Tailwind CSS) and enjoy solving complex challenges with clean, maintainable architecture. When I'm not coding, I love exploring emerging technologies, optimizing system performance, and crafting polished user interfaces.";

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
                    Personal Journey
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display text-darker">
                    About <span className="gradient-text">Me</span>
                </h2>
                <p className="text-secondary/90 max-w-2xl mx-auto text-base sm:text-lg">
                    A glimpse into my background, engineering philosophy, and the tools I use every day.
                </p>
            </motion.div>

            {/* Bio Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="glass-card p-8 sm:p-10 relative overflow-hidden bg-white/80 shadow-xl shadow-orange-500/5">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-orange-400 to-secondary" />
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-4">
                        <Sparkles size={18} />
                        <span>Background & Philosophy</span>
                    </div>
                    <p className="text-dark/85 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                        {profile.about || defaultAbout}
                    </p>
                </div>
            </motion.div>

            {/* Tech Stack & Skills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 font-display text-darker">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                        Technical Proficiency
                    </h3>
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
                        {skills.length} Technologies
                    </span>
                </div>

                {skills.length === 0 && !loading ? (
                    <div className="glass-card p-8 text-center text-secondary text-sm">
                        Skills will appear here once added in the Admin Panel.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                            <div key={category} className="space-y-3">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
                                    <Layers size={16} className="text-primary" />
                                    {category}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {catSkills.map((skill, idx) => (
                                        <motion.div
                                            key={skill.id || idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.04 }}
                                            viewport={{ once: true }}
                                            className="glass-card p-4 flex flex-col justify-between bg-white/90 hover:border-primary/50 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-default group"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-darker text-sm group-hover:text-primary transition-colors">
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs font-semibold text-secondary">
                                                    {skill.level}%
                                                </span>
                                            </div>

                                            {/* Skill Progress Bar */}
                                            <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 }}
                                                    viewport={{ once: true }}
                                                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Experience Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 font-display text-darker">
                        <span className="w-8 h-1 bg-secondary rounded-full"></span>
                        Work Experience
                    </h3>
                </div>

                {experience.length === 0 && !loading ? (
                    <div className="glass-card p-8 text-center text-secondary text-sm">
                        Experience history will appear here once added in the Admin Panel.
                    </div>
                ) : (
                    <div className="relative pl-6 sm:pl-8 border-l-2 border-orange-200/80 space-y-8 ml-2 sm:ml-4">
                        {experience.map((exp, idx) => (
                            <motion.div
                                key={exp.id || idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                {/* Timeline Node Indicator */}
                                <span className={`absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                                    exp.current
                                        ? 'bg-primary border-white ring-4 ring-orange-200 shadow-md'
                                        : 'bg-white border-secondary ring-2 ring-orange-100'
                                }`} />

                                <div className="glass-card p-6 sm:p-7 bg-white/85 hover:bg-white transition-all hover:border-primary/40 hover:shadow-lg shadow-orange-500/5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                        <div>
                                            <h4 className="text-xl font-bold text-darker font-display group-hover:text-primary transition-colors">
                                                {exp.role}
                                            </h4>
                                            <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-0.5">
                                                <Building size={16} />
                                                <span>{exp.company}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 self-start">
                                            {exp.current && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Current
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 bg-orange-100/80 px-3 py-1 rounded-full text-xs text-secondary font-medium">
                                                <Calendar size={13} />
                                                {exp.duration}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-dark/75 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default About;

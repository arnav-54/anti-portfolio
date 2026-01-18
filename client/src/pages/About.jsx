import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const About = () => {
    const [profile, setProfile] = useState({});
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillsRes, expRes, profileRes] = await Promise.all([
                    axios.get('/skills'),
                    axios.get('/experience'),
                    axios.get('/profile')
                ]);
                setSkills(skillsRes.data);
                setExperience(expRes.data);
                setProfile(profileRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
                <h1 className="text-4xl font-bold mb-8 text-darker">About <span className="text-primary">Me</span></h1>
                <div className="glass-card p-8 md:p-10 text-left text-dark/80 leading-loose text-lg relative overflow-hidden bg-light/90">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                    <p className="mb-6 whitespace-pre-wrap">
                        {profile.about || "Hello! I'm a passionate developer with a knack for building robust and scalable web applications. My journey started with a curiosity for how things work on the internet, and has evolved into a career dedicated to solving complex problems through code."}
                    </p>
                </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-darker">
                    <span className="w-10 h-1 bg-primary rounded-full"></span> Tech Stack
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {skills.map((skill, idx) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="glass-card px-4 py-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-all hover:-translate-y-1 cursor-default bg-white"
                        >
                            <span className="font-bold text-dark">{skill.name}</span>
                            <span className="text-xs text-primary/80 uppercase tracking-wider font-semibold">{skill.category}</span>

                            {/* Skills Progress Bar Optional */}
                            <div className="w-full h-1 bg-orange-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${skill.level}%` }}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-darker">
                    <span className="w-10 h-1 bg-secondary rounded-full"></span> Experience
                </h2>
                <div className="space-y-10 pl-4 md:pl-8 border-l border-orange-200 ml-2 md:ml-0">
                    {experience.map((exp, idx) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12"
                        >
                            <span className="absolute -left-[5px] md:-left-[9px] top-6 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-secondary shadow-md font-bold"></span>
                            <div className="glass-card p-6 hover:bg-white transition-colors group bg-white/50">
                                <h3 className="text-xl font-bold text-dark group-hover:text-secondary transition-colors">{exp.role}</h3>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 text-sm text-secondary mt-1">
                                    <span className="font-medium text-dark/70">{exp.company}</span>
                                    <span className="bg-orange-100 px-3 py-1 rounded-full text-xs mt-2 sm:mt-0 w-fit text-secondary">{exp.duration}</span>
                                </div>
                                <p className="text-dark/70 text-sm md:text-base leading-relaxed">{exp.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default About;

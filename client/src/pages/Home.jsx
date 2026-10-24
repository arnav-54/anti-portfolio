import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowDown, Download, ArrowRight, Sparkles, Code2, Layers, Cpu } from 'lucide-react';
import Projects from './Projects';
import About from './About';
import Contact from './Contact';

const Home = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
    const [stats, setStats] = useState({ projects: 0, skills: 0, experienceYears: 2 });

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [profRes, projRes, skillsRes] = await Promise.all([
                    axios.get('/profile').catch(() => ({ data: {} })),
                    axios.get('/projects').catch(() => ({ data: [] })),
                    axios.get('/skills').catch(() => ({ data: [] }))
                ]);

                if (profRes.data?.resumeUrl) {
                    setResumeUrl(profRes.data.resumeUrl);
                }
                setStats({
                    projects: projRes.data?.length || 4,
                    skills: skillsRes.data?.length || 10,
                    experienceYears: 2
                });
            } catch (err) {
                console.error("Meta fetch error:", err);
            }
        };
        fetchMeta();
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-orange-300/25 via-amber-200/20 to-orange-400/20 blur-3xl -z-10 pointer-events-none rounded-full" />

            {/* Hero Section */}
            <section id="home" className="min-h-[92vh] flex flex-col items-center justify-center relative z-10 px-4 pt-24 pb-16">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="max-w-5xl mx-auto text-center flex flex-col items-center"
                >
                    {/* Status Pill */}
                    <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-300/80 bg-white/70 shadow-sm backdrop-blur-md">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-secondary font-semibold tracking-wider uppercase">
                            Available for Opportunities
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 font-display text-darker leading-[1.05]">
                        Digital <br />
                        <span className="gradient-text">Architect.</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p variants={fadeUp} className="text-secondary/90 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed font-light">
                        I build accessible, high-performance web applications and scalable backends. Blending refined aesthetics with rock-solid engineering.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto mb-16">
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="w-full sm:w-auto group px-8 py-4 bg-primary text-white rounded-full font-semibold text-base sm:text-lg transition-all hover:bg-secondary flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
                        >
                            View Projects
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-white/80 border border-orange-200/80 text-dark hover:bg-orange-50/80 hover:border-orange-300 rounded-full font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-sm backdrop-blur-sm hover:scale-[1.02]"
                        >
                            <Download size={18} className="text-primary" />
                            Download CV
                        </a>
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <motion.div
                        variants={fadeUp}
                        className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl w-full border-t border-orange-200/60 pt-8"
                    >
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/40 border border-orange-100/80">
                            <div className="flex items-center gap-1.5 text-primary mb-1">
                                <Code2 size={18} />
                                <span className="text-2xl sm:text-3xl font-bold font-sans text-darker">{stats.projects}+</span>
                            </div>
                            <span className="text-xs sm:text-sm text-secondary font-medium">Projects Built</span>
                        </div>

                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/40 border border-orange-100/80">
                            <div className="flex items-center gap-1.5 text-primary mb-1">
                                <Cpu size={18} />
                                <span className="text-2xl sm:text-3xl font-bold font-sans text-darker">{stats.skills}+</span>
                            </div>
                            <span className="text-xs sm:text-sm text-secondary font-medium">Technologies</span>
                        </div>

                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/40 border border-orange-100/80">
                            <div className="flex items-center gap-1.5 text-primary mb-1">
                                <Sparkles size={18} />
                                <span className="text-2xl sm:text-3xl font-bold font-sans text-darker">100%</span>
                            </div>
                            <span className="text-xs sm:text-sm text-secondary font-medium">Dedication</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <button
                    onClick={() => scrollToSection('projects')}
                    aria-label="Scroll to projects"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary hover:text-secondary p-2 transition-colors cursor-pointer animate-bounce"
                >
                    <ArrowDown size={22} />
                </button>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen py-24 bg-gradient-to-b from-orange-50/30 via-orange-100/20 to-transparent w-full relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Projects />
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="min-h-screen py-24 w-full relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <About />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen py-24 bg-gradient-to-b from-orange-50/40 to-orange-100/40 w-full relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Contact />
                </div>
            </section>
        </div>
    );
};

export default Home;

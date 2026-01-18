import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowDown, Download, ArrowRight } from 'lucide-react';
import Projects from './Projects';
import About from './About';
import Contact from './Contact';

const Home = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await axios.get('/profile');
                if (data.resumeUrl) setResumeUrl(data.resumeUrl);
            } catch (err) { console.error(err); }
        };
        fetchResume();
    }, []);

    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* Hero Section */}
            <section id="home" className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                    className="max-w-5xl mx-auto text-center"
                >
                    <motion.div variants={fadeUp} className="mb-6">
                        <span className="px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-xs text-secondary font-medium tracking-widest uppercase backdrop-blur-md">
                            Portfolio 2026
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 font-display text-dark">
                        Digital <br />
                        <span className="text-primary/80">Architect.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-secondary max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed font-light">
                        I build accessible, pixel-perfect, and performant web experiences.
                        Blending art with engineering.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a href="#projects" className="group px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg transition-all hover:bg-secondary flex items-center gap-2 shadow-lg shadow-orange-500/20">
                            View Work
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href={resumeUrl} target="_blank" className="px-8 py-4 bg-white/50 border border-orange-200 text-dark hover:bg-orange-50 rounded-full font-medium text-lg transition-all flex items-center gap-2 backdrop-blur-sm">
                            <Download size={18} />
                            Resume
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary animate-bounce"
                >
                    <ArrowDown size={24} />
                </motion.div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen flex items-center justify-center py-20 bg-orange-50/50 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-100/20 to-transparent pointer-events-none" />
                <div className="w-full max-w-7xl mx-auto px-4">
                    <Projects />
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="min-h-screen flex items-center justify-center py-20 w-full">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <About />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen flex items-center justify-center py-20 bg-orange-50/50 w-full">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <Contact />
                </div>
            </section>
        </div>
    );
};

export default Home;

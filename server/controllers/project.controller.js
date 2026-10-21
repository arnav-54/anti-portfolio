const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            // Order by featured first, then order index, then date
            orderBy: [
                { featured: 'desc' },
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id }
        });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { title, description, images, techStack, liveLink, githubLink, featured, order } = req.body;
        const project = await prisma.project.create({
            data: {
                title,
                description,
                images: Array.isArray(images) ? images : [],
                techStack: Array.isArray(techStack) ? techStack : [],
                liveLink: liveLink || null,
                githubLink: githubLink || null,
                featured: Boolean(featured),
                order: Number(order) || 0
            },
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { title, description, images, techStack, liveLink, githubLink, featured, order } = req.body;
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: {
                title,
                description,
                images: Array.isArray(images) ? images : undefined,
                techStack: Array.isArray(techStack) ? techStack : undefined,
                liveLink: liveLink !== undefined ? liveLink : undefined,
                githubLink: githubLink !== undefined ? githubLink : undefined,
                featured: featured !== undefined ? Boolean(featured) : undefined,
                order: order !== undefined ? Number(order) : undefined
            },
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        await prisma.project.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };

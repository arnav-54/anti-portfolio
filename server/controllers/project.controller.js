const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: [
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
}

const createProject = async (req, res) => {
    try {
        const project = await prisma.project.create({
            data: req.body,
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: req.body,
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

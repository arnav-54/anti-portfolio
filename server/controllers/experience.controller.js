const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getExperiences = async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { startDate: 'desc' }
        });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExperience = async (req, res) => {
    try {
        const { role, company, duration, description, current, startDate, endDate } = req.body;
        const experience = await prisma.experience.create({
            data: {
                role,
                company,
                duration,
                description,
                current: Boolean(current),
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null
            },
        });
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExperience = async (req, res) => {
    try {
        const { role, company, duration, description, current, startDate, endDate } = req.body;
        const experience = await prisma.experience.update({
            where: { id: req.params.id },
            data: {
                role,
                company,
                duration,
                description,
                current: current !== undefined ? Boolean(current) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined
            },
        });
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        await prisma.experience.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Experience removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getExperiences = async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { startDate: 'desc' } // Assuming schema has startDate, I might have named it slightly differently in mind vs text
        });
        // Wait, let me check schema I wrote.
        // model Experience { ... startDate DateTime ... } - Yes.
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExperience = async (req, res) => {
    try {
        const experience = await prisma.experience.create({
            data: req.body,
        });
        res.status(201).json(experience);
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

module.exports = { getExperiences, createExperience, deleteExperience };

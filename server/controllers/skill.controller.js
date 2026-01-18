const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const skill = await prisma.skill.create({
            data: req.body,
        });
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        await prisma.skill.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Skill removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSkills, createSkill, deleteSkill };

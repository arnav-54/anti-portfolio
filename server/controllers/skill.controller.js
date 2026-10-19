const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { level: 'desc' }
        });
        res.json(skills);
    } catch (error) {
        console.error('getSkills error:', error);
        res.status(500).json({ message: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const { name, category, level, icon } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Skill name is required' });
        }
        const skill = await prisma.skill.create({
            data: {
                name: name.trim(),
                category: category || 'Frontend',
                level: parseInt(level, 10) || 50,
                icon: icon || null
            },
        });
        res.status(201).json(skill);
    } catch (error) {
        console.error('createSkill error:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[SKILL UPDATE] Updating id=${id}`, req.body);

        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ message: 'Valid Skill ID is required' });
        }

        const { name, category, level, icon } = req.body;
        const data = {};
        if (name !== undefined) data.name = name.trim();
        if (category !== undefined) data.category = category;
        if (level !== undefined) data.level = Math.min(100, Math.max(0, parseInt(level, 10)));
        if (icon !== undefined) data.icon = icon;

        const skill = await prisma.skill.update({
            where: { id },
            data
        });

        console.log(`[SKILL UPDATE] Updated successfully:`, skill);
        res.json(skill);
    } catch (error) {
        console.error('updateSkill error:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ message: 'Valid Skill ID is required' });
        }

        await prisma.skill.delete({
            where: { id },
        });
        res.json({ message: 'Skill removed' });
    } catch (error) {
        console.error('deleteSkill error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };

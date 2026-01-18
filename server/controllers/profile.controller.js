const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findFirst();
        console.log('GET PROFILE - Data from DB:', JSON.stringify(profile, null, 2));
        res.json(profile || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        console.log('UPDATE PROFILE - Request body:', JSON.stringify(req.body, null, 2));

        const count = await prisma.profile.count();
        let profile;
        if (count === 0) {
            profile = await prisma.profile.create({ data: req.body });
        } else {
            const first = await prisma.profile.findFirst();
            console.log('UPDATE PROFILE - Current DB data:', JSON.stringify(first, null, 2));

            const { id, updatedAt, createdAt, ...updateData } = req.body;
            console.log('UPDATE PROFILE - Filtered update data:', JSON.stringify(updateData, null, 2));

            profile = await prisma.profile.update({
                where: { id: first.id },
                data: updateData
            });
            console.log('UPDATE PROFILE - Updated profile:', JSON.stringify(profile, null, 2));
        }
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile };

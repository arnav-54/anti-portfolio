const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('admin123', salt);

        const user = await prisma.user.update({
            where: { username: 'admin' },
            data: { password: password },
        });

        console.log('Password reset successfully for user:', user.username);
    } catch (error) {
        if (error.code === 'P2025') {
            console.log('Admin user not found. Creating one...');
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('admin123', salt);
            await prisma.user.create({
                data: { username: 'admin', password }
            });
            console.log('Admin user created.');
        } else {
            console.error('Error resetting password:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();

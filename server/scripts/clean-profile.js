const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanProfile() {
    try {
        console.log('Cleaning profile data...');

        // Get the current profile
        const profile = await prisma.profile.findFirst();

        if (!profile) {
            console.log('No profile found');
            return;
        }

        console.log('Current profile:', JSON.stringify(profile, null, 2));

        // Clean the data
        const cleanedData = {
            resumeUrl: '',
            github: 'https://github.com/arnav-54',
            linkedin: '',
            twitter: ''
        };

        // Update the profile
        const updated = await prisma.profile.update({
            where: { id: profile.id },
            data: cleanedData
        });

        console.log('Profile cleaned successfully!');
        console.log('Updated profile:', JSON.stringify(updated, null, 2));

    } catch (error) {
        console.error('Error cleaning profile:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanProfile();

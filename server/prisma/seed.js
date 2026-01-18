const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password,
        },
    });

    console.log('Admin user created/found:', admin);

    // Create Sample Skills
    await prisma.skill.createMany({
        data: [
            { name: "React", category: "Frontend", level: 90, icon: "FaReact" },
            { name: "Node.js", category: "Backend", level: 85, icon: "FaNodeJs" },
            { name: "MongoDB", category: "Database", level: 80, icon: "SiMongodb" },
            { name: "Tailwind CSS", category: "Frontend", level: 95, icon: "SiTailwindcss" }
        ]
    });

    // Create Sample Project
    await prisma.project.create({
        data: {
            title: "E-Commerce Dashboard",
            description: "A fully functional e-commerce dashboard with analytics, product management, and user roles.",
            techStack: ["React", "Express", "MongoDB", "Chakra UI"],
            images: ["https://placehold.co/600x400/222/eee?text=Dashboard+Preview"],
            githubLink: "https://github.com/example/repo",
            liveLink: "https://example.com",
            featured: true
        }
    });

    // Create Experience
    await prisma.experience.create({
        data: {
            role: "Senior Full Stack Dev",
            company: "Tech Solutions Inc.",
            duration: "2023 - Present",
            description: "Leading a team of 5 developers building scalable web applications.",
            startDate: new Date("2023-01-01"),
            current: true
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

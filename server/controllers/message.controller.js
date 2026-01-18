const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
    try {
        const message = await prisma.message.create({
            data: req.body,
        });
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const message = await prisma.message.update({
            where: { id: req.params.id },
            data: { read: true }
        });
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMessage = async (req, res) => {
    try {
        await prisma.message.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage };

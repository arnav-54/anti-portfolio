const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", { username }); // LOGGING

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        console.log("User found:", user ? "YES" : "NO"); // LOGGING

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch ? "YES" : "NO");

            if (isMatch) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                });

                res.json({
                    id: user.id,
                    username: user.username,
                    token,
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (user) {
            res.json({ id: user.id, username: user.username });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, logout, getMe };

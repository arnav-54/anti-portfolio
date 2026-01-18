const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins (reflects the request origin)
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const skillRoutes = require('./routes/skill.routes');
const experienceRoutes = require('./routes/experience.routes');
const messageRoutes = require('./routes/message.routes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', require('./routes/profile.routes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


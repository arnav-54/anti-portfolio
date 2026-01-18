const express = require('express');
const { getExperiences, createExperience, deleteExperience } = require('../controllers/experience.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getExperiences);
router.post('/', protect, createExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;

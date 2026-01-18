const express = require('express');
const { getSkills, createSkill, deleteSkill } = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, createSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;

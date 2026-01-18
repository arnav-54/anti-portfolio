const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getProfile);
router.put('/', protect, updateProfile); // Upsert logic in controller
router.post('/', protect, updateProfile);

module.exports = router;

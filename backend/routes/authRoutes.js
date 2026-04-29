const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Route for uploading profile image
router.post('/profile/image', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image provided' });
        }
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

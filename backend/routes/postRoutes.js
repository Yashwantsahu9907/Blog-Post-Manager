const express = require('express');
const router = express.Router();
const {
    getPosts,
    getUserPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    exportPostsToCSV
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/export/csv').get(exportPostsToCSV);
router.route('/my-posts').get(protect, getUserPosts);
router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

module.exports = router;

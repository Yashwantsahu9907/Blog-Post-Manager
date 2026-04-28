const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    exportPostsToCSV
} = require('../controllers/postController');

router.route('/export/csv').get(exportPostsToCSV);
router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;

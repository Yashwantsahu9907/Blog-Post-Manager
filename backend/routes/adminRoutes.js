const express = require('express');
const router = express.Router();
const {
    getDashboardMetrics,
    getUsers,
    updateUser,
    deleteUser,
    getPosts,
    updatePostApproval
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardMetrics);
router.route('/users').get(getUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);
router.route('/posts').get(getPosts);
router.route('/posts/:id/approve').put(updatePostApproval);

module.exports = router;

const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const publishedPosts = await Post.countDocuments({ status: 'Published' });
        const draftPosts = await Post.countDocuments({ status: 'Draft' });
        const recentActivity = await Post.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

        res.status(200).json({
            totalUsers,
            totalPosts,
            publishedPosts,
            draftPosts,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { role, accountStatus } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (role) user.role = role;
        if (accountStatus) user.accountStatus = accountStatus;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            accountStatus: updatedUser.accountStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts (including drafts, pending, etc)
// @route   GET /api/admin/posts
// @access  Private/Admin
const getPosts = async (req, res) => {
    try {
        const { search, category, status, approvalStatus, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (status) query.status = status;
        if (approvalStatus) query.approvalStatus = approvalStatus;

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalPosts: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post approval status
// @route   PUT /api/admin/posts/:id/approve
// @access  Private/Admin
const updatePostApproval = async (req, res) => {
    try {
        const { approvalStatus } = req.body;
        
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { approvalStatus },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardMetrics,
    getUsers,
    updateUser,
    deleteUser,
    getPosts,
    updatePostApproval
};

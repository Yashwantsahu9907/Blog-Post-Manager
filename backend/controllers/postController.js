const Post = require('../models/Post');
const { Parser } = require('json2csv');
const sanitizeHtml = require('sanitize-html');

// @desc    Get all posts (with pagination, search, filter)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;

        // Build query
        const query = { approvalStatus: 'Approved' };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
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

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Public
const createPost = async (req, res) => {
    try {
        req.body.user = req.user.id;
        
        // Sanitize content
        if (req.body.content) {
            req.body.content = sanitizeHtml(req.body.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    '*': ['style', 'class'],
                    'img': ['src', 'alt', 'width', 'height']
                }
            });
        }

        const post = new Post(req.body);
        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Public
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user
        if (post.user?.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to update this post' });
        }

        // Sanitize content
        if (req.body.content) {
            req.body.content = sanitizeHtml(req.body.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    '*': ['style', 'class'],
                    'img': ['src', 'alt', 'width', 'height']
                }
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Public
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user
        if (post.user?.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export posts to CSV
// @route   GET /api/posts/export/csv
// @access  Public
const exportPostsToCSV = async (req, res) => {
    try {
        const { search, category, status } = req.query;

        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (status) query.status = status;

        const posts = await Post.find(query).sort({ createdAt: -1 });

        const fields = ['_id', 'title', 'authorName', 'email', 'category', 'status', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(posts);

        res.header('Content-Type', 'text/csv');
        res.attachment('posts.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPosts,
    getUserPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    exportPostsToCSV
};

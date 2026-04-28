const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        authorName: {
            type: String,
            required: [true, 'Please add an author name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['Draft', 'Published', 'Archived'],
            default: 'Draft',
        },
        thumbnailUrl: {
            type: String,
            match: [
                /^https?:\/\/.+/,
                'Please add a valid URL for the thumbnail',
            ],
            required: [true, 'Please add a thumbnail URL'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Please add a short description'],
        },
        content: {
            type: String,
            required: [true, 'Please add the content'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema);

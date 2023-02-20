const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSystem = new Schema({
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSystem);

module.exports = Comment
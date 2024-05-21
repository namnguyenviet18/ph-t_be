const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    comment: { type: String, require: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date_time: { type: Date, default: Date.now }
})
const PhotoSchema = mongoose.Schema({
    file_name: { type: String, require: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date_time: { type: Date, default: Date.now },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Photo', PhotoSchema);
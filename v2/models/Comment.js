var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    author: String,
    title: String,
    body: String
});
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
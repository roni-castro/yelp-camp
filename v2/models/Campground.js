var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String,
    photo: String,
    desc: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var campgroundModel = mongoose.model("Campground", campgroundSchema);
module.exports = campgroundModel;


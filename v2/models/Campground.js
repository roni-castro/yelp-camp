var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String,
    photo: String,
    desc: String
});
var campgroundModel = mongoose.model("Campground", campgroundSchema);
module.exports = campgroundModel;


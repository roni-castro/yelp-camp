var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    username: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.index({username: 1}, {unique: true}); // UNIQUE KEY for the username field
var userModel = mongoose.model("User", userSchema);

module.exports = userModel;
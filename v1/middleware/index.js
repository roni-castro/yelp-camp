var Comment = require("../models/Comment");
var Campground = require("../models/Campground");
var middlewareObj = {};
var USER_NEEDS_TO_LOGIN_MSG = "You need to login to make this action";


// Check if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         return next();
    }
    req.flash("error", USER_NEEDS_TO_LOGIN_MSG);
    res.redirect("/login");
}

// Check if the user is owner of a comment 
middlewareObj.isOwnerOfComment = function (req, res, next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
         });
    } else {
        req.flash("error", USER_NEEDS_TO_LOGIN_MSG);
        res.redirect("/login");
    }
}


// Check if the user is owner of the campground 
middlewareObj.isOwnerOfCampground = function(req, res, next){
     if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCamp){
           if(err || !foundCamp){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user.id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
         });
    } else {
        req.flash("error", USER_NEEDS_TO_LOGIN_MSG);
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
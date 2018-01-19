var Comment = require("../models/Comment");
var Campground = require("../models/Campground");
var middlewareObj = {};


// Check if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         return  next();
    } else {
        res.redirect("/login");
    }
}

// Check if the user is owner of a comment 
middlewareObj.isOwnerOfComment = function (req, res, next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               console.log(err);
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
        res.redirect("/login");
    }
}


// Check if the user is owner of the campground 
middlewareObj.isOwnerOfCampground = function(req, res, next){
     if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCamp){
           if(err){
               console.log(err);
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
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
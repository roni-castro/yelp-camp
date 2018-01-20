var express         = require("express"),
    Campground      = require("../models/Campground"),
    Comment         = require("../models/Comment"),
    sanitazer       = require("express-sanitizer"),
    middlewareObj   = require("../middleware"),
    router          = express.Router({mergeParams: true});

// Create a new comment to an specific campground
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var reqCommentObj = req.body.comment;
    var reqCommentParams = req.params;
    reqCommentObj.body = req.sanitize(reqCommentObj.body);
    Campground.findById(reqCommentParams.id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            Comment.create(reqCommentObj, function(err, createdComment){
                if(err){
                    req.flash("error", err.message);
                } else if(!createdComment){
                    req.flash("error", "Campground not found");
                } else {
                    createdComment.author.id = req.user.id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCamp.comments.push(createdComment);
                    foundCamp.save();
                    req.flash("success", "Comment posted successfully!");
                }
                res.redirect("/campgrounds/" + reqCommentParams.id);
            });
        }
    });
});

// Show form to create a new comment
router.get("/newComment", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
            if(err || !foundCamp){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                res.render("comment/newComment", {camp: foundCamp});
            }
        }
    );   
});

//Show screen to edit comment
router.get("/:comment_id/editComment", middlewareObj.isLoggedIn, middlewareObj.isOwnerOfComment, function(req, res){
     Campground.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else{
                    res.render("comment/editComment", {camp: foundCamp, comment: foundComment});
                }
            }); 
        }
    });
});

// Update a comment
router.put("/:comment_id", middlewareObj.isLoggedIn, middlewareObj.isOwnerOfComment, function(req, res){
   var commentToBeEdited = req.body.comment;
   commentToBeEdited.body = req.sanitize(commentToBeEdited.body);
   Comment.findByIdAndUpdate(req.params.comment_id, commentToBeEdited, function(err, foundComment){
       if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

// Delete an specific comment
router.delete("/:comment_id", middlewareObj.isLoggedIn, middlewareObj.isOwnerOfComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCamp){
        if(err || !foundCamp){
             req.flash("error", "Campground not found");
            res.redirect("back");
        } else{
             req.flash("success", "Comment deleted successfully");
             res.redirect("/campgrounds/" + req.params.id);  
        }
       
    });          
});

module.exports = router;
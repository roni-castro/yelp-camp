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
        if(err){
            console.log(err);
        } else {
            Comment.create(reqCommentObj, function(err, createdComment){
                if(err){
                    console.log(err);
                } else {
                    createdComment.author.id = req.user.id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCamp.comments.push(createdComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + reqCommentParams.id);
                }
            });
        }
    });
});

// Show form to create a new comment
router.get("/newComment", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id,
        function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                res.render("comment/newComment", {camp: foundCamp});
            }
        }
    );   
});

//Show screen to edit comment
router.get("/:comment_id/editComment", middlewareObj.isLoggedIn, middlewareObj.isOwnerOfComment, function(req, res){
     Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    console.log(err);
                    req.redirect(req.get("referer"));
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
       if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

// Delete an specific comment
router.delete("/:comment_id", middlewareObj.isLoggedIn, middlewareObj.isOwnerOfComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCamp){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
             res.redirect("/campgrounds/" + req.params.id);  
        }
       
    });          
});

module.exports = router;
var express         = require("express"),
    Campground      = require("../models/Campground"),
    Comment         = require("../models/Comment"),
    router          = express.Router({mergeParams: true});

// Create a new comment to an specific campground
router.post("/", isLoggedIn, function(req, res){
    var reqCommentObj = req.body.comment;
    var reqCommentParams = req.params;
    reqCommentObj.body = req.sanitize(reqCommentObj.body);
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            Comment.create(reqCommentObj, function(err, createdComment){
                if(err){
                    console.log(err);
                } else{
                    foundCamp.comments.push(createdComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + reqCommentParams.id);
                }
            });
        }
    });
});

// Show form to create a new comment
router.get("/newComment", isLoggedIn, function(req, res){
    Campground.findById(req.params.id,
        function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                console.log(foundCamp);
                res.render("comment/newComment", {camp: foundCamp});
            }
        }
    );   
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
var express         = require("express"),
    Campground      = require("../models/Campground"),
    middleware      = require("../middleware"),
    router          = express.Router();
    
// Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, 
    function(err, camps){
        if(err){
            console.log(err);
        } else {
            res.render("campground/campgrounds", {camps: camps});
        }
    });   
});

// Show new campground form page
router.get("/newCampground", middleware.isLoggedIn, function(req, res) {
     res.render("campground/newCampground"); 
});

// Edit an specific campground
router.get("/:id/editCampground", middleware.isLoggedIn, middleware.isOwnerOfCampground, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
       if(err){
            console.log(err);
       } else{
            res.render("campground/editCampground", {camp: foundCamp});
       }
    });
});

// Show details of an specific campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments")
    .exec(
        function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                res.render("campground/campgroundDetail", {camp: foundCamp});
            }
        }
    );   
});

// Create a new Campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var post = req.body.post;
    post.desc = req.sanitize(post.desc);
    var name = post.name;
    var desc = post.desc;
    var photo = post.photo;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var campgroundToBeCreated = {name:name, photo:photo, desc:desc, author:author};
    Campground.create(campgroundToBeCreated, 
    function(err, camp){
        if(err){
            console.log(err);
        } 
    });
   res.redirect("/campgrounds");
});

// Update Campground
router.put("/:id", middleware.isLoggedIn, middleware.isOwnerOfCampground, function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.findByIdAndUpdate(req.params.id, req.body.post, function(err, foundCamp){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds/" + req.params.id); 
       }
    });
});

// Delete Campground
router.delete("/:id", middleware.isLoggedIn, middleware.isOwnerOfCampground, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
            console.log(err);
       } else{
            res.redirect("/campgrounds");          
       }
    });
});

module.exports = router;

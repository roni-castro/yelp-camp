var express         = require("express"),
    Campground      = require("../models/Campground"),
    router          = express.Router({mergeParams: true});
    
// Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, 
    function(err, camps){
        if(err){
            console.log(err);
        } else {
            console.log(camps);
            res.render("campground/campgrounds", {camps: camps});
        }
    });   
});

// Show new campground form page
router.get("/newCampground", function(req, res) {
     res.render("campground/newCampground"); 
});

// Edit an specific campground
router.get("/:id/editCampground", function(req, res) {
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
                console.log(foundCamp);
                res.render("campground/campgroundDetail", {camp: foundCamp});
            }
        }
    );   
});

// Create a new Campground
router.post("/", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.create(req.body.post, 
    function(err, camp){
        if(err){
            console.log(err);
        } else {
            console.log(camp);
        }
    });
   res.redirect("/campgrounds");
});

// Update Campground
router.put("/:id", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds/" + req.params.id);          
       }
    });
});

// Delete Campground
router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
            console.log(err);
       } else{
            res.redirect("/campgrounds");          
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

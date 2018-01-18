var express         = require("express"),
    Campground      = require("../models/Campground"),
    router          = express.Router();
    
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
router.get("/newCampground", isLoggedIn, function(req, res) {
     res.render("campground/newCampground"); 
});

// Edit an specific campground
router.get("/:id/editCampground", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res){
    var post = req.body.post;
    post.desc = req.sanitize(post.desc);
    var name = post.name;
    var desc = post.desc;
    var photo = post.photo;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    let cloned = Object.assign({}, post);
    var campgroundToBeCreated = {name:name, photo:photo, desc:desc, author:author};
    
    console.log("########################################### " + cloned.name );
    console.log("########################################### " + campgroundToBeCreated.author.username );

    Campground.create(campgroundToBeCreated, 
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
router.put("/:id", isLoggedIn, function(req, res){
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
router.delete("/:id", isLoggedIn, function(req, res){
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

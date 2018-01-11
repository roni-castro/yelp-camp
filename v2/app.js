var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    sanitazer       = require("express-sanitizer"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/Campground"),
    Comment         = require("./models/Comment");
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}, function(err){
    if (err){
        throw err;
    } else{
        console.log('Mongo DB is connected');
    }
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitazer());

app.get("/", function(req, res){
   res.redirect("/campgrounds"); 
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, 
    function(err, camps){
        if(err){
            console.log(err);
        } else {
            console.log("Camp found");
            console.log(camps);
            res.render("campground/campgrounds", {camps: camps});
        }
    });   
});

app.get("/campgrounds/newCampground", function(req, res) {
     res.render("campground/newCampground"); 
});

app.get("/campgrounds/:id/editCampground", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
       if(err){
           console.log(err);
       } else{
           res.render("campground/editCampground", {camp: foundCamp});
       }
    });
});

app.get("/campgrounds/:id", function(req, res){
    console.log(req.params);
    Campground.findById(req.params.id, 
    function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            console.log("Camp found");
            console.log(foundCamp);
            res.render("campground/campgroundDetail", {camp: foundCamp});
        }
    });   
});

app.post("/campgrounds", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.create(req.body.post, 
    function(err, camp){
        if(err){
            console.log(err);
        } else {
            console.log("Camp created");
            console.log(camp);
        }
    });
   res.redirect("/campgrounds");
});

app.put("/campgrounds/:id", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds");          
       }
    });
});

app.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
            console.log(err);
       } else{
            res.redirect("/campgrounds");          
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});
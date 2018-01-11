var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    Campground  = require("./models/Campground"),
    Comment     = require("./models/Comment");
    
    
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
   var newCampName = req.body.name; 
   var newCampPhoto = req.body.photo; 
   var desc = req.body.desc;
   var newCamp = {name: newCampName, photo: newCampPhoto, desc: desc};
   saveNewCampToDB(newCamp);
   res.redirect("/campgrounds");
});

function saveNewCampToDB(model){
    Campground.create(model, 
    function(err, camp){
        if(err){
            console.log(err);
        } else {
            console.log("Camp created");
            console.log(camp);
        }
    });
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});
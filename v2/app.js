var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var campgroundSchema = new mongoose.Schema({
    name: String,
    photo: String,
    desc: String
});
var campgroundModel = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res){
   res.redirect("/campgrounds"); 
});

app.get("/campgrounds", function(req, res){
    campgroundModel.find({}, 
    function(err, camps){
        if(err){
            console.log(err);
        } else {
            console.log("Camp found");
            console.log(camps);
            res.render("campgrounds", {camps: camps});
        }
    });   
    console.log("Aqui");
});

app.get("/campgrounds/newCampground", function(req, res) {
     res.render("newCampground"); 
});

app.get("/campgrounds/:id", function(req, res){
    console.log(req.params);
    campgroundModel.findById(req.params.id, 
    function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            console.log("Camp found");
            console.log(foundCamp);
            res.render("campgroundDetail", {camp: foundCamp});
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
    campgroundModel.create(model, 
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